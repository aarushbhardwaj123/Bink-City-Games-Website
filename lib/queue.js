import { Queue } from "bullmq";
import IORedis from "ioredis";

let connection;
let tokenQueue;

function getQueue() {
  if (!tokenQueue) {
    connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: null,
      lazyConnect: true,
      enableOfflineQueue: false,
    });
    tokenQueue = new Queue("token-delivery", { connection });
  }
  return tokenQueue;
}

export async function enqueueTokenDelivery(order) {
  const q = getQueue();
  return q.add(
    "deliver-tokens",
    {
      orderId: order.id,
      clubId: order.clubGgClubId,
      playerId: order.clubGgPlayerId,
      tokenAmount: order.tokenAmount,
      stripePaymentIntentId: order.stripePaymentIntentId,
    },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
    }
  );
}
