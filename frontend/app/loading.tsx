'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-800 rounded-md" />
          <div className="h-4 w-72 bg-slate-800/60 rounded-md" />
        </div>
        <div className="h-9 w-32 bg-slate-800 rounded-md" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-28 bg-slate-900 border border-slate-800 rounded-xl" />
        <div className="h-28 bg-slate-900 border border-slate-800 rounded-xl" />
        <div className="h-28 bg-slate-900 border border-slate-800 rounded-xl" />
        <div className="h-28 bg-slate-900 border border-slate-800 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-slate-900 border border-slate-800 rounded-xl" />
        <div className="h-64 bg-slate-900 border border-slate-800 rounded-xl" />
      </div>
    </div>
  );
}
