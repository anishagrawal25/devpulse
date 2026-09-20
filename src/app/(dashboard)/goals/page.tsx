"use client";

import React, { useState, useEffect } from "react";
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  Sparkles,
  TrendingUp,
  Layers,
  Code2,
  Briefcase,
  AlertCircle,
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
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Skeleton,
  PageHeaderSkeleton,
  MetricsGridSkeleton,
  CardSkeleton,
} from "@/components/ui/skeleton";

interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: string;
  progress: number;
  status: string;
  targetDate?: string;
  createdAt: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Skill");
  const [priority, setPriority] = useState("MEDIUM");
  const [progress, setProgress] = useState(0);
  const [targetDate, setTargetDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals || []);
      }
    } catch {
      toast.error("Failed to load goals");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingGoal(null);
    setTitle("");
    setDescription("");
    setCategory("Skill");
    setPriority("MEDIUM");
    setProgress(0);
    setTargetDate("");
    setIsCreateModalOpen(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description || "");
    setCategory(goal.category);
    setPriority(goal.priority);
    setProgress(goal.progress);
    setTargetDate(
      goal.targetDate ? new Date(goal.targetDate).toISOString().split("T")[0] : ""
    );
    setIsCreateModalOpen(true);
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Goal title is required");

    setIsSubmitting(true);
    try {
      const url = editingGoal ? `/api/goals/${editingGoal.id}` : "/api/goals";
      const method = editingGoal ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          progress: Number(progress),
          targetDate: targetDate ? new Date(targetDate).toISOString() : null,
        }),
      });

      if (res.ok) {
        if (progress === 100) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
          toast.success("Goal completed! +100 XP 🎉");
        } else {
          toast.success(editingGoal ? "Goal updated" : "Goal created successfully");
        }
        setIsCreateModalOpen(false);
        fetchGoals();
      } else {
        toast.error("Failed to save goal");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateGoalProgressQuick = async (goal: Goal, newProgress: number) => {
    try {
      const isCompleting = newProgress === 100 && goal.progress < 100;
      const res = await fetch(`/api/goals/${goal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress }),
      });

      if (res.ok) {
        if (isCompleting) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          toast.success(`Goal "${goal.title}" Completed! +100 XP 🎯`);
        }
        setGoals((prev) =>
          prev.map((g) =>
            g.id === goal.id
              ? {
                  ...g,
                  progress: newProgress,
                  status: newProgress === 100 ? "COMPLETED" : "IN_PROGRESS",
                }
              : g
          )
        );
      }
    } catch {
      toast.error("Failed to update progress");
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Goal deleted");
        setGoals((prev) => prev.filter((g) => g.id !== id));
      }
    } catch {
      toast.error("Failed to delete goal");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeaderSkeleton />
        <MetricsGridSkeleton count={3} />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-28 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full rounded-full" />
            </CardSkeleton>
          ))}
        </div>
      </div>
    );
  }

  const filteredGoals =
    activeCategory === "ALL"
      ? goals
      : goals.filter((g) => g.category.toUpperCase() === activeCategory);

  const completedCount = goals.filter((g) => g.status === "COMPLETED" || g.progress === 100).length;
  const inProgressCount = goals.length - completedCount;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Goal Tracking & Milestones
          </h2>
          <p className="text-xs text-muted-foreground">
            Set ambitious targets, break them down into habits, and track measurable outcomes.
          </p>
        </div>

        <Button variant="glow" onClick={openCreateModal} className="font-semibold shadow-sm">
          <Plus className="h-4 w-4" />
          <span>New Goal</span>
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card/70 border-border/80 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Goals</p>
            <p className="text-xl font-bold text-foreground">{goals.length}</p>
          </div>
        </Card>

        <Card className="p-4 bg-card/70 border-border/80 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">In Progress</p>
            <p className="text-xl font-bold text-foreground">{inProgressCount}</p>
          </div>
        </Card>

        <Card className="p-4 bg-card/70 border-border/80 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Completed</p>
            <p className="text-xl font-bold text-emerald-400">{completedCount}</p>
          </div>
        </Card>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "SKILL", "PROJECT", "DSA", "CAREER"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeCategory === cat
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            {cat === "ALL" ? "All Goals" : cat}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-border bg-card/30">
            <Target className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="font-semibold text-foreground text-sm">No goals in this category</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Create your first target date goal to start tracking progress.
            </p>
            <Button variant="outline" size="sm" onClick={openCreateModal} className="mt-4">
              <Plus className="h-3.5 w-3.5" />
              <span>Create Goal</span>
            </Button>
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const isDone = goal.progress === 100;
            return (
              <Card
                key={goal.id}
                className={`p-5 space-y-4 transition-all hover:border-indigo-500/30 ${
                  isDone ? "border-emerald-500/20 bg-emerald-950/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
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
                        {goal.priority}
                      </Badge>
                      <Badge variant="purple">{goal.category}</Badge>
                      {goal.targetDate && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(goal.targetDate)}
                        </span>
                      )}
                    </div>
                    <h3
                      className={`font-bold text-base text-foreground mt-1 ${
                        isDone ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {goal.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(goal)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {goal.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {goal.description}
                  </p>
                )}

                {/* Progress Control */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Completion</span>
                    <span
                      className={`font-bold ${
                        isDone ? "text-emerald-400" : "text-indigo-400"
                      }`}
                    >
                      {goal.progress}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={goal.progress}
                      onChange={(e) =>
                        updateGoalProgressQuick(goal, parseInt(e.target.value))
                      }
                      className="w-full accent-indigo-500 h-1.5 bg-secondary rounded-lg cursor-pointer"
                    />
                    <button
                      onClick={() => updateGoalProgressQuick(goal, isDone ? 0 : 100)}
                      className={`p-1.5 rounded-lg border text-xs font-semibold shrink-0 transition-colors ${
                        isDone
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-border bg-secondary hover:bg-secondary/80 text-muted-foreground"
                      }`}
                      title={isDone ? "Mark Incomplete" : "Mark 100% Done"}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Goal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingGoal ? "Edit Goal" : "Create Career / Skill Goal"}
        description="Set measurable targets with realistic deadlines."
      >
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Goal Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master PostgreSQL Indexing & Optimization"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Study B-Trees, execute benchmark queries with EXPLAIN ANALYZE."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="Skill">Skill</option>
                <option value="Project">Project</option>
                <option value="DSA">DSA</option>
                <option value="Career">Career</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent ⚡</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Progress ({progress}%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          <Button type="submit" variant="glow" className="w-full mt-2" isLoading={isSubmitting}>
            {editingGoal ? "Update Goal" : "Create Goal 🎯"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
