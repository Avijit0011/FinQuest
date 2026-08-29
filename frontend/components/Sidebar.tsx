'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Trophy,
  Award,
  BarChart3,
  Bot,
  Settings,
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Budgets', href: '/budgets' },
  { label: 'Savings Goals', href: '/goals' },
  { label: 'Challenges', href: '/challenges' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'AI Coach', href: '/coach' },
  { label: 'Settings', href: '/settings' },
  { label: 'Admin Panel', href: '/admin' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-57px)] p-3">
      <div className="space-y-1">
        <p className="px-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="fin-card p-3 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-slate-700 dark:text-slate-300">XP Rate</span>
            <span className="text-blue-600 dark:text-blue-400">1.2x Multiplier</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Maintain daily logging streak to preserve bonus multiplier.
          </p>
        </div>
      </div>
    </aside>
  );
}
