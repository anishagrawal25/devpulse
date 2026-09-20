import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  careerGoal: z.string().default("Full Stack Developer"),
  careerLevel: z.string().default("Beginner"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
      validated.name
    )}`;

    // Create a 100% clean normal user account (0 goals, 0 projects, 0 DSA records, 0 hackathons, 0 reminders)
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email.toLowerCase().trim(),
        passwordHash,
        avatar,
        careerGoal: validated.careerGoal,
        careerLevel: validated.careerLevel,
        streakCount: 0,
        longestStreak: 0,
        totalXp: 0,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type: "USER_REGISTERED",
        description: `Joined DevPulse on the ${validated.careerGoal} track`,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          careerGoal: user.careerGoal,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
