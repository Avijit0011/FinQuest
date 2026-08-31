'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { fetchAPI } from '../../lib/api';

const COLOR_PALETTE = ['#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', '#EF4444', '#10B981', '#06B6D4'];

export default function AnalyticsPage() {
  const [range, setRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const data = await fetchAPI(`/analytics/summary?range_days=${range}`);
        if (data) {
          if (Array.isArray(data.spending_over_time)) {
            setTimelineData(data.spending_over_time);
          } else {
            setTimelineData([]);
          }

          if (Array.isArray(data.category_breakdown)) {
            setCategoryData(
              data.category_breakdown.map((item: any, idx: number) => ({
                name: item.category,
                value: item.amount,
                color: COLOR_PALETTE[idx % COLOR_PALETTE.length]
              }))
            );
          } else {
            setCategoryData([]);
          }
        }
      } catch (err) {
        console.warn('[Analytics API] Error loading analytics:', err);
        setTimelineData([]);
        setCategoryData([]);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [range]);

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
                range === r ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
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
        <div className="lg:col-span-2 fin-card p-6 flex flex-col justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4">
            Income vs Expense Cash Flow ({range} Days)
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500 italic">No cash flow data recorded for the selected range.</p>
            )}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="fin-card p-6 flex flex-col justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
            Category Breakdown
          </h3>
          <div className="h-56 w-full relative flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500 italic text-center">No category expense records found.</p>
            )}
          </div>

          <div className="space-y-1.5 text-xs mt-2">
            {categoryData.map((c) => (
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
