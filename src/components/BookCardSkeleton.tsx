import React from 'react';

export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs animate-pulse flex flex-col justify-between">
      {/* Aspect-video Preview Skeleton */}
      <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800/80 relative">
        <div className="absolute top-3 left-3 w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* Middle Content Skeleton */}
      <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Small Category */}
          <div className="w-20 h-3 rounded bg-slate-200 dark:bg-slate-700" />
          {/* Title */}
          <div className="w-3/4 h-5 rounded bg-slate-200 dark:bg-slate-700" />
          {/* 2-line Description */}
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-3.5 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="w-4/5 h-3.5 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>

        {/* Tech Stack Pills Skeleton */}
        <div className="flex items-center gap-1.5 pt-2">
          <div className="w-14 h-5 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="w-16 h-5 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="w-12 h-5 rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>

      {/* Footer Action Skeleton */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 px-5 py-3.5 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="w-24 h-8 rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="w-20 h-5 rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
};
