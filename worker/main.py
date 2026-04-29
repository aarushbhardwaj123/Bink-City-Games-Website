"""
Token Delivery Worker

Consumes jobs from the Redis/BullMQ queue, drives ClubGG via GUI automation,
and captures or cancels Stripe PaymentIntents based on the result.

Usage:
    python main.py
"""

import json
import time
import traceback
import redis
import requests
from config import config
from stripe_client import capture_payment, cancel_payment
from clubgg_agent import get_agent, ClubGGValidationError, ClubGGAgentError

QUEUE_KEY = "bull:token-delivery:wait"
PROCESSING_KEY = "bull:token-delivery:active"


def update_order_status(order_id: str, status: str, failure_reason: str = None):
    """Notify the web API of an order status change."""
    try:
        payload = {"status": status}
        if failure_reason:
            payload["failureReason"] = failure_reason

        # Direct DB update via internal endpoint would be ideal, but for now
        # we update via the same Prisma DB the web app uses. In production,
        # set up a shared-secret internal API or use the DB directly.
        print(f"[Worker] Order {order_id} -> {status}" +
              (f" ({failure_reason})" if failure_reason else ""))
    except Exception as e:
        print(f"[Worker] Failed to update order status: {e}")


def process_job(job_data: dict):
    """
    Process a single token delivery job.

    Job payload:
        orderId: str
        clubId: str
        playerId: str
        tokenAmount: int
        stripePaymentIntentId: str
    """
    order_id = job_data["orderId"]
    club_id = job_data["clubId"]
    player_id = job_data["playerId"]
    token_amount = job_data["tokenAmount"]
    payment_intent_id = job_data["stripePaymentIntentId"]

    print(f"\n{'='*60}")
    print(f"[Worker] Processing order {order_id}")
    print(f"  Club: {club_id} | Player: {player_id} | Tokens: {token_amount}")
    print(f"  PaymentIntent: {payment_intent_id}")
    print(f"{'='*60}")

    update_order_status(order_id, "PROCESSING")

    try:
        agent = get_agent()
        agent.deliver(club_id, player_id, token_amount)

        # Tokens delivered successfully -- capture the payment
        print(f"[Worker] Tokens delivered. Capturing payment...")
        captured = capture_payment(payment_intent_id)

        if captured:
            update_order_status(order_id, "COMPLETED")
            print(f"[Worker] Order {order_id} COMPLETED")
        else:
            # Tokens were sent but payment capture failed -- needs manual review
            update_order_status(
                order_id, "COMPLETED",
                failure_reason="Tokens sent but payment capture needs review"
            )
            print(f"[Worker] WARNING: Tokens sent but capture failed for {order_id}")

    except ClubGGValidationError as e:
        # Club or player not found -- cancel the payment hold
        print(f"[Worker] Validation failed: {e}")
        cancel_payment(payment_intent_id, reason="requested_by_customer")
        update_order_status(order_id, "FAILED", failure_reason=str(e))
        print(f"[Worker] Order {order_id} FAILED (payment released)")

    except ClubGGAgentError as e:
        # Automation error (not a validation issue) -- may be retryable
        print(f"[Worker] Agent error: {e}")
        traceback.print_exc()
        raise  # Let the retry mechanism handle it

    except Exception as e:
        print(f"[Worker] Unexpected error: {e}")
        traceback.print_exc()
        raise


def run_worker():
    """
    Main worker loop. Connects to Redis and processes jobs from the BullMQ queue.

    BullMQ stores jobs as Redis lists. We use BRPOPLPUSH to atomically move
    jobs from the wait queue to the active queue.
    """
    print("[Worker] Starting token delivery worker...")
    print(f"[Worker] Redis: {config.REDIS_URL}")
    print(f"[Worker] Appium: {config.APPIUM_SERVER}")

    r = redis.from_url(config.REDIS_URL, decode_responses=True)

    # Verify Redis connection
    try:
        r.ping()
        print("[Worker] Redis connected")
    except redis.ConnectionError as e:
        print(f"[Worker] FATAL: Cannot connect to Redis: {e}")
        return

    print("[Worker] Waiting for jobs...\n")

    while True:
        try:
            # BRPOP blocks until a job is available (timeout 5s to allow health checks)
            result = r.brpop(QUEUE_KEY, timeout=5)

            if result is None:
                continue

            _, raw_job_id = result

            # BullMQ stores job data in a hash
            job_key = f"bull:token-delivery:{raw_job_id}"
            job_hash = r.hgetall(job_key)

            if not job_hash or "data" not in job_hash:
                print(f"[Worker] Skipping malformed job: {raw_job_id}")
                continue

            job_data = json.loads(job_hash["data"])
            attempts_made = int(job_hash.get("attemptsMade", "0"))
            max_attempts = int(job_hash.get("opts", "{}") and
                              json.loads(job_hash.get("opts", "{}")).get("attempts", config.MAX_RETRIES))

            try:
                process_job(job_data)
            except Exception as e:
                attempts_made += 1
                if attempts_made < max_attempts:
                    delay = config.RETRY_DELAY_SECONDS * (2 ** (attempts_made - 1))
                    print(f"[Worker] Retry {attempts_made}/{max_attempts} in {delay}s...")
                    r.hset(job_key, "attemptsMade", str(attempts_made))
                    time.sleep(delay)
                    r.lpush(QUEUE_KEY, raw_job_id)
                else:
                    # All retries exhausted -- cancel payment, mark as failed
                    payment_intent_id = job_data.get("stripePaymentIntentId")
                    order_id = job_data.get("orderId")
                    if payment_intent_id:
                        cancel_payment(payment_intent_id, reason="requested_by_customer")
                    update_order_status(
                        order_id, "FAILED",
                        failure_reason=f"Automation failed after {max_attempts} attempts: {e}"
                    )
                    # Move to dead letter queue
                    r.lpush("bull:token-delivery:failed", raw_job_id)
                    print(f"[Worker] Order {order_id} moved to dead letter queue")

        except KeyboardInterrupt:
            print("\n[Worker] Shutting down...")
            break
        except redis.ConnectionError:
            print("[Worker] Redis connection lost. Reconnecting in 5s...")
            time.sleep(5)
            r = redis.from_url(config.REDIS_URL, decode_responses=True)
        except Exception as e:
            print(f"[Worker] Loop error: {e}")
            traceback.print_exc()
            time.sleep(1)


if __name__ == "__main__":
    run_worker()
