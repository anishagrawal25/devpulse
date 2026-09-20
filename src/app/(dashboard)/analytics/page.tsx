"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Target,
  Code2,
  FolderKanban,
  Flame,
  Award,
  Sparkles,
  Zap,
  Calendar,
  CheckCircle2,
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
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { calculateLevel } from "@/lib/utils";
import { toast } from "sonner";
import {
  Skeleton,
  PageHeaderSkeleton,
  MetricsGridSkeleton,
  ChartSkeleton,
  CardSkeleton,
} from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeaderSkeleton />
        <MetricsGridSkeleton count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton height="h-60" />
          <ChartSkeleton height="h-60" />
          <ChartSkeleton height="h-56" />
          <CardSkeleton className="p-6">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-64" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-8 w-full rounded-xl" />
              <Skeleton className="h-8 w-full rounded-xl" />
              <Skeleton className="h-8 w-full rounded-xl" />
            </div>
          </CardSkeleton>
        </div>
      </div>
    );
  }

  const summary = data?.summary || {};
  const charts = data?.charts || {};
  const { level, progressPercent } = calculateLevel(summary.totalXp ?? 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Consistency & Growth Analytics
          </h2>
          <p className="text-xs text-muted-foreground">
            Multi-dimensional measurement of your coding consistency, algorithmic velocity, and milestone delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple">Live Real-Time Metrics</Badge>
        </div>
      </div>

      {/* Top 4 Hero Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-card/70 border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Career Readiness</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {summary.careerReadinessScore ?? 0}%
          </div>
          <p className="text-[11px] text-indigo-400 font-medium mt-1">
            {summary.careerReadinessScore > 50 ? "Strong industry readiness" : "Building foundational velocity"}
          </p>
        </Card>

        <Card className="p-5 bg-card/70 border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Current Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="h-4 w-4 fill-amber-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {summary.streakCount ?? 0} <span className="text-xs font-normal text-muted-foreground">days</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Max record: {summary.longestStreak ?? 0} days
          </p>
        </Card>

        <Card className="p-5 bg-card/70 border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Goal Completion</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {summary.goalCompletionRate ?? 0}%
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {summary.completedGoals ?? 0}/{summary.totalGoals ?? 0} Goals Complete
          </p>
        </Card>

        <Card className="p-5 bg-card/70 border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Milestone Velocity</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {summary.milestoneCompletionRate ?? 0}%
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {summary.completedMilestones ?? 0}/{summary.totalMilestones ?? 0} Milestones
          </p>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 14-Day Consistency Activity Heatmap */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>14-Day Activity Consistency</CardTitle>
              <CardDescription>Daily actions logged across all modules</CardDescription>
            </div>
            <Badge variant="default">Compounding Habit</Badge>
          </div>

          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.past14Days || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* DSA Difficulty Distribution */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>DSA Difficulty Distribution</CardTitle>
              <CardDescription>Problem solve ratios (Easy, Medium, Hard)</CardDescription>
            </div>
            <Code2 className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            {(summary.totalDsaSolved ?? 0) === 0 ? (
              <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
                <Code2 className="h-8 w-8 mb-2 text-muted-foreground/40" />
                <span>No DSA problems solved yet</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.dsaDifficultyDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
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
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs pt-2">
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Easy
            </span>
            <span className="flex items-center gap-2 text-amber-400">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Medium
            </span>
            <span className="flex items-center gap-2 text-rose-400">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Hard
            </span>
          </div>
        </Card>

        {/* Goals By Category */}
        <Card className="p-6 space-y-4">
          <div>
            <CardTitle>Goals Breakdown by Category</CardTitle>
            <CardDescription>Distribution across skills, projects, and DSA</CardDescription>
          </div>

          <div className="h-56 w-full pt-2">
            {(summary.totalGoals ?? 0) === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-xs text-muted-foreground">
                <Target className="h-8 w-8 mb-2 text-muted-foreground/40" />
                <span>No active goals created yet</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.goalsByCategory || []} layout="vertical">
                  <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* DSA Topic Patterns Breakdown */}
        <Card className="p-6 space-y-4">
          <div>
            <CardTitle>Algorithmic Topic Patterns</CardTitle>
            <CardDescription>Problems solved per data structure & pattern</CardDescription>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {(!charts.dsaTopicDistribution || charts.dsaTopicDistribution.length === 0) ? (
              <div className="py-12 flex flex-col items-center justify-center text-xs text-muted-foreground">
                <Code2 className="h-8 w-8 mb-2 text-muted-foreground/40" />
                <span>No topic logs yet. Record your daily solved problems!</span>
              </div>
            ) : (
              charts.dsaTopicDistribution?.map((item: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{item.topic}</span>
                    <span className="text-muted-foreground">{item.count} problems</span>
                  </div>
                  <ProgressBar
                    value={item.count}
                    max={Math.max(...(charts.dsaTopicDistribution || []).map((t: any) => t.count), 5)}
                    colorClass="bg-cyan-500"
                  />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
