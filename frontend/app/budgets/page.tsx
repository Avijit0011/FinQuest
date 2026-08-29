'use client';

import React from 'react';
import { PieChart, AlertTriangle, Plus, CheckCircle } from 'lucide-react';

export default function BudgetsPage() {
  const budgets = [
    { id: 1, category: 'Food & Dining', spent: 6800, target: 10000, color: 'bg-amber-500' },
    { id: 2, category: 'Transportation', spent: 3400, target: 5000, color: 'bg-blue-500' },
    { id: 3, category: 'Shopping', spent: 7800, target: 8000, color: 'bg-pink-500' },
    { id: 4, category: 'Entertainment', spent: 2100, target: 4000, color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Budget Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Set category limits and receive smart overspend warnings.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all self-start">
          <Plus className="w-4 h-4" />
          <span>New Budget Category</span>
        </button>
      </div>

      {/* Warning Banner if category near breach */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-xs font-medium">
          <span className="font-bold">Caution Warning:</span> Your <span className="font-bold">Shopping</span> category spending (₹7,800 / ₹8,000) is at 97.5% capacity. Keeping shopping light for the next few days will maintain your consistency score.
        </div>
      </div>

      {/* Category Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((b) => {
          const pct = Math.min(100, (b.spent / b.target) * 100);
          const isHigh = pct >= 80;

          return (
            <div key={b.id} className="fin-card p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{b.category}</h3>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${isHigh ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {pct.toFixed(1)}% Used
                </span>
              </div>

              <div className="flex justify-between items-baseline text-sm">
                <span className="text-slate-500">Spent: <strong className="text-slate-900 dark:text-slate-100">₹{b.spent.toLocaleString()}</strong></span>
                <span className="text-slate-500">Cap: <strong className="text-slate-900 dark:text-slate-100">₹{b.target.toLocaleString()}</strong></span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isHigh ? 'bg-rose-500' : 'bg-indigo-600'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-400">
                Remaining allowance: ₹{(b.target - b.spent).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
