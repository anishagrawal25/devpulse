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
    const { isCompleted, title, description, dueDate } = body;

    const existing = await prisma.milestone.findUnique({
      where: { id },
      include: { project: true, hackathon: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    const wasCompleted = existing.isCompleted;
    const isNowCompleted = isCompleted !== undefined ? isCompleted : wasCompleted;

    const updated = await prisma.milestone.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existing.dueDate,
        isCompleted: isNowCompleted,
        completedAt: isNowCompleted && !wasCompleted ? new Date() : !isNowCompleted ? null : existing.completedAt,
      },
    });

    // If newly completed, grant XP and log
    if (isNowCompleted && !wasCompleted) {
      await prisma.user.update({
        where: { id: user.id },
        data: { totalXp: { increment: 40 } },
      });

      await prisma.activityLog.create({
        data: {
          userId: user.id,
          type: "MILESTONE_COMPLETED",
          description: `Completed milestone: "${updated.title}" on ${existing.project?.title || existing.hackathon?.name || "Project"} 🚀`,
        },
      });
    }

    // Recompute project progress
    if (existing.projectId) {
      const allMilestones = await prisma.milestone.findMany({
        where: { projectId: existing.projectId },
      });
      const completedCount = allMilestones.filter((m) => m.isCompleted).length;
      const progress = Math.round((completedCount / allMilestones.length) * 100);
      const status = progress === 100 ? "COMPLETED" : "IN_PROGRESS";

      await prisma.project.update({
        where: { id: existing.projectId },
        data: { progress, status },
      });
    }

    return NextResponse.json({ milestone: updated });
  } catch (error) {
    console.error("PATCH /api/milestones/[id] error:", error);
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
    const existing = await prisma.milestone.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    const projectId = existing.projectId;
    await prisma.milestone.delete({ where: { id } });

    if (projectId) {
      const allMilestones = await prisma.milestone.findMany({
        where: { projectId },
      });
      if (allMilestones.length > 0) {
        const completedCount = allMilestones.filter((m) => m.isCompleted).length;
        const progress = Math.round((completedCount / allMilestones.length) * 100);
        await prisma.project.update({
          where: { id: projectId },
          data: { progress },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
