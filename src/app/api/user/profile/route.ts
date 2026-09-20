import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        careerGoal: user.careerGoal,
        careerLevel: user.careerLevel,
        targetTimeline: user.targetTimeline,
        streakCount: user.streakCount,
        longestStreak: user.longestStreak,
        totalXp: user.totalXp,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, careerGoal, careerLevel, targetTimeline, avatar } = body;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        careerGoal: careerGoal !== undefined ? careerGoal : user.careerGoal,
        careerLevel: careerLevel !== undefined ? careerLevel : user.careerLevel,
        targetTimeline: targetTimeline !== undefined ? targetTimeline : user.targetTimeline,
        avatar: avatar !== undefined ? avatar : user.avatar,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("PATCH /api/user/profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
