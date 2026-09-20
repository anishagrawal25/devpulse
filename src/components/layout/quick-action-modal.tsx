"use client";

import React, { useState } from "react";
import { Modal, Button } from "@/components/ui/core";
import { Code2, Target, FolderKanban, BookOpen, GitPullRequest } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function QuickActionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"dsa" | "goal" | "journal" | "pr">("dsa");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [dsaTitle, setDsaTitle] = useState("");
  const [dsaPlatform, setDsaPlatform] = useState("LeetCode");
  const [dsaDifficulty, setDsaDifficulty] = useState("Medium");
  const [dsaTopic, setDsaTopic] = useState("Arrays");
  const [dsaTime, setDsaTime] = useState("30");
  const [dsaNotes, setDsaNotes] = useState("");

  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState("Skill");
  const [goalPriority, setGoalPriority] = useState("MEDIUM");
  const [goalDate, setGoalDate] = useState("");

  const [journalLearned, setJournalLearned] = useState("");
  const [journalChallenges, setJournalChallenges] = useState("");
  const [journalNext, setJournalNext] = useState("");
  const [journalMood, setJournalMood] = useState("GREAT");

  const [prRepo, setPrRepo] = useState("");
  const [prTitle, setPrTitle] = useState("");
  const [prUrl, setPrUrl] = useState("");

  const handleLogDSA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dsaTitle.trim()) return toast.error("Please enter a problem title");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemTitle: dsaTitle,
          platform: dsaPlatform,
          difficulty: dsaDifficulty,
          topic: dsaTopic,
          timeSpentMinutes: parseInt(dsaTime) || 30,
          notes: dsaNotes,
        }),
      });
      if (res.ok) {
        toast.success("DSA problem logged successfully! +30 XP earned 🔥");
        setDsaTitle("");
        setDsaNotes("");
        onClose();
      } else {
        toast.error("Failed to log DSA problem");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return toast.error("Please enter a goal title");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: goalTitle,
          category: goalCategory,
          priority: goalPriority,
          targetDate: goalDate ? new Date(goalDate).toISOString() : null,
          progress: 0,
        }),
      });
      if (res.ok) {
        toast.success("Goal created successfully! 🎯");
        setGoalTitle("");
        onClose();
      } else {
        toast.error("Failed to create goal");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalLearned.trim()) return toast.error("Please write what you learned today");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnedContent: journalLearned,
          challengesContent: journalChallenges,
          nextPlanContent: journalNext,
          mood: journalMood,
        }),
      });
      if (res.ok) {
        toast.success("Reflection journal saved! +20 XP ✨");
        setJournalLearned("");
        setJournalChallenges("");
        setJournalNext("");
        onClose();
      } else {
        toast.error("Failed to save journal");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogPR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prRepo.trim() || !prTitle.trim()) return toast.error("Please enter repository and PR title");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/open-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: prRepo,
          prTitle: prTitle,
          prUrl: prUrl,
          status: "OPEN",
          contributionType: "Pull Request",
        }),
      });
      if (res.ok) {
        toast.success("Open Source contribution logged! 🚀");
        setPrRepo("");
        setPrTitle("");
        setPrUrl("");
        onClose();
      } else {
        toast.error("Failed to log contribution");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Execution Logger"
      description="Quickly log your daily consistency activities to keep your streak glowing."
      maxWidth="max-w-lg"
    >
      {/* Tab Switcher */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-secondary rounded-xl mb-4 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("dsa")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all",
            activeTab === "dsa"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Code2 className="h-3.5 w-3.5 text-indigo-400" />
          <span>DSA</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("goal")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all",
            activeTab === "goal"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Target className="h-3.5 w-3.5 text-amber-400" />
          <span>Goal</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("journal")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all",
            activeTab === "journal"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
          <span>Journal</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pr")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all",
            activeTab === "pr"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <GitPullRequest className="h-3.5 w-3.5 text-emerald-400" />
          <span>PR Log</span>
        </button>
      </div>

      {/* DSA Form */}
      {activeTab === "dsa" && (
        <form onSubmit={handleLogDSA} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Problem Title *
            </label>
            <input
              type="text"
              value={dsaTitle}
              onChange={(e) => setDsaTitle(e.target.value)}
              placeholder="e.g. Trapping Rain Water, Course Schedule..."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Difficulty
              </label>
              <select
                value={dsaDifficulty}
                onChange={(e) => setDsaDifficulty(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="Easy">Easy (🟢)</option>
                <option value="Medium">Medium (🟡)</option>
                <option value="Hard">Hard (🔴)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Platform
              </label>
              <select
                value={dsaPlatform}
                onChange={(e) => setDsaPlatform(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="LeetCode">LeetCode</option>
                <option value="Codeforces">Codeforces</option>
                <option value="HackerRank">HackerRank</option>
                <option value="NeetCode">NeetCode</option>
                <option value="GeeksforGeeks">GeeksforGeeks</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Topic Pattern
              </label>
              <select
                value={dsaTopic}
                onChange={(e) => setDsaTopic(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="Arrays">Arrays & Hashing</option>
                <option value="Two Pointers">Two Pointers</option>
                <option value="Sliding Window">Sliding Window</option>
                <option value="Stack">Stack</option>
                <option value="Binary Search">Binary Search</option>
                <option value="Linked List">Linked List</option>
                <option value="Trees">Trees & BST</option>
                <option value="Tries">Tries</option>
                <option value="Heap">Heap / Priority Queue</option>
                <option value="Backtracking">Backtracking</option>
                <option value="Graphs">Graphs</option>
                <option value="DP">Dynamic Programming</option>
                <option value="Greedy">Greedy</option>
                <option value="Math">Math & Geometry</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Time Spent (Mins)
              </label>
              <input
                type="number"
                value={dsaTime}
                onChange={(e) => setDsaTime(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Key Insights / Pattern Notes
            </label>
            <textarea
              rows={2}
              value={dsaNotes}
              onChange={(e) => setDsaNotes(e.target.value)}
              placeholder="e.g. Maintained prefix max array, solved with O(N) space."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
            />
          </div>

          <Button type="submit" variant="glow" className="w-full" isLoading={isSubmitting}>
            Log Problem & Maintain Streak 🔥
          </Button>
        </form>
      )}

      {/* Goal Form */}
      {activeTab === "goal" && (
        <form onSubmit={handleCreateGoal} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Goal Title *
            </label>
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="e.g. Master Docker Containerization & Compose"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Category
              </label>
              <select
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="Skill">Skill Mastery</option>
                <option value="Project">Project Delivery</option>
                <option value="DSA">DSA Practice</option>
                <option value="Career">Career & Open Source</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Priority
              </label>
              <select
                value={goalPriority}
                onChange={(e) => setGoalPriority(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent ⚡</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Target Deadline
            </label>
            <input
              type="date"
              value={goalDate}
              onChange={(e) => setGoalDate(e.target.value)}
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <Button type="submit" variant="glow" className="w-full" isLoading={isSubmitting}>
            Create Goal 🎯
          </Button>
        </form>
      )}

      {/* Journal Form */}
      {activeTab === "journal" && (
        <form onSubmit={handleSaveJournal} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              What Did You Learn Today? *
            </label>
            <textarea
              rows={2}
              value={journalLearned}
              onChange={(e) => setJournalLearned(e.target.value)}
              placeholder="e.g. Learned how Next.js 15 Server Actions handle parallel cache revalidation."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Challenges / Blockers Faced
            </label>
            <textarea
              rows={2}
              value={journalChallenges}
              onChange={(e) => setJournalChallenges(e.target.value)}
              placeholder="e.g. Debugged an issue with CORS on local API route."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Next Action Plan
            </label>
            <input
              type="text"
              value={journalNext}
              onChange={(e) => setJournalNext(e.target.value)}
              placeholder="e.g. Solve 2 Tree problems & finish the SIH Hackathon deck."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Today&apos;s Mood & Energy
            </label>
            <select
              value={journalMood}
              onChange={(e) => setJournalMood(e.target.value)}
              className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <option value="PRODUCTIVE">⚡ Super Productive</option>
              <option value="GREAT">🌟 Great Momentum</option>
              <option value="NEUTRAL">😐 Steady / Normal</option>
              <option value="TIRED">😴 Tired but Pushed Through</option>
              <option value="STRUGGLING">🧗 Struggled with Concepts</option>
            </select>
          </div>

          <Button type="submit" variant="glow" className="w-full" isLoading={isSubmitting}>
            Save Reflection ✨
          </Button>
        </form>
      )}

      {/* PR Form */}
      {activeTab === "pr" && (
        <form onSubmit={handleLogPR} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Repository Name *
            </label>
            <input
              type="text"
              value={prRepo}
              onChange={(e) => setPrRepo(e.target.value)}
              placeholder="e.g. vercel/next.js or prisma/prisma"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Pull Request / Contribution Title *
            </label>
            <input
              type="text"
              value={prTitle}
              onChange={(e) => setPrTitle(e.target.value)}
              placeholder="e.g. fix: optimize database connection pooling"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              PR / Issue URL
            </label>
            <input
              type="url"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <Button type="submit" variant="glow" className="w-full" isLoading={isSubmitting}>
            Log Contribution 🚀
          </Button>
        </form>
      )}
    </Modal>
  );
}
