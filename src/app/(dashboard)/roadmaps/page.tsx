"use client";

import React, { useState, useEffect } from "react";
import {
  Map,
  Sparkles,
  Plus,
  CheckCircle2,
  Circle,
  BookOpen,
  ExternalLink,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  Code2,
  Flame,
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
  Modal,
} from "@/components/ui/core";
import { CAREER_GOALS } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Skeleton,
  PageHeaderSkeleton,
  CardSkeleton,
} from "@/components/ui/skeleton";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Resource {
  title: string;
  url: string;
  type: "DOCS" | "VIDEO" | "PROJECT" | "PRACTICE";
}

interface Week {
  weekNumber: number;
  title: string;
  description: string;
  topics: string[];
  tasks: Task[];
  resources: Resource[];
}

interface RoadmapItem {
  id: string;
  title: string;
  careerGoal: string;
  targetWeeks: number;
  progress: number;
  content: {
    summary?: string;
    weeks: Week[];
  };
}

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapItem | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generator Form State
  const [role, setRole] = useState("Software Developer");
  const [level, setLevel] = useState("Beginner");
  const [weeks, setWeeks] = useState(4);
  const [focusAreas, setFocusAreas] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch("/api/roadmaps");
      if (res.ok) {
        const data = await res.json();
        const list = data.roadmaps || [];
        setRoadmaps(list);
        if (list.length > 0 && !selectedRoadmap) {
          setSelectedRoadmap(list[0]);
        }
      }
    } catch {
      toast.error("Failed to load roadmaps");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      toast.info("Consulting Gemini AI to design your personalized weekly pathway...");

      const res = await fetch("/api/roadmaps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerGoal: role,
          experienceLevel: level,
          targetWeeks: Number(weeks),
          focusAreas,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const genData = await res.json();
      const generated = genData.roadmap;

      // Save to database
      const saveRes = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generated.title || `${role} Roadmap`,
          careerGoal: role,
          targetWeeks: Number(weeks),
          content: generated,
        }),
      });

      if (saveRes.ok) {
        const saved = await saveRes.json();
        toast.success("AI Roadmap successfully generated and saved! ✨");
        setIsGenerateModalOpen(false);
        setRoadmaps((prev) => [saved.roadmap, ...prev]);
        setSelectedRoadmap(saved.roadmap);
      }
    } catch {
      toast.error("Failed to generate roadmap");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = async (taskId: string, currentCompleted: boolean) => {
    if (!selectedRoadmap) return;
    const newCompleted = !currentCompleted;

    // Optimistic update
    const updatedWeeks = selectedRoadmap.content.weeks.map((w) => ({
      ...w,
      tasks: w.tasks.map((t) => (t.id === taskId ? { ...t, completed: newCompleted } : t)),
    }));

    let total = 0;
    let completed = 0;
    updatedWeeks.forEach((w) => {
      total += w.tasks.length;
      completed += w.tasks.filter((t) => t.completed).length;
    });
    const newProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const updatedRoadmap = {
      ...selectedRoadmap,
      progress: newProgress,
      content: {
        ...selectedRoadmap.content,
        weeks: updatedWeeks,
      },
    };

    setSelectedRoadmap(updatedRoadmap);
    setRoadmaps((prev) =>
      prev.map((r) => (r.id === selectedRoadmap.id ? updatedRoadmap : r))
    );

    if (newCompleted) {
      if (newProgress === 100) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast.success("Roadmap 100% Completed! Incredible work! 🏆");
      } else {
        toast.success("Task completed! +20 XP 🔥");
      }
    }

    try {
      await fetch(`/api/roadmaps/${selectedRoadmap.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          completed: newCompleted,
        }),
      });
    } catch {
      toast.error("Failed to sync task state");
    }
  };

  const handleDeleteRoadmap = async (id: string) => {
    if (!confirm("Are you sure you want to delete this roadmap?")) return;
    try {
      const res = await fetch(`/api/roadmaps/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Roadmap deleted");
        const remaining = roadmaps.filter((r) => r.id !== id);
        setRoadmaps(remaining);
        setSelectedRoadmap(remaining[0] || null);
      }
    } catch {
      toast.error("Failed to delete roadmap");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeaderSkeleton />
        <CardSkeleton className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 rounded-full" />
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-3 w-96 max-w-full" />
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </CardSkeleton>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-3 w-3/4" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-7 w-full rounded-xl" />
                <Skeleton className="h-7 w-full rounded-xl" />
              </div>
            </CardSkeleton>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>AI Learning Roadmaps</span>
            <Badge variant="purple">Gemini Powered</Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Personalized week-by-week curriculum tailored to your career goal and skill level.
          </p>
        </div>

        <Button
          variant="glow"
          onClick={() => setIsGenerateModalOpen(true)}
          className="font-semibold shadow-sm"
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate New Roadmap</span>
        </Button>
      </div>

      {/* Roadmaps Selector Bar */}
      {roadmaps.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {roadmaps.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRoadmap(r)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2.5 border ${
                selectedRoadmap?.id === r.id
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/20"
                  : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Map className="h-3.5 w-3.5" />
              <span>{r.title}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedRoadmap?.id === r.id
                    ? "bg-white/20 text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {r.progress}%
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Roadmap Tree / Weeks Timeline */}
      {!selectedRoadmap ? (
        <Card className="py-20 text-center border-dashed">
          <Map className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="font-bold text-foreground text-base">No Roadmaps Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Click &quot;Generate New Roadmap&quot; to prompt Gemini AI for a customized week-by-week technical curriculum.
          </p>
          <Button
            variant="glow"
            size="sm"
            onClick={() => setIsGenerateModalOpen(true)}
            className="mt-4"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Roadmap</span>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Active Roadmap Overview Card */}
          <Card className="p-6 bg-gradient-to-r from-card via-card to-indigo-950/20 border-indigo-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="default">{selectedRoadmap.careerGoal}</Badge>
                  <Badge variant="secondary">
                    {selectedRoadmap.targetWeeks} Weeks Duration
                  </Badge>
                </div>
                <h3 className="text-xl font-extrabold text-foreground">
                  {selectedRoadmap.title}
                </h3>
                {selectedRoadmap.content.summary && (
                  <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                    {selectedRoadmap.content.summary}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-xs font-semibold text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-extrabold text-indigo-400">
                    {selectedRoadmap.progress}%
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteRoadmap(selectedRoadmap.id)}
                  className="p-2 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete Roadmap"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <ProgressBar value={selectedRoadmap.progress} colorClass="bg-indigo-500" />
            </div>
          </Card>

          {/* Week by Week Cards */}
          <div className="space-y-4">
            {selectedRoadmap.content.weeks?.map((week) => {
              const weekTotal = week.tasks?.length || 0;
              const weekDone = week.tasks?.filter((t) => t.completed).length || 0;
              const isWeekComplete = weekTotal > 0 && weekDone === weekTotal;

              return (
                <Card
                  key={week.weekNumber}
                  className={`p-5 transition-all ${
                    isWeekComplete
                      ? "border-emerald-500/30 bg-emerald-950/5"
                      : "border-border/80 hover:border-border"
                  }`}
                >
                  {/* Week Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/60 gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-extrabold ${
                          isWeekComplete
                            ? "bg-emerald-500 text-white shadow-xs"
                            : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        }`}
                      >
                        W{week.weekNumber}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">
                          {week.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{week.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {weekDone}/{weekTotal} Tasks
                      </span>
                      {isWeekComplete && (
                        <Badge variant="success">Completed</Badge>
                      )}
                    </div>
                  </div>

                  {/* Core Topics Pills */}
                  {week.topics && week.topics.length > 0 && (
                    <div className="pt-3 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[11px] font-semibold text-muted-foreground mr-1">
                        Topics:
                      </span>
                      {week.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2.5 py-0.5 rounded-lg bg-secondary text-foreground font-mono"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tasks List */}
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-foreground">Action Items & Milestones:</p>
                    <div className="space-y-1.5">
                      {week.tasks?.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id, task.completed)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                            task.completed
                              ? "border-emerald-500/20 bg-emerald-500/5 text-muted-foreground line-through"
                              : "border-border/60 bg-secondary/30 hover:bg-secondary/70 text-foreground"
                          }`}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <span className="flex-1 font-medium">{task.title}</span>
                          <span className="text-[10px] text-indigo-400 font-semibold shrink-0">
                            +20 XP
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Curated Resources */}
                  {week.resources && week.resources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                        Recommended Resources:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {week.resources.map((res, i) => (
                          <a
                            key={i}
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/20 transition-colors"
                          >
                            <BookOpen className="h-3 w-3" />
                            <span>{res.title}</span>
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Roadmap Generator Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate AI Learning Roadmap"
        description="Gemini will synthesize an actionable week-by-week curriculum based on your goals."
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Target Career Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              {CAREER_GOALS.map((cg) => (
                <option key={cg.slug} value={cg.name}>
                  {cg.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Your Experience Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="Beginner">Beginner (College Student)</option>
                <option value="Intermediate">Intermediate (Building apps)</option>
                <option value="Advanced">Advanced (Interview Prep)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Duration (Weeks)
              </label>
              <select
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value={4}>4 Weeks (Intensive Sprint)</option>
                <option value={6}>6 Weeks (Balanced)</option>
                <option value={8}>8 Weeks (Deep Mastery)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Specific Technologies / Focus Areas (Optional)
            </label>
            <input
              type="text"
              value={focusAreas}
              onChange={(e) => setFocusAreas(e.target.value)}
              placeholder="e.g. Next.js 15, PostgreSQL indexing, Docker, Gemini AI"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <Button
            type="submit"
            variant="glow"
            className="w-full mt-2 font-bold"
            isLoading={isGenerating}
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Custom Roadmap ✨</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
}
