'use client';

import React from 'react';

export function CardSkeleton() {
  return (
    <div className="fin-card p-5 space-y-3">
      <div className="flex justify-between items-center">
        <div className="skeleton-box h-4 w-24" />
        <div className="skeleton-box h-6 w-6 rounded-md" />
      </div>
      <div className="skeleton-box h-8 w-36" />
      <div className="skeleton-box h-3 w-28" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-200 dark:border-slate-800">
      <td className="py-3 px-4"><div className="skeleton-box h-4 w-32" /></td>
      <td className="py-3 px-4"><div className="skeleton-box h-4 w-20" /></td>
      <td className="py-3 px-4"><div className="skeleton-box h-4 w-16" /></td>
      <td className="py-3 px-4"><div className="skeleton-box h-4 w-24" /></td>
      <td className="py-3 px-4 text-right"><div className="skeleton-box h-4 w-16 ml-auto" /></td>
    </tr>
  );
}

export function ChartSkeleton() {
  return (
    <div className="fin-card p-6 space-y-4">
      <div className="skeleton-box h-5 w-40" />
      <div className="skeleton-box h-64 w-full rounded-lg" />
    </div>
  );
}
