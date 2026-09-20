import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";
import { generateWeeklyReviewAI } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { customApiKey } = body;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Aggregate user's past 7 days metrics
    const [dsaEntries, projects, completedMilestones, prs, journals] = await Promise.all([
      prisma.dsaEntry.findMany({
        where: {
          userId: user.id,
          solvedAt: { gte: oneWeekAgo },
        },
      }),
      prisma.project.findMany({
        where: { userId: user.id },
        select: { title: true, progress: true },
      }),
      prisma.milestone.findMany({
        where: {
          OR: [
            { project: { userId: user.id } },
            { hackathon: { userId: user.id } },
          ],
          isCompleted: true,
          completedAt: { gte: oneWeekAgo },
        },
      }),
      prisma.openSourceEntry.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: oneWeekAgo },
        },
      }),
      prisma.reflectionJournal.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: oneWeekAgo },
        },
      }),
    ]);

    const dsaTopics = Array.from(new Set(dsaEntries.map((e) => e.topic)));
    const projectSummaries = projects.map((p) => `${p.title} (${p.progress}%)`);
    const recentLearnings = journals.map((j) => j.learnedContent).slice(0, 4);

    const aiReview = await generateWeeklyReviewAI(
      {
        userName: user.name || "Student",
        dsaSolvedCount: dsaEntries.length,
        dsaTopics,
        projectsWorkedOn: projectSummaries,
        milestonesCompleted: completedMilestones.length,
        prCount: prs.length,
        journalsCount: journals.length,
        recentLearnings,
      },
      customApiKey
    );

    const formattedRecommendations = [
      ...aiReview.areasToImprove.map((a) => `• [Focus] ${a}`),
      ...aiReview.actionPlanNextWeek.map((p) => `• [Action] ${p}`),
    ].join("\n");

    const savedReview = await prisma.weeklyReview.create({
      data: {
        userId: user.id,
        startDate: oneWeekAgo,
        endDate: now,
        dsaCount: dsaEntries.length,
        projectsProgress: projectSummaries.join(", ") || "No active projects",
        milestonesCompleted: completedMilestones.length,
        aiSummary: `${aiReview.summary}\n\nKey Highlights:\n${aiReview.highlights.map((h) => `• ${h}`).join("\n")}`,
        aiRecommendations: formattedRecommendations,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { totalXp: { increment: 50 } },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type: "WEEKLY_REVIEW_GENERATED",
        description: `Generated AI Weekly Retrospective (Score: ${aiReview.productivityScore}/100) 📊`,
      },
    });

    return NextResponse.json({
      review: savedReview,
      aiAnalysis: aiReview,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/weekly-review/generate error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
