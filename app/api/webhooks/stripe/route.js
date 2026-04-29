import { NextResponse } from "next/server";
import stripe from "../../../../lib/stripe.js";
import prisma from "../../../../lib/prisma.js";
import { enqueueTokenDelivery } from "../../../../lib/queue.js";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event;

    if (process.env.STRIPE_WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error("Stripe webhook signature verification failed:", err.message);
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 }
        );
      }
    } else {
      event = JSON.parse(rawBody);
    }

    switch (event.type) {
      case "payment_intent.amount_capturable_updated": {
        const paymentIntent = event.data.object;

        const order = await prisma.order.findUnique({
          where: { stripePaymentIntentId: paymentIntent.id },
        });

        if (order && order.status === "PENDING") {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: "AUTHORIZED" },
          });

          await enqueueTokenDelivery(order);
        }

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        await prisma.order.updateMany({
          where: {
            stripePaymentIntentId: paymentIntent.id,
            status: { in: ["AUTHORIZED", "PROCESSING"] },
          },
          data: { status: "COMPLETED" },
        });

        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;

        await prisma.order.updateMany({
          where: {
            stripePaymentIntentId: paymentIntent.id,
            status: { in: ["PENDING", "AUTHORIZED", "PROCESSING"] },
          },
          data: {
            status: "FAILED",
            failureReason:
              paymentIntent.cancellation_reason || "Payment canceled",
          },
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
