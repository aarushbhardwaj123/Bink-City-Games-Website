import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "../../../../lib/prisma.js";

function verifyWebhookSignature(body, signature) {
  const secret = process.env.ONFIDO_WEBHOOK_SECRET;
  if (!secret) return true; // skip in dev if not configured
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body);
  const expected = hmac.digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature || ""),
    Buffer.from(expected)
  );
}

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-sha2-signature");

    if (process.env.ONFIDO_WEBHOOK_SECRET && !verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const payload = event.payload;

    if (payload?.resource_type === "check" && payload?.action === "check.completed") {
      const checkId = payload.object?.id;
      if (!checkId) {
        return NextResponse.json({ error: "Missing check ID" }, { status: 400 });
      }

      const result = payload.object?.status;

      const user = await prisma.user.findFirst({
        where: { onfidoCheckId: checkId },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            idVerified: result === "complete",
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Onfido webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
