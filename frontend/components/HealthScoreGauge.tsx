'use client';

import React from 'react';

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
  let scoreColor = 'text-blue-600 dark:text-blue-400';
  if (score < 50) scoreColor = 'text-red-600 dark:text-red-400';

  const breakdown = [
    { label: 'Savings Ratio', pts: savingsScore, max: 25 },
    { label: 'Budget Adherence', pts: budgetScore, max: 25 },
    { label: 'Tracking Consistency', pts: consistencyScore, max: 20 },
    { label: 'Goal Pace', pts: goalScore, max: 20 },
    { label: 'Spending Stability', pts: spendingScore, max: 10 },
  ];

  return (
    <div className="fin-card p-5 bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
          Financial Health Index
        </h3>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          Deterministic Score
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 min-w-[120px]">
          <span className={`text-3xl font-black ${scoreColor}`}>{score}</span>
          <span className="text-[11px] font-semibold text-slate-400">out of 100</span>
        </div>

        <div className="w-full space-y-2">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                <span className="text-slate-900 dark:text-slate-100">
                  {item.pts} / {item.max}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded overflow-hidden">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-full rounded transition-all duration-300"
                  style={{ width: `${(item.pts / item.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        Note: Calculated deterministically from user-entered savings ratios, budget caps, and streak metrics.
      </div>
    </div>
  );
}
