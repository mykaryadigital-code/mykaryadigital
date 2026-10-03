import React from 'react';

interface SkeletonProps {
  className?: string;
  rounded?: string;
}

/**
 * Base animated skeleton primitive with Tailwind's animate-pulse
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = 'w-full h-4',
  rounded = 'rounded-md',
}) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
};

/**
 * Individual Project Card Skeleton matching modern aspect-video anatomy
 */
export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col justify-between">
      {/* Top: aspect-video Preview Image Skeleton */}
      <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 animate-pulse relative">
        {/* Top-left pill skeleton */}
        <div className="absolute top-3 left-3 w-16 h-5 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
        {/* Top-right icons skeleton */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>

      {/* Middle: Content Hierarchy Skeleton */}
      <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Small Category Pill */}
          <Skeleton className="w-24 h-3 rounded-md" />
          {/* Project Title */}
          <Skeleton className="w-3/4 h-5 rounded-md mt-1" />
          {/* 2-line Description */}
          <div className="space-y-1.5 pt-1.5">
            <Skeleton className="w-full h-3.5 rounded" />
            <Skeleton className="w-4/5 h-3.5 rounded" />
          </div>
        </div>

        {/* Tech Stack Badges Skeleton */}
        <div className="flex items-center gap-1.5 pt-3">
          <Skeleton className="w-16 h-5 rounded-full" />
          <Skeleton className="w-20 h-5 rounded-full" />
          <Skeleton className="w-14 h-5 rounded-full" />
        </div>
      </div>

      {/* Bottom: Action Footer Skeleton */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 px-5 py-3.5 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <Skeleton className="w-24 h-8 rounded-xl" />
        <Skeleton className="w-20 h-4 rounded-md" />
      </div>
    </div>
  );
};

interface ProjectGridSkeletonProps {
  count?: number;
}

/**
 * Responsive 1-2-3 Column Project Grid Skeleton
 */
export const ProjectGridSkeleton: React.FC<ProjectGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      role="status"
      aria-label="Memuatkan projek..."
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProjectCardSkeleton key={`skeleton-${index}`} />
      ))}
      <span className="sr-only">Memuatkan data projek...</span>
    </div>
  );
};

/**
 * Filter Bar Skeleton for tab pills
 */
export const FilterBarSkeleton: React.FC = () => {
  return (
    <div className="w-full py-2 flex items-center gap-2 overflow-hidden">
      <Skeleton className="w-20 h-9 rounded-full shrink-0" />
      <Skeleton className="w-28 h-9 rounded-full shrink-0" />
      <Skeleton className="w-36 h-9 rounded-full shrink-0" />
      <Skeleton className="w-32 h-9 rounded-full shrink-0" />
      <Skeleton className="w-28 h-9 rounded-full shrink-0" />
    </div>
  );
};
