"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  Settings,
  User,
  Key,
  Database,
  Download,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  Layers,
  LogOut,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from "@/components/ui/core";
import { CAREER_GOALS } from "@/lib/utils";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState("");
  const [careerGoal, setCareerGoal] = useState("Software Developer");
  const [careerLevel, setCareerLevel] = useState("Intermediate");
  const [targetTimeline, setTargetTimeline] = useState("6 Months");
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);

  useEffect(() => {
    fetchProfile();
    const storedKey = localStorage.getItem("devpulse_gemini_key") || "";
    setApiKey(storedKey);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setName(data.user.name || "");
          setCareerGoal(data.user.careerGoal || "Software Developer");
          setCareerLevel(data.user.careerLevel || "Intermediate");
          setTargetTimeline(data.user.targetTimeline || "6 Months");
        }
      }
    } catch {
      console.error("Failed to load profile");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          careerGoal,
          careerLevel,
          targetTimeline,
        }),
      });

      if (res.ok) {
        if (apiKey) {
          localStorage.setItem("devpulse_gemini_key", apiKey.trim());
        } else {
          localStorage.removeItem("devpulse_gemini_key");
        }
        await update({ name, careerGoal, careerLevel });
        toast.success("Settings saved successfully! ✨");
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReseed = async () => {
    if (!confirm("Reseed the database with fresh demo data? This will reset demo items.")) return;
    setIsReseeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      if (res.ok) {
        toast.success("Database successfully reseeded with fresh demo records!");
        window.location.reload();
      } else {
        toast.error("Failed to reseed database");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsReseeding(false);
    }
  };

  const handleExportData = async () => {
    try {
      const [goalsRes, projectsRes, dsaRes, osRes, journalRes] = await Promise.all([
        fetch("/api/goals"),
        fetch("/api/projects"),
        fetch("/api/dsa"),
        fetch("/api/open-source"),
        fetch("/api/journal"),
      ]);

      const exportObj = {
        exportedAt: new Date().toISOString(),
        profile: { name, careerGoal, careerLevel },
        goals: (await goalsRes.json()).goals || [],
        projects: (await projectsRes.json()).projects || [],
        dsa: (await dsaRes.json()).entries || [],
        openSource: (await osRes.json()).entries || [],
        journals: (await journalRes.json()).journals || [],
      };

      const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `devpulse-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      toast.success("Exported your DevPulse data to JSON!");
    } catch {
      toast.error("Failed to export data");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Settings & Configuration
        </h2>
        <p className="text-xs text-muted-foreground">
          Manage your career pathway, Gemini AI keys, theme preferences, and data exports.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile & Career Role */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border/80">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Developer Profile & Career Path</CardTitle>
              <CardDescription>Personalize your target focus area</CardDescription>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Target Career Path
              </label>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                {CAREER_GOALS.map((cg) => (
                  <option key={cg.slug} value={cg.name}>
                    {cg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Current Skill Level
              </label>
              <select
                value={careerLevel}
                onChange={(e) => setCareerLevel(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="Beginner">Beginner (Starting fresh / 1st-2nd year)</option>
                <option value="Intermediate">Intermediate (Building projects / pre-final)</option>
                <option value="Advanced">Advanced (Interview ready / Open Source)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Target Goal Timeline
              </label>
              <select
                value={targetTimeline}
                onChange={(e) => setTargetTimeline(e.target.value)}
                className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="3 Months">3 Months Intensive</option>
                <option value="6 Months">6 Months Balanced</option>
                <option value="1 Year">1 Year Comprehensive</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Gemini API Key Config */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border/80">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Google Gemini AI Key (Optional)</CardTitle>
              <CardDescription>
                Provide your custom Gemini API key or use built-in smart AI fallback
              </CardDescription>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Get your free key from the{" "}
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 underline"
              >
                Google AI Studio
              </a>
              . If left blank, DevPulse automatically uses realistic generative templates.
            </p>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border/80">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Appearance & Theme</CardTitle>
              <CardDescription>Choose your interface styling</CardDescription>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                theme === "dark"
                  ? "border-indigo-500 bg-indigo-500/10 text-foreground font-bold shadow-xs"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-5 w-5 text-indigo-400" />
              <span className="text-xs">Dark Theme</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                theme === "light"
                  ? "border-indigo-500 bg-indigo-500/10 text-foreground font-bold shadow-xs"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-5 w-5 text-amber-400" />
              <span className="text-xs">Light Theme</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                theme === "system"
                  ? "border-indigo-500 bg-indigo-500/10 text-foreground font-bold shadow-xs"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Laptop className="h-5 w-5 text-cyan-400" />
              <span className="text-xs">System Match</span>
            </button>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/30 font-semibold"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </Button>

          <Button type="submit" variant="glow" size="lg" isLoading={isSaving} className="font-bold">
            Save Preferences
          </Button>
        </div>
      </form>

      {/* Database Management & Export */}
      <Card className="p-6 space-y-4 border-dashed">
        <div className="flex items-center gap-3 pb-3 border-b border-border/80">
          <div className="p-2.5 rounded-xl bg-secondary text-foreground">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base">Data Management & Sandbox</CardTitle>
            <CardDescription>Export your data or reset sandbox records</CardDescription>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="text-sm font-bold text-foreground">JSON Backup & Export</h4>
            <p className="text-xs text-muted-foreground">
              Download your complete goals, DSA logs, projects, and journal history.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4" />
            <span>Export to JSON</span>
          </Button>
        </div>

        {(typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) || session?.user?.email === "demo@devpulse.com" ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
            <div>
              <h4 className="text-sm font-bold text-foreground">Reseed Demo Sandbox</h4>
              <p className="text-xs text-muted-foreground">
                Populate database with rich demo goals, projects, DSA logs, hackathons, and AI reviews.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleReseed}
              isLoading={isReseeding}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reseed Demo Data</span>
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
