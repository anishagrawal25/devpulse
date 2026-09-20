"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  ExternalLink,
  Trash2,
  Sparkles,
  Users,
  Award,
  AlertTriangle,
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
import { formatDate, getDaysLeft } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Skeleton,
  PageHeaderSkeleton,
  CardSkeleton,
} from "@/components/ui/skeleton";

interface Milestone {
  id: string;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
}

interface Hackathon {
  id: string;
  name: string;
  websiteUrl?: string;
  regDeadline?: string;
  submissionDeadline?: string;
  teamName?: string;
  status: string;
  prizeNotes?: string;
  projectSummary?: string;
  milestones: Milestone[];
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [regDeadline, setRegDeadline] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [teamName, setTeamName] = useState("");
  const [prizeNotes, setPrizeNotes] = useState("");
  const [projectSummary, setProjectSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const res = await fetch("/api/hackathons");
      if (res.ok) {
        const data = await res.json();
        setHackathons(data.hackathons || []);
      }
    } catch {
      toast.error("Failed to load hackathons");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Hackathon name is required");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/hackathons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          websiteUrl,
          regDeadline: regDeadline ? new Date(regDeadline).toISOString() : null,
          submissionDeadline: submissionDeadline ? new Date(submissionDeadline).toISOString() : null,
          teamName,
          prizeNotes,
          projectSummary,
        }),
      });

      if (res.ok) {
        toast.success("Hackathon added with default milestone stages! 🏆");
        setIsAddModalOpen(false);
        setName("");
        setWebsiteUrl("");
        setRegDeadline("");
        setSubmissionDeadline("");
        setTeamName("");
        setPrizeNotes("");
        setProjectSummary("");
        fetchHackathons();
      } else {
        toast.error("Failed to create hackathon");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMilestone = async (milestone: Milestone, hackathonId: string) => {
    const isNowCompleted = !milestone.isCompleted;

    setHackathons((prev) =>
      prev.map((h) => {
        if (h.id !== hackathonId) return h;
        return {
          ...h,
          milestones: h.milestones.map((m) =>
            m.id === milestone.id ? { ...m, isCompleted: isNowCompleted } : m
          ),
        };
      })
    );

    if (isNowCompleted) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      toast.success(`Hackathon milestone "${milestone.title}" completed! +40 XP ⚡`);
    }

    try {
      await fetch(`/api/milestones/${milestone.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: isNowCompleted }),
      });
    } catch {
      toast.error("Failed to update milestone");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this hackathon?")) return;
    try {
      const res = await fetch(`/api/hackathons/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Hackathon removed");
        setHackathons((prev) => prev.filter((h) => h.id !== id));
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <CardSkeleton key={i} className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-36 rounded-full" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
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
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Hackathons & Deadlines
          </h2>
          <p className="text-xs text-muted-foreground">
            Track registration cutoffs, submission deadlines, and stage deliverables for national and global hackathons.
          </p>
        </div>

        <Button
          variant="glow"
          onClick={() => setIsAddModalOpen(true)}
          className="font-semibold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Hackathon</span>
        </Button>
      </div>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hackathons.length === 0 ? (
          <Card className="col-span-full py-16 text-center border-dashed">
            <Trophy className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-bold text-foreground text-sm">No Hackathons Logged</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Add upcoming hackathons like Smart India Hackathon (SIH), ETHGlobal, or Devpost hackathons.
            </p>
            <Button
              variant="glow"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Hackathon</span>
            </Button>
          </Card>
        ) : (
          hackathons.map((h) => {
            const daysLeft = getDaysLeft(h.submissionDeadline);
            const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;
            const completedCount = h.milestones?.filter((m) => m.isCompleted).length || 0;
            const totalCount = h.milestones?.length || 0;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <Card
                key={h.id}
                className="p-6 space-y-4 border-border/80 hover:border-amber-500/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <Badge
                          variant={
                            isUrgent ? "danger" : daysLeft !== null && daysLeft > 0 ? "warning" : "secondary"
                          }
                        >
                          {daysLeft !== null && daysLeft >= 0
                            ? `⏳ ${daysLeft} Days Remaining`
                            : "Submissions Closed"}
                        </Badge>
                        {h.teamName && (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {h.teamName}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-foreground">{h.name}</h3>
                    </div>

                    <button
                      onClick={() => handleDelete(h.id)}
                      className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {h.projectSummary && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      💡 {h.projectSummary}
                    </p>
                  )}

                  {h.prizeNotes && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex items-center gap-2">
                      <Award className="h-4 w-4 shrink-0" />
                      <span>{h.prizeNotes}</span>
                    </div>
                  )}

                  {/* Deadlines Box */}
                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-secondary/40 border border-border/60">
                    <div>
                      <span className="text-muted-foreground text-[11px]">Registration:</span>
                      <p className="font-semibold text-foreground">
                        {formatDate(h.regDeadline)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">Final Submission:</span>
                      <p className="font-semibold text-rose-400">
                        {formatDate(h.submissionDeadline)}
                      </p>
                    </div>
                  </div>

                  {/* Milestones Progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Deliverables</span>
                      <span className="font-bold text-foreground">
                        {completedCount}/{totalCount} Completed
                      </span>
                    </div>
                    <ProgressBar value={progress} colorClass="bg-amber-500" />
                  </div>

                  {/* Milestone Checklist */}
                  <div className="space-y-1.5 pt-2">
                    {h.milestones?.map((milestone) => (
                      <div
                        key={milestone.id}
                        onClick={() => toggleMilestone(milestone, h.id)}
                        className={`flex items-center gap-3 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                          milestone.isCompleted
                            ? "border-emerald-500/20 bg-emerald-500/5 text-muted-foreground line-through"
                            : "border-border/60 bg-secondary/30 hover:bg-secondary/70 text-foreground"
                        }`}
                      >
                        {milestone.isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className="flex-1 font-medium">{milestone.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Link */}
                {h.websiteUrl && (
                  <div className="pt-3 border-t border-border/60">
                    <a
                      href={h.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-400 hover:underline flex items-center gap-1.5"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Official Hackathon Portal</span>
                    </a>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Add Hackathon Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Hackathon Tracking"
        description="Track your team deadlines, deliverables, and submissions."
      >
        <form onSubmit={handleCreateHackathon} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Hackathon Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Smart India Hackathon (SIH 2026)"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Registration Deadline
              </label>
              <input
                type="date"
                value={regDeadline}
                onChange={(e) => setRegDeadline(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Submission Deadline *
              </label>
              <input
                type="date"
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. CodeCrafters"
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Official Website
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://sih.gov.in"
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Project Idea Summary
            </label>
            <input
              type="text"
              value={projectSummary}
              onChange={(e) => setProjectSummary(e.target.value)}
              placeholder="e.g. AI-driven real-time railway grievance redressal system"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Prize / Track Notes
            </label>
            <input
              type="text"
              value={prizeNotes}
              onChange={(e) => setPrizeNotes(e.target.value)}
              placeholder="e.g. Top 3 win ₹1,00,000 + Incubation Mentorship"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <Button type="submit" variant="glow" className="w-full mt-2 font-bold" isLoading={isSubmitting}>
            Add Hackathon 🏆
          </Button>
        </form>
      </Modal>
    </div>
  );
}
