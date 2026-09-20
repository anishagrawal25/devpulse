import { GoogleGenerativeAI } from "@google/generative-ai";

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  description: string;
  topics: string[];
  tasks: { id: string; title: string; completed: boolean }[];
  resources: { title: string; url: string; type: "DOCS" | "VIDEO" | "PROJECT" | "PRACTICE" | string }[];
}

export interface GeneratedRoadmap {
  title: string;
  careerGoal: string;
  targetWeeks: number;
  summary: string;
  weeks: RoadmapWeek[];
}

export interface WeeklyReviewResult {
  summary: string;
  highlights: string[];
  areasToImprove: string[];
  actionPlanNextWeek: string[];
  productivityScore: number; // 1 to 100
  encouragingQuote: string;
}

export async function generateLearningRoadmap(
  careerGoal: string,
  experienceLevel: string = "Beginner",
  targetWeeks: number = 4,
  focusAreas: string = "",
  customApiKey?: string
): Promise<GeneratedRoadmap> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an elite principal engineer and career mentor. Generate a personalized, highly structured week-by-week learning roadmap for a student aiming to become a "${careerGoal}".
Level: ${experienceLevel}.
Duration: ${targetWeeks} weeks.
Additional Focus/Interests: ${focusAreas || "Standard industry standards"}.

Return ONLY valid JSON matching this exact TypeScript structure:
{
  "title": "${careerGoal} Mastery Roadmap",
  "careerGoal": "${careerGoal}",
  "targetWeeks": ${targetWeeks},
  "summary": "Brief 2-3 sentence overview of this roadmap",
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week theme / title",
      "description": "Week focus",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "tasks": [
        {"id": "w1-t1", "title": "Specific hands-on action item", "completed": false},
        {"id": "w1-t2", "title": "Build a mini project or solve 5 problems", "completed": false}
      ],
      "resources": [
        {"title": "Resource Name", "url": "https://example.com", "type": "DOCS"}
      ]
    }
  ]
}
Do not wrap with markdown code fences except pure json.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned) as GeneratedRoadmap;
      return parsed;
    } catch (err) {
      console.error("Gemini roadmap generation error, using smart fallback:", err);
    }
  }

  // Smart Fallback Roadmaps tailored to roles
  return getFallbackRoadmap(careerGoal, experienceLevel, targetWeeks);
}

export async function generateWeeklyReviewAI(
  weeklyData: {
    userName?: string;
    dsaSolvedCount: number;
    dsaTopics: string[];
    projectsWorkedOn: string[];
    milestonesCompleted: number;
    prCount: number;
    journalsCount: number;
    recentLearnings: string[];
  },
  customApiKey?: string
): Promise<WeeklyReviewResult> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an encouraging but rigorous senior engineering mentor reviewing a student's weekly consistency log.
Student Weekly Data:
- DSA Solved: ${weeklyData.dsaSolvedCount} problems (Topics: ${weeklyData.dsaTopics.join(", ") || "None"})
- Projects active: ${weeklyData.projectsWorkedOn.join(", ") || "None"}
- Milestones completed: ${weeklyData.milestonesCompleted}
- Open Source PRs: ${weeklyData.prCount}
- Reflection journals written: ${weeklyData.journalsCount}
- Key learnings noted: ${weeklyData.recentLearnings.join("; ") || "General study"}

