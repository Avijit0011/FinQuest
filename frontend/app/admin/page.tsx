'use client';

import React from 'react';
import { ShieldCheck, Users, Activity, Trophy, BarChart2 } from 'lucide-react';

export default function AdminPage() {
  const stats = {
    totalUsers: 1420,
    activeUsers30d: 980,
    totalTransactions: 38450,
    totalVolume: 14850000,
    avgHealthScore: 76.5,
    challengeCompletionRate: 68.4
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            System Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Platform health, aggregate user statistics, and gamification completion metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="fin-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Registered Users</span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2">
            {stats.totalUsers.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-500 font-semibold mt-1 inline-block">
            {stats.activeUsers30d} active streak users
          </span>
        </div>

        <div className="fin-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Logged Volume</span>
            <BarChart2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-500 mt-2">
            ₹{(stats.totalVolume / 100000).toFixed(1)} Lakhs
          </div>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 inline-block">
            {stats.totalTransactions.toLocaleString()} total transactions
          </span>
        </div>

        <div className="fin-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Health Score</span>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-500 mt-2">
            {stats.avgHealthScore} / 100
          </div>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 inline-block">
            {stats.challengeCompletionRate}% challenge success rate
          </span>
        </div>
      </div>
    </div>
  );
}
