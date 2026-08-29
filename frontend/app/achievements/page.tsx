'use client';

import React from 'react';

export default function AchievementsPage() {
  const achievements = [
    { code: 'ACH_FIRST_TX', name: 'First Step', desc: 'Logged your first transaction in FinQuest', xp: 50, unlocked: true, date: '2026-08-01' },
    { code: 'ACH_STREAK_7', name: 'Habit Builder', desc: 'Maintained a 7-day transaction tracking streak', xp: 250, unlocked: true, date: '2026-08-07' },
    { code: 'ACH_SAVE_1K', name: 'Seed Saver', desc: 'Saved your first ₹1,000 towards a goal', xp: 150, unlocked: true, date: '2026-08-10' },
    { code: 'ACH_SAVE_10K', name: 'Wealth Pioneer', desc: 'Saved a total of ₹10,000 across savings goals', xp: 500, unlocked: true, date: '2026-08-20' },
    { code: 'ACH_STREAK_30', name: 'Unstoppable Tracker', desc: 'Maintained a 30-day transaction tracking streak', xp: 1000, unlocked: false },
    { code: 'ACH_GOAL_DONE', name: 'Goal Crusher', desc: 'Completed 1 financial savings goal 100%', xp: 500, unlocked: false },
    { code: 'ACH_LVL_10', name: 'Quest Master', desc: 'Reached Level 10 in FinQuest', xp: 750, unlocked: false }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Achievement Gallery
        </h1>
        <p className="text-xs text-slate-500">
          Earned milestone badges based on verified financial tracking activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((a) => (
          <div
            key={a.code}
            className={`fin-card p-4 space-y-2 border ${
              a.unlocked
                ? 'border-blue-500/40 bg-white dark:bg-slate-900'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 opacity-60'
            }`}
          >
            <div className="flex justify-between items-center text-xs">
              <span className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${
                a.unlocked ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                {a.unlocked ? 'Unlocked' : 'Locked'}
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">+{a.xp} XP</span>
            </div>

            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{a.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>

            {a.unlocked && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-semibold">
                Unlocked on {a.date}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
