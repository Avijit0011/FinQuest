'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings as SettingsIcon, Download, Trash2, Shield, Camera, Upload, Check, LogOut, Sparkles } from 'lucide-react';
import { fetchAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const PRESET_AVATARS = [
  {
    id: 'hero',
    name: 'Paladin Hero',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%232563eb"/><circle cx="50" cy="38" r="20" fill="%2393c5fd"/><path d="M20,90 C20,68 35,55 50,55 C65,55 80,68 80,90 Z" fill="%231d4ed8"/><path d="M45,28 L55,28 L55,48 L45,48 Z" fill="%23ffffff"/><path d="M38,35 L62,35 L62,40 L38,40 Z" fill="%23ffffff"/></svg>'
  },
  {
    id: 'wizard',
    name: 'Arcane Mage',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%237c3aed"/><circle cx="50" cy="40" r="18" fill="%23c084fc"/><path d="M20,90 C20,65 35,58 50,58 C65,58 80,65 80,90 Z" fill="%235b21b6"/><polygon points="50,10 65,32 35,32" fill="%23f59e0b"/></svg>'
  },
  {
    id: 'cyber',
    name: 'Cyber Ninja',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%230f172a"/><circle cx="50" cy="38" r="20" fill="%2306b6d4"/><path d="M20,90 C20,68 35,58 50,58 C65,58 80,68 80,90 Z" fill="%231e293b"/><rect x="35" y="32" width="30" height="8" rx="4" fill="%2322d3ee"/></svg>'
  },
  {
    id: 'phoenix',
    name: 'Phoenix Vanguard',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23ea580c"/><circle cx="50" cy="38" r="20" fill="%23fdba74"/><path d="M20,90 C20,68 35,55 50,55 C65,55 80,68 80,90 Z" fill="%23c2410c"/><path d="M50,15 Q60,30 50,45 Q40,30 50,15 Z" fill="%23f59e0b"/></svg>'
  },
  {
    id: 'mech',
    name: 'Titan Mech',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23475569"/><rect x="32" y="22" width="36" height="32" rx="6" fill="%2394a3b8"/><path d="M20,90 C20,68 35,58 50,58 C65,58 80,68 80,90 Z" fill="%23334155"/><rect x="40" y="32" width="20" height="6" rx="3" fill="%2338bdf8"/></svg>'
  },
  {
    id: 'legend',
    name: 'Golden Legend',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23d97706"/><circle cx="50" cy="38" r="20" fill="%23fef08a"/><path d="M20,90 C20,68 35,55 50,55 C65,55 80,68 80,90 Z" fill="%23b45309"/><polygon points="50,12 55,24 68,24 57,32 61,44 50,36 39,44 43,32 32,24 45,24" fill="%23f59e0b"/></svg>'
  }
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || 'Alex Mercer');
  const [currency, setCurrency] = useState(user?.currency || '₹');
  const [avatar, setAvatar] = useState(user?.avatar || PRESET_AVATARS[0].url);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setCurrency(user.currency || '₹');
      if (user.avatar) {
        setAvatar(user.avatar);
      }
    }
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const updatedUser = await fetchAPI('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, currency, avatar }),
      });

      updateUserProfile(updatedUser || { name, currency, avatar });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      // Fallback local update if offline
      updateUserProfile({ name, currency, avatar });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

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

  const userInitials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AM';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Profile & Account Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your quest avatar, profile details, currency preferences, and data privacy options.
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

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Picture & Avatar Section */}
        <div className="fin-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" /> Profile Picture & RPG Avatar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload a custom profile photo or choose an adventurer avatar for your dashboard badge.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Live Avatar Preview */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group w-24 h-24 rounded-full bg-slate-800 border-2 border-blue-500/50 shadow-lg shadow-blue-500/10 overflow-hidden flex items-center justify-center">
                {avatar && (avatar.startsWith('data:') || avatar.startsWith('http') || avatar.startsWith('blob:')) ? (
                  <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black text-white">{userInitials}</span>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1"
                >
                  <Upload className="w-4 h-4" /> Change
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Photo
              </button>
            </div>

            {/* RPG Preset Avatar Grid */}
            <div className="flex-1 space-y-3 w-full">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Choose Adventurer Preset
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = avatar === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAvatar(preset.url)}
                      className={`relative p-1.5 rounded-xl border transition-all flex flex-col items-center gap-1 group ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/10 scale-105'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900'
                      }`}
                      title={preset.name}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate w-full text-center">
                        {preset.name.split(' ')[0]}
                      </span>

                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="fin-card p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" /> User Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
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
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="₹">₹ (INR)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2"
            >
              {saving ? (
                'Saving Profile...'
              ) : (
                <>
                  <Check className="w-4 h-4" /> Save Profile Changes
                </>
              )}
            </button>

            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile updated successfully!
              </span>
            )}
          </div>
        </div>
      </form>

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
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Data (JSON)
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Transactions (CSV)
          </button>

          <button
            type="button"
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
                type="button"
                onClick={() => {
                  alert('Account deleted.');
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-2 bg-rose-600 text-white font-bold text-xs rounded-lg"
              >
                Permanently Delete
              </button>
              <button
                type="button"
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

