'use client';

import React, { useState, useEffect } from 'react';
import { Target, Plus, Calendar, Trash2, X, AlertCircle } from 'lucide-react';
import { fetchAPI } from '../../lib/api';

interface Goal {
  id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  category: string;
  status: string;
  percentage: number;
  required_monthly_saving: number;
  required_weekly_saving: number;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals & form state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCategory, setNewCategory] = useState('General Savings');
  const [newDeadline, setNewDeadline] = useState('');
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // Contribution state
  const [activeGoalId, setActiveGoalId] = useState<number | null>(null);
  const [contribAmount, setContribAmount] = useState('');
  const [submittingContrib, setSubmittingContrib] = useState(false);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI('/goals');
      if (Array.isArray(data)) {
        setGoals(data);
      } else {
        setGoals([]);
      }
    } catch (err: any) {
      console.warn('[Goals API] Failed to load goals:', err);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTarget || !newDeadline) return;

    setSubmittingCreate(true);
    setError(null);

    try {
      const payload = {
        title: newTitle,
        target_amount: parseFloat(newTarget),
        category: newCategory,
        deadline: new Date(newDeadline).toISOString()
      };

      const createdGoal = await fetchAPI('/goals', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setGoals((prev) => [createdGoal, ...prev]);
      setIsCreateOpen(false);

      // Reset form
      setNewTitle('');
      setNewTarget('');
      setNewCategory('General Savings');
      setNewDeadline('');
    } catch (err: any) {
      console.error('[Create Goal Error]', err);
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (!goalToDelete) return;

    try {
      await fetchAPI(`/goals/${goalToDelete.id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('[Delete Goal Error]:', err);
    } finally {
      setGoals((prev) => prev.filter((g) => g.id !== goalToDelete.id));
      setGoalToDelete(null);
    }
  };

  const handleAddContribution = async (id: number) => {
    const val = parseFloat(contribAmount);
    if (!val || val <= 0) return;

    setSubmittingContrib(true);

    try {
      const updatedGoal = await fetchAPI(`/goals/${id}/contributions`, {
        method: 'POST',
        body: JSON.stringify({ amount: val })
      });

      setGoals((prev) => prev.map((g) => (g.id === id ? updatedGoal : g)));
    } catch (err) {
      console.warn('[Contribution Error]:', err);
    } finally {
      setContribAmount('');
      setActiveGoalId(null);
      setSubmittingContrib(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Savings Goals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Set targets, automate weekly contribution requirements, and earn XP.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="fin-card p-6 h-48 animate-pulse bg-slate-800/40" />
          <div className="fin-card p-6 h-48 animate-pulse bg-slate-800/40" />
          <div className="fin-card p-6 h-48 animate-pulse bg-slate-800/40" />
        </div>
      ) : goals.length === 0 ? (
        <div className="fin-card p-12 text-center space-y-3">
          <Target className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-300">No active savings goals found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create your first savings goal to track progress and earn XP when milestones are reached.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Savings Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((g) => {
            const formattedDeadline = typeof g.deadline === 'string'
              ? g.deadline.split('T')[0]
              : new Date(g.deadline).toISOString().split('T')[0];

            return (
              <div key={g.id} className="fin-card p-6 flex flex-col justify-between space-y-4 relative group">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {g.percentage}% Complete
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formattedDeadline}
                      </span>

                      <button
                        onClick={() => setGoalToDelete(g)}
                        title="Delete Goal"
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{g.title}</h3>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                    {g.category}
                  </span>

                  <div className="my-3 space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Saved: ₹{g.current_amount.toLocaleString()}</span>
                      <span>Target: ₹{g.target_amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, g.percentage)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span>Required Monthly:</span>
                      <strong className="text-blue-600 dark:text-blue-400">₹{(g.required_monthly_saving || 0).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Required Weekly Pace:</span>
                      <strong>₹{(g.required_weekly_saving || 0).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {activeGoalId === g.id ? (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
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
                        disabled={submittingContrib}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        {submittingContrib ? 'Saving...' : 'Confirm (+20 XP)'}
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
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Add Contribution
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create New Goal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="fin-card max-w-md w-full p-6 bg-slate-900 border-slate-800 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Create New Savings Goal</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. MacBook Pro M3, Vacation, Emergency Fund"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  placeholder="150000"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  required
                  min="1"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="General Savings">General Savings</option>
                  <option value="Gadgets">Gadgets & Electronics</option>
                  <option value="Travel">Travel & Vacation</option>
                  <option value="Safety">Emergency & Safety Fund</option>
                  <option value="Vehicle">Vehicle / Car</option>
                  <option value="Real Estate">Home & Real Estate</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Deadline Date</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submittingCreate}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                >
                  {submittingCreate ? 'Creating...' : 'Create Goal'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {goalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="fin-card max-w-md w-full p-6 bg-slate-900 border-slate-800 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-rose-500 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Delete Savings Goal?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{goalToDelete.title}"</strong>? This will permanently remove the goal and its contribution history.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleDeleteGoal}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Delete Goal
              </button>
              <button
                onClick={() => setGoalToDelete(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
