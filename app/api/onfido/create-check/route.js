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

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.idVerified) {
      return NextResponse.json({ error: "Already verified" }, { status: 400 });
    }

    let applicantId = user.onfidoApplicantId;

    if (!applicantId) {
      const nameParts = user.name.split(" ");
      const applicant = await onfidoFetch("/applicants", {
        method: "POST",
        body: JSON.stringify({
          first_name: nameParts[0] || user.name,
          last_name: nameParts.slice(1).join(" ") || "N/A",
          email: user.email,
          dob: user.dateOfBirth.toISOString().split("T")[0],
        }),
      });

      applicantId = applicant.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { onfidoApplicantId: applicantId },
      });
    }

    const sdkToken = await onfidoFetch("/sdk_token", {
      method: "POST",
      body: JSON.stringify({
        applicant_id: applicantId,
        referrer: process.env.NEXTAUTH_URL + "/*",
      }),
    });

    return NextResponse.json({
      sdkToken: sdkToken.token,
      applicantId,
    });
  } catch (error) {
    console.error("Onfido create-check error:", error);
    return NextResponse.json(
      { error: "Failed to initialize verification" },
      { status: 500 }
    );
  }
}
