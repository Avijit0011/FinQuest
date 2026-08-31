'use client';

import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { fetchAPI } from '../../lib/api';

interface AchievementItem {
  code: string;
  name: string;
  desc: string;
  xp: number;
  unlocked: boolean;
  date?: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        setLoading(true);
        const res = await fetchAPI('/gamification/achievements');
        if (Array.isArray(res)) {
          const mapped = res.map((a: any) => ({
            code: a.code,
            name: a.name,
            desc: a.description,
            xp: a.xp_reward || 100,
            unlocked: !!a.is_unlocked,
            date: a.unlocked_at ? a.unlocked_at.split('T')[0] : undefined
          }));
          setAchievements(mapped);
        } else {
          setAchievements([]);
        }
      } catch (err) {
        console.warn('[Achievements API] Error loading achievements:', err);
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    }

    loadAchievements();
  }, []);

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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="fin-card p-4 h-32 animate-pulse bg-slate-800/40" />
          <div className="fin-card p-4 h-32 animate-pulse bg-slate-800/40" />
          <div className="fin-card p-4 h-32 animate-pulse bg-slate-800/40" />
          <div className="fin-card p-4 h-32 animate-pulse bg-slate-800/40" />
        </div>
      ) : achievements.length === 0 ? (
        <div className="fin-card p-12 text-center space-y-3">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-300">No achievements recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Log transactions and complete financial milestones to unlock achievement badges.
          </p>
        </div>
      ) : (
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

              {a.unlocked && a.date && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-semibold">
                  Unlocked on {a.date}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
