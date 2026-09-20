# ⚡ DevPulse

<div align="center">

![DevPulse Banner](https://img.shields.io/badge/DevPulse-Consistency%20Platform-6366f1?style=for-the-badge&logo=rocket&logoColor=white)

**Career Growth, Consistency & Execution Engine for Software Developers**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Powered-8e75ff?style=flat-square&logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](LICENSE)

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Environment Variables](#-environment-variables) • [Database Schema](#-database-schema) • [Contributing](#-contributing)

</div>

---

## 📌 Overview

**DevPulse** is a dedicated career development and consistency execution platform designed for students, aspiring software engineers, and developers.

Instead of juggling fragmented spreadsheets, notes, to-do lists, and separate bookmarking tools, **DevPulse** centralizes your entire developer journey:
- 🎯 **Goal Setting & Milestone Tracking**
- 🤖 **AI-Generated Personalized Roadmaps** (Gemini AI)
- 💻 **DSA Problem Solving & Pattern Analytics**
- 🚀 **Software Project Velocity & Ship Checklists**
- 🏆 **Hackathon Deadline Countdown & Team Deliverables**
- 🌐 **Open Source PR & Contribution Logs**
- ✍️ **Daily Technical Reflection Journals**
- 🧠 **Automated AI Weekly Retrospectives**
- 🔔 **Intelligent Deadline & Streak Reminders**

---

## ✨ Key Features

### 1. 📊 Consistency & Career Readiness Dashboard
- **Gamified Momentum**: Real-time streak tracking, XP level progression, and dynamic Career Readiness Score (0–100).
- **Interactive Visualizations**: 14-day activity consistency heatmap, DSA difficulty distribution donut chart, and topic pattern breakdown powered by Recharts.
- **Overdue Alert Banner**: Automatic warnings for approaching submission deadlines and neglected milestones.

### 2. 🎯 Goal & Milestone Management
- Categorize goals into **Skills**, **Projects**, **DSA**, and **Career**.
- Interactive progress sliders with instant progress synchronization and milestone celebrations (confetti particle effects).
- Priority filters (**Urgent**, **High**, **Medium**, **Low**) with target completion dates.

### 3. 🤖 AI Learning Roadmaps (Powered by Google Gemini)
- Dynamically generate custom 4, 6, or 8-week technical curriculums based on your target career track (**Software Developer**, **Full Stack**, **Backend**, **Frontend**, **AI/ML**, **DevOps**, **Mobile**, or **Cybersecurity**).
- Week-by-week actionable checklists with curated documentation, video tutorials, and practice exercises.
- Real-time progress calculation as tasks are completed.

### 4. 💻 DSA Tracker & Problem Bank
- Log daily problem-solving sessions from **LeetCode**, **Codeforces**, **HackerRank**, **GeeksforGeeks**, and **NeetCode**.
- Categorize by algorithm patterns (*Sliding Window, Dynamic Programming, Two Pointers, Trees, Graphs, etc.*).
- Search and filter by difficulty, topic, platform, or personal solution notes.

### 5. 🚀 Project Tracking & Ship Velocity
- Prevent half-finished projects by breaking builds into concrete deliverables.
- Track GitHub repositories, live demo deployments, and tech stack tags.
- Milestone checklists with optimistic UI state updates.

### 6. 🏆 Hackathons & Deadlines Engine
- Track national and international competitions (*Smart India Hackathon, ETHGlobal, Devpost, MLH*).
- Real-time countdowns for registration cutoffs and final round project submissions.
- Team notes, prize track goals, and stage deliverable checklists.

### 7. 🌐 Open Source Contribution Hub
- Log Pull Requests, issues, and code reviews across open-source repositories (*Next.js, React, Prisma, Tailwind CSS*).
- Track merged vs. open status and repository diversity.

### 8. ✍️ Daily Reflection Journal & 🧠 AI Weekly Reviews
- **Daily Reflection**: Document daily learnings, technical challenges, tomorrow's plan, and mood/energy level.
- **AI Weekly Retrospectives**: Gemini AI analyzes your 7-day logs across DSA, projects, and reflections to deliver personalized mentor recommendations and weekly execution scores.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router with Server & Client Components) |
| **Language** | TypeScript |
| **Frontend** | React 19, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Data Visualization** | Recharts (Responsive Charts & Heatmaps) |
| **Database & ORM** | Prisma ORM with SQLite (B-Tree indexed, PostgreSQL ready) |
| **Authentication** | NextAuth.js (Credentials Provider, JWT Session Strategy) |
| **AI Intelligence** | Google Gemini API (`@google/generative-ai` & `gemini-1.5-flash`) |
| **Styling & Theme** | Dark/Light Mode with `next-themes` and Glassmorphism CSS tokens |

