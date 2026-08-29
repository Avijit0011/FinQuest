'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Flame,
  Trophy,
  Target,
  ArrowRight,
  Bot,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';
import HealthScoreGauge from '../../components/HealthScoreGauge';

export default function Dashboard() {
  const [data, setData] = useState({
    totalBalance: 248500,
    monthlyIncome: 75000,
    monthlyExpense: 31200,
    netSavings: 43800,
    level: 12,
    xp: 2450,
    streak: 14,
    healthScore: 78,
    aiInsight: "Your food spending is 12% lower than last month! You are currently on track to reach your MacBook Pro savings goal.",
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
      { id: 2, title: 'Emergency Fund', current: 180000, target: 250000, pct: 72.0 }
    ]
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Here is your financial quest progress and spending overview.
          </p>
        </div>

        <Link
          href="/coach"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity self-start"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI Coach</span>
        </Link>
      </div>

      {/* Daily AI Insight Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-700/50 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <span className="text-[11px] uppercase font-bold text-indigo-400 tracking-wider">
            Daily AI Insight
          </span>
          <p className="text-sm text-slate-200 font-medium leading-relaxed mt-0.5">
            {data.aiInsight}
          </p>
        </div>
      </div>

      {/* Financial Overview Cards (Balance, Income, Expense, Savings) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="fin-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Net Worth</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            ₹{data.totalBalance.toLocaleString()}
          </div>
          <span className="text-[11px] font-semibold text-emerald-500 mt-1 inline-block">
            +12.4% this month
          </span>
        </div>

        <div className="fin-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Monthly Income</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{data.monthlyIncome.toLocaleString()}
          </div>
          <span className="text-[11px] font-semibold text-slate-400 mt-1 inline-block">Verified inflow</span>
        </div>

        <div className="fin-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Monthly Expenses</span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
            ₹{data.monthlyExpense.toLocaleString()}
          </div>
          <span className="text-[11px] font-semibold text-slate-400 mt-1 inline-block">69% of budget used</span>
        </div>

        <div className="fin-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Net Savings</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
            ₹{data.netSavings.toLocaleString()}
          </div>
          <span className="text-[11px] font-semibold text-amber-500 mt-1 inline-block">+200 XP earned</span>
        </div>
      </div>

      {/* Main Grid: Health Score Gauge & Active Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HealthScoreGauge score={data.healthScore} />
        </div>

        {/* Active Challenge Widget */}
        <div className="fin-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Active Challenge
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                +{data.activeChallenge.xpReward} XP
              </span>
            </div>

            <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              {data.activeChallenge.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Stay within daily budget caps for 7 days.
            </p>

            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Progress</span>
                <span>{data.activeChallenge.progress} / {data.activeChallenge.target} Days</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${(data.activeChallenge.progress / data.activeChallenge.target) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            href="/challenges"
            className="mt-6 w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View All Challenges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid: Savings Goals & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Goals Preview */}
        <div className="fin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Savings Goals</h3>
            </div>
            <Link href="/goals" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {data.goals.map((g) => (
              <div key={g.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="text-slate-900 dark:text-slate-100">{g.title}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{g.pct}%</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-2">
                  <span>₹{g.current.toLocaleString()}</span>
                  <span>Target: ₹{g.target.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${g.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="fin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Recent Activity</h3>
            <Link href="/transactions" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {data.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">{tx.desc}</p>
                  <span className="text-[10px] text-slate-400">{tx.category} • {tx.date}</span>
                </div>
                <span className={`font-bold text-xs ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
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
