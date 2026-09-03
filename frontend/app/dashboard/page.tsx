'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HealthScoreGauge from '../../components/HealthScoreGauge';
import { CardSkeleton } from '../../components/SkeletonLoader';
import { fetchAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const currency = user?.currency || '₹';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    netSavings: 0,
    level: 1,
    xp: 0,
    streak: 0,
    healthScore: 0,
    aiInsight: "Welcome to FinQuest! Log your first transaction or set up a savings goal to start tracking your financial metrics.",
    recentTransactions: [] as any[],
    activeChallenge: {
      title: '7-Day Budget Challenge',
      progress: 0,
      target: 7,
      xpReward: 250,
    },
    goals: [] as any[]
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [summary, healthRes, insightRes, txRes, goalsRes, gamificationRes] = await Promise.allSettled([
          fetchAPI('/analytics/summary'),
          fetchAPI('/health-score'),
          fetchAPI('/ai/insight'),
          fetchAPI('/transactions?size=5'),
          fetchAPI('/goals'),
          fetchAPI('/gamification/status')
        ]);

        setData((prev) => {
          const updated = { ...prev };

          if (summary.status === 'fulfilled' && summary.value) {
            updated.totalBalance = summary.value.total_income ? summary.value.net_savings : 0;
            updated.monthlyIncome = summary.value.total_income || user?.monthly_income || 0;
            updated.monthlyExpense = summary.value.total_expense ?? 0;
            updated.netSavings = summary.value.net_savings ?? 0;
          }

          if (healthRes.status === 'fulfilled' && healthRes.value) {
            updated.healthScore = healthRes.value.overall_score ?? 0;
          }

          if (insightRes.status === 'fulfilled' && insightRes.value) {
            updated.aiInsight = insightRes.value.insight ?? prev.aiInsight;
          }

          if (txRes.status === 'fulfilled' && txRes.value?.items) {
            updated.recentTransactions = txRes.value.items.map((t: any) => ({
              id: t.id,
              desc: t.description,
              category: t.category?.name || 'General',
              amount: t.amount,
              type: t.transaction_type,
              date: typeof t.date === 'string' ? t.date.split('T')[0] : 'Recent'
            }));
          }

          if (goalsRes.status === 'fulfilled' && Array.isArray(goalsRes.value)) {
            updated.goals = goalsRes.value.slice(0, 3).map((g: any) => ({
              id: g.id,
              title: g.title,
              current: g.current_amount,
              target: g.target_amount,
              pct: g.percentage
            }));
          }

          if (gamificationRes.status === 'fulfilled' && gamificationRes.value) {
            updated.level = gamificationRes.value.level ?? 1;
            updated.xp = gamificationRes.value.xp ?? 0;
            updated.streak = gamificationRes.value.streak_count ?? 0;
          }

          return updated;
        });
      } catch (err) {
        console.warn('[Dashboard API] Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="skeleton-box h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Account summary, active quest progress, and cash flow metrics.
          </p>
        </div>

        <Link
          href="/coach"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors self-start"
        >
          <span>Ask AI Coach</span>
        </Link>
      </div>

      {/* AI Insight Card */}
      <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">
          Verified AI Summary
        </span>
        <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
          {data.aiInsight}
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="fin-card p-4">
          <span className="text-xs font-semibold text-slate-500">Total Net Worth</span>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {currency}{data.totalBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1 inline-block">
            Net Account Balance
          </span>
        </div>

        <div className="fin-card p-4">
          <span className="text-xs font-semibold text-slate-500">Monthly Income</span>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {currency}{data.monthlyIncome.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Verified Inflow</span>
        </div>

        <div className="fin-card p-4">
          <span className="text-xs font-semibold text-slate-500">Monthly Expenses</span>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {currency}{data.monthlyExpense.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Verified Outflow</span>
        </div>

        <div className="fin-card p-4">
          <span className="text-xs font-semibold text-slate-500">Net Savings</span>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {currency}{data.netSavings.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Current Period Savings</span>
        </div>
      </div>

      {/* Health Score & Active Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HealthScoreGauge score={data.healthScore} />
        </div>

        <div className="fin-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Active Quest
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                +{data.activeChallenge.xpReward} XP
              </span>
            </div>

            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {data.activeChallenge.title}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Stay within daily budget caps for 7 consecutive days.
            </p>

            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Progress</span>
                <span>{data.activeChallenge.progress} / {data.activeChallenge.target} Days</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded transition-all"
                  style={{ width: `${(data.activeChallenge.progress / data.activeChallenge.target) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            href="/challenges"
            className="mt-6 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold text-xs rounded-md text-center transition-colors"
          >
            View All Challenges
          </Link>
        </div>
      </div>

      {/* Savings Goals & Activity Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="fin-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Savings Goals</h3>
            <Link href="/goals" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View Goals
            </Link>
          </div>

          {data.goals.length === 0 ? (
            <div className="text-center py-6 space-y-2 text-xs text-slate-500">
              <p>No active savings goals found.</p>
              <Link href="/goals" className="text-blue-400 font-bold hover:underline">
                + Add your first savings goal
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.goals.map((g) => (
                <div key={g.id} className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-900 dark:text-slate-100">{g.title}</span>
                    <span className="text-blue-600 dark:text-blue-400">{g.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded overflow-hidden">
                    <div className="bg-blue-600 h-full rounded" style={{ width: `${Math.min(100, g.pct)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="fin-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Recent Transactions</h3>
            <Link href="/transactions" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View Table
            </Link>
          </div>

          {data.recentTransactions.length === 0 ? (
            <div className="text-center py-6 space-y-2 text-xs text-slate-500">
              <p>No recent transactions logged.</p>
              <Link href="/transactions" className="text-blue-400 font-bold hover:underline">
                + Add your first transaction
              </Link>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {data.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex justify-between p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{tx.desc}</p>
                    <span className="text-[10px] text-slate-500">{tx.category} • {tx.date}</span>
                  </div>
                  <span className={`font-bold ${tx.type === 'income' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
