import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isPast, differenceInDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined, pattern: string = "MMM dd, yyyy") {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, pattern);
}

export function formatRelativeTime(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function getDaysLeft(date: Date | string | null | undefined) {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = differenceInDays(d, new Date());
  return diff;
}

export function calculateLevel(xp: number) {
  // Level 1: 0 - 500 XP, Level 2: 500 - 1200 XP, Level 3: 1200 - 2100 XP, etc.
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const currentLevelBaseXP = Math.pow(level - 1, 2) * 100;
  const nextLevelXP = Math.pow(level, 2) * 100;
  const progressPercent = Math.min(
    100,
    Math.round(((xp - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP || 1)) * 100)
  );

  return {
    level,
    currentXP: xp,
    nextLevelXP,
    progressPercent,
  };
}

export const CAREER_GOALS = [
  {
    name: "Software Developer",
    slug: "software-developer",
    description: "Core software engineering, Data Structures & Algorithms, Object-Oriented Design, and production architectures.",
    skills: ["DSA & Algorithms", "Java / C++ / Python", "OOP & System Design", "Git & GitHub", "SQL & Databases", "Unit Testing", "Problem Solving"],
    icon: "Code2",
  },
  {
    name: "Full Stack Developer",
    slug: "full-stack-developer",
    description: "Master modern web development across frontend, backend, databases, and DevOps.",
    skills: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Docker", "REST APIs", "Prisma"],
    icon: "Layers",
  },
  {
    name: "Frontend Developer",
    slug: "frontend-developer",
    description: "Build delightful, responsive, and accessible user interfaces with modern React & CSS.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux/Zustand", "Web Performance"],
    icon: "Layout",
  },
  {
    name: "Backend Developer",
    slug: "backend-developer",
    description: "Design high-performance distributed systems, robust APIs, databases, and microservices.",
    skills: ["Node.js", "Go / Java", "PostgreSQL", "Redis", "Docker", "System Design", "Microservices"],
    icon: "Server",
  },
  {
    name: "AI / ML Engineer",
    slug: "ai-ml-engineer",
    description: "Develop generative AI workflows, LLM agents, deep learning models, and data pipelines.",
    skills: ["Python", "PyTorch", "LangChain", "Gemini API", "Hugging Face", "Vector DBs", "FastAPI"],
    icon: "Sparkles",
  },
  {
    name: "DevOps & Cloud Engineer",
    slug: "devops-cloud-engineer",
    description: "Automate CI/CD pipelines, orchestrate Kubernetes clusters, and architect resilient cloud infrastructure.",
    skills: ["AWS / GCP", "Docker", "Kubernetes", "CI/CD Actions", "Terraform", "Linux", "Prometheus"],
    icon: "Terminal",
  },
  {
    name: "Mobile App Developer",
    slug: "mobile-app-developer",
    description: "Build native & cross-platform iOS and Android mobile apps with clean user experience.",
    skills: ["React Native", "Flutter", "TypeScript", "Swift / Kotlin", "Mobile UI/UX", "Firebase"],
    icon: "Smartphone",
  },
  {
    name: "Cybersecurity Analyst",
    slug: "cybersecurity-analyst",
    description: "Protect systems, identify security vulnerabilities, and build defense-in-depth infrastructure.",
    skills: ["Network Security", "OWASP Top 10", "Ethical Hacking", "Cryptography", "Linux", "SIEM Tools"],
    icon: "Shield",
  },
  {
    name: "Data Analyst",
    slug: "data-analyst",
    description: "Transform complex data into actionable business intelligence, dashboards, and predictive insights.",
    skills: ["SQL", "Python", "Pandas", "PowerBI", "Tableau", "Data Cleaning", "Statistics"],
    icon: "BarChart3",
  },
];
