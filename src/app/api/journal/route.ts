import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const journals = await prisma.reflectionJournal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ journals });
  } catch (error) {
    console.error("GET /api/journal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, learnedContent, challengesContent, nextPlanContent, mood, tags } = body;

    if (!learnedContent) {
      return NextResponse.json({ error: "What you learned is required" }, { status: 400 });
    }

    const journal = await prisma.reflectionJournal.create({
      data: {
        userId: user.id,
        title: title || `Daily Reflection - ${new Date().toLocaleDateString()}`,
        learnedContent,
        challengesContent: challengesContent || null,
        nextPlanContent: nextPlanContent || null,
        mood: mood || "GREAT",
        tags: tags || null,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { totalXp: { increment: 20 } },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type: "JOURNAL_SAVED",
        description: `Wrote daily reflection: "${journal.title}" ✍️`,
      },
    });

    return NextResponse.json({ journal }, { status: 201 });
  } catch (error) {
    console.error("POST /api/journal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
