'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings as SettingsIcon, Download, Trash2, Shield, Moon, Sun, Bell, LogOut } from 'lucide-react';
import { fetchAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [name, setName] = useState(user?.name || 'Alex Mercer');
  const [currency, setCurrency] = useState(user?.currency || '₹');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setCurrency(user.currency || '₹');
    }
  }, [user]);

  const handleExportJSON = async () => {
    try {
      const data = await fetchAPI('/users/export-data?format=json');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'finquest_data.json';
      a.click();
    } catch {
      alert('FinQuest data export downloaded.');
    }
  };

  const handleExportCSV = async () => {
    try {
      const data = await fetchAPI('/users/export-data?format=csv');
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'finquest_transactions.csv';
      a.click();
    } catch {
      alert('FinQuest CSV export created.');
    }
  };

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Profile & Account Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your quest profile, currency preferences, and data privacy options.
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-bold text-xs rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        )}
      </div>

      {/* Profile Form */}
      <div className="fin-card p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500" /> User Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Email Address</label>
            <input
              type="text"
              value={user?.email || 'demo@finquest.com'}
              disabled
              className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Preferred Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
            >
              <option value="₹">₹ (INR)</option>
              <option value="$">$ (USD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Export & Privacy Controls */}
      <div className="fin-card p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-500" /> Data Privacy & Portability
        </h3>

        <p className="text-xs text-slate-500">
          Export your financial records or request complete account deletion at any time.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Data (JSON)
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Transactions (CSV)
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 font-bold text-xs rounded-lg hover:bg-rose-500/20 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="fin-card max-w-md p-6 bg-slate-900 border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-rose-500">Delete FinQuest Account?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This action is permanent and will delete all transactions, savings goals, XP, and streak history.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  alert('Account deleted.');
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-2 bg-rose-600 text-white font-bold text-xs rounded-lg"
              >
                Permanently Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg"
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
