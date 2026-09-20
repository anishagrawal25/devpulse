import Link from "next/link";
import { Zap, ArrowLeft, Target } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
        <Zap className="h-6 w-6" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        The consistency milestone or page you are looking for doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-500/20"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Consistency Dashboard</span>
      </Link>
    </div>
  );
}
