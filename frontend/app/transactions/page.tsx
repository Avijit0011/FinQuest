'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, Tag, ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';
import QuickAddModal from '../../components/QuickAddModal';

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transactions, setTransactions] = useState([
    { id: 1, desc: 'Swiggy Gourmet Order', category: 'Food & Dining', amount: 450, type: 'expense', date: '2026-08-28', method: 'UPI', anomaly: false },
    { id: 2, desc: 'Zomato Family Dinner', category: 'Food & Dining', amount: 680, type: 'expense', date: '2026-08-27', method: 'Card', anomaly: false },
    { id: 3, desc: 'Uber Office Commute', category: 'Transportation', amount: 320, type: 'expense', date: '2026-08-27', method: 'UPI', anomaly: false },
    { id: 4, desc: 'Monthly Metro Pass', category: 'Transportation', amount: 1200, type: 'expense', date: '2026-08-26', method: 'UPI', anomaly: false },
    { id: 5, desc: 'Amazon Tech Accessories', category: 'Shopping', amount: 12490, type: 'expense', date: '2026-08-25', method: 'Card', anomaly: true },
    { id: 6, desc: 'PVR Movie & Popcorn', category: 'Entertainment', amount: 750, type: 'expense', date: '2026-08-24', method: 'UPI', anomaly: false },
    { id: 7, desc: 'Tech Salary Direct Deposit', category: 'Income & Salary', amount: 75000, type: 'income', date: '2026-08-01', method: 'Bank Transfer', anomaly: false },
    { id: 8, desc: 'Freelance Project Stipend', category: 'Income & Salary', amount: 15000, type: 'income', date: '2026-08-15', method: 'Bank Transfer', anomaly: false },
  ]);

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesType = selectedType === 'All' || t.type === selectedType;
    return matchesSearch && matchesCat && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Transaction Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track, filter, and categorize all income and expense entries.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="fin-card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Income & Salary">Income & Salary</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="fin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {t.type === 'income' ? (
                      <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    )}
                    <span>{t.desc}</span>
                    {t.anomaly && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20" title="ML Anomaly Flag">
                        <AlertCircle className="w-3 h-3" /> Unusual
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <Tag className="w-3 h-3" />
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{t.date}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{t.method}</td>
                  <td className={`py-3.5 px-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <QuickAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
