import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const roadmaps = await prisma.roadmap.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const parsed = roadmaps.map((r) => ({
      ...r,
      content: JSON.parse(r.contentJson || "{}"),
    }));

    return NextResponse.json({ roadmaps: parsed });
  } catch (error) {
    console.error("GET /api/roadmaps error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, careerGoal, targetWeeks, content } = body;

    const roadmap = await prisma.roadmap.create({
      data: {
        userId: user.id,
        title: title || `${careerGoal} Pathway`,
        careerGoal: careerGoal || user.careerGoal,
        targetWeeks: targetWeeks || 4,
        contentJson: JSON.stringify(content),
        progress: 0,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type: "ROADMAP_CREATED",
        description: `Generated AI roadmap: "${roadmap.title}" 🗺️`,
      },
    });

    return NextResponse.json({
      roadmap: {
        ...roadmap,
        content,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/roadmaps error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