---

## 🚀 Getting Started

Follow these steps to run DevPulse locally on your machine:

### Prerequisites
- **Node.js**: `v18.18.0` or higher
- **npm** or **pnpm** / **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/anishagrawal25/devpulse.git
cd devpulse
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env
```
Update `.env` with your secrets:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-random-key-here"

# Google Gemini API Key (Optional - Fallback templates are built-in)
GEMINI_API_KEY="your-gemini-api-key"

# Demo Mode Toggle (set to true for showcase login)
NEXT_PUBLIC_SHOW_DEMO="true"
```

### 4. Initialize Database & Seed Sample Data
```bash
# Push Prisma schema with optimized indexes
npx prisma db push

# Seed realistic showcase data (Demo account)
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Account Credentials

For instant demonstration and feature evaluation:
- **Email**: `demo@devpulse.com`
- **Password**: `demo123`
- *(Or click the **"Try Demo"** button on the Login page)*

> **Note**: New user accounts created via **Sign Up** start with a **100% clean slate** (0 goals, 0 projects, 0 DSA solves) so you can build your own authentic progress.

---

## 📂 Project Structure

```
devpulse/
├── prisma/
│   ├── schema.prisma        # Prisma schema with B-Tree indexes
│   └── seed.js              # Comprehensive demo sandbox seed data
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication routes (Login, Register)
│   │   ├── (dashboard)/     # Main application views
│   │   │   ├── analytics/   # Consistency metrics & charts
│   │   │   ├── dsa/         # DSA Problem Tracker
│   │   │   ├── goals/       # Goal & milestone tracking
│   │   │   ├── hackathons/  # Hackathon countdown engine
│   │   │   ├── journal/     # Daily technical reflection journal
│   │   │   ├── open-source/ # Open-source PR logs
│   │   │   ├── projects/    # Project ship velocity checklists
│   │   │   ├── reminders/   # Smart notification & reminder center
│   │   │   ├── roadmaps/    # AI-generated weekly curriculum
│   │   │   ├── settings/    # Profile & theme configuration
│   │   │   ├── weekly-review# AI Weekly Retrospectives
│   │   │   ├── loading.tsx  # Zero-CLS instant skeleton loaders
│   │   │   └── page.tsx     # Overview dashboard
│   │   ├── api/             # Next.js REST API route handlers
│   │   └── layout.tsx       # Global root layout & providers
│   ├── components/
│   │   ├── layout/          # Sidebar, Header, Quick Action Modal
│   │   └── ui/              # Core cards, buttons, badges, skeletons
│   ├── lib/
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── gemini.ts        # Gemini AI prompt orchestration
│   │   ├── prisma.ts        # Global Prisma client singleton
│   │   └── utils.ts         # Career roles, formulas & helpers
│   └── styles/
│       └── globals.css      # Design tokens, themes & shimmer animations
├── .env.example             # Example environment configuration
├── Dockerfile               # Containerized deployment spec
├── package.json
└── tsconfig.json
```

---

## ⚡ Performance & Rendering Optimizations

- **Instant Perceived Speed**: Zero Cumulative Layout Shift (CLS = 0) with custom hardware-accelerated shimmer skeleton loaders.
- **Indexed Queries**: Composite indexes on `userId`, `status`, `solvedAt`, and foreign keys ensure sub-10ms query execution.
- **Parallel Data Fetching**: Optimized with `Promise.all` across route handlers.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve DevPulse:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Built with ❤️ for aspiring software engineers striving for daily consistency.
</div>
