import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth.js";
import prisma from "../../../../lib/prisma.js";

const ONFIDO_API_URL = "https://api.onfido.com/v3.6";

async function onfidoFetch(path, options = {}) {
  const res = await fetch(`${ONFIDO_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Token token=${process.env.ONFIDO_API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Onfido API error: ${res.status} ${err}`);
  }
  return res.json();
}

export async function POST() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.onfidoApplicantId) {
      return NextResponse.json(
        { error: "No applicant found" },
        { status: 400 }
      );
    }

    const check = await onfidoFetch("/checks", {
      method: "POST",
      body: JSON.stringify({
        applicant_id: user.onfidoApplicantId,
        report_names: ["document", "facial_similarity_photo"],
      }),
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { onfidoCheckId: check.id },
    });

    return NextResponse.json({ checkId: check.id, status: check.status });
  } catch (error) {
    console.error("Onfido complete-check error:", error);
    return NextResponse.json(
      { error: "Failed to create check" },
      { status: 500 }
    );
  }
}
