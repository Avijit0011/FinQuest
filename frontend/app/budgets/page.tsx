'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, AlertTriangle, Plus, Trash2, X } from 'lucide-react';
import { fetchAPI } from '../../lib/api';

interface BudgetCategory {
  id: number;
  category_name: string;
  allocated_amount: number;
  spent_amount: number;
  percentage: number;
}

interface Budget {
  id: number;
  title: string;
  period: string;
  total_amount: number;
  spent_amount: number;
  remaining_amount: number;
  percentage: number;
  categories: BudgetCategory[];
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('Monthly Master Budget');
  const [totalAmount, setTotalAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI('/budgets');
      if (Array.isArray(data)) {
        setBudgets(data);
      } else {
        setBudgets([]);
      }
    } catch (err) {
      console.warn('[Budgets API] Failed to load budgets:', err);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totalAmount) return;

    setSubmitting(true);
    try {
      const payload = {
        title,
        period: 'monthly',
        total_amount: parseFloat(totalAmount),
        categories: []
      };
      await fetchAPI('/budgets', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      await loadBudgets();
      setIsModalOpen(false);
      setTotalAmount('');
    } catch (err) {
      console.error('[Create Budget Error]', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBudget = async (id: number) => {
    try {
      await fetchAPI(`/budgets/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[Delete Budget Error]', err);
    } finally {
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // Flatten categories for warning check
  const allCategories = budgets.flatMap((b) => b.categories);
  const highCategory = allCategories.find((c) => c.percentage >= 80);

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

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Budget Cap</span>
        </button>
      </div>

      {/* Warning Banner if category near breach */}
      {highCategory && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs font-medium">
            <span className="font-bold">Caution Warning:</span> Your <span className="font-bold">{highCategory.category_name}</span> spending (₹{highCategory.spent_amount.toLocaleString()} / ₹{highCategory.allocated_amount.toLocaleString()}) is at {highCategory.percentage}% capacity. Keeping discretionary purchases light will preserve your consistency score.
          </div>
        </div>
      )}

      {loading ? (
        <div className="fin-card p-6 h-40 animate-pulse bg-slate-800/40" />
      ) : budgets.length === 0 ? (
        <div className="fin-card p-12 text-center space-y-3">
          <PieChart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-300">No active budget caps found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Configure your monthly spending caps to manage expenses and prevent budget overruns.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Budget Cap
          </button>
        </div>
      ) : (
        budgets.map((b) => (
          <div key={b.id} className="fin-card p-6 space-y-5 relative">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{b.title}</h3>
                <p className="text-xs text-slate-500">
                  Period: <span className="capitalize font-semibold">{b.period}</span> • Overall Cap: ₹{b.total_amount.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${b.percentage >= 80 ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-400'}`}>
                  {b.percentage}% Total Used
                </span>
                <button
                  onClick={() => handleDeleteBudget(b.id)}
                  title="Delete Budget"
                  className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {b.categories.length > 0 ? (
                b.categories.map((c) => {
                  const isHigh = c.percentage >= 80;
                  return (
                    <div key={c.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{c.category_name}</h4>
                        <span className={`text-xs font-bold ${isHigh ? 'text-rose-500' : 'text-blue-400'}`}>
                          {c.percentage}%
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline text-xs text-slate-500">
                        <span>Spent: <strong className="text-slate-900 dark:text-slate-100">₹{c.spent_amount.toLocaleString()}</strong></span>
                        <span>Cap: <strong className="text-slate-900 dark:text-slate-100">₹{c.allocated_amount.toLocaleString()}</strong></span>
                      </div>

                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isHigh ? 'bg-rose-500' : 'bg-blue-600'}`}
                          style={{ width: `${Math.min(100, c.percentage)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-xs text-slate-500 italic py-4">
                  Total Budget Capacity: ₹{b.total_amount.toLocaleString()} • Spent so far: ₹{b.spent_amount.toLocaleString()} ({b.percentage}% used)
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Modal: Create Budget */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="fin-card max-w-md w-full p-6 bg-slate-900 border-slate-800 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Create New Budget</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Budget Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Total Budget Capacity (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  required
                  min="1"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Budget'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
