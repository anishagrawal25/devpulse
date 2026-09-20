"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Zap, ArrowRight, Lock, Mail, User, Layers } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui/core";
import { CAREER_GOALS } from "@/lib/utils";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [careerGoal, setCareerGoal] = useState("Software Developer");
  const [careerLevel, setCareerLevel] = useState("Beginner");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error("Please fill in all required fields");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          careerGoal,
          careerLevel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully! Logging you in...");

      // Automatically sign in
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Network error during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <Card className="border border-border/80 shadow-2xl backdrop-blur-md bg-card/90">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
                <Zap className="h-6 w-6 fill-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Create your DevPulse Account
              </h2>
              <p className="text-xs text-muted-foreground">
                Start tracking your developer milestones and build consistency.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5" htmlFor="register-name">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-input bg-secondary/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5" htmlFor="register-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-input bg-secondary/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5" htmlFor="register-password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="register-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-input bg-secondary/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Target Career Track
                </label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <select
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    className="w-full rounded-xl border border-input bg-secondary/50 pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    {CAREER_GOALS.map((cg) => (
                      <option key={cg.slug} value={cg.name}>
                        {cg.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Current Experience Level
                </label>
                <select
                  value={careerLevel}
                  onChange={(e) => setCareerLevel(e.target.value)}
                  className="w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  <option value="Beginner">Beginner (Starting fresh / 1st-2nd year)</option>
                  <option value="Intermediate">Intermediate (Building projects / pre-final year)</option>
                  <option value="Advanced">Advanced (Interview prepping / Open source)</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="glow"
                className="w-full py-2.5 text-sm font-semibold mt-2"
                isLoading={isLoading}
              >
                <span>Launch My Consistency Journey</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-indigo-400 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
