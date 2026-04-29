import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "../../../../lib/prisma.js";

export async function POST(request) {
  try {
    const { email, password, name, dateOfBirth } = await request.json();

    if (!email || !password || !name || !dateOfBirth) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const dob = new Date(dateOfBirth);
    const age = Math.floor(
      (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    if (age < 18) {
      return NextResponse.json(
        { error: "You must be at least 18 years old" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        dateOfBirth: dob,
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
