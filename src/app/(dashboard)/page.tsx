"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  Target,
  Code2,
  FolderKanban,
  Trophy,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  BookOpen,
  GitPullRequest,
  TrendingUp,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  ProgressBar,
} from "@/components/ui/core";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatDate, calculateLevel } from "@/lib/utils";
import { QuickActionModal } from "@/components/layout/quick-action-modal";
import {
  Skeleton,
  MetricsGridSkeleton,
  ChartSkeleton,
  CardSkeleton,
} from "@/components/ui/skeleton";

export default function DashboardOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [analyticsRes, goalsRes, projectsRes, remindersRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/goals"),
        fetch("/api/projects"),
        fetch("/api/reminders"),
      ]);

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        setData(aData);
      }
      if (goalsRes.ok) {
        const gData = await goalsRes.json();
        setGoals(gData.goals || []);
      }
      if (projectsRes.ok) {
        const pData = await projectsRes.json();
        setProjects(pData.projects || []);
      }
      if (remindersRes.ok) {
        const rData = await remindersRes.json();
        setReminders(rData.reminders || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/10 bg-card/40 p-6 sm:p-8 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-44 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-9 w-96 max-w-full" />
          <Skeleton className="h-4 w-3/4 max-w-xl" />
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>

        <MetricsGridSkeleton count={4} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="space-y-6">
            <ChartSkeleton height="h-44" />
            <ChartSkeleton height="h-40" />
          </div>
        </div>
      </div>
    );
  }

  const summary = data?.summary || {};
  const charts = data?.charts || {};
  const { level, progressPercent } = calculateLevel(summary.totalXp ?? 0);
  const activeReminders = reminders.filter((r) => !r.isRead).slice(0, 2);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/40 p-6 sm:p-8 backdrop-blur-md">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                {summary.careerGoal || "Software Developer"} Track
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Level {level}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Consistency is your unfair advantage 🚀
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              You are currently on a <strong className="text-foreground">{summary.streakCount ?? 0}-day streak</strong> with an overall Career Readiness Score of <strong className="text-indigo-400">{summary.careerReadinessScore ?? 0}/100</strong>. Keep pushing your milestones!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="glow"
              onClick={() => setIsQuickActionOpen(true)}
              className="font-semibold shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Log Today&apos;s Work</span>
            </Button>
            <Link href="/weekly-review">
              <Button variant="outline" className="font-medium">
                <span>AI Review</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overdue/Approaching Deadline Alert Banner */}
      {activeReminders.length > 0 && (
        <div className="space-y-2">
          {activeReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 text-xs text-foreground animate-fade-in"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{reminder.title}</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">{reminder.message}</p>
                </div>
              </div>
              <Link href="/reminders" className="shrink-0 text-amber-400 font-semibold hover:underline flex items-center gap-1">
                <span>Action</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <Card className="border-indigo-500/20 bg-card/60 backdrop-blur-sm p-5 relative overflow-hidden group hover:border-indigo-500/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Daily Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="h-4 w-4 fill-amber-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {summary.streakCount ?? 0} <span className="text-sm font-semibold text-muted-foreground">days</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Longest: <span className="font-semibold text-foreground">{summary.longestStreak ?? 0} days</span>
            </p>
          </div>
        </Card>

        {/* DSA Solved Card */}
        <Card className="border-emerald-500/20 bg-card/60 backdrop-blur-sm p-5 relative overflow-hidden group hover:border-emerald-500/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">DSA Solved</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Code2 className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {summary.totalDsaSolved ?? 0} <span className="text-sm font-semibold text-muted-foreground">problems</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">
              {summary.totalDsaSolved > 0 ? "Daily momentum on track 🔥" : "Start logging your solves"}
            </p>
          </div>
        </Card>

        {/* Active Projects Card */}
        <Card className="border-cyan-500/20 bg-card/60 backdrop-blur-sm p-5 relative overflow-hidden group hover:border-cyan-500/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Project Velocity</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {summary.completedMilestones ?? 0}/{summary.totalMilestones ?? 0} <span className="text-sm font-semibold text-muted-foreground">milestones</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {summary.totalProjects ?? 0} active repositories
            </p>
          </div>
        </Card>

        {/* Career Readiness Score */}
        <Card className="border-purple-500/20 bg-card/60 backdrop-blur-sm p-5 relative overflow-hidden group hover:border-purple-500/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Readiness Score</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {summary.careerReadinessScore ?? 0}<span className="text-sm font-semibold text-muted-foreground">/100</span>
            </div>
            <p className="text-[11px] text-indigo-400 font-medium">
              {summary.careerReadinessScore > 50 ? "Strong velocity" : "Building your foundation"}
            </p>
          </div>
        </Card>
      </div>

      {/* Main Grid: Goals & Projects vs Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Goals & Active Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Goals Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Active Goals & Targets</CardTitle>
                <CardDescription>Trackable execution milestones</CardDescription>
              </div>
              <Link href="/goals">
                <Button variant="ghost" size="sm" className="text-xs text-indigo-400">
                  <span>View All ({goals.length})</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {goals.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No active goals. Click &quot;Log Today&apos;s Work&quot; to set one up!
                </div>
              ) : (
                goals.slice(0, 3).map((goal) => (
                  <div
                    key={goal.id}
                    className="p-4 rounded-xl border border-border/80 bg-secondary/30 hover:bg-secondary/60 transition-colors space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              goal.priority === "URGENT"
                                ? "danger"
                                : goal.priority === "HIGH"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {goal.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(goal.targetDate)}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-foreground mt-1">
                          {goal.title}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20 shrink-0">
                        {goal.progress}%
                      </span>
                    </div>
                    <ProgressBar value={goal.progress} colorClass="bg-indigo-500" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Active Projects Snapshot */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Projects & Ship Velocity</CardTitle>
                <CardDescription>Software delivery and milestone completion</CardDescription>
              </div>
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="text-xs text-indigo-400">
                  <span>Manage Projects</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No active projects yet. Add your first repository to track milestones!
                </div>
              ) : (
                projects.slice(0, 2).map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-xl border border-border/80 bg-secondary/30 hover:bg-secondary/60 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{project.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {project.description}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 shrink-0">
                        {project.progress}% Complete
                      </span>
                    </div>

                    <ProgressBar value={project.progress} colorClass="bg-emerald-500" />

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                      <span>
                        {project.milestones?.filter((m: any) => m.isCompleted).length ?? 0}/
                        {project.milestones?.length ?? 0} Milestones
                      </span>
                      <span className="font-mono text-[11px] text-foreground">
                        {project.techStack?.split(",")[0] || "Next.js"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Consistency & DSA Breakdown */}
        <div className="space-y-6">
          {/* Consistency Activity Bar Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>14-Day Consistency Trend</span>
                <TrendingUp className="h-4 w-4 text-indigo-400" />
              </CardTitle>
              <CardDescription className="text-xs">Logged events per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.past14Days || []}>
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#94a3b8", fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "0.75rem",
                        fontSize: "11px",
                      }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* DSA Difficulty Donut Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>DSA Problem Distribution</span>
                <Code2 className="h-4 w-4 text-emerald-400" />
              </CardTitle>
              <CardDescription className="text-xs">Difficulty breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {(summary.totalDsaSolved ?? 0) === 0 ? (
                <div className="h-40 w-full flex flex-col items-center justify-center text-xs text-muted-foreground">
                  <Code2 className="h-6 w-6 mb-1 text-muted-foreground/40" />
                  <span>0 problems solved yet</span>
                </div>
              ) : (
                <div className="h-40 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts.dsaDifficultyDistribution || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {charts.dsaDifficultyDistribution?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "0.75rem",
                          fontSize: "11px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="flex items-center justify-center gap-4 text-xs mt-2">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Easy
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Medium
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Hard
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Nav Shortcuts */}
          <Card className="p-4 bg-gradient-to-br from-indigo-950/20 to-card">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Execution Modules
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/roadmaps"
                  className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>AI Roadmaps</span>
                </Link>
                <Link
                  href="/hackathons"
                  className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Trophy className="h-3.5 w-3.5 text-amber-400" />
                  <span>Hackathons</span>
                </Link>
                <Link
                  href="/open-source"
                  className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <GitPullRequest className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Open Source</span>
                </Link>
                <Link
                  href="/journal"
                  className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Daily Journal</span>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => {
          setIsQuickActionOpen(false);
          loadDashboardData();
        }}
      />
    </div>
  );
}
