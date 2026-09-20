"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Calendar,
  Sparkles,
  Trash2,
  Smile,
  AlertCircle,
  Lightbulb,
  ArrowRight,
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
  Modal,
} from "@/components/ui/core";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Skeleton,
  PageHeaderSkeleton,
  CardSkeleton,
} from "@/components/ui/skeleton";

interface JournalEntry {
  id: string;
  title?: string;
  learnedContent: string;
  challengesContent?: string;
  nextPlanContent?: string;
  mood: string;
  tags?: string;
  createdAt: string;
}

export default function JournalPage() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [learned, setLearned] = useState("");
  const [challenges, setChallenges] = useState("");
  const [nextPlan, setNextPlan] = useState("");
  const [mood, setMood] = useState("GREAT");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const res = await fetch("/api/journal");
      if (res.ok) {
        const data = await res.json();
        setJournals(data.journals || []);
      }
    } catch {
      toast.error("Failed to load reflection journal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!learned.trim()) return toast.error("Please describe what you learned");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          learnedContent: learned,
          challengesContent: challenges,
          nextPlanContent: nextPlan,
          mood,
          tags,
        }),
      });

      if (res.ok) {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        toast.success("Reflection entry saved! +20 XP ✨");
        setIsWriteModalOpen(false);
        setTitle("");
        setLearned("");
        setChallenges("");
        setNextPlan("");
        setTags("");
        fetchJournals();
      } else {
        toast.error("Failed to save entry");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this journal entry?")) return;
    try {
      const res = await fetch(`/api/journal/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Entry removed");
        setJournals((prev) => prev.filter((j) => j.id !== id));
      }
    } catch {
      toast.error("Failed to delete entry");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeaderSkeleton />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-32 rounded-full" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-5 w-5" />
              </div>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </CardSkeleton>
          ))}
        </div>
      </div>
    );
  }

  const getMoodBadge = (m: string) => {
    switch (m) {
      case "PRODUCTIVE":
        return { label: "⚡ Super Productive", variant: "purple" as const };
      case "GREAT":
        return { label: "🌟 Great Momentum", variant: "success" as const };
      case "NEUTRAL":
        return { label: "😐 Steady / Normal", variant: "secondary" as const };
      case "TIRED":
        return { label: "😴 Tired but Pushed", variant: "warning" as const };
      case "STRUGGLING":
        return { label: "🧗 Overcoming Blockers", variant: "danger" as const };
      default:
        return { label: m, variant: "default" as const };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Daily Reflection Journal
          </h2>
          <p className="text-xs text-muted-foreground">
            Lock in your architectural takeaways, document blockers, and set clear intentions for tomorrow.
          </p>
        </div>

        <Button
          variant="glow"
          onClick={() => setIsWriteModalOpen(true)}
          className="font-semibold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Write Daily Reflection</span>
        </Button>
      </div>

      {/* Journal Timeline */}
      <div className="space-y-4">
        {journals.length === 0 ? (
          <Card className="py-16 text-center border-dashed">
            <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-bold text-foreground text-sm">No Journal Entries Yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Reflecting on what you learned each day compounds your technical understanding exponentially.
            </p>
            <Button
              variant="glow"
              size="sm"
              onClick={() => setIsWriteModalOpen(true)}
              className="mt-4"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Write First Entry</span>
            </Button>
          </Card>
        ) : (
          journals.map((entry) => {
            const moodInfo = getMoodBadge(entry.mood);

            return (
              <Card
                key={entry.id}
                className="p-6 space-y-4 border-border/80 hover:border-indigo-500/30 transition-all"
              >
                {/* Entry Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={moodInfo.variant}>{moodInfo.label}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(entry.createdAt, "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                    {entry.title && (
                      <h3 className="font-bold text-base text-foreground mt-1">
                        {entry.title}
                      </h3>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Entry Content Blocks */}
                <div className="space-y-3 text-xs">
                  {/* Learned Content */}
                  <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/60 space-y-1">
                    <span className="font-semibold text-foreground flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-indigo-400">
                      <Lightbulb className="h-3.5 w-3.5" />
                      What I Learned:
                    </span>
                    <p className="text-foreground leading-relaxed pl-5">
                      {entry.learnedContent}
                    </p>
                  </div>

                  {/* Challenges Content */}
                  {entry.challengesContent && (
                    <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                      <span className="font-semibold text-amber-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Challenges & Blockers:
                      </span>
                      <p className="text-foreground leading-relaxed pl-5">
                        {entry.challengesContent}
                      </p>
                    </div>
                  )}

                  {/* Next Plan Content */}
                  {entry.nextPlanContent && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                      <span className="font-semibold text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <ArrowRight className="h-3.5 w-3.5" />
                        Next Steps & Intentions:
                      </span>
                      <p className="text-foreground leading-relaxed pl-5">
                        {entry.nextPlanContent}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tags Footer */}
                {entry.tags && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-border/50">
                    {entry.tags.split(",").map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono"
                      >
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Write Journal Modal */}
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        title="Record Daily Reflection"
        description="Capture your technical insights, blockers, and tomorrow's roadmap."
      >
        <form onSubmit={handleSaveEntry} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Title / Focus Theme (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next.js 15 Server Actions Deep Dive"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              What did you learn today? *
            </label>
            <textarea
              rows={3}
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              placeholder="e.g. Mastered optimistic updates in Next.js and fixed a memory leak in websocket event listeners."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              What challenges / bugs did you face?
            </label>
            <textarea
              rows={2}
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="e.g. Spent 30 mins debugging CORS on localhost."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Tomorrow&apos;s High-Priority Plan
            </label>
            <input
              type="text"
              value={nextPlan}
              onChange={(e) => setNextPlan(e.target.value)}
              placeholder="e.g. Complete hackathon prototype and solve 2 DP LeetCode problems."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Mood / Energy Level
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="PRODUCTIVE">⚡ Super Productive</option>
                <option value="GREAT">🌟 Great Momentum</option>
                <option value="NEUTRAL">😐 Steady / Normal</option>
                <option value="TIRED">😴 Tired but Pushed</option>
                <option value="STRUGGLING">🧗 Struggled with Concepts</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Next.js, Prisma, DSA"
                className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          <Button type="submit" variant="glow" className="w-full mt-2 font-bold" isLoading={isSubmitting}>
            Save Reflection Entry ✨
          </Button>
        </form>
      </Modal>
    </div>
  );
}
