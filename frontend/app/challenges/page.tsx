'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { fetchAPI } from '../../lib/api';

interface ChallengeItem {
  id: number;
  challenge_id: number;
  title: string;
  desc: string;
  difficulty: string;
  xp: number;
  progress: number;
  target: number;
  daysLeft: number;
  joined: boolean;
  pct: number;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const [joinedRes, availableRes] = await Promise.allSettled([
        fetchAPI('/gamification/challenges'),
        fetchAPI('/gamification/available-challenges')
      ]);

      const items: ChallengeItem[] = [];

      if (joinedRes.status === 'fulfilled' && Array.isArray(joinedRes.value)) {
        joinedRes.value.forEach((uc: any) => {
          const c = uc.challenge;
          const end = new Date(uc.end_date);
          const daysLeft = Math.max(1, Math.ceil((end.getTime() - Date.now()) / (1000 * 3600 * 24)));

          items.push({
            id: uc.id,
            challenge_id: c.id,
            title: c.title,
            desc: c.description,
            difficulty: c.difficulty || 'Medium',
            xp: c.xp_reward || 250,
            progress: uc.current_progress || 0,
            target: c.target_value || 7,
            daysLeft,
            joined: true,
            pct: uc.percentage || 0
          });
        });
      }

      if (availableRes.status === 'fulfilled' && Array.isArray(availableRes.value)) {
        availableRes.value.forEach((c: any) => {
          items.push({
            id: c.id,
            challenge_id: c.id,
            title: c.title,
            desc: c.description,
            difficulty: c.difficulty || 'Easy',
            xp: c.xp_reward || 250,
            progress: 0,
            target: c.target_value || 7,
            daysLeft: c.duration_days || 7,
            joined: false,
            pct: 0
          });
        });
      }

      setChallenges(items);
    } catch (err) {
      console.warn('[Challenges API] Error loading challenges:', err);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const handleJoin = async (challengeId: number) => {
    try {
      await fetchAPI(`/gamification/challenges/${challengeId}/join`, {
        method: 'POST'
      });
      await loadChallenges();
    } catch (err) {
      console.warn('[Join Challenge Error]', err);
    }
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="fin-card p-6 h-40 animate-pulse bg-slate-800/40" />
          <div className="fin-card p-6 h-40 animate-pulse bg-slate-800/40" />
        </div>
      ) : challenges.length === 0 ? (
        <div className="fin-card p-12 text-center space-y-3">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-300">No active challenges available</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All system quests are completed! Check back later for new financial goals and challenges.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((c) => (
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
                      <span>{c.progress} / {c.target} ({c.pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${Math.min(100, c.pct)}%` }} />
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
                    onClick={() => handleJoin(c.challenge_id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Accept Quest
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
