"use client";

import React, { useState, useEffect } from "react";
import {
  FolderKanban,
  Plus,
  Github,
  Globe,
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
  Edit2,
  ExternalLink,
  Code2,
  Sparkles,
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
  CardSkeleton,
} from "@/components/ui/skeleton";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  repoUrl?: string;
  liveUrl?: string;
  techStack?: string;
  status: string;
  progress: number;
  dueDate?: string;
  milestones: Milestone[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Project Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [techStack, setTechStack] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Milestone Form State
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDueDate, setMilestoneDueDate] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Project title is required");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          repoUrl,
          liveUrl,
          techStack,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });

      if (res.ok) {
        toast.success("Project created with default milestones! 🚀");
        setIsCreateModalOpen(false);
        setTitle("");
        setDescription("");
        setRepoUrl("");
        setLiveUrl("");
        setTechStack("");
        fetchProjects();
      } else {
        toast.error("Failed to create project");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMilestone = async (milestone: Milestone, projectId: string) => {
    const isNowCompleted = !milestone.isCompleted;

    // Optimistically update
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedM = p.milestones.map((m) =>
          m.id === milestone.id ? { ...m, isCompleted: isNowCompleted } : m
        );
        const completedCount = updatedM.filter((m) => m.isCompleted).length;
        const newProgress = Math.round((completedCount / updatedM.length) * 100);
        return {
          ...p,
          progress: newProgress,
          status: newProgress === 100 ? "COMPLETED" : "IN_PROGRESS",
          milestones: updatedM,
        };
      })
    );

    if (isNowCompleted) {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      toast.success(`Milestone "${milestone.title}" completed! +40 XP ⚡`);
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

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim() || !selectedProjectId) return;

    try {
      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProjectId,
          title: milestoneTitle,
          dueDate: milestoneDueDate ? new Date(milestoneDueDate).toISOString() : null,
        }),
      });

      if (res.ok) {
        toast.success("Milestone added to project");
        setIsMilestoneModalOpen(false);
        setMilestoneTitle("");
        setMilestoneDueDate("");
        fetchProjects();
      }
    } catch {
      toast.error("Failed to add milestone");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Project deleted");
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      toast.error("Failed to delete project");
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
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-5 w-5" />
              </div>
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-5 w-24 rounded-md" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-8 w-full rounded-xl" />
                <Skeleton className="h-8 w-full rounded-xl" />
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
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Project Tracking & Velocity
          </h2>
          <p className="text-xs text-muted-foreground">
            Break software projects into concrete ship milestones and prevent half-finished builds.
          </p>
        </div>

        <Button
          variant="glow"
          onClick={() => setIsCreateModalOpen(true)}
          className="font-semibold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-border bg-card/30">
            <FolderKanban className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="font-semibold text-foreground text-sm">No Projects Created Yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Add your current portfolio project, hackathon build, or SaaS idea to start logging milestones.
            </p>
            <Button
              variant="glow"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Project</span>
            </Button>
          </div>
        ) : (
          projects.map((project) => (
            <Card
              key={project.id}
              className="p-6 space-y-5 border-border/80 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Project Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge
                        variant={
                          project.status === "COMPLETED" ? "success" : "default"
                        }
                      >
                        {project.status === "COMPLETED" ? "Shipped" : "In Development"}
                      </Badge>
                      {project.dueDate && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Target: {formatDate(project.dueDate)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      {project.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {project.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                )}

                {/* Tech Stack Pills */}
                {project.techStack && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.split(",").map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-foreground font-mono"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Completion</span>
                    <span className="font-bold text-emerald-400">{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} colorClass="bg-emerald-500" />
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Milestones Checklist
                    </span>
                    <button
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setIsMilestoneModalOpen(true);
                      }}
                      className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Milestone</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {project.milestones?.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground py-2">
                        No milestones yet. Click &quot;Add Milestone&quot; above.
                      </p>
                    ) : (
                      project.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          onClick={() => toggleMilestone(milestone, project.id)}
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
                          {milestone.dueDate && (
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {formatDate(milestone.dueDate, "MMM d")}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Links Footer */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:underline flex items-center gap-1.5"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>

                <span className="text-[11px] text-muted-foreground">
                  {project.milestones.filter((m) => m.isCompleted).length}/
                  {project.milestones.length} done
                </span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Software Project"
        description="Set up your project with milestones, tech stack, and GitHub links."
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Project Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. InvoiceFlow - Automated Billing SaaS"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Description / Summary
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Full-stack billing application with Stripe and Next.js 15."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Tech Stack (Comma Separated)
            </label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="Next.js 15, TypeScript, Tailwind CSS, PostgreSQL, Prisma"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Live URL / Deployment
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://myproject.vercel.app"
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Target Ship Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <Button type="submit" variant="glow" className="w-full mt-2 font-bold" isLoading={isSubmitting}>
            Create Project 🚀
          </Button>
        </form>
      </Modal>

      {/* Add Milestone Modal */}
      <Modal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        title="Add Project Milestone"
        description="Add a specific task or feature milestone to this project."
      >
        <form onSubmit={handleAddMilestone} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Milestone Title *
            </label>
            <input
              type="text"
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
              placeholder="e.g. Integrate Stripe Webhooks & Billing"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={milestoneDueDate}
              onChange={(e) => setMilestoneDueDate(e.target.value)}
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2">
            Add Milestone
          </Button>
        </form>
      </Modal>
    </div>
  );
}
