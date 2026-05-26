import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-emerald-50 animate-pulse">
      <div className="h-64 w-full bg-emerald-50/50" />
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 bg-emerald-50/50 rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-emerald-50/50 rounded" />
          <div className="h-4 w-5/6 bg-emerald-50/50 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-emerald-50/50 rounded" />
          <div className="h-6 w-16 bg-blue-50/50 rounded" />
        </div>
        <div className="h-12 w-full bg-emerald-100/50 rounded-xl" />
      </div>
    </div>
  );
};
