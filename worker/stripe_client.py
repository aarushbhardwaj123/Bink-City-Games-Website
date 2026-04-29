import stripe
from config import config

stripe.api_key = config.STRIPE_SECRET_KEY


def capture_payment(payment_intent_id: str) -> bool:
    """Capture an authorized PaymentIntent after successful token delivery."""
    try:
        intent = stripe.PaymentIntent.capture(payment_intent_id)
        return intent.status == "succeeded"
    except stripe.StripeError as e:
        print(f"[Stripe] Capture failed for {payment_intent_id}: {e}")
        return False


def cancel_payment(payment_intent_id: str, reason: str = "fraudulent") -> bool:
    """Cancel/release an authorized PaymentIntent when validation fails."""
    try:
        intent = stripe.PaymentIntent.cancel(
            payment_intent_id,
            cancellation_reason=reason,
        )
        return intent.status == "canceled"
    except stripe.StripeError as e:
        print(f"[Stripe] Cancel failed for {payment_intent_id}: {e}")
        return False
