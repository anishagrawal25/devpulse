"use client";

import React, { useState, useEffect } from "react";
import {
  GitPullRequest,
  Plus,
  Github,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Sparkles,
  GitMerge,
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

interface OpenSourceLog {
  id: string;
  repoName: string;
  prTitle: string;
  prUrl?: string;
  issueUrl?: string;
  status: string;
  contributionType: string;
  description?: string;
  mergedAt?: string;
  createdAt: string;
}

export default function OpenSourcePage() {
  const [entries, setEntries] = useState<OpenSourceLog[]>([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [repoName, setRepoName] = useState("");
  const [prTitle, setPrTitle] = useState("");
  const [prUrl, setPrUrl] = useState("");
  const [issueUrl, setIssueUrl] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [contributionType, setContributionType] = useState("Pull Request");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/open-source");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch {
      toast.error("Failed to load open-source logs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim() || !prTitle.trim()) {
      return toast.error("Please fill in repository name and PR title");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/open-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName,
          prTitle,
          prUrl,
          issueUrl,
          status,
          contributionType,
          description,
        }),
      });

      if (res.ok) {
        if (status === "MERGED") {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          toast.success("Merged PR logged! +60 XP 🚀");
        } else {
          toast.success("Contribution logged successfully");
        }
        setIsLogModalOpen(false);
        setRepoName("");
        setPrTitle("");
        setPrUrl("");
        setIssueUrl("");
        setDescription("");
        fetchEntries();
      } else {
        toast.error("Failed to save contribution");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (entry: OpenSourceLog) => {
    const newStatus = entry.status === "MERGED" ? "OPEN" : "MERGED";
    try {
      const res = await fetch(`/api/open-source/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        if (newStatus === "MERGED") {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          toast.success("PR marked as Merged! +50 XP 🎉");
        }
        setEntries((prev) =>
          prev.map((e) => (e.id === entry.id ? { ...e, status: newStatus } : e))
        );
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this open source contribution log?")) return;
    try {
      const res = await fetch(`/api/open-source/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Contribution log removed");
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
        <Skeleton className="h-20 w-full rounded-2xl" />
        <MetricsGridSkeleton count={3} />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} className="p-5 flex justify-between items-center">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-28 rounded-lg" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-64" />
              </div>
              <Skeleton className="h-8 w-24 rounded-xl" />
            </CardSkeleton>
          ))}
        </div>
      </div>
    );
  }

  const filtered =
    filterStatus === "ALL"
      ? entries
      : entries.filter((e) => e.status.toUpperCase() === filterStatus);

  const mergedCount = entries.filter((e) => e.status === "MERGED").length;
  const reposCount = new Set(entries.map((e) => e.repoName)).size;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Open Source Contributions
          </h2>
          <p className="text-xs text-muted-foreground">
            Track your Pull Requests, issues solved, and upstream open-source momentum.
          </p>
        </div>

        <Button
          variant="glow"
          onClick={() => setIsLogModalOpen(true)}
          className="font-semibold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Log Contribution</span>
        </Button>
      </div>

      {/* GitHub Sync Teaser Banner */}
      <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Github className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              Automated GitHub Sync (Coming Soon)
            </p>
            <p className="text-[11px] text-muted-foreground">
              Connect your GitHub personal access token to automatically import PR merges and commits.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 shrink-0">
          Manual Tracking Active
        </span>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card/70 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
            <GitPullRequest className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Contributions</p>
            <p className="text-xl font-bold text-foreground">{entries.length}</p>
          </div>
        </Card>

        <Card className="p-4 bg-card/70 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
            <GitMerge className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Merged Pull Requests</p>
            <p className="text-xl font-bold text-purple-400">{mergedCount}</p>
          </div>
        </Card>

        <Card className="p-4 bg-card/70 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Github className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Repositories</p>
            <p className="text-xl font-bold text-foreground">{reposCount}</p>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {["ALL", "MERGED", "OPEN"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === st
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {st === "ALL" ? "All Logs" : st}
          </button>
        ))}
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="py-16 text-center border-dashed">
            <GitPullRequest className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-bold text-foreground text-sm">No Open Source Logs</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Contribute to open source projects like React, Next.js, or Prisma and log your PRs here.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLogModalOpen(true)}
              className="mt-4"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log Contribution</span>
            </Button>
          </Card>
        ) : (
          filtered.map((entry) => (
            <Card
              key={entry.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-border/80 hover:border-indigo-500/30 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-foreground font-mono bg-secondary px-2.5 py-0.5 rounded-lg border border-border">
                    {entry.repoName}
                  </span>
                  <Badge
                    variant={
                      entry.status === "MERGED"
                        ? "purple"
                        : entry.status === "OPEN"
                        ? "cyan"
                        : "secondary"
                    }
                  >
                    {entry.status}
                  </Badge>
                  <Badge variant="outline">{entry.contributionType}</Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-foreground">
                  {entry.prTitle}
                </h3>

                {entry.description && (
                  <p className="text-xs text-muted-foreground">{entry.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => toggleStatus(entry)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    entry.status === "MERGED"
                      ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                      : "border-border bg-secondary hover:bg-secondary/80 text-muted-foreground"
                  }`}
                >
                  {entry.status === "MERGED" ? "✓ Merged" : "Mark Merged"}
                </button>

                {entry.prUrl && (
                  <a
                    href={entry.prUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors"
                    title="View PR on GitHub"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Log Contribution Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Open Source Contribution"
        description="Record your PRs and issue contributions to public repositories."
      >
        <form onSubmit={handleLogContribution} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Repository Name (owner/repo) *
            </label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="e.g. vercel/next.js, facebook/react, prisma/prisma"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Contribution / PR Title *
            </label>
            <input
              type="text"
              value={prTitle}
              onChange={(e) => setPrTitle(e.target.value)}
              placeholder="e.g. fix: solve hydration error with dynamic imports"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="OPEN">Open (Under Review)</option>
                <option value="MERGED">Merged 🎉</option>
                <option value="DRAFT">Draft</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Type
              </label>
              <select
                value={contributionType}
                onChange={(e) => setContributionType(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="Pull Request">Pull Request</option>
                <option value="Issue">Issue / Bug Report</option>
                <option value="Documentation">Documentation</option>
                <option value="Code Review">Code Review</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Pull Request URL (Optional)
            </label>
            <input
              type="url"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Notes / Summary of Changes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Added unit tests for edge runtime headers."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
            />
          </div>

          <Button type="submit" variant="glow" className="w-full mt-2 font-bold" isLoading={isSubmitting}>
            Log Contribution 🚀
          </Button>
        </form>
      </Modal>
    </div>
  );
}
