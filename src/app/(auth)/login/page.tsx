"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Zap, Sparkles, ArrowRight, Lock, Mail, Flame, CheckCircle2, UserCheck, ShieldCheck } from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/ui/core";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  React.useEffect(() => {
    // Show demo button only in local development, on localhost, or if ?demo=true is provided
    if (typeof window !== "undefined") {
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const isDevEnv = process.env.NODE_ENV !== "production";
      const hasDemoParam = window.location.search.includes("demo=true");
      const isExplicitEnv = process.env.NEXT_PUBLIC_SHOW_DEMO === "true";

      if (isLocalhost || isDevEnv || hasDemoParam || isExplicitEnv) {
        setShowDemo(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter email and password");
    }

    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Welcome back to DevPulse!");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryDemo = async () => {
    setIsDemoLoading(true);
    try {
      const res = await signIn("credentials", {
        email: "demo@devpulse.com",
        password: "demo123",
        redirect: false,
      });

      if (res?.error) {
        toast.error("Demo account login failed. Please ensure DB is seeded.");
      } else {
        toast.success("Welcome to DevPulse Showcase Demo! 🚀");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Failed to connect to demo account");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10">
        {/* Left Side: Product Vision & Highlights */}
        <div className="space-y-6 hidden lg:block pr-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
              <Zap className="h-6 w-6 fill-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground">
              DevPulse
            </span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            Stop starting over. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Execute your tech goals consistently.
            </span>
          </h2>

          <p className="text-muted-foreground text-sm leading-relaxed">
            The all-in-one execution platform for CS students and aspiring engineers. Plan AI roadmaps, track project milestones, log daily DSA problem streaks, and conquer hackathons.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "AI-Generated Personalized Learning Roadmaps with Gemini",
              "DSA Problem Tracker with Streaks & Pattern Analytics",
              "Project Milestones & Hackathon Deadline Countdown Engine",
              "Automated Smart Reminders & AI Weekly Retrospectives",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Login & Try Demo Card */}
        <Card className="border border-border/80 shadow-2xl backdrop-blur-md bg-card/90">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                  Welcome to DevPulse
                </h3>
                <Badge variant="purple">v1.0 Ready</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Sign in to your account or get started with your developer journey
              </p>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5" autoComplete="off">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5" htmlFor="login-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-input bg-secondary/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5" htmlFor="login-password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-input bg-secondary/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5 text-sm font-semibold"
                  isLoading={isLoading}
                >
                  Login
                </Button>
                <Link href="/register" className="w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full py-2.5 text-sm font-semibold"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </form>

            {/* Developer/Admin Exclusive Try Demo Experience */}
            {showDemo && (
              <>
                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-border w-full" />
                  <span className="bg-card px-3 text-[11px] text-muted-foreground font-medium shrink-0">
                    Developer Demo Showcase
                  </span>
                  <div className="border-t border-border w-full" />
                </div>

                <div className="p-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-indigo-500/5 to-purple-950/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Instant Demo Access
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">Local / Dev Mode</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Instant access to pre-populated showcase data for local evaluation and demonstration.
                  </p>
                  <Button
                    type="button"
                    variant="glow"
                    size="md"
                    className="w-full font-bold shadow-md hover:shadow-indigo-500/30"
                    isLoading={isDemoLoading}
                    onClick={handleTryDemo}
                  >
                    <span>Try Demo</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
