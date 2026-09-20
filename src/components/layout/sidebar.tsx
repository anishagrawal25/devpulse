"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Target,
  Map,
  FolderKanban,
  Code2,
  GitPullRequest,
  Trophy,
  Bell,
  BookOpen,
  CalendarCheck,
  BarChart3,
  Settings,
  LogOut,
  Flame,
  Zap,
  Sparkles,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn, calculateLevel } from "@/lib/utils";
import { Badge } from "@/components/ui/core";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "AI Roadmaps", href: "/roadmaps", icon: Map, badge: "AI" },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "DSA Tracker", href: "/dsa", icon: Code2 },
  { name: "Open Source", href: "/open-source", icon: GitPullRequest },
  { name: "Hackathons", href: "/hackathons", icon: Trophy },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Weekly Review", href: "/weekly-review", icon: CalendarCheck, badge: "AI" },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
}: {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user as any;
  const userXp = user?.totalXp ?? 0;
  const streakCount = user?.streakCount ?? 0;
  const { level, progressPercent } = calculateLevel(userXp);
  const isDemo = user?.email === "demo@devpulse.com";

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card/95 backdrop-blur-md transition-transform duration-300 lg:static lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Logo Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/80">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-bold text-lg tracking-tight group"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-foreground flex items-center gap-1.5 leading-none">
                DevPulse
                <span className="text-[10px] font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  PRO
                </span>
              </span>
              <span className="text-[11px] text-muted-foreground font-normal mt-0.5">
                Career & Consistency
              </span>
            </div>
          </Link>

          {setIsMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Gamified Streak & XP Level Pill */}
        <div className="mx-4 my-3 p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Level {level} Dev</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-amber-400">
              <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-500 animate-pulse" />
              <span>{streakCount}d Streak</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
            <span>{user?.careerGoal || "Software Developer"}</span>
            <span>{userXp} XP</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Platform Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-indigo-500 dark:text-indigo-400"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom User Card & Actions */}
        <div className="border-t border-border/80 p-3 space-y-2">
          <Link
            href="/settings"
            className="flex items-center gap-2.5 p-2 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors group cursor-pointer"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          >
            <img
              src={
                user?.image ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || "Student"}`
              }
              alt="Avatar"
              className="h-9 w-9 rounded-xl border border-indigo-500/30 bg-muted shrink-0"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate flex items-center gap-1.5">
                {user?.name || "Student Developer"}
                {isDemo && (
                  <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/15 px-1 rounded border border-indigo-500/30">
                    DEMO
                  </span>
                )}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                {user?.email || "No session"}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
