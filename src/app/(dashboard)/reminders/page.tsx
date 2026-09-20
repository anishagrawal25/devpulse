"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Clock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Trash2,
  Calendar,
  Sparkles,
  Check,
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
import {
  Skeleton,
  PageHeaderSkeleton,
  CardSkeleton,
} from "@/components/ui/skeleton";

interface Reminder {
  id: string;
  title: string;
  message: string;
  type: string;
  dueDate?: string;
  isRead: boolean;
  createdAt: string;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filterType, setFilterType] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("DEADLINE");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await fetch("/api/reminders");
      if (res.ok) {
        const data = await res.json();
        setReminders(data.reminders || []);
      }
    } catch {
      toast.error("Failed to load reminders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return toast.error("Title and message are required");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          type,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });

      if (res.ok) {
        toast.success("Reminder created");
        setIsAddModalOpen(false);
        setTitle("");
        setMessage("");
        setDueDate("");
        fetchReminders();
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/reminders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isRead: true } : r))
      );
    } catch {
      toast.error("Failed to update reminder");
    }
  };

  const dismissReminder = async (id: string) => {
    try {
      await fetch(`/api/reminders/${id}`, { method: "DELETE" });
      toast.success("Reminder dismissed");
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Failed to delete reminder");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeaderSkeleton />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-xl" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} className="p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="h-3 w-96 max-w-full" />
                </div>
              </div>
              <Skeleton className="h-8 w-24 rounded-xl" />
            </CardSkeleton>
          ))}
        </div>
      </div>
    );
  }

  const filtered =
    filterType === "ALL"
      ? reminders
      : filterType === "UNREAD"
      ? reminders.filter((r) => !r.isRead)
      : reminders.filter((r) => r.type === filterType);

  const unreadCount = reminders.filter((r) => !r.isRead).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Smart Reminder Center</span>
            {unreadCount > 0 && (
              <Badge variant="warning">{unreadCount} Pending Alerts</Badge>
            )}
          </h2>
          <p className="text-xs text-muted-foreground">
            Automated intelligence engine alerting you to approaching hackathons, overdue milestones, and DSA targets.
          </p>
        </div>

        <Button
          variant="glow"
          onClick={() => setIsAddModalOpen(true)}
          className="font-semibold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Reminder</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "UNREAD", "DEADLINE", "MILESTONE", "DSA"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              filterType === tab
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "ALL" ? "All Reminders" : tab}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="py-16 text-center border-dashed">
            <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-400 opacity-60 mb-3" />
            <h3 className="font-bold text-foreground text-sm">All caught up!</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No pending deadline alerts or overdue milestones.
            </p>
          </Card>
        ) : (
          filtered.map((reminder) => {
            const isDeadline = reminder.type === "DEADLINE";
            const isMilestone = reminder.type === "MILESTONE";
            const isDsa = reminder.type === "DSA";

            return (
              <Card
                key={reminder.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  reminder.isRead
                    ? "border-border/60 bg-card/40 opacity-80"
                    : isDeadline
                    ? "border-rose-500/30 bg-rose-500/5 shadow-xs"
                    : isMilestone
                    ? "border-amber-500/30 bg-amber-500/5 shadow-xs"
                    : "border-indigo-500/30 bg-indigo-500/5 shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isDeadline
                        ? "bg-rose-500/20 text-rose-400"
                        : isMilestone
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-indigo-500/20 text-indigo-400"
                    }`}
                  >
                    {isDeadline && <Clock className="h-4 w-4" />}
                    {isMilestone && <AlertTriangle className="h-4 w-4" />}
                    {isDsa && <Flame className="h-4 w-4" />}
                    {!isDeadline && !isMilestone && !isDsa && <Bell className="h-4 w-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={
                          isDeadline
                            ? "danger"
                            : isMilestone
                            ? "warning"
                            : isDsa
                            ? "purple"
                            : "secondary"
                        }
                      >
                        {reminder.type}
                      </Badge>
                      {reminder.dueDate && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {formatDate(reminder.dueDate)}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-foreground">
                      {reminder.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                      {reminder.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!reminder.isRead && (
                    <button
                      onClick={() => markAsRead(reminder.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground border border-border flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => dismissReminder(reminder.id)}
                    className="p-2 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Custom Reminder Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Custom Reminder"
        description="Schedule a reminder alert for upcoming tasks or targets."
      >
        <form onSubmit={handleCreateReminder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Reminder Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SIH Round 1 PPT Submission"
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Message Details *
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Ensure all slides have Figma links and tech stack diagrams."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Alert Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="DEADLINE">Deadline Alert</option>
                <option value="MILESTONE">Milestone</option>
                <option value="DSA">DSA Practice</option>
                <option value="GOAL">Goal Target</option>
                <option value="SYSTEM">General Note</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          <Button type="submit" variant="glow" className="w-full mt-2 font-bold" isLoading={isSubmitting}>
            Save Reminder
          </Button>
        </form>
      </Modal>
    </div>
  );
}
