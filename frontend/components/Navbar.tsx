'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Plus } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            Q
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">
            FinQuest
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hidden sm:inline-block">
            SaaS Platform
          </span>
        </Link>

        {/* Gamification Bar (Level, XP, Streak) - Clean typography, zero emojis */}
        <div className="hidden md:flex items-center gap-5 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-600 text-white rounded">
              Lvl {userLevel}
            </span>
            <div className="flex flex-col w-24">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <span>XP</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{userXP}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded mt-0.5 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />

          {/* Streak Indicator */}
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Streak: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{streakCount} Days</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onQuickAddClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
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
            className="w-8 h-8 rounded bg-slate-800 text-white font-semibold text-xs flex items-center justify-center border border-slate-700"
          >
            AM
          </Link>
        </div>
      </div>
    </header>
  );
}
