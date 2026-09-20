"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Plus,
  Flame,
  Search,
  ExternalLink,
  Trash2,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Layers,
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

interface DSAProblem {
  id: string;
  problemTitle: string;
  platform: string;
  difficulty: string;
  topic: string;
  timeSpentMinutes: number;
  notes?: string;
  problemUrl?: string;
  solutionUrl?: string;
  solvedAt: string;
}

export default function DSATrackerPage() {
  const [entries, setEntries] = useState<DSAProblem[]>([]);
  const [stats, setStats] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("LeetCode");
  const [difficulty, setDifficulty] = useState("Medium");
  const [topic, setTopic] = useState("Arrays");
  const [timeSpent, setTimeSpent] = useState("30");
  const [notes, setNotes] = useState("");
  const [problemUrl, setProblemUrl] = useState("");
  const [solutionUrl, setSolutionUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDSAEntries();
  }, []);

  const fetchDSAEntries = async () => {
    try {
      const res = await fetch("/api/dsa");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
        setStats(data.stats || {});
      }
    } catch {
      toast.error("Failed to load DSA logs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Problem title is required");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemTitle: title,
          platform,
          difficulty,
          topic,
          timeSpentMinutes: parseInt(timeSpent) || 30,
          notes,
          problemUrl,
          solutionUrl,
        }),
      });

      if (res.ok) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        toast.success(`Logged "${title}"! Streak updated 🔥`);
        setIsLogModalOpen(false);
        setTitle("");
        setNotes("");
        setProblemUrl("");
        setSolutionUrl("");
        fetchDSAEntries();
      } else {
        toast.error("Failed to log problem");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this log?")) return;
    try {
      const res = await fetch(`/api/dsa/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("DSA log removed");
        setEntries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      toast.error("Failed to delete log");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeaderSkeleton />
        <MetricsGridSkeleton count={4} />
        <CardSkeleton className="p-6">
          <Skeleton className="h-6 w-52 mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-border/60 bg-secondary/20 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-6 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </CardSkeleton>
      </div>
    );
  }

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiff =
      selectedDifficulty === "ALL" || e.difficulty.toUpperCase() === selectedDifficulty;
    const matchesTopic =
      selectedTopic === "ALL" || e.topic.toUpperCase() === selectedTopic.toUpperCase();
    return matchesSearch && matchesDiff && matchesTopic;
  });

  const totalSolved = entries.length;
  const easyCount = stats.easyCount ?? 0;
  const mediumCount = stats.mediumCount ?? 0;
  const hardCount = stats.hardCount ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>DSA Tracker & Problem Bank</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 fill-amber-400" />
              {stats.streakCount ?? 0} Day Streak
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Log your daily problem-solving sessions, track patterns, and prepare for coding interviews.
          </p>
        </div>

        <Button
          variant="glow"
          onClick={() => setIsLogModalOpen(true)}
          className="font-semibold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Log DSA Problem</span>
        </Button>
      </div>

      {/* Difficulty Breakdown Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Solved */}
        <Card className="p-4 bg-card/70 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Solved</p>
            <p className="text-xl font-extrabold text-foreground">{totalSolved}</p>
          </div>
        </Card>

        {/* Easy */}
        <Card className="p-4 bg-card/70 flex items-center gap-4 border-emerald-500/20">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <span className="text-base font-bold">🟢</span>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Easy</span>
              <span className="font-bold text-emerald-400">{easyCount}</span>
            </div>
            <ProgressBar
              value={totalSolved > 0 ? Math.round((easyCount / totalSolved) * 100) : 0}
              colorClass="bg-emerald-500"
            />
          </div>
        </Card>

        {/* Medium */}
        <Card className="p-4 bg-card/70 flex items-center gap-4 border-amber-500/20">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
            <span className="text-base font-bold">🟡</span>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Medium</span>
              <span className="font-bold text-amber-400">{mediumCount}</span>
            </div>
            <ProgressBar
              value={totalSolved > 0 ? Math.round((mediumCount / totalSolved) * 100) : 0}
              colorClass="bg-amber-500"
            />
          </div>
        </Card>

        {/* Hard */}
        <Card className="p-4 bg-card/70 flex items-center gap-4 border-rose-500/20">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400">
            <span className="text-base font-bold">🔴</span>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Hard</span>
              <span className="font-bold text-rose-400">{hardCount}</span>
            </div>
            <ProgressBar
              value={totalSolved > 0 ? Math.round((hardCount / totalSolved) * 100) : 0}
              colorClass="bg-rose-500"
            />
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search problems, topics, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-input bg-card pl-9 pr-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedDifficulty === diff
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Logs List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Solved Problems Bank</CardTitle>
          <CardDescription>
            Showing {filteredEntries.length} logged DSA problems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No problems match your current search/filter.
            </div>
          ) : (
            filteredEntries.map((problem) => {
              const diffColor =
                problem.difficulty === "Easy"
                  ? "success"
                  : problem.difficulty === "Hard"
                  ? "danger"
                  : "warning";

              return (
                <div
                  key={problem.id}
                  className="p-4 rounded-xl border border-border/70 bg-secondary/20 hover:bg-secondary/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={diffColor}>{problem.difficulty}</Badge>
                      <Badge variant="purple">{problem.topic}</Badge>
                      <span className="text-[11px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {problem.platform}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {problem.timeSpentMinutes}m
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-foreground">
                      {problem.problemTitle}
                    </h4>

                    {problem.notes && (
                      <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                        💡 {problem.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-muted-foreground">
                      {formatDate(problem.solvedAt)}
                    </span>

                    {problem.problemUrl && (
                      <a
                        href={problem.problemUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                        title="Problem Link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(problem.id)}
                      className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Log Problem Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Solved DSA Problem"
        description="Record your problem solving details to maintain consistency streaks."
      >
        <form onSubmit={handleLogProblem} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Problem Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trapping Rain Water, Course Schedule"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="LeetCode">LeetCode</option>
                <option value="Codeforces">Codeforces</option>
                <option value="HackerRank">HackerRank</option>
                <option value="NeetCode">NeetCode</option>
                <option value="GeeksforGeeks">GeeksforGeeks</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="Easy">Easy (🟢)</option>
                <option value="Medium">Medium (🟡)</option>
                <option value="Hard">Hard (🔴)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Topic Pattern
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="Arrays">Arrays & Hashing</option>
                <option value="Two Pointers">Two Pointers</option>
                <option value="Sliding Window">Sliding Window</option>
                <option value="Stack">Stack</option>
                <option value="Binary Search">Binary Search</option>
                <option value="Trees">Trees & BST</option>
                <option value="Graphs">Graphs</option>
                <option value="DP">Dynamic Programming</option>
                <option value="Greedy">Greedy</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Time Spent (Minutes)
              </label>
              <input
                type="number"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Pattern Takeaway / Key Insights
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Maintained prefix max array, solved with O(N) space and O(N) time."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Problem / Solution URL (Optional)
            </label>
            <input
              type="url"
              value={problemUrl}
              onChange={(e) => setProblemUrl(e.target.value)}
              placeholder="https://leetcode.com/problems/..."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <Button type="submit" variant="glow" className="w-full mt-2 font-bold" isLoading={isSubmitting}>
            Log Problem & Earn XP 🔥
          </Button>
        </form>
      </Modal>
    </div>
  );
}
