import React from 'react';

export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[18px] p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)] animate-pulse flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row gap-5 lg:gap-6 items-start">
        {/* Cover Skeleton */}
        <div className="w-36 sm:w-44 h-52 sm:h-60 rounded-[12px] bg-slate-100 shrink-0 mx-auto sm:mx-0" />

        {/* Info Skeleton */}
        <div className="flex-1 w-full space-y-3 self-stretch flex flex-col justify-between">
          <div className="space-y-3">
            {/* Status & Menu Skeleton */}
            <div className="flex items-center justify-between">
              <div className="w-24 h-6 rounded-full bg-slate-100" />
              <div className="w-8 h-8 rounded-lg bg-slate-100" />
            </div>

            {/* Price Skeleton */}
            <div className="w-20 h-6 rounded-md bg-slate-100" />

            {/* Title Skeleton */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-5 rounded-md bg-slate-100" />
              <div className="w-3/4 h-5 rounded-md bg-slate-100" />
            </div>

            {/* Author Skeleton */}
            <div className="w-32 h-4 rounded-md bg-slate-100" />

            {/* Metadata Skeleton */}
            <div className="flex items-center gap-4 pt-1">
              <div className="w-24 h-4 rounded-md bg-slate-100" />
              <div className="w-20 h-4 rounded-md bg-slate-100" />
              <div className="w-16 h-4 rounded-md bg-slate-100" />
            </div>

            {/* Description Skeleton */}
            <div className="space-y-1 pt-1">
              <div className="w-full h-3.5 rounded bg-slate-100" />
              <div className="w-full h-3.5 rounded bg-slate-100" />
              <div className="w-2/3 h-3.5 rounded bg-slate-100" />
            </div>
          </div>

          {/* CTA Skeleton */}
          <div className="flex items-center gap-3 pt-3">
            <div className="w-32 h-11 rounded-[12px] bg-slate-100" />
            <div className="w-28 h-11 rounded-[12px] bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
};
