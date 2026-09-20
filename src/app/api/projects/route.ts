import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      include: {
        milestones: {
          orderBy: { dueDate: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, repoUrl, liveUrl, techStack, dueDate, milestones } = body;

    if (!title) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title,
        description,
        repoUrl,
        liveUrl,
        techStack,
        dueDate: dueDate ? new Date(dueDate) : null,
        progress: 0,
        status: "IN_PROGRESS",
      },
    });

    // Create initial milestones if provided
    if (Array.isArray(milestones) && milestones.length > 0) {
      for (const m of milestones) {
        if (m.title?.trim()) {
          await prisma.milestone.create({
            data: {
              projectId: project.id,
              title: m.title.trim(),
              description: m.description || "",
              dueDate: m.dueDate ? new Date(m.dueDate) : null,
              isCompleted: !!m.isCompleted,
            },
          });
        }
      }
    } else {
      // Create default starter milestones
      const defaultMilestones = [
        "System Architecture & UI Wireframes",
        "Core Backend API & Database Models",
        "Frontend Component Integration",
        "Testing & Production Deployment",
      ];
      for (const mTitle of defaultMilestones) {
        await prisma.milestone.create({
          data: {
            projectId: project.id,
            title: mTitle,
            isCompleted: false,
          },
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type: "PROJECT_CREATED",
        description: `Created project "${title}"`,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { totalXp: { increment: 50 } },
    });

    const fullProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: { milestones: true },
    });

    return NextResponse.json({ project: fullProject }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
