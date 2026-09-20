import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { title, description, category, targetDate, priority, progress, status } = body;

    const existingGoal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!existingGoal || existingGoal.userId !== user.id) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const calculatedStatus =
      status || (progress === 100 ? "COMPLETED" : existingGoal.status);

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingGoal.title,
        description: description !== undefined ? description : existingGoal.description,
        category: category !== undefined ? category : existingGoal.category,
        priority: priority !== undefined ? priority : existingGoal.priority,
        progress: progress !== undefined ? progress : existingGoal.progress,
        status: calculatedStatus,
        targetDate: targetDate !== undefined ? (targetDate ? new Date(targetDate) : null) : existingGoal.targetDate,
      },
    });

    if (calculatedStatus === "COMPLETED" && existingGoal.status !== "COMPLETED") {
      await prisma.user.update({
        where: { id: user.id },
        data: { totalXp: { increment: 100 } },
      });
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          type: "GOAL_COMPLETED",
          description: `Completed goal: "${updated.title}" 🎯`,
        },
      });
    }

    return NextResponse.json({ goal: updated });
  } catch (error) {
    console.error("PATCH /api/goals/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.goal.findUnique({ where: { id } });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    await prisma.goal.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/goals/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
