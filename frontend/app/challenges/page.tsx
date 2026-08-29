'use client';

import React, { useState } from 'react';
import { Trophy, Flame, Target, CheckCircle2, Clock } from 'lucide-react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([
    { id: 1, title: '7-Day Budget Challenge', desc: 'Stay within your daily spending target for 7 consecutive days.', difficulty: 'Easy', xp: 250, progress: 4, target: 7, daysLeft: 3, joined: true },
    { id: 2, title: 'Monthly Saver Quest', desc: 'Save ₹5,000 into your active savings goals this month.', difficulty: 'Medium', xp: 500, progress: 3200, target: 5000, daysLeft: 12, joined: true },
    { id: 3, title: '3-Day No-Spend Blitz', desc: 'Complete 3 days without discretionary shopping or restaurant orders.', difficulty: 'Hard', xp: 300, progress: 0, target: 3, daysLeft: 5, joined: false },
    { id: 4, title: 'Food Budget Mastery', desc: 'Keep food and eating out spending below ₹5,000 this month.', difficulty: 'Medium', xp: 350, progress: 0, target: 5000, daysLeft: 18, joined: false },
  ]);

  const handleJoin = (id: number) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, joined: true } : c))
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Financial Quest Challenges
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Complete targeted financial habits to earn XP, rank up, and unlock achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((c) => {
          const pct = Math.min(100, (c.progress / c.target) * 100);

          return (
            <div key={c.id} className="fin-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    c.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' :
                    c.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {c.difficulty} Difficulty
                  </span>
                  <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    +{c.xp} XP
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{c.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{c.desc}</p>

                {c.joined && (
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Progress</span>
                      <span>{c.progress} / {c.target} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {c.daysLeft} days left
                </span>

                {c.joined ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                    <CheckCircle2 className="w-4 h-4" /> Joined
                  </span>
                ) : (
                  <button
                    onClick={() => handleJoin(c.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Accept Quest
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
