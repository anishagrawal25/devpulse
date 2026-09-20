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
    const { taskId, completed, content } = body;

    const existing = await prisma.roadmap.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    let parsedContent = content || JSON.parse(existing.contentJson || "{}");

    // If toggling a specific task
    if (taskId && typeof completed === "boolean") {
      let totalTasks = 0;
      let completedTasks = 0;

      if (Array.isArray(parsedContent.weeks)) {
        parsedContent.weeks = parsedContent.weeks.map((week: any) => {
          if (Array.isArray(week.tasks)) {
            week.tasks = week.tasks.map((t: any) => {
              if (t.id === taskId) {
                return { ...t, completed };
              }
              return t;
            });
            totalTasks += week.tasks.length;
            completedTasks += week.tasks.filter((t: any) => t.completed).length;
          }
          return week;
        });
      }

      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : existing.progress;

      const updated = await prisma.roadmap.update({
        where: { id },
        data: {
          contentJson: JSON.stringify(parsedContent),
          progress,
        },
      });

      if (completed) {
        await prisma.user.update({
          where: { id: user.id },
          data: { totalXp: { increment: 20 } },
        });
      }

      return NextResponse.json({
        roadmap: {
          ...updated,
          content: parsedContent,
        },
      });
    }

    const updated = await prisma.roadmap.update({
      where: { id },
      data: {
        contentJson: JSON.stringify(parsedContent),
      },
    });

    return NextResponse.json({
      roadmap: {
        ...updated,
        content: parsedContent,
      },
    });
  } catch (error) {
    console.error("PATCH /api/roadmaps/[id] error:", error);
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
    const existing = await prisma.roadmap.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    await prisma.roadmap.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