Return ONLY valid JSON matching this schema:
{
  "summary": "2-3 sentence personalized review of their momentum and progress",
  "highlights": ["Key achievement 1", "Key achievement 2"],
  "areasToImprove": ["Area 1 where consistency or depth can improve", "Area 2"],
  "actionPlanNextWeek": ["Concrete goal 1 for next week", "Concrete goal 2", "Concrete goal 3"],
  "productivityScore": 85,
  "encouragingQuote": "Short inspiring quote"
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned) as WeeklyReviewResult;
    } catch (err) {
      console.error("Gemini weekly review generation error, using fallback:", err);
    }
  }

  // Fallback intelligent weekly review
  const score = Math.min(
    100,
    Math.max(
      40,
      weeklyData.dsaSolvedCount * 8 +
        weeklyData.milestonesCompleted * 15 +
        weeklyData.prCount * 12 +
        weeklyData.journalsCount * 10
    )
  );

  return {
    summary: `Great momentum this week! You logged ${weeklyData.dsaSolvedCount} DSA problems, pushed forward on ${weeklyData.projectsWorkedOn.length} project(s), and completed ${weeklyData.milestonesCompleted} key milestone(s). Your consistency is building strong compounding habits.`,
    highlights: [
      `Solved ${weeklyData.dsaSolvedCount} DSA problems with focus on core algorithmic patterns.`,
      `Completed ${weeklyData.milestonesCompleted} high-impact project milestone(s).`,
      weeklyData.prCount > 0
        ? `Contributed ${weeklyData.prCount} open-source pull request(s).`
        : `Maintained regular reflection habits with ${weeklyData.journalsCount} journal entry.`,
    ],
    areasToImprove: [
      weeklyData.dsaSolvedCount < 5
        ? "Aim for at least 1-2 DSA problems every single day to keep streaks alive."
        : "Challenge yourself with 1 Hard problem next week to test deeper pattern recognition.",
      "Ensure all project branches are cleanly committed with descriptive PR notes.",
      "Review past journal blockers to prevent recurring roadblocks.",
    ],
    actionPlanNextWeek: [
      "Ship the next milestone for your primary active project.",
      "Complete 7 DSA problems focusing on Graph & Dynamic Programming patterns.",
      "Submit or review 1 open-source pull request.",
      "Write a reflection journal entry after each deep work session.",
    ],
    productivityScore: score,
    encouragingQuote: "“Small daily improvements over time lead to stunning results.” – Robin Sharma",
  };
}

