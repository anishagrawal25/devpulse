import React from "react";
import {
  Skeleton,
  PageHeaderSkeleton,
  MetricsGridSkeleton,
  ChartSkeleton,
  CardSkeleton,
} from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/10 bg-card/40 p-6 sm:p-8 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-44 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-9 w-96 max-w-full" />
        <Skeleton className="h-4 w-3/4 max-w-xl" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* Metrics Row */}
      <MetricsGridSkeleton count={4} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-6">
          <ChartSkeleton height="h-44" />
          <ChartSkeleton height="h-40" />
        </div>
      </div>
    </div>
  );
}
