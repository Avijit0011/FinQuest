'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Trophy, Target, User } from 'lucide-react';

const MOBILE_NAV = [
  { label: 'Home', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Transactions', icon: Receipt, href: '/transactions' },
  { label: 'Challenges', icon: Trophy, href: '/challenges' },
  { label: 'Goals', icon: Target, href: '/goals' },
  { label: 'Profile', icon: User, href: '/settings' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {MOBILE_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400 scale-110' : ''}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
