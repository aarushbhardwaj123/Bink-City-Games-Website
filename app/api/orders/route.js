import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth.js";
import prisma from "../../../lib/prisma.js";
import stripe from "../../../lib/stripe.js";

const TOKEN_PRICE_CENTS_PER_UNIT = 1; // $0.01 per token -- adjust to real pricing

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.idVerified) {
      return NextResponse.json(
        { error: "Identity verification required" },
        { status: 403 }
      );
    }

    const { clubId, playerId, tokenAmount } = await request.json();

    if (!clubId || !playerId || !tokenAmount) {
      return NextResponse.json(
        { error: "Club ID, Player ID, and token amount are required" },
        { status: 400 }
      );
    }

    const amount = parseInt(tokenAmount, 10);
    if (isNaN(amount) || amount < 100 || amount > 10000000) {
      return NextResponse.json(
        { error: "Token amount must be between 100 and 10,000,000" },
        { status: 400 }
      );
    }

    const priceUsd = amount * TOKEN_PRICE_CENTS_PER_UNIT;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceUsd,
      currency: "usd",
      capture_method: "manual",
      metadata: {
        userId: user.id,
        clubId,
        playerId,
        tokenAmount: String(amount),
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        clubGgClubId: clubId,
        clubGgPlayerId: playerId,
        tokenAmount: amount,
        priceUsd,
        stripePaymentIntentId: paymentIntent.id,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      clientSecret: paymentIntent.client_secret,
      priceUsd,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
