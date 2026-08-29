'use client';

import React, { useState } from 'react';
import './globals.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import QuickAddModal from '../components/QuickAddModal';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased">
        {!isLandingPage && (
          <Navbar
            userLevel={12}
            userXP={2450}
            streakCount={14}
            onQuickAddClick={() => setIsQuickAddOpen(true)}
          />
        )}

        <div className="flex">
          {!isLandingPage && <Sidebar />}
          <main className={`flex-1 ${!isLandingPage ? 'p-4 sm:p-6 lg:p-8 pb-24 md:pb-8' : ''}`}>
            {children}
          </main>
        </div>

        {!isLandingPage && <BottomNav />}

        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
        />
      </body>
    </html>
  );
}