function getFallbackRoadmap(careerGoal: string, level: string, weeks: number): GeneratedRoadmap {
  const goalLower = careerGoal.toLowerCase();
  const isSoftwareDev = goalLower.includes("software") || goalLower.includes("sde");
  const isAI = goalLower.includes("ai") || goalLower.includes("data") || goalLower.includes("ml");
  const isBackend = goalLower.includes("backend");
  const isDevOps = goalLower.includes("devops") || goalLower.includes("cloud");

  const weeksData: RoadmapWeek[] = [];

  if (isSoftwareDev) {
    const sdeTemplates = [
      {
        title: "Core Data Structures & Algorithmic Complexity",
        desc: "Master Big-O time/space analysis, arrays, strings, two pointers, and sliding window patterns.",
        topics: ["Time & Space Complexity Analysis", "Two Pointers & Sliding Window Patterns", "Hash Tables & Collision Resolution"],
        tasks: [
          { id: "w1-t1", title: "Solve 10 LeetCode Easy/Medium array and string problems", completed: true },
          { id: "w1-t2", title: "Implement a custom Dynamic Array and HashMap from scratch in Java/C++/Python", completed: true },
          { id: "w1-t3", title: "Write unit tests for edge cases (empty inputs, duplicates, overflows)", completed: false },
        ],
        resources: [
          { title: "NeetCode Roadmap & Problem Bank", url: "https://neetcode.io/roadmap", type: "PRACTICE" },
          { title: "MIT 6.006 Introduction to Algorithms", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/", type: "VIDEO" },
        ],
      },
      {
        title: "Trees, Graphs & Dynamic Programming",
        desc: "Deep dive into recursion, BST traversals, BFS/DFS graph explorations, and memoization.",
        topics: ["Binary Search Trees & Lowest Common Ancestor", "Graph BFS / DFS / Topological Sort", "1D & 2D Dynamic Programming (Knapsack, LCS)"],
        tasks: [
          { id: "w2-t1", title: "Solve 10 Tree & Graph interview problems on LeetCode", completed: false },
          { id: "w2-t2", title: "Implement Dijkstra's shortest path algorithm and topological sort", completed: false },
          { id: "w2-t3", title: "Solve 5 classic DP problems (Coin Change, Longest Increasing Subsequence)", completed: false },
        ],
        resources: [
          { title: "Grokking the Coding Interview", url: "https://designgurus.org/", type: "DOCS" },
          { title: "Visualgo Algorithm Visualizer", url: "https://visualgo.net/", type: "DOCS" },
        ],
      },
      {
        title: "Object-Oriented Design & System Architecture",
        desc: "Apply SOLID principles, design patterns (Factory, Singleton, Observer), and low-level system modeling.",
        topics: ["SOLID Principles & Clean Code", "Design Patterns (Factory, Strategy, Observer, Decorator)", "Low-Level Design (Parking Lot, Elevator, Rate Limiter)"],
        tasks: [
          { id: "w3-t1", title: "Design and code a complete object-oriented system (e.g. In-Memory Cache or Chess Game)", completed: false },
          { id: "w3-t2", title: "Write comprehensive unit & integration tests with mock dependencies", completed: false },
        ],
        resources: [
          { title: "Refactoring Guru: Design Patterns", url: "https://refactoring.guru/design-patterns", type: "DOCS" },
          { title: "Clean Code by Robert C. Martin", url: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/", type: "DOCS" },
        ],
      },
      {
        title: "Concurrency, Relational Databases & Production Readiness",
        desc: "Understand multi-threading, race conditions, ACID transactions, and CI/CD pipelines.",
        topics: ["Threads, Locks & Deadlock Prevention", "SQL Indexing & ACID Transactions", "Git workflow, Code Reviews & CI/CD Pipelines"],
        tasks: [
          { id: "w4-t1", title: "Build a multi-threaded producer-consumer task processor", completed: false },
          { id: "w4-t2", title: "Submit a pull request with unit tests to an open-source project", completed: false },
          { id: "w4-t3", title: "Conduct a 45-minute mock coding interview session", completed: false },
        ],
        resources: [
          { title: "System Design Primer by Donne Martin", url: "https://github.com/donnemartin/system-design-primer", type: "DOCS" },
        ],
      },
    ];

    for (let i = 0; i < weeks; i++) {
      const template = sdeTemplates[i % sdeTemplates.length];
      weeksData.push({
        weekNumber: i + 1,
        title: template.title,
        description: template.desc,
        topics: template.topics,
        tasks: template.tasks.map((t, idx) => ({ ...t, id: `w${i + 1}-t${idx + 1}` })),
        resources: template.resources,
      });
    }
  } else if (isAI) {
    const aiTemplates = [
      {
        title: "Python Foundations & Vector Math",
        desc: "Master NumPy, Pandas, linear algebra fundamentals, and data structures.",
        topics: ["NumPy Vectorization", "Pandas DataFrame transformations", "Matrix calculus & dot products"],
        tasks: [
          { id: "w1-t1", title: "Build an automated data cleaning script in Pandas", completed: true },
          { id: "w1-t2", title: "Implement basic linear regression from scratch using NumPy", completed: true },
          { id: "w1-t3", title: "Solve 5 array manipulation LeetCode questions", completed: false },
        ],
        resources: [
          { title: "Python for Data Analysis (Wes McKinney)", url: "https://wesmckinney.com/book/", type: "DOCS" },
          { title: "3Blue1Brown Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", type: "VIDEO" },
        ],
      },
      {
        title: "Deep Learning Foundations with PyTorch",
        desc: "Understand backpropagation, neural network architectures, and PyTorch tensors.",
        topics: ["Tensors & Autograd", "Multi-Layer Perceptrons", "Loss functions & Optimizers (Adam/SGD)"],
        tasks: [
          { id: "w2-t1", title: "Build a MNIST digit classifier in PyTorch", completed: false },
          { id: "w2-t2", title: "Implement early stopping and hyperparameter tuning", completed: false },
        ],
        resources: [
          { title: "PyTorch Official Deep Learning Tutorials", url: "https://pytorch.org/tutorials/", type: "DOCS" },
        ],
      },
      {
        title: "LLMs, Embeddings & RAG Architectures",
        desc: "Integrate Google Gemini API, vector embeddings, and retrieval-augmented generation.",
        topics: ["Gemini 1.5 Flash/Pro SDK", "Vector DBs (Chroma/Pinecone/pgvector)", "Prompt Engineering & Structured Outputs"],
        tasks: [
          { id: "w3-t1", title: "Build a custom document Q&A bot with Gemini & Vector Store", completed: false },
          { id: "w3-t2", title: "Add streaming responses and token tracking", completed: false },
        ],
        resources: [
          { title: "Google Gemini API Cookbook", url: "https://ai.google.dev/gemini-api/docs", type: "DOCS" },
        ],
      },
      {
        title: "Production AI Agent Systems & Deployment",
        desc: "Build autonomous multi-tool agents and deploy with FastAPI & Docker.",
        topics: ["Function Calling / Tool Use", "FastAPI Async Endpoints", "Docker containerization & latency optimization"],
        tasks: [
          { id: "w4-t1", title: "Build an autonomous web-research agent with tool calling", completed: false },
          { id: "w4-t2", title: "Deploy your AI service with Docker and health checks", completed: false },
        ],
        resources: [
          { title: "FastAPI Production Guide", url: "https://fastapi.tiangolo.com/", type: "DOCS" },
        ],
      },
    ];

    for (let i = 0; i < weeks; i++) {
      const template = aiTemplates[i % aiTemplates.length];
      weeksData.push({
        weekNumber: i + 1,
        title: template.title,
        description: template.desc,
        topics: template.topics,
        tasks: template.tasks.map((t, idx) => ({ ...t, id: `w${i + 1}-t${idx + 1}` })),
        resources: template.resources,
      });
    }
  } else if (isBackend) {
    const backendTemplates = [
      {
        title: "Relational Databases & Schema Design",
        desc: "PostgreSQL, indexing, normal forms, and Prisma ORM query optimization.",
        topics: ["PostgreSQL indexing (B-Tree, GIN)", "Prisma multi-relation schemas", "Transactions & ACID guarantees"],
        tasks: [
          { id: "w1-t1", title: "Design an e-commerce database schema with Prisma", completed: true },
          { id: "w1-t2", title: "Write complex aggregation queries and benchmark with EXPLAIN ANALYZE", completed: false },
        ],
        resources: [
          { title: "Use The Index, Luke! (SQL Indexing)", url: "https://use-the-index-luke.com/", type: "DOCS" },
        ],
      },
      {
        title: "RESTful API Architecture & Authentication",
        desc: "Secure JWTs, refresh tokens, role-based access control (RBAC), and validation.",
        topics: ["JWT vs Session auth", "Zod request schema validation", "Rate limiting & CORS middleware"],
        tasks: [
          { id: "w2-t1", title: "Implement auth service with bcrypt and JWT rotation", completed: false },
          { id: "w2-t2", title: "Add rate limiting with Redis / in-memory tokens", completed: false },
        ],
        resources: [
          { title: "OWASP API Security Top 10", url: "https://owasp.org/www-project-api-security/", type: "DOCS" },
        ],
      },
      {
        title: "Caching, Queues & Asynchronous Processing",
        desc: "Redis caching patterns, background workers, and job queues.",
        topics: ["Redis Cache-Aside pattern", "BullMQ / Background Workers", "Idempotency keys"],
        tasks: [
          { id: "w3-t1", title: "Integrate Redis caching for high-traffic endpoints", completed: false },
          { id: "w3-t2", title: "Implement a background email/webhook processing worker", completed: false },
        ],
        resources: [
          { title: "Redis University: Caching Patterns", url: "https://university.redis.com/", type: "DOCS" },
        ],
      },
      {
        title: "System Design, Docker & Production Deployments",
        desc: "Microservices vs modular monoliths, Docker multi-stage builds, and CI/CD pipelines.",
        topics: ["Horizontal vs Vertical scaling", "Docker & Docker Compose", "GitHub Actions CI/CD"],
        tasks: [
          { id: "w4-t1", title: "Containerize your entire backend stack with health checks", completed: false },
          { id: "w4-t2", title: "Set up GitHub Actions to run tests and build Docker images", completed: false },
        ],
        resources: [
          { title: "System Design Primer by Donne Martin", url: "https://github.com/donnemartin/system-design-primer", type: "DOCS" },
        ],
      },
    ];

    for (let i = 0; i < weeks; i++) {
      const template = backendTemplates[i % backendTemplates.length];
      weeksData.push({
        weekNumber: i + 1,
        title: template.title,
        description: template.desc,
        topics: template.topics,
        tasks: template.tasks.map((t, idx) => ({ ...t, id: `w${i + 1}-t${idx + 1}` })),
        resources: template.resources,
      });
    }
  } else {
    // Default Full Stack / Frontend Roadmap
    const fullStackTemplates = [
      {
        title: "Modern React 19 & Next.js App Router",
        desc: "Master Server Components, Client boundaries, dynamic routing, and suspense streaming.",
        topics: ["React 19 Server Components", "Next.js App Router (Layouts, Templates, Suspense)", "Server Actions & Revalidation"],
        tasks: [
          { id: "w1-t1", title: "Build a responsive dashboard shell with Sidebar and Topbar", completed: true },
          { id: "w1-t2", title: "Implement server actions with optimistic UI updates", completed: true },
          { id: "w1-t3", title: "Solve 5 array & string DSA problems on LeetCode", completed: false },
        ],
        resources: [
          { title: "Next.js App Router Documentation", url: "https://nextjs.org/docs/app", type: "DOCS" },
          { title: "React 19 Official Documentation", url: "https://react.dev", type: "DOCS" },
        ],
      },
      {
        title: "Database Architecture with Prisma & PostgreSQL",
        desc: "Relational database schema modeling, migrations, indexing, and transactional integrity.",
        topics: ["PostgreSQL relations (1-to-many, many-to-many)", "Prisma migrations & client queries", "Data seeding & aggregations"],
        tasks: [
          { id: "w2-t1", title: "Define schema for multi-tenant SaaS application", completed: false },
          { id: "w2-t2", title: "Write seed script and test cascade deletes", completed: false },
          { id: "w2-t3", title: "Solve 5 Linked List & Stack DSA problems", completed: false },
        ],
        resources: [
          { title: "Prisma Schema Reference", url: "https://www.prisma.io/docs/orm/prisma-schema", type: "DOCS" },
        ],
      },
      {
        title: "Secure Authentication & API Integrations",
        desc: "Auth.js (NextAuth), JWT session management, RBAC, and third-party AI APIs.",
        topics: ["NextAuth Credentials & OAuth providers", "Zod form validation & Hook Form", "Google Gemini API Integration"],
        tasks: [
          { id: "w3-t1", title: "Implement secure registration, login, and session guards", completed: false },
          { id: "w3-t2", title: "Integrate Gemini API with structured JSON output", completed: false },
          { id: "w3-t3", title: "Solve 5 Tree & Graph DSA problems", completed: false },
        ],
        resources: [
          { title: "Auth.js Documentation", url: "https://authjs.dev/", type: "DOCS" },
        ],
      },
      {
        title: "Production Deployment, Monitoring & Polish",
        desc: "Performance optimization, Docker containers, lighthouse audits, and CI/CD pipelines.",
        topics: ["Vercel / Docker deployments", "Core Web Vitals & bundle optimization", "Error boundaries & Toast notifications"],
        tasks: [
          { id: "w4-t1", title: "Deploy application with live PostgreSQL database", completed: false },
          { id: "w4-t2", title: "Record 2-min demo walkthrough video and share on LinkedIn/GitHub", completed: false },
          { id: "w4-t3", title: "Submit project to 1 upcoming hackathon", completed: false },
        ],
        resources: [
          { title: "Vercel Production Checklist", url: "https://vercel.com/docs", type: "DOCS" },
        ],
      },
    ];

    for (let i = 0; i < weeks; i++) {
      const template = fullStackTemplates[i % fullStackTemplates.length];
      weeksData.push({
        weekNumber: i + 1,
        title: template.title,
        description: template.desc,
        topics: template.topics,
        tasks: template.tasks.map((t, idx) => ({ ...t, id: `w${i + 1}-t${idx + 1}` })),
        resources: template.resources,
      });
    }
  }

  return {
    title: `${careerGoal} Complete Roadmap`,
    careerGoal,
    targetWeeks: weeks,
    summary: `A structured ${weeks}-week pathway tailored for ${level} level developers aiming to become industry-ready ${careerGoal}s through hands-on project milestones and consistency.`,
    weeks: weeksData,
  };
}
