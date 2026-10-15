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
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col justify-between">
      {/* Top: Portrait Book Showcase Stage Skeleton */}
      <div className="w-full min-h-[290px] sm:min-h-[310px] p-6 sm:p-7 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80 relative">
        {/* Top-left pill skeleton */}
        <div className="absolute top-3.5 left-3.5 w-16 h-5 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
        {/* Top-right icons skeleton */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
        </div>
        {/* Portrait Book Cover Object Skeleton */}
        <div className="w-[155px] sm:w-[170px] aspect-[2/3] max-h-[255px] rounded-r-md rounded-l-xs bg-slate-200 dark:bg-slate-700 animate-pulse shadow-md" />
      </div>

      {/* Middle: Content Hierarchy Skeleton */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Small Category */}
          <Skeleton className="w-20 h-3 rounded-md" />
          {/* Book Title */}
          <Skeleton className="w-3/4 h-5 rounded-md mt-1" />
          {/* Author */}
          <Skeleton className="w-1/2 h-3.5 rounded-md" />
          {/* 2-line Description */}
          <div className="space-y-1.5 pt-1">
            <Skeleton className="w-full h-3 rounded" />
            <Skeleton className="w-4/5 h-3 rounded" />
          </div>
        </div>

        {/* Stats Row Skeleton */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Skeleton className="w-16 h-3 rounded-full" />
          <Skeleton className="w-20 h-3 rounded-full" />
        </div>
      </div>

      {/* Bottom: Action Footer Skeleton */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 px-5 py-3.5 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <Skeleton className="w-16 h-5 rounded-md" />
        <Skeleton className="w-24 h-8 rounded-xl" />
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
