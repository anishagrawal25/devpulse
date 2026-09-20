import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { projectId, hackathonId, title, description, dueDate } = body;

    if (!title || (!projectId && !hackathonId)) {
      return NextResponse.json({ error: "Title and project/hackathon ID required" }, { status: 400 });
    }

    const milestone = await prisma.milestone.create({
      data: {
        projectId: projectId || null,
        hackathonId: hackathonId || null,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        isCompleted: false,
      },
    });

    // Recompute project progress if attached to a project
    if (projectId) {
      await updateProjectProgress(projectId);
    }

    return NextResponse.json({ milestone }, { status: 201 });
  } catch (error) {
    console.error("POST /api/milestones error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function updateProjectProgress(projectId: string) {
  const milestones = await prisma.milestone.findMany({
    where: { projectId },
  });
  if (milestones.length === 0) return;
  const completed = milestones.filter((m) => m.isCompleted).length;
  const progress = Math.round((completed / milestones.length) * 100);
  const status = progress === 100 ? "COMPLETED" : "IN_PROGRESS";

  await prisma.project.update({
    where: { id: projectId },
    data: { progress, status },
  });
}
