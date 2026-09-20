import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Automated smart checker: check approaching hackathons and overdue milestones
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // 1. Check approaching hackathons
    const upcomingHackathons = await prisma.hackathon.findMany({
      where: {
        userId: user.id,
        submissionDeadline: { lte: threeDaysLater, gte: now },
      },
    });

    for (const h of upcomingHackathons) {
      const existing = await prisma.reminder.findFirst({
        where: {
          userId: user.id,
          entityType: "HACKATHON",
          entityId: h.id,
          isDismissed: false,
        },
      });
      if (!existing && h.submissionDeadline) {
        await prisma.reminder.create({
          data: {
            userId: user.id,
            title: `🚨 ${h.name} Deadline in < 3 Days`,
            message: `Final submission is closing on ${h.submissionDeadline.toLocaleDateString()}. Make sure your repo & video are uploaded!`,
            type: "DEADLINE",
            dueDate: h.submissionDeadline,
            entityType: "HACKATHON",
            entityId: h.id,
          },
        });
      }
    }

    // 2. Check overdue project milestones
    const overdueMilestones = await prisma.milestone.findMany({
      where: {
        project: { userId: user.id },
        isCompleted: false,
        dueDate: { lte: now },
      },
      include: { project: true },
    });

    for (const m of overdueMilestones) {
      const existing = await prisma.reminder.findFirst({
        where: {
          userId: user.id,
          entityType: "PROJECT",
          entityId: m.projectId,
          title: { contains: m.title },
          isDismissed: false,
        },
      });
      if (!existing && m.project) {
        await prisma.reminder.create({
          data: {
            userId: user.id,
            title: `⚠️ Overdue Milestone: "${m.title}"`,
            message: `Milestone for project "${m.project.title}" was due on ${m.dueDate?.toLocaleDateString() || "today"}.`,
            type: "MILESTONE",
            dueDate: m.dueDate || new Date(),
            entityType: "PROJECT",
            entityId: m.project.id,
          },
        });
      }
    }

    const reminders = await prisma.reminder.findMany({
      where: {
        userId: user.id,
        isDismissed: false,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reminders });
  } catch (error) {
    console.error("GET /api/reminders error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, message, type, dueDate } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId: user.id,
        title,
        message,
        type: type || "SYSTEM",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json({ reminder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
