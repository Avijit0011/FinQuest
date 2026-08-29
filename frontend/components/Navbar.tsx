'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Sparkles, Sun, Moon, Shield, Award, User as UserIcon, Plus } from 'lucide-react';

interface NavbarProps {
  userLevel?: number;
  userXP?: number;
  streakCount?: number;
  onQuickAddClick?: () => void;
}

export default function Navbar({
  userLevel = 12,
  userXP = 2450,
  streakCount = 14,
  onQuickAddClick
}: NavbarProps) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const xpCurrent = userXP % 1000;
  const xpPct = (xpCurrent / 1000) * 100;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            Q
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
            FinQuest
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hidden sm:inline-block">
            SaaS RPG
          </span>
        </Link>

        {/* Gamification Bar (Level, XP, Streak) */}
        <div className="hidden md:flex items-center gap-6 bg-slate-50 dark:bg-slate-800/60 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          {/* Level & XP */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-sm">
              {userLevel}
            </div>
            <div className="flex flex-col w-28">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <span>Level {userLevel}</span>
                <span className="text-amber-500 font-bold">{userXP} XP</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-0.5">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />

          {/* Streak Indicator */}
          <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span>{streakCount} Day Streak</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick AI Add Transaction Button */}
          <button
            onClick={onQuickAddClick}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all hover:shadow-indigo-500/25 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Profile Link */}
          <Link
            href="/settings"
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
              AM
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
