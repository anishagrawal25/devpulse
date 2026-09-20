"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Layers,
  Layout,
  Server,
  Sparkles,
  BarChart3,
  Code2,
  Terminal,
  Smartphone,
  Shield,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui/core";
import { CAREER_GOALS } from "@/lib/utils";
import { toast } from "sonner";

const iconsMap: Record<string, any> = {
  Code2,
  Layers,
  Layout,
  Server,
  Sparkles,
  Terminal,
  Smartphone,
  Shield,
  BarChart3,
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [selectedGoal, setSelectedGoal] = useState("Software Developer");
  const [selectedLevel, setSelectedLevel] = useState("Intermediate");
  const [timeline, setTimeline] = useState("6 Months");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerGoal: selectedGoal,
          careerLevel: selectedLevel,
          targetTimeline: timeline,
        }),
      });

      if (res.ok) {
        await update({
          careerGoal: selectedGoal,
          careerLevel: selectedLevel,
        });
        toast.success("Profile setup complete! Welcome to DevPulse.");
        router.push("/dashboard");
      } else {
        toast.error("Failed to save onboarding settings");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl z-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/30 mb-2">
            <Zap className="h-6 w-6 fill-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Personalize Your Execution Roadmap
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Choose your target career path to unlock tailored learning roadmaps, curated project milestones, and intelligent reminders.
          </p>
        </div>

        {/* Career Goal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {CAREER_GOALS.map((goal) => {
            const Icon = iconsMap[goal.icon] || Layers;
            const isSelected = selectedGoal === goal.name;

            return (
              <div
                key={goal.slug}
                onClick={() => setSelectedGoal(goal.name)}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/15"
                    : "border-border bg-card/60 hover:bg-secondary/60 hover:border-border/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isSelected
                          ? "bg-indigo-500 text-white shadow-xs"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-1">
                    {goal.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {goal.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap gap-1">
                  {goal.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                  {goal.skills.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md text-muted-foreground">
                      +{goal.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline & Experience Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border border-border bg-card/80">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">
              Current Skill Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedLevel(level)}
                  className={`py-2 px-2 text-xs font-medium rounded-xl border transition-all ${
                    selectedLevel === level
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-semibold"
                      : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">
              Target Career Milestone Timeline
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["3 Months", "6 Months", "1 Year"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeline(t)}
                  className={`py-2 px-2 text-xs font-medium rounded-xl border transition-all ${
                    timeline === t
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-semibold"
                      : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            variant="glow"
            onClick={handleFinish}
            isLoading={isSubmitting}
            className="w-full sm:w-auto font-bold px-8"
          >
            <span>Enter DevPulse Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
