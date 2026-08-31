'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Tag, ArrowUpRight, ArrowDownLeft, AlertCircle, Trash2 } from 'lucide-react';
import QuickAddModal from '../../components/QuickAddModal';
import { fetchAPI } from '../../lib/api';

interface TransactionItem {
  id: number;
  desc: string;
  category: string;
  amount: number;
  type: string;
  date: string;
  method: string;
  anomaly: boolean;
}

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      let queryParams = '?size=50';
      if (selectedType !== 'All') queryParams += `&transaction_type=${selectedType}`;

      const res = await fetchAPI(`/transactions${queryParams}`);
      if (res && Array.isArray(res.items)) {
        const mapped = res.items.map((t: any) => ({
          id: t.id,
          desc: t.description,
          category: t.category?.name || 'General',
          amount: t.amount,
          type: t.transaction_type,
          date: typeof t.date === 'string' ? t.date.split('T')[0] : 'Recent',
          method: t.payment_method || 'UPI / Card',
          anomaly: !!t.is_flagged_anomaly
        }));
        setTransactions(mapped);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.warn('[Transactions API] Failed to load transactions:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [selectedType]);

  const handleDelete = async (id: number) => {
    try {
      await fetchAPI(`/transactions/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[Delete Transaction] Error:', err);
    } finally {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

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
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition-all self-start"
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
            className="w-full pl-9 pr-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {filtered.length > 0 ? (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {t.type === 'income' ? (
                        <ArrowDownLeft className="w-4 h-4 text-blue-500" />
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
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Tag className="w-3 h-3" />
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{t.date}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{t.method}</td>
                    <td className={`py-3.5 px-4 text-right font-bold ${t.type === 'income' ? 'text-blue-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDelete(t.id)}
                        title="Delete Entry"
                        className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500 italic">
                    {loading ? 'Loading transactions...' : 'No transactions logged yet. Click "Add Transaction" to create your first entry.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QuickAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadTransactions}
      />
    </div>
  );
}
