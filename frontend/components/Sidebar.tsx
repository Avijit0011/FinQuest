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
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Transactions', icon: Receipt, href: '/transactions' },
  { label: 'Budgets', icon: PieChart, href: '/budgets' },
  { label: 'Savings Goals', icon: Target, href: '/goals' },
  { label: 'Challenges', icon: Trophy, href: '/challenges' },
  { label: 'Achievements', icon: Award, href: '/achievements' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'AI Coach', icon: Bot, href: '/coach' },
  { label: 'Settings', icon: Settings, href: '/settings' },
  { label: 'Admin Panel', icon: ShieldCheck, href: '/admin' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-61px)] p-4 transition-colors">
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          Quest Hub
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-600 dark:border-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Gamification Level Footer Widget */}
      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="fin-card p-3 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-950/40 dark:to-purple-950/40">
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-indigo-600 dark:text-indigo-400">XP Multiplier</span>
            <span className="text-amber-500">1.2x Active</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Maintain your 14-day streak to retain maximum XP rewards!
          </p>
        </div>
      </div>
    </aside>
  );
}
