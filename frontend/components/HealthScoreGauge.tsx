'use client';

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface HealthScoreProps {
  score?: number;
  savingsScore?: number;
  budgetScore?: number;
  consistencyScore?: number;
  goalScore?: number;
  spendingScore?: number;
}

export default function HealthScoreGauge({
  score = 78,
  savingsScore = 20,
  budgetScore = 21,
  consistencyScore = 18,
  goalScore = 13,
  spendingScore = 6
}: HealthScoreProps) {
  let scoreColor = 'text-emerald-500';
  let bgGlow = 'from-emerald-500/10 to-teal-500/5';
  if (score < 50) {
    scoreColor = 'text-rose-500';
    bgGlow = 'from-rose-500/10 to-orange-500/5';
  } else if (score < 75) {
    scoreColor = 'text-amber-500';
    bgGlow = 'from-amber-500/10 to-yellow-500/5';
  }

  const breakdown = [
    { label: 'Savings', pts: savingsScore, max: 25 },
    { label: 'Budgeting', pts: budgetScore, max: 25 },
    { label: 'Consistency', pts: consistencyScore, max: 20 },
    { label: 'Goals', pts: goalScore, max: 20 },
    { label: 'Spending', pts: spendingScore, max: 10 },
  ];

  return (
    <div className={`fin-card p-5 bg-gradient-to-br ${bgGlow} relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-6 h-6 ${scoreColor}`} />
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            Financial Health Score
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Motivational Index
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
        {/* Score Ring / Big Number */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 min-w-[110px]">
          <span className={`text-4xl font-black ${scoreColor}`}>{score}</span>
          <span className="text-xs font-semibold text-slate-400">out of 100</span>
        </div>

        {/* Breakdown Factor Bars */}
        <div className="w-full space-y-2.5">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                <span className="text-slate-900 dark:text-slate-100">
                  {item.pts} / {item.max}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(item.pts / item.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <p>
          Calculated deterministically from your savings ratio, budget limits, tracking streak, and goal pace. Not an official financial credit rating.
        </p>
      </div>
    </div>
  );
}
