'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

const SPENDING_TIMELINE = [
  { date: 'Aug 01', income: 75000, expense: 1200 },
  { date: 'Aug 05', income: 0, expense: 2800 },
  { date: 'Aug 10', income: 0, expense: 4500 },
  { date: 'Aug 15', income: 15000, expense: 3200 },
  { date: 'Aug 20', income: 0, expense: 8900 },
  { date: 'Aug 25', income: 0, expense: 6400 },
  { date: 'Aug 28', income: 0, expense: 4200 },
];

const CATEGORY_DATA = [
  { name: 'Food & Dining', value: 9800, color: '#F59E0B' },
  { name: 'Transportation', value: 4200, color: '#3B82F6' },
  { name: 'Shopping', value: 12490, color: '#EC4899' },
  { name: 'Entertainment', value: 2400, color: '#8B5CF6' },
  { name: 'Bills & Utilities', value: 3849, color: '#EF4444' },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState('30');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Financial Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Interactive visual insights into your cash flow and category spending.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start">
          {['7', '30', '90'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                range === r ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {r} Days
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Line Chart (Spending over time) & Donut Chart (Category breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 fin-card p-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4">
            Income vs Expense Cash Flow
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPENDING_TIMELINE}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="fin-card p-6 flex flex-col justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
            Category Breakdown
          </h3>
          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs">
            {CATEGORY_DATA.map((c) => (
              <div key={c.name} className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="font-bold">₹{c.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
