const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedDemoData() {
  console.log("Seeding DevPulse Demo & Career Goal Data...");

  // 1. Career Goals Catalog
  const careerGoals = [
    {
      name: "Full Stack Developer",
      slug: "full-stack-developer",
      description: "Master modern web development across frontend, backend, databases, and DevOps.",
      defaultSkills: "TypeScript, Next.js, React, Node.js, PostgreSQL, Docker, Prisma, REST APIs, Tailwind CSS",
      icon: "Layers",
    },
    {
      name: "Frontend Developer",
      slug: "frontend-developer",
      description: "Build delightful, responsive, and accessible user interfaces with modern React & CSS.",
      defaultSkills: "React, Next.js, TypeScript, Tailwind CSS, Zustand, Performance, Accessibility",
      icon: "Layout",
    },
    {
      name: "Backend Developer",
      slug: "backend-developer",
      description: "Design high-performance distributed systems, robust APIs, databases, and microservices.",
      defaultSkills: "Node.js, Go, PostgreSQL, Redis, Docker, System Design, Microservices, CI/CD",
      icon: "Server",
    },
    {
      name: "AI / ML Engineer",
      slug: "ai-ml-engineer",
      description: "Develop generative AI workflows, LLM agents, deep learning models, and data pipelines.",
      defaultSkills: "Python, PyTorch, LangChain, Gemini API, Hugging Face, Vector DBs, FastAPI",
      icon: "Sparkles",
    },
    {
      name: "Data Analyst",
      slug: "data-analyst",
      description: "Transform complex data into actionable business intelligence, dashboards, and predictive insights.",
      defaultSkills: "SQL, Python, Pandas, Tableau, PowerBI, Data Visualization, Statistics",
      icon: "BarChart3",
    },
  ];

  for (const cg of careerGoals) {
    await prisma.careerGoal.upsert({
      where: { slug: cg.slug },
      update: cg,
      create: cg,
    });
  }

  // 2. Demo User: demo@devpulse.com
  const passwordHash = await bcrypt.hash("demo123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@devpulse.com" },
    update: {
      name: "Demo Developer",
      passwordHash,
      careerGoal: "Full Stack Developer",
      careerLevel: "Intermediate",
      targetTimeline: "6 Months",
      streakCount: 12,
      longestStreak: 18,
      totalXp: 2150,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DevPulseDemoUser",
      lastActiveAt: new Date(),
    },
    create: {
      email: "demo@devpulse.com",
      name: "Demo Developer",
      passwordHash,
      careerGoal: "Full Stack Developer",
      careerLevel: "Intermediate",
      targetTimeline: "6 Months",
      streakCount: 12,
      longestStreak: 18,
      totalXp: 2150,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DevPulseDemoUser",
      lastActiveAt: new Date(),
    },
  });

  const userId = demoUser.id;

  // Clear existing items for demo user to ensure idempotent seed
  const existingProjects = await prisma.project.findMany({ where: { userId }, select: { id: true } });
  const existingHackathons = await prisma.hackathon.findMany({ where: { userId }, select: { id: true } });
  
  const projectIds = existingProjects.map(p => p.id);
  const hackathonIds = existingHackathons.map(h => h.id);

  await prisma.milestone.deleteMany({
    where: {
      OR: [
        { projectId: { in: projectIds } },
        { hackathonId: { in: hackathonIds } },
      ]
    }
  });

  await prisma.goal.deleteMany({ where: { userId } });
  await prisma.project.deleteMany({ where: { userId } });
  await prisma.dsaEntry.deleteMany({ where: { userId } });
  await prisma.openSourceEntry.deleteMany({ where: { userId } });
  await prisma.hackathon.deleteMany({ where: { userId } });
  await prisma.reminder.deleteMany({ where: { userId } });
  await prisma.reflectionJournal.deleteMany({ where: { userId } });
  await prisma.weeklyReview.deleteMany({ where: { userId } });
  await prisma.roadmap.deleteMany({ where: { userId } });
  await prisma.activityLog.deleteMany({ where: { userId } });

  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // 3. Exact Goals from Prompt:
  // - Learn PostgreSQL (80%)
  // - Complete DevPulse MVP (60%)
  // - Solve 50 DSA Problems (70%)
  await prisma.goal.createMany({
    data: [
      {
        userId,
        title: "Learn PostgreSQL",
        description: "Master relational schema design, B-Tree & GIN indexing, transactions, and query optimization with EXPLAIN ANALYZE.",
        category: "Skill",
        progress: 80,
        status: "IN_PROGRESS",
        priority: "HIGH",
        targetDate: nextWeek,
      },
      {
        userId,
        title: "Complete DevPulse MVP",
        description: "Build out full consistency platform with AI roadmaps, DSA trackers, hackathons, and sleek Linear-inspired UI.",
        category: "Project",
        progress: 60,
        status: "IN_PROGRESS",
        priority: "URGENT",
        targetDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: "Solve 50 DSA Problems",
        description: "Focus on Arrays, Two Pointers, Trees, Graphs, and Dynamic Programming patterns on LeetCode.",
        category: "DSA",
        progress: 70,
        status: "IN_PROGRESS",
        priority: "HIGH",
        targetDate: nextMonth,
      },
    ],
  });

  // 4. Exact Projects from Prompt:
  // Project 1: InvoiceFlow (UI Complete, Backend Complete, Testing In Progress)
  const p1 = await prisma.project.create({
    data: {
      userId,
      title: "InvoiceFlow",
      description: "Automated billing and invoice generation SaaS for freelancers with Stripe and PDF export.",
      repoUrl: "https://github.com/demodev/invoiceflow",
      liveUrl: "https://invoiceflow-demo.vercel.app",
      techStack: "Next.js, TypeScript, Tailwind CSS, PostgreSQL, Stripe",
      status: "IN_PROGRESS",
      progress: 67,
      dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.milestone.createMany({
    data: [
      {
        projectId: p1.id,
        title: "UI Complete",
        description: "Dashboard layout, invoice builder forms, and responsive preview.",
        dueDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        isCompleted: true,
        completedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: p1.id,
        title: "Backend Complete",
        description: "Prisma schema, CRUD invoice routes, and Stripe payment webhooks.",
        dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        isCompleted: true,
        completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: p1.id,
        title: "Testing In Progress",
        description: "Playwright E2E invoice generation flows and webhook testing.",
        dueDate: nextWeek,
        isCompleted: false,
      },
    ],
  });

  // Project 2: DevPulse (Authentication Complete, Goal Tracking Complete, Analytics Pending)
  const p2 = await prisma.project.create({
    data: {
      userId,
      title: "DevPulse",
      description: "Career growth and developer consistency execution platform with Gemini AI roadmaps.",
      repoUrl: "https://github.com/anishagrawal25/devpulse",
      liveUrl: "http://localhost:3000",
      techStack: "Next.js 15, TypeScript, Tailwind CSS, Prisma, Gemini AI, Auth.js",
      status: "IN_PROGRESS",
      progress: 67,
      dueDate: nextWeek,
    },
  });

  await prisma.milestone.createMany({
    data: [
      {
        projectId: p2.id,
        title: "Authentication Complete",
        description: "Credentials, session tokens, and dual demo sandbox flow.",
        dueDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        isCompleted: true,
        completedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: p2.id,
        title: "Goal Tracking Complete",
        description: "Target dates, milestone management, and progress sliders.",
        dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        isCompleted: true,
        completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: p2.id,
        title: "Analytics Pending",
        description: "Recharts dashboards, consistency heatmaps, and readiness score.",
        dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        isCompleted: false,
      },
    ],
  });

  // 5. Exact DSA Progress from Prompt:
  // Easy: 20, Medium: 12, Hard: 3 (35 problems total), Current Streak: 12 Days
  const dsaProblems = [
    // Easy (20 problems)
    { title: "Two Sum", diff: "Easy", topic: "Arrays", daysAgo: 11 },
    { title: "Valid Anagram", diff: "Easy", topic: "Arrays", daysAgo: 11 },
    { title: "Contains Duplicate", diff: "Easy", topic: "Arrays", daysAgo: 10 },
    { title: "Valid Palindrome", diff: "Easy", topic: "Two Pointers", daysAgo: 10 },
    { title: "Best Time to Buy and Sell Stock", diff: "Easy", topic: "Sliding Window", daysAgo: 9 },
    { title: "Valid Parentheses", diff: "Easy", topic: "Stack", daysAgo: 9 },
    { title: "Binary Search", diff: "Easy", topic: "Binary Search", daysAgo: 8 },
    { title: "Reverse Linked List", diff: "Easy", topic: "Linked List", daysAgo: 8 },
    { title: "Merge Two Sorted Lists", diff: "Easy", topic: "Linked List", daysAgo: 7 },
    { title: "Invert Binary Tree", diff: "Easy", topic: "Trees", daysAgo: 7 },
    { title: "Maximum Depth of Binary Tree", diff: "Easy", topic: "Trees", daysAgo: 6 },
    { title: "Diameter of Binary Tree", diff: "Easy", topic: "Trees", daysAgo: 6 },
    { title: "Balanced Binary Tree", diff: "Easy", topic: "Trees", daysAgo: 5 },
    { title: "Same Tree", diff: "Easy", topic: "Trees", daysAgo: 5 },
    { title: "Subtree of Another Tree", diff: "Easy", topic: "Trees", daysAgo: 4 },
    { title: "Lowest Common Ancestor of a BST", diff: "Easy", topic: "Trees", daysAgo: 4 },
    { title: "Climbing Stairs", diff: "Easy", topic: "DP", daysAgo: 3 },
    { title: "Min Cost Climbing Stairs", diff: "Easy", topic: "DP", daysAgo: 2 },
    { title: "Single Number", diff: "Easy", topic: "Math", daysAgo: 1 },
    { title: "Counting Bits", diff: "Easy", topic: "Math", daysAgo: 0 },

    // Medium (12 problems)
    { title: "Group Anagrams", diff: "Medium", topic: "Arrays", daysAgo: 11 },
    { title: "Top K Frequent Elements", diff: "Medium", topic: "Arrays", daysAgo: 10 },
    { title: "3Sum", diff: "Medium", topic: "Two Pointers", daysAgo: 9 },
    { title: "Container With Most Water", diff: "Medium", topic: "Two Pointers", daysAgo: 8 },
    { title: "Longest Substring Without Repeating Characters", diff: "Medium", topic: "Sliding Window", daysAgo: 7 },
    { title: "Longest Repeating Character Replacement", diff: "Medium", topic: "Sliding Window", daysAgo: 6 },
    { title: "Daily Temperatures", diff: "Medium", topic: "Stack", daysAgo: 5 },
    { title: "Binary Tree Level Order Traversal", diff: "Medium", topic: "Trees", daysAgo: 4 },
    { title: "Number of Islands", diff: "Medium", topic: "Graphs", daysAgo: 3 },
    { title: "Course Schedule", diff: "Medium", topic: "Graphs", daysAgo: 2 },
    { title: "Coin Change", diff: "Medium", topic: "DP", daysAgo: 1 },
    { title: "Longest Increasing Subsequence", diff: "Medium", topic: "DP", daysAgo: 0 },

    // Hard (3 problems)
    { title: "Trapping Rain Water", diff: "Hard", topic: "Two Pointers", daysAgo: 6 },
    { title: "Merge k Sorted Lists", diff: "Hard", topic: "Heap", daysAgo: 3 },
    { title: "Word Ladder", diff: "Hard", topic: "Graphs", daysAgo: 0 },
  ];

  for (const prob of dsaProblems) {
    const solvedDate = new Date(now.getTime() - prob.daysAgo * 24 * 60 * 60 * 1000);
    await prisma.dsaEntry.create({
      data: {
        userId,
        problemTitle: prob.title,
        platform: "LeetCode",
        difficulty: prob.diff,
        topic: prob.topic,
        timeSpentMinutes: prob.diff === "Hard" ? 50 : prob.diff === "Medium" ? 35 : 20,
        notes: `Optimized with ${prob.topic} algorithmic pattern.`,
        problemUrl: `https://leetcode.com/problems/${prob.title.toLowerCase().replace(/ /g, "-")}`,
        solvedAt: solvedDate,
      },
    });
  }

  // 6. Exact Open Source from Prompt:
  // 5 Pull Requests, 3 Issues Resolved, 2 Repositories Contributed
  const osEntries = [
    // 5 PRs (across vercel/next.js & prisma/prisma)
    {
      repo: "vercel/next.js",
      title: "docs: clarify App Router Server Actions revalidation cache behavior",
      type: "Pull Request",
      status: "MERGED",
      url: "https://github.com/vercel/next.js/pull/71829",
      desc: "Updated documentation and added clear code examples for cache tagging.",
      daysAgo: 8,
    },
    {
      repo: "vercel/next.js",
      title: "fix: handle nested dynamic route param decoding in edge middleware",
      type: "Pull Request",
      status: "MERGED",
      url: "https://github.com/vercel/next.js/pull/72104",
      desc: "Fixed edge case where encoded URI characters caused hydration mismatches.",
      daysAgo: 5,
    },
    {
      repo: "prisma/prisma",
      title: "fix: prevent unnecessary connection pool reconnects on idle timeouts",
      type: "Pull Request",
      status: "MERGED",
      url: "https://github.com/prisma/prisma/pull/24890",
      desc: "Optimized connection pool recycling logic for serverless environments.",
      daysAgo: 3,
    },
    {
      repo: "prisma/prisma",
      title: "feat: add support for custom composite index naming in SQLite provider",
      type: "Pull Request",
      status: "OPEN",
      url: "https://github.com/prisma/prisma/pull/25102",
      desc: "Under review by Prisma core maintainers.",
      daysAgo: 2,
    },
    {
      repo: "vercel/next.js",
      title: "perf: optimize Turbopack module resolution for monorepo symlinks",
      type: "Pull Request",
      status: "OPEN",
      url: "https://github.com/vercel/next.js/pull/73210",
      desc: "Proposed caching pass to avoid repeated stat calls.",
      daysAgo: 1,
    },

    // 3 Issues Resolved
    {
      repo: "vercel/next.js",
      title: "issue: investigate Turbopack hot-reload delay on large SVG asset bundles",
      type: "Issue",
      status: "CLOSED",
      url: "https://github.com/vercel/next.js/issues/68902",
      desc: "Reproduced with benchmark repository and confirmed fix in v15.1.",
      daysAgo: 10,
    },
    {
      repo: "prisma/prisma",
      title: "issue: foreign key cascade constraint failure during batch transactions",
      type: "Issue",
      status: "CLOSED",
      url: "https://github.com/prisma/prisma/issues/23410",
      desc: "Submitted clean reproduction repository and assisted in test harness.",
      daysAgo: 7,
    },
    {
      repo: "prisma/prisma",
      title: "issue: type inference discrepancy with Prisma.JsonNull vs undefined",
      type: "Issue",
      status: "CLOSED",
      url: "https://github.com/prisma/prisma/issues/24119",
      desc: "Resolved through clarification and helper utility.",
      daysAgo: 4,
    },
  ];

  for (const os of osEntries) {
    await prisma.openSourceEntry.create({
      data: {
        userId,
        repoName: os.repo,
        prTitle: os.title,
        prUrl: os.type === "Pull Request" ? os.url : null,
        issueUrl: os.type === "Issue" ? os.url : null,
        status: os.status,
        contributionType: os.type,
        description: os.desc,
        mergedAt: os.status === "MERGED" ? new Date(now.getTime() - os.daysAgo * 24 * 60 * 60 * 1000) : null,
        createdAt: new Date(now.getTime() - os.daysAgo * 24 * 60 * 60 * 1000),
      },
    });
  }

  // 7. Exact Hackathons from Prompt:
  // - Hack Devengers 2.0 (Project Submitted)
  // - SIH (Research Phase)
  const h1 = await prisma.hackathon.create({
    data: {
      userId,
      name: "Hack Devengers 2.0",
      websiteUrl: "https://hackdevengers.devpost.com",
      regDeadline: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      submissionDeadline: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      teamName: "CodeCrafters",
      status: "SUBMITTED",
      prizeNotes: "Grand Prize: $5,000 + Cloud Mentorship Credits",
      projectSummary: "AI-powered automated accessibility scanner and code refactoring bot.",
    },
  });

  await prisma.milestone.createMany({
    data: [
      {
        hackathonId: h1.id,
        title: "Team Formation",
        description: "Formed team of 4 (Frontend, Backend, AI Specialist, Product).",
        dueDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        isCompleted: true,
        completedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        hackathonId: h1.id,
        title: "Working Prototype",
        description: "Completed Next.js + Gemini API core scanner.",
        dueDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        isCompleted: true,
        completedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        hackathonId: h1.id,
        title: "Project Submitted",
        description: "Submitted 3-minute demo video, GitHub repo, and live URL on Devpost.",
        dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        isCompleted: true,
        completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  const h2 = await prisma.hackathon.create({
    data: {
      userId,
      name: "SIH (Smart India Hackathon 2026)",
      websiteUrl: "https://sih.gov.in",
      regDeadline: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      submissionDeadline: new Date(now.getTime() + 24 * 24 * 60 * 60 * 1000),
      teamName: "CodeCrafters",
      status: "REGISTERED",
      prizeNotes: "Top Team Award: ₹1,00,000 Cash Prize + Incubation Mentorship",
      projectSummary: "Real-time AI passenger grievance redressal & railway asset tracking.",
    },
  });

  await prisma.milestone.createMany({
    data: [
      {
        hackathonId: h2.id,
        title: "Team Registration",
        description: "6 students registered with college mentor approval.",
        dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        isCompleted: true,
        completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        hackathonId: h2.id,
        title: "Research Phase",
        description: "Detailed problem statement analysis, stakeholder interviews, and architecture diagrams.",
        dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        isCompleted: false,
      },
      {
        hackathonId: h2.id,
        title: "Prototype & Presentation Deck",
        description: "Build Next.js interactive prototype and 10-slide deck.",
        dueDate: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
        isCompleted: false,
      },
    ],
  });

  // 8. Exact Reminders from Prompt:
  // - Finish Analytics Dashboard
  // - Complete Weekly Reflection
  // - Update Project Milestones
  await prisma.reminder.createMany({
    data: [
      {
        userId,
        title: "Finish Analytics Dashboard",
        message: "Finalize the Recharts consistency heatmaps and Career Readiness score card.",
        type: "MILESTONE",
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        isRead: false,
      },
      {
        userId,
        title: "Complete Weekly Reflection",
        message: "Record your key learnings on PostgreSQL indexing and Dynamic Programming.",
        type: "SYSTEM",
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        isRead: false,
      },
      {
        userId,
        title: "Update Project Milestones",
        message: "InvoiceFlow testing suite and DevPulse goal tracking are ready for verification.",
        type: "GOAL",
        dueDate: nextWeek,
        isRead: false,
      },
    ],
  });

  // 9. Reflection Journals
  await prisma.reflectionJournal.createMany({
    data: [
      {
        userId,
        title: "PostgreSQL B-Tree Indexing & Query Tuning Breakthrough",
        learnedContent: "Explored composite indexing strategies and index scan vs sequential scan trade-offs. Reduced execution time on a 1M row mock dataset from 420ms to 4ms using partial B-Tree indexes.",
        challengesContent: "Debugging query planner behavior with OR clauses. Solved by replacing with UNION ALL across indexed columns.",
        nextPlanContent: "Implement Gemini AI structured schema response parser and finalize the hackathon prototype.",
        mood: "PRODUCTIVE",
        tags: "PostgreSQL, Databases, Backend",
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: "Cracking Hard Graph Patterns (Kahn's & Tarjan's Algorithms)",
        learnedContent: "Mastered topological sort with Kahn's algorithm and understood how in-degree tracking cleanly handles cycle detection.",
        challengesContent: "Initially struggled with recursion state resets in DFS cycle detection.",
        nextPlanContent: "Solve 2 more graph problem variations and wrap up SIH presentation slides.",
        mood: "GREAT",
        tags: "DSA, Graphs, LeetCode",
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // 10. AI Weekly Review
  await prisma.weeklyReview.create({
    data: {
      userId,
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: now,
      dsaCount: 16,
      projectsProgress: "InvoiceFlow (67%), DevPulse (67%)",
      milestonesCompleted: 5,
      aiSummary: "Incredible consistency this week! You maintained your 12-day streak while logging 16 DSA problems across Graphs, Dynamic Programming, and Trees. Two active projects (InvoiceFlow and DevPulse) progressed past their core architectural milestones, and your PR to vercel/next.js was successfully merged.",
      aiRecommendations: "• Step up to solve 1-2 LeetCode Hard problems next week to build deeper intuition for complex multi-dimensional DP state transitions.\n• Wrap up testing on InvoiceFlow before pushing the production build.\n• Keep up your daily reflection habits to lock in core architectural takeaways.",
    },
  });

  // 11. 4-Week AI Roadmap
  const roadmapData = {
    title: "Full Stack Developer Mastery Pathway",
    careerGoal: "Full Stack Developer",
    targetWeeks: 4,
    summary: "Comprehensive 4-week pathway from Next.js 15 App Router architecture to PostgreSQL database tuning and production deployment.",
    weeks: [
      {
        weekNumber: 1,
        title: "Modern Next.js 15 App Router & React 19",
        description: "Server Components, Server Actions, Dynamic Layouts, and Tailwind UI architecture.",
        topics: ["React 19 Server Components", "App Router layouts and suspense", "Optimistic server actions"],
        tasks: [
          { id: "w1-t1", title: "Build responsive dashboard shell with dark mode", completed: true },
          { id: "w1-t2", title: "Implement Zod form validation for user inputs", completed: true },
          { id: "w1-t3", title: "Solve 5 array & hashmap LeetCode problems", completed: true },
        ],
        resources: [
          { title: "Next.js 15 Docs", url: "https://nextjs.org/docs", type: "DOCS" },
          { title: "Tailwind CSS Mastery", url: "https://tailwindcss.com", type: "DOCS" },
        ],
      },
      {
        weekNumber: 2,
        title: "PostgreSQL Database Design & Prisma ORM",
        description: "Relational schema modeling, foreign keys, query optimization, and migrations.",
        topics: ["Relational modeling with foreign keys", "Prisma migrations & transactions", "Database indexing & EXPLAIN plans"],
        tasks: [
          { id: "w2-t1", title: "Design production Prisma schema with cascading deletes", completed: true },
          { id: "w2-t2", title: "Write automated seed script for mock data", completed: true },
          { id: "w2-t3", title: "Solve 5 Tree & Graph DSA problems", completed: true },
        ],
        resources: [
          { title: "Prisma ORM Guide", url: "https://prisma.io/docs", type: "DOCS" },
        ],
      },
      {
        weekNumber: 3,
        title: "Authentication, Security & AI Integrations",
        description: "Auth.js, JWT tokens, RBAC, Google Gemini AI API integration.",
        topics: ["NextAuth Credentials and session tokens", "Google Gemini 1.5 Flash structured output", "Role-based access control"],
        tasks: [
          { id: "w3-t1", title: "Implement secure credential login and session provider", completed: true },
          { id: "w3-t2", title: "Integrate Gemini AI for roadmap and review generation", completed: false },
          { id: "w3-t3", title: "Solve 5 Dynamic Programming LeetCode problems", completed: false },
        ],
        resources: [
          { title: "Auth.js Documentation", url: "https://authjs.dev", type: "DOCS" },
          { title: "Google Gemini API", url: "https://ai.google.dev", type: "DOCS" },
        ],
      },
      {
        weekNumber: 4,
        title: "Docker, Monitoring & Production Deployment",
        description: "Multi-stage Docker builds, Core Web Vitals, Recharts analytics, and CI/CD.",
        topics: ["Docker multi-stage builds", "Recharts interactive data visualizations", "Vercel / Cloud deployment"],
        tasks: [
          { id: "w4-t1", title: "Containerize app with Docker Compose", completed: false },
          { id: "w4-t2", title: "Build comprehensive analytics dashboard with Recharts", completed: false },
          { id: "w4-t3", title: "Deploy to production with live database", completed: false },
        ],
        resources: [
          { title: "Docker Guides", url: "https://docs.docker.com", type: "DOCS" },
        ],
      },
    ],
  };

  await prisma.roadmap.create({
    data: {
      userId,
      title: roadmapData.title,
      careerGoal: roadmapData.careerGoal,
      targetWeeks: 4,
      contentJson: JSON.stringify(roadmapData),
      progress: 60,
    },
  });

  // 12. Activity Logs (populated across the past 12 days)
  for (let i = 0; i < 12; i++) {
    const logDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    await prisma.activityLog.create({
      data: {
        userId,
        type: i % 2 === 0 ? "DSA_SOLVED" : "PROJECT_MILESTONE",
        description: i % 2 === 0 ? `Solved LeetCode daily problem (Day ${12 - i})` : `Updated project milestones on DevPulse`,
        createdAt: logDate,
      },
    });
  }

  console.log("Demo account successfully seeded: demo@devpulse.com (password: demo123)");
}

seedDemoData()
  .catch((e) => {
    console.error("Error seeding demo data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
