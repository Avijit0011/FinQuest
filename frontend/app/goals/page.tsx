'use client';

import React, { useState } from 'react';
import { Target, Plus, Calendar, CheckCircle2 } from 'lucide-react';

export default function GoalsPage() {
  const [goals, setGoals] = useState([
    { id: 1, title: 'New MacBook Pro M3', current: 68000, target: 150000, deadline: '2027-06-30', monthlyReq: 6833, weeklyReq: 1708, pct: 45.3 },
    { id: 2, title: 'Emergency Safety Fund', current: 180000, target: 250000, deadline: '2026-12-31', monthlyReq: 17500, weeklyReq: 4375, pct: 72.0 },
    { id: 3, title: 'Japan Travel Adventure', current: 42000, target: 120000, deadline: '2027-03-31', monthlyReq: 11142, weeklyReq: 2785, pct: 35.0 }
  ]);

  const [activeGoalId, setActiveGoalId] = useState<number | null>(null);
  const [contribAmount, setContribAmount] = useState('');

  const handleAddContribution = (id: number) => {
    const val = parseFloat(contribAmount);
    if (!val || val <= 0) return;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newCurr = g.current + val;
          return {
            ...g,
            current: newCurr,
            pct: Math.min(100, parseFloat(((newCurr / g.target) * 100).toFixed(1)))
          };
        }
        return g;
      })
    );
    setContribAmount('');
    setActiveGoalId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Savings Goals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Set targets, automate weekly contribution requirements, and earn XP.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all self-start">
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((g) => (
          <div key={g.id} className="fin-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {g.pct}% Complete
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {g.deadline}
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{g.title}</h3>

              <div className="my-3 space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Saved: ₹{g.current.toLocaleString()}</span>
                  <span>Target: ₹{g.target.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${g.pct}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Required Monthly Saving:</span>
                  <strong className="text-indigo-600 dark:text-indigo-400">₹{g.monthlyReq.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Required Weekly Pace:</span>
                  <strong>₹{g.weeklyReq.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {activeGoalId === g.id ? (
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Contribution Amount (₹)"
                  value={contribAmount}
                  onChange={(e) => setContribAmount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddContribution(g.id)}
                    className="flex-1 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg"
                  >
                    Confirm (+20 XP)
                  </button>
                  <button
                    onClick={() => setActiveGoalId(null)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveGoalId(g.id)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Add Contribution
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
