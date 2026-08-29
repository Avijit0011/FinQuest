'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HealthScoreGauge from '../../components/HealthScoreGauge';
import { CardSkeleton } from '../../components/SkeletonLoader';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const [data] = useState({
    totalBalance: 248500,
    monthlyIncome: 75000,
    monthlyExpense: 31200,
    netSavings: 43800,
    level: 12,
    xp: 2450,
    streak: 14,
    healthScore: 78,
    aiInsight: "Food spending is 12% lower than last month. You are currently on track to reach your MacBook Pro savings goal.",
    recentTransactions: [
      { id: 1, desc: 'Swiggy Gourmet Order', category: 'Food & Dining', amount: 450, type: 'expense', date: 'Today' },
      { id: 2, desc: 'Monthly Metro Pass', category: 'Transportation', amount: 1200, type: 'expense', date: 'Yesterday' },
      { id: 3, desc: 'Freelance UI Payment', category: 'Income & Salary', amount: 15000, type: 'income', date: '2 days ago' },
      { id: 4, desc: 'Amazon Electronics', category: 'Shopping', amount: 2490, type: 'expense', date: '3 days ago' },
    ],
    activeChallenge: {
      title: '7-Day Budget Challenge',
      progress: 4,
      target: 7,
      xpReward: 250,
      daysLeft: 3
    },
    goals: [
      { id: 1, title: 'New MacBook Pro M3', current: 68000, target: 150000, pct: 45.3 },
      { id: 2, title: 'Emergency Safety Fund', current: 180000, target: 250000, pct: 72.0 }
    ]
  });

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
            ₹{data.totalBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1 inline-block">
            +12.4% this month
          </span>
        </div>

        <div className="fin-card p-4">
          <span className="text-xs font-semibold text-slate-500">Monthly Income</span>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            ₹{data.monthlyIncome.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Verified Inflow</span>
        </div>

        <div className="fin-card p-4">
          <span className="text-xs font-semibold text-slate-500">Monthly Expenses</span>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            ₹{data.monthlyExpense.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">69% of budget capacity</span>
        </div>

        <div className="fin-card p-4">
          <span className="text-xs font-semibold text-slate-500">Net Savings</span>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            ₹{data.netSavings.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">+200 XP rewarded</span>
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

          <div className="space-y-3">
            {data.goals.map((g) => (
              <div key={g.id} className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-900 dark:text-slate-100">{g.title}</span>
                  <span className="text-blue-600 dark:text-blue-400">{g.pct}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded overflow-hidden">
                  <div className="bg-blue-600 h-full rounded" style={{ width: `${g.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fin-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Recent Transactions</h3>
            <Link href="/transactions" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View Table
            </Link>
          </div>

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
        </div>
      </div>
    </div>
  );
}
