"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Sparkles,
  Award,
  TrendingUp,
  Target,
  ArrowRight,
  Code2,
  FolderKanban,
  Flame,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
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
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Skeleton,
  PageHeaderSkeleton,
  CardSkeleton,
} from "@/components/ui/skeleton";

interface WeeklyReviewItem {
  id: string;
  startDate: string;
  endDate: string;
  dsaCount: number;
  projectsProgress?: string;
  milestonesCompleted: number;
  aiSummary: string;
  aiRecommendations: string;
  createdAt: string;
}

export default function WeeklyReviewPage() {
  const [reviews, setReviews] = useState<WeeklyReviewItem[]>([]);
  const [activeReview, setActiveReview] = useState<WeeklyReviewItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/weekly-review");
      if (res.ok) {
        const data = await res.json();
        const list = data.reviews || [];
        setReviews(list);
        if (list.length > 0 && !activeReview) {
          setActiveReview(list[0]);
        }
      }
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReview = async () => {
    setIsGenerating(true);
    try {
      toast.info("Analyzing your 7-day logs and generating mentor retrospective with Gemini AI...");
      const res = await fetch("/api/weekly-review/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        const data = await res.json();
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        toast.success("AI Weekly Review generated! +50 XP 🚀");
        setReviews((prev) => [data.review, ...prev]);
        setActiveReview(data.review);
      } else {
        toast.error("Failed to generate review");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeaderSkeleton />
        <CardSkeleton className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-7 w-72" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-14 w-20 rounded-2xl" />
              <Skeleton className="h-14 w-20 rounded-2xl" />
            </div>
          </div>
          <Skeleton className="h-28 w-full rounded-2xl" />
        </CardSkeleton>
        <CardSkeleton className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
        </CardSkeleton>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>AI Weekly Retrospective</span>
            <Badge variant="purple">Gemini Powered</Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Synthesizes your weekly DSA problems, projects, open-source PRs, and reflections into actionable guidance.
          </p>
        </div>

        <Button
          variant="glow"
          onClick={handleGenerateReview}
          isLoading={isGenerating}
          className="font-semibold shadow-sm"
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate This Week&apos;s Review</span>
        </Button>
      </div>

      {/* Review Archive Selector */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {reviews.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveReview(r)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 border flex items-center gap-2 ${
                activeReview?.id === r.id
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/20"
                  : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
              }`}
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>
                {formatDate(r.startDate, "MMM d")} - {formatDate(r.endDate, "MMM d")}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Active Review Content */}
      {!activeReview ? (
        <Card className="py-20 text-center border-dashed">
          <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="font-bold text-foreground text-base">No Weekly Reviews Yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Click &quot;Generate This Week&apos;s Review&quot; to aggregate your current week&apos;s activity and receive personalized AI coaching.
          </p>
          <Button
            variant="glow"
            size="sm"
            onClick={handleGenerateReview}
            isLoading={isGenerating}
            className="mt-4"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Review Now</span>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Top Summary Card */}
          <Card className="p-6 bg-gradient-to-r from-card via-card to-indigo-950/20 border-indigo-500/20 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="default">Weekly Sprint</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(activeReview.startDate)} — {formatDate(activeReview.endDate)}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-foreground">
                  Performance & Consistency Synthesis
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-center">
                  <p className="text-[10px] uppercase font-bold tracking-wider">DSA Solved</p>
                  <p className="text-xl font-extrabold text-foreground">
                    {activeReview.dsaCount}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-center">
                  <p className="text-[10px] uppercase font-bold tracking-wider">Milestones</p>
                  <p className="text-xl font-extrabold text-emerald-400">
                    {activeReview.milestonesCompleted}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Summary Text */}
            <div className="p-5 rounded-2xl bg-secondary/40 border border-border/80 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Gemini Senior Engineering Mentor Analysis</span>
              </div>
              <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                {activeReview.aiSummary}
              </p>
            </div>
          </Card>

          {/* Actionable Recommendations Card */}
          <Card className="p-6 space-y-4 border-border/80">
            <div className="flex items-center gap-2 text-foreground">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-foreground">
                  Strategic Action Plan for Next Week
                </h4>
                <p className="text-xs text-muted-foreground">
                  Concrete high-impact habits and recommendations
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/30 border border-border/60">
              <p className="text-xs text-foreground whitespace-pre-line leading-relaxed font-sans">
                {activeReview.aiRecommendations}
              </p>
            </div>

            {activeReview.projectsProgress && (
              <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                <span>Active Projects: <strong className="text-foreground">{activeReview.projectsProgress}</strong></span>
                <span>Generated {formatDate(activeReview.createdAt)}</span>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
