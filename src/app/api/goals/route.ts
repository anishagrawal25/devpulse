import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("GET /api/goals error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, category, targetDate, priority, progress } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title,
        description,
        category: category || "Skill",
        priority: priority || "MEDIUM",
        progress: typeof progress === "number" ? progress : 0,
        status: progress === 100 ? "COMPLETED" : "IN_PROGRESS",
        targetDate: targetDate ? new Date(targetDate) : null,
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type: "GOAL_CREATED",
        description: `Created new goal: "${title}"`,
      },
    });

    // Add XP to user
    await prisma.user.update({
      where: { id: user.id },
      data: { totalXp: { increment: 25 } },
    });

    return NextResponse.json({ goal }, { status: 201 });
  } catch (error) {
    console.error("POST /api/goals error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
