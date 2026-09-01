'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  userLevel?: number;
  userXP?: number;
  streakCount?: number;
  onQuickAddClick?: () => void;
}

export default function Navbar({
  userLevel,
  userXP,
  streakCount,
  onQuickAddClick
}: NavbarProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const level = userLevel ?? (user?.level || 12);
  const xp = userXP ?? (user?.xp || 2450);
  const streak = streakCount ?? (user?.streak_count || 14);

  const xpCurrent = xp % 1000;
  const xpPct = (xpCurrent / 1000) * 100;

  // Compute initials
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AM';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-amber-600/20">
            Q
          </div>
          <span className="font-extrabold text-lg text-stone-900 dark:text-stone-100 tracking-tight">
            FinQuest
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 hidden sm:inline-block">
            Cozy Finance
          </span>
        </Link>

        {/* Gamification Bar (Level, XP, Streak) */}
        <div className="hidden md:flex items-center gap-5 bg-amber-50/50 dark:bg-stone-800/80 px-3.5 py-1.5 rounded-xl border border-amber-200/50 dark:border-stone-700/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2 py-0.5 bg-amber-600 text-white rounded-md shadow-sm">
              Lvl {level}
            </span>
            <div className="flex flex-col w-24">
              <div className="flex justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                <span>XP</span>
                <span className="text-amber-600 dark:text-amber-400 font-extrabold">{xp}</span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full mt-0.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-300"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-stone-300 dark:bg-stone-700" />

          {/* Streak Indicator */}
          <div className="text-xs font-bold text-stone-700 dark:text-stone-300">
            Streak: <span className="text-amber-600 dark:text-amber-400 font-black">{streak} Days</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onQuickAddClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm shadow-amber-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/settings"
            title={user ? `${user.name} (${user.email})` : 'Settings'}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center border border-slate-700 overflow-hidden transition-colors"
          >
            {user?.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('http') || user.avatar.startsWith('blob:')) ? (
              <img
                src={user.avatar}
                alt={user.name || 'User Profile'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              initials
            )}
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-md text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
