import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const entries = await prisma.dsaEntry.findMany({
      where: { userId: user.id },
      orderBy: { solvedAt: "desc" },
    });

    // Compute stats
    const totalSolved = entries.length;
    const easyCount = entries.filter((e) => e.difficulty === "Easy").length;
    const mediumCount = entries.filter((e) => e.difficulty === "Medium").length;
    const hardCount = entries.filter((e) => e.difficulty === "Hard").length;

    // Group by topic
    const topicMap: Record<string, number> = {};
    for (const e of entries) {
      topicMap[e.topic] = (topicMap[e.topic] || 0) + 1;
    }
    const topicStats = Object.entries(topicMap).map(([topic, count]) => ({
      topic,
      count,
    }));

    // Group by platform
    const platformMap: Record<string, number> = {};
    for (const e of entries) {
      platformMap[e.platform] = (platformMap[e.platform] || 0) + 1;
    }

    return NextResponse.json({
      entries,
      stats: {
        totalSolved,
        easyCount,
        mediumCount,
        hardCount,
        topicStats,
        platformMap,
        streakCount: user.streakCount,
      },
    });
  } catch (error) {
    console.error("GET /api/dsa error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      problemTitle,
      platform,
      difficulty,
      topic,
      timeSpentMinutes,
      notes,
      problemUrl,
      solutionUrl,
      solvedAt,
    } = body;

    if (!problemTitle) {
      return NextResponse.json({ error: "Problem title is required" }, { status: 400 });
    }

    const entry = await prisma.dsaEntry.create({
      data: {
        userId: user.id,
        problemTitle,
        platform: platform || "LeetCode",
        difficulty: difficulty || "Medium",
        topic: topic || "Arrays",
        timeSpentMinutes: typeof timeSpentMinutes === "number" ? timeSpentMinutes : 30,
        notes: notes || null,
        problemUrl: problemUrl || null,
        solutionUrl: solutionUrl || null,
        solvedAt: solvedAt ? new Date(solvedAt) : new Date(),
      },
    });

    // Update streak and XP
    const newStreak = user.streakCount + 1;
    const longest = Math.max(user.longestStreak, newStreak);
    const xpBonus = difficulty === "Hard" ? 50 : difficulty === "Medium" ? 30 : 20;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        streakCount: newStreak,
        longestStreak: longest,
        totalXp: { increment: xpBonus },
        lastActiveAt: new Date(),
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type: "DSA_SOLVED",
        description: `Solved "${problemTitle}" (${difficulty}) on ${platform || "LeetCode"} 🔥`,
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/dsa error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
