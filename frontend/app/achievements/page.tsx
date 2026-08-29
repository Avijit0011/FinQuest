'use client';

import React from 'react';
import { Award, CheckCircle2, Lock, Flame, Zap, ShieldCheck, Trophy, Crown } from 'lucide-react';

export default function AchievementsPage() {
  const achievements = [
    { code: 'ACH_FIRST_TX', name: 'First Step', desc: 'Logged your first transaction in FinQuest', icon: CheckCircle2, xp: 50, unlocked: true, date: '2026-08-01' },
    { code: 'ACH_STREAK_7', name: 'Habit Builder', desc: 'Maintained a 7-day transaction tracking streak', icon: Flame, xp: 250, unlocked: true, date: '2026-08-07' },
    { code: 'ACH_SAVE_1K', name: 'Seed Saver', desc: 'Saved your first ₹1,000 towards a goal', icon: ShieldCheck, xp: 150, unlocked: true, date: '2026-08-10' },
    { code: 'ACH_SAVE_10K', name: 'Wealth Pioneer', desc: 'Saved a total of ₹10,000 across savings goals', icon: Trophy, xp: 500, unlocked: true, date: '2026-08-20' },
    { code: 'ACH_STREAK_30', name: 'Unstoppable Tracker', desc: 'Maintained a 30-day transaction tracking streak', icon: Zap, xp: 1000, unlocked: false },
    { code: 'ACH_GOAL_DONE', name: 'Goal Crusher', desc: 'Completed 1 financial savings goal 100%', icon: Award, xp: 500, unlocked: false },
    { code: 'ACH_LVL_10', name: 'Quest Master', desc: 'Reached Level 10 in FinQuest', icon: Crown, xp: 750, unlocked: false }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Achievement Showcase
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Unlock badges as you achieve key personal finance milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {achievements.map((a) => {
          const Icon = a.icon;

          return (
            <div
              key={a.code}
              className={`fin-card p-5 relative overflow-hidden transition-all ${
                a.unlocked
                  ? 'border-indigo-500/40 bg-gradient-to-br from-indigo-500/5 to-purple-500/5'
                  : 'opacity-60 bg-slate-100/50 dark:bg-slate-900/50 grayscale'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  a.unlocked ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <span className="text-xs font-bold text-amber-500">
                  +{a.xp} XP
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{a.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{a.desc}</p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] font-semibold flex items-center justify-between">
                {a.unlocked ? (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked {a.date}
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
