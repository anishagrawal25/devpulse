import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";
import { calculateLevel } from "@/lib/utils";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [goals, projects, dsaEntries, openSourceLogs, hackathons, activityLogs, roadmaps] =
      await Promise.all([
        prisma.goal.findMany({ where: { userId: user.id } }),
        prisma.project.findMany({
          where: { userId: user.id },
          include: { milestones: true },
        }),
        prisma.dsaEntry.findMany({
          where: { userId: user.id },
          orderBy: { solvedAt: "desc" },
        }),
        prisma.openSourceEntry.findMany({ where: { userId: user.id } }),
        prisma.hackathon.findMany({
          where: { userId: user.id },
          include: { milestones: true },
        }),
        prisma.activityLog.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        prisma.roadmap.findMany({ where: { userId: user.id } }),
      ]);

    // 1. Goal Completion Stats
    const totalGoals = goals.length;
    const completedGoals = goals.filter((g) => g.status === "COMPLETED" || g.progress === 100).length;
    const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    const goalsByCategory = [
      { name: "Skill", count: goals.filter((g) => g.category === "Skill").length },
      { name: "Project", count: goals.filter((g) => g.category === "Project").length },
      { name: "DSA", count: goals.filter((g) => g.category === "DSA").length },
      { name: "Career", count: goals.filter((g) => g.category === "Career").length },
    ];

    // 2. DSA Stats & Breakdown
    const dsaDifficultyDistribution = [
      { name: "Easy", value: dsaEntries.filter((d) => d.difficulty === "Easy").length, color: "#10b981" },
      { name: "Medium", value: dsaEntries.filter((d) => d.difficulty === "Medium").length, color: "#f59e0b" },
      { name: "Hard", value: dsaEntries.filter((d) => d.difficulty === "Hard").length, color: "#f43f5e" },
    ];

    const topicCounts: Record<string, number> = {};
    dsaEntries.forEach((d) => {
      topicCounts[d.topic] = (topicCounts[d.topic] || 0) + 1;
    });
    const dsaTopicDistribution = Object.entries(topicCounts).map(([topic, count]) => ({
      topic,
      count,
    }));

    // 3. Project & Milestone Stats
    let totalMilestones = 0;
    let completedMilestones = 0;
    projects.forEach((p) => {
      totalMilestones += p.milestones.length;
      completedMilestones += p.milestones.filter((m) => m.isCompleted).length;
    });
    const milestoneCompletionRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    // 4. Activity Logs By Day (past 14 days)
    const past14Days: { date: string; label: string; count: number }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
      const dayLogs = activityLogs.filter(
        (l) => l.createdAt.toISOString().split("T")[0] === dateStr
      );
      past14Days.push({
        date: dateStr,
        label: dayLabel,
        count: dayLogs.length,
      });
    }

    // 5. Career Readiness Score Formula (0 to 100)
    // - DSA Volume (up to 30 pts)
    // - Project Milestones (up to 30 pts)
    // - Goal Completion Rate (up to 20 pts)
    // - Consistency Streak (up to 20 pts)
    const dsaPts = Math.min(30, dsaEntries.length * 2.5);
    const projPts = Math.min(30, completedMilestones * 4);
    const goalPts = (goalCompletionRate / 100) * 20;
    const streakPts = Math.min(20, (user.streakCount || 0) * 1.5);
    const careerReadinessScore = Math.min(100, Math.round(dsaPts + projPts + goalPts + streakPts));

    const { level, currentXP, nextLevelXP, progressPercent } = calculateLevel(user.totalXp || 0);

    return NextResponse.json({
      summary: {
        totalGoals,
        completedGoals,
        goalCompletionRate,
        totalProjects: projects.length,
        totalMilestones,
        completedMilestones,
        milestoneCompletionRate,
        totalDsaSolved: dsaEntries.length,
        totalOpenSource: openSourceLogs.length,
        totalHackathons: hackathons.length,
        streakCount: user.streakCount,
        longestStreak: user.longestStreak,
        totalXp: user.totalXp,
        level,
        progressPercent,
        careerReadinessScore,
        careerGoal: user.careerGoal,
      },
      charts: {
        goalsByCategory,
        dsaDifficultyDistribution,
        dsaTopicDistribution,
        past14Days,
      },
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
