import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="border border-zinc-900 bg-zinc-900/30 rounded-2xl overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-[16/10] bg-zinc-800" />
      {/* Body Skeleton */}
      <div className="p-5 flex flex-col gap-4">
        {/* Category & Badge */}
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-zinc-800 rounded" />
          <div className="h-5 w-12 bg-zinc-800 rounded-full" />
        </div>
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 w-full bg-zinc-800 rounded" />
          <div className="h-5 w-2/3 bg-zinc-800 rounded" />
        </div>
        {/* Info */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/40">
          <div className="flex gap-2 items-center">
            <div className="h-4 w-4 bg-zinc-800 rounded-full" />
            <div className="h-4 w-32 bg-zinc-800 rounded" />
          </div>
          <div className="flex gap-2 items-center">
            <div className="h-4 w-4 bg-zinc-800 rounded-full" />
            <div className="h-4 w-44 bg-zinc-800 rounded" />
          </div>
        </div>
        {/* Footer (Price & Button) */}
        <div className="flex items-center justify-between pt-3 mt-1">
          <div className="space-y-1">
            <div className="h-3 w-16 bg-zinc-800 rounded" />
            <div className="h-5 w-24 bg-zinc-800 rounded" />
          </div>
          <div className="h-9 w-24 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
