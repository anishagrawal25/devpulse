import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const hackathons = await prisma.hackathon.findMany({
      where: { userId: user.id },
      include: {
        milestones: {
          orderBy: { dueDate: "asc" },
        },
      },
      orderBy: { submissionDeadline: "asc" },
    });

    return NextResponse.json({ hackathons });
  } catch (error) {
    console.error("GET /api/hackathons error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      name,
      websiteUrl,
      regDeadline,
      submissionDeadline,
      teamName,
      status,
      prizeNotes,
      projectSummary,
      milestones,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Hackathon name is required" }, { status: 400 });
    }

    const hackathon = await prisma.hackathon.create({
      data: {
        userId: user.id,
        name,
        websiteUrl,
        regDeadline: regDeadline ? new Date(regDeadline) : null,
        submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : null,
        teamName,
        status: status || "REGISTERED",
        prizeNotes,
        projectSummary,
      },
    });

    // Default hackathon milestones (Team Formation, PPT, Prototype, Submission)
    const defaultMilestones = [
      { title: "Team Formation & Role Assignment", daysBefore: 14 },
      { title: "Idea PPT & Architecture Design", daysBefore: 7 },
      { title: "Core Working Prototype", daysBefore: 3 },
      { title: "Final Video Demo & Code Submission", daysBefore: 0 },
    ];

    if (Array.isArray(milestones) && milestones.length > 0) {
      for (const m of milestones) {
        if (m.title?.trim()) {
          await prisma.milestone.create({
            data: {
              hackathonId: hackathon.id,
              title: m.title.trim(),
              dueDate: m.dueDate ? new Date(m.dueDate) : null,
              isCompleted: !!m.isCompleted,
            },
          });
        }
      }
    } else {
      const baseDate = submissionDeadline ? new Date(submissionDeadline) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      for (const dm of defaultMilestones) {
        const mDate = new Date(baseDate.getTime() - dm.daysBefore * 24 * 60 * 60 * 1000);
        await prisma.milestone.create({
          data: {
            hackathonId: hackathon.id,
            title: dm.title,
            dueDate: mDate,
            isCompleted: false,
          },
        });
      }
    }

    // Create deadline reminder
    if (submissionDeadline) {
      await prisma.reminder.create({
        data: {
          userId: user.id,
          title: `${name} Submission Approaching`,
          message: `Submission deadline is on ${new Date(submissionDeadline).toLocaleDateString()}. Complete your video and repository!`,
          type: "DEADLINE",
          dueDate: new Date(submissionDeadline),
          entityType: "HACKATHON",
          entityId: hackathon.id,
        },
      });
    }

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type: "HACKATHON_ADDED",
        description: `Registered for hackathon "${name}" 🏆`,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { totalXp: { increment: 40 } },
    });

    const full = await prisma.hackathon.findUnique({
      where: { id: hackathon.id },
      include: { milestones: true },
    });

    return NextResponse.json({ hackathon: full }, { status: 201 });
  } catch (error) {
    console.error("POST /api/hackathons error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
