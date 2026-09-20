"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Bell,
  Sun,
  Moon,
  Plus,
  Flame,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Menu,
  LogOut,
} from "lucide-react";
import { Button, Badge } from "@/components/ui/core";
import { cn } from "@/lib/utils";
import { QuickActionModal } from "@/components/layout/quick-action-modal";

interface ReminderItem {
  id: string;
  title: string;
  message: string;
  type: string;
  dueDate?: string;
  isRead: boolean;
}

export function Header({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await fetch("/api/reminders");
      if (res.ok) {
        const data = await res.json();
        setReminders(data.reminders || []);
      }
    } catch (err) {
      console.error("Failed to load reminders", err);
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
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = reminders.filter((r) => !r.isRead).length;

  const getPageTitle = () => {
    if (pathname === "/") return "Developer Consistency Hub";
    if (pathname.startsWith("/goals")) return "Goal Tracking & Milestones";
    if (pathname.startsWith("/roadmaps")) return "AI-Powered Learning Roadmaps";
    if (pathname.startsWith("/projects")) return "Project Tracking & Ship Velocity";
    if (pathname.startsWith("/dsa")) return "DSA Problem Tracker & Streaks";
    if (pathname.startsWith("/open-source")) return "Open Source Contributions";
    if (pathname.startsWith("/hackathons")) return "Hackathons & Deadlines";
    if (pathname.startsWith("/reminders")) return "Smart Reminder Center";
    if (pathname.startsWith("/journal")) return "Daily Reflection Journal";
    if (pathname.startsWith("/weekly-review")) return "AI Weekly Retrospective";
    if (pathname.startsWith("/analytics")) return "Consistency & Growth Analytics";
    if (pathname.startsWith("/settings")) return "Settings & Preferences";
    return "DevPulse Platform";
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6 backdrop-blur-md">
        {/* Left Side: Mobile Menu & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight">
              {getPageTitle()}
            </h1>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              DevPulse Execution Engine
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action, Streak, Reminders, Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action Button */}
          <Button
            size="sm"
            variant="glow"
            onClick={() => setIsQuickActionOpen(true)}
            className="hidden sm:flex shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Quick Log</span>
          </Button>

          {/* Quick Log Icon button on mobile */}
          <Button
            size="icon"
            variant="glow"
            onClick={() => setIsQuickActionOpen(true)}
            className="sm:hidden h-8 w-8 rounded-lg"
          >
            <Plus className="h-4 w-4" />
          </Button>

          {/* Notification / Reminder Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={cn(
                "relative rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                isNotificationsOpen && "bg-muted text-foreground"
              )}
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Menu */}
            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card p-4 shadow-xl z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        Reminders & Alerts
                      </span>
                      {unreadCount > 0 && (
                        <Badge variant="warning">{unreadCount} pending</Badge>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        router.push("/reminders");
                      }}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                    {reminders.length === 0 ? (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-emerald-400 opacity-60" />
                        All caught up! No active deadline alerts.
                      </div>
                    ) : (
                      reminders.slice(0, 5).map((reminder) => (
                        <div
                          key={reminder.id}
                          className={cn(
                            "p-3 rounded-xl border text-xs transition-colors cursor-pointer",
                            reminder.isRead
                              ? "border-border/60 bg-secondary/30 text-muted-foreground"
                              : "border-indigo-500/30 bg-indigo-500/5 text-foreground"
                          )}
                          onClick={() => markAsRead(reminder.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold flex items-center gap-1.5">
                              {reminder.type === "DEADLINE" && (
                                <Clock className="h-3 w-3 text-rose-400 shrink-0" />
                              )}
                              {reminder.type === "MILESTONE" && (
                                <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                              )}
                              {reminder.type === "DSA" && (
                                <Flame className="h-3 w-3 text-amber-500 shrink-0" />
                              )}
                              {reminder.title}
                            </span>
                            {!reminder.isRead && (
                              <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                            {reminder.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-500" />
              )}
            </button>
          )}

          {/* Quick Logout Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-xl p-2 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Global Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => {
          setIsQuickActionOpen(false);
          fetchReminders();
        }}
      />
    </>
  );
}
