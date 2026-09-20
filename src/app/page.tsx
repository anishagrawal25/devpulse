"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Zap,
  Sparkles,
  ArrowRight,
  Flame,
  Code2,
  FolderKanban,
  Target,
  Trophy,
  CalendarCheck,
  GitPullRequest,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Star,
  Terminal,
  Cpu,
  Layers,
  ArrowUpRight,
  Compass,
} from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/ui/core";

export default function LandingPage() {
  const { data: session } = useSession();
  const [selectedTrack, setSelectedTrack] = useState<string>("fullstack");

  const careerTracks = [
    {
      id: "fullstack",
      title: "Full Stack Engineer",
      icon: Layers,
      description: "Master Next.js 15, TypeScript, Node.js, PostgreSQL, and scalable microservices.",
      stats: "12-Week Adaptive Curriculum",
      skills: ["Next.js", "TypeScript", "Prisma", "Docker", "REST & GraphQL", "CI/CD"],
    },
    {
      id: "backend",
      title: "Backend & Systems",
      icon: Terminal,
      description: "Deep dive into distributed systems, Redis caching, database indexing, and Go/Java concurrency.",
      stats: "14-Week System Design Track",
      skills: ["Go / Node.js", "PostgreSQL", "Redis", "Kafka", "Docker & K8s", "System Design"],
    },
    {
      id: "aiml",
      title: "AI & ML Engineer",
      icon: Cpu,
      description: "Build production LLM agents, RAG pipelines, fine-tuning workflows, and PyTorch models.",
      stats: "10-Week GenAI & ML Track",
      skills: ["Python", "PyTorch", "LangChain", "Gemini API", "Vector DBs", "Model Eval"],
    },
    {
      id: "devops",
      title: "Cloud & DevOps",
      icon: Compass,
      description: "Automate Kubernetes infrastructure, Terraform provisioning, Docker containerization, and AWS.",
      stats: "8-Week SRE & Cloud Track",
      skills: ["Docker", "Kubernetes", "AWS / GCP", "Terraform", "GitHub Actions", "Prometheus"],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/20 selection:text-indigo-400 overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[20%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight group">
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
              <span className="text-[10px] text-muted-foreground font-normal">
                Career Operating System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#roadmaps" className="hover:text-foreground transition-colors">
              AI Roadmaps
            </a>
            <a href="#dsa" className="hover:text-foreground transition-colors">
              DSA Tracker
            </a>
            <a href="#retrospectives" className="hover:text-foreground transition-colors">
              Weekly AI Reviews
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/dashboard">
                <Button variant="glow" size="sm" className="font-semibold gap-1.5 shadow-md">
                  <span>Open Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="glow" size="sm" className="font-semibold gap-1.5 shadow-md shadow-indigo-500/20">
                    <span>Get Started Free</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Release Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-400 mb-8 backdrop-blur-md animate-fade-in shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>DevPulse 2.0 • The Developer Career Growth Accelerator</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl mx-auto leading-[1.1] mb-6">
            Master Your Tech Career. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Track Consistency. Ship 10x Faster.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
            The unified platform for high-performance software engineers. Generate adaptive AI roadmaps, track daily LeetCode momentum, log project milestones, and get automated weekly retrospectives from an AI Senior Mentor.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="glow" className="w-full font-bold text-base px-8 py-6 rounded-2xl shadow-xl shadow-indigo-500/25">
                <span>Start Free in 30 Seconds</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>

            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full font-semibold text-base px-6 py-6 rounded-2xl border-border/80 bg-card/60 backdrop-blur-sm hover:bg-card">
                <Flame className="h-5 w-5 text-amber-500 mr-2" />
                <span>Explore Live App</span>
              </Button>
            </Link>
          </div>

          {/* Trust Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto pt-6 border-t border-border/60">
            <div className="p-4 rounded-2xl bg-card/40 border border-border/60 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground mt-1">Open Source & Free</p>
            </div>
            <div className="p-4 rounded-2xl bg-card/40 border border-border/60 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">Gemini 1.5</p>
              <p className="text-xs text-muted-foreground mt-1">AI Mentor Guidance</p>
            </div>
            <div className="p-4 rounded-2xl bg-card/40 border border-border/60 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">14-Day</p>
              <p className="text-xs text-muted-foreground mt-1">Consistency Habit Loop</p>
            </div>
            <div className="p-4 rounded-2xl bg-card/40 border border-border/60 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">Next.js 15</p>
              <p className="text-xs text-muted-foreground mt-1">Sub-Second Speed</p>
            </div>
          </div>
        </section>

        {/* Live Interface Preview Mockup */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="relative rounded-3xl p-1 sm:p-2 bg-gradient-to-b from-indigo-500/30 via-border/50 to-transparent shadow-2xl shadow-indigo-500/10">
            <div className="rounded-[22px] bg-card/90 border border-border/80 overflow-hidden backdrop-blur-xl">
              {/* Browser Mockup Top Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-secondary/40 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-4 py-1 rounded-lg bg-background/80 text-[11px] font-mono text-muted-foreground border border-border/60">
                  https://devpulse.app/dashboard
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </div>
              </div>

              {/* Mockup Dashboard Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/40 border border-indigo-500/20">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Full Stack Track
                      </span>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Level 5 Dev (4,850 XP)
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      Consistency is your unfair advantage 🚀
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href="/register">
                      <Button variant="glow" size="sm" className="font-semibold shadow-md">
                        Try It Live
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Metric Cards Mockup */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-card border border-indigo-500/20 space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Daily Streak</span>
                      <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-foreground">12 Days</div>
                    <p className="text-[11px] text-muted-foreground">Longest: 28 Days</p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-emerald-500/20 space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>DSA Solved</span>
                      <Code2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-foreground">148 Solved</div>
                    <p className="text-[11px] text-emerald-400 font-medium">LeetCode & NeetCode</p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-cyan-500/20 space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Shipped Projects</span>
                      <FolderKanban className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-foreground">4 Apps</div>
                    <p className="text-[11px] text-muted-foreground">18 Milestones Done</p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-purple-500/20 space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Career Readiness</span>
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-foreground">88 / 100</div>
                    <p className="text-[11px] text-indigo-400 font-medium">Top 5% Velocity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Built For Modern Engineers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-4 tracking-tight">
              Everything You Need to Advance from Junior to Staff Engineer
            </h2>
            <p className="text-base text-muted-foreground mt-3">
              Stop juggling scattered Notion tables, spreadsheets, and bookmarks. DevPulse brings your technical goals into one high-velocity system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Card className="border-border/80 bg-card/60 backdrop-blur-sm hover:border-indigo-500/40 transition-all group p-6 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">AI Career Roadmaps</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dynamic, multi-week curriculums tailored to your career goals with interactive milestone check-offs and curated study resources.
              </p>
            </Card>

            {/* Card 2 */}
            <Card className="border-border/80 bg-card/60 backdrop-blur-sm hover:border-emerald-500/40 transition-all group p-6 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Daily DSA Problem Tracker</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Log problems solved across LeetCode, Codeforces, and NeetCode. Filter by topic, track time spent, and visualize difficulty distributions.
              </p>
            </Card>

            {/* Card 3 */}
            <Card className="border-border/80 bg-card/60 backdrop-blur-sm hover:border-purple-500/40 transition-all group p-6 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">AI Weekly Retrospectives</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every week, our AI analyzes your commits, solves, journals, and blockers to output Senior Staff Engineer actionable feedback.
              </p>
            </Card>

            {/* Card 4 */}
            <Card className="border-border/80 bg-card/60 backdrop-blur-sm hover:border-cyan-500/40 transition-all group p-6 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <FolderKanban className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Project & Ship Velocity</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Manage your side-projects with breakdown milestones, GitHub repository links, live URLs, and tech stack tags.
              </p>
            </Card>

            {/* Card 5 */}
            <Card className="border-border/80 bg-card/60 backdrop-blur-sm hover:border-amber-500/40 transition-all group p-6 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <GitPullRequest className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Open Source & Hackathons</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track merged PRs on major open-source repositories and never miss hackathon registration and submission deadlines.
              </p>
            </Card>

            {/* Card 6 */}
            <Card className="border-border/80 bg-card/60 backdrop-blur-sm hover:border-rose-500/40 transition-all group p-6 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Gamified Streaks & XP</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Earn developer XP for every problem solved, milestone completed, and journal entry written. Level up your career profile.
              </p>
            </Card>
          </div>
        </section>

        {/* Interactive Career Track Switcher */}
        <section id="roadmaps" className="py-20 bg-secondary/20 border-y border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Curated Roadmaps
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-4 tracking-tight">
                Select Your Tech Specialization
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Generate an intelligent weekly plan tailored to your target engineering track.
              </p>
            </div>

            {/* Track Selector Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {careerTracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                    selectedTrack === track.id
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/25"
                      : "bg-card/60 text-muted-foreground border-border hover:text-foreground hover:bg-card"
                  }`}
                >
                  <track.icon className="h-4 w-4" />
                  <span>{track.title}</span>
                </button>
              ))}
            </div>

            {/* Selected Track Details Card */}
            {(() => {
              const active = careerTracks.find((t) => t.id === selectedTrack) || careerTracks[0];
              return (
                <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-card border border-indigo-500/20 shadow-xl backdrop-blur-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                        <active.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{active.title}</h3>
                        <p className="text-xs text-indigo-400 font-semibold">{active.stats}</p>
                      </div>
                    </div>
                    <Link href="/register">
                      <Button variant="glow" size="sm" className="font-semibold gap-1.5">
                        <span>Generate Custom Plan</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {active.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-xs font-semibold text-foreground">Core Competencies Covered:</p>
                    <div className="flex flex-wrap gap-2">
                      {active.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1 font-mono text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* Bottom High-Converting CTA Banner */}
        <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-tr from-indigo-950/60 via-purple-950/40 to-slate-900/60 p-8 sm:p-14 backdrop-blur-xl shadow-2xl">
            <div className="absolute right-[-10%] top-[-20%] w-[350px] h-[350px] rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                100% Free Forever • No Credit Card Required
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight max-w-2xl mx-auto leading-tight">
                Ready to take complete control of your engineering growth?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Join ambitious software developers building real momentum with DevPulse. Create your account in under 30 seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" variant="glow" className="font-bold text-base px-8 py-6 rounded-2xl shadow-xl shadow-indigo-500/25">
                    <span>Create Your Free Account</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="font-semibold text-base px-6 py-6 rounded-2xl border-border bg-card/60">
                    <span>Sign In</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-card/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-md shadow-indigo-500/25">
              <Zap className="h-4 w-4 fill-white" />
            </div>
            <span className="font-bold text-foreground">DevPulse</span>
            <span className="text-xs text-muted-foreground">© 2026 DevPulse Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-foreground transition-colors">
              Sign Up
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <a
              href="https://github.com/anishagrawal25/devpulse"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
