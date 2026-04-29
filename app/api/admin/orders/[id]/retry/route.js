import { NextResponse } from "next/server";
import { auth } from "../../../../../../lib/auth.js";
import prisma from "../../../../../../lib/prisma.js";
import { enqueueTokenDelivery } from "../../../../../../lib/queue.js";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "FAILED") {
      return NextResponse.json(
        { error: "Only failed orders can be retried" },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id },
      data: { status: "AUTHORIZED", failureReason: null },
    });

    await enqueueTokenDelivery(order);

    return NextResponse.json({ message: "Order re-queued for delivery" });
  } catch (error) {
    console.error("Admin retry error:", error);
    return NextResponse.json(
      { error: "Failed to retry order" },
      { status: 500 }
    );
  }
}
