'use client';

import React, { useState } from 'react';
import './globals.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import QuickAddModal from '../components/QuickAddModal';
import OnboardingModal from '../components/OnboardingModal';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';

function AppShell({ children }: { children: React.ReactNode }) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const pathname = usePathname();
  const isStandalonePage = pathname === '/' || pathname === '/login';
  const { user, isAuthenticated } = useAuth();
  const showOnboarding = isAuthenticated && user ? !user.is_onboarded : false;

  return (
    <>
      {!isStandalonePage && (
        <Navbar
          onQuickAddClick={() => setIsQuickAddOpen(true)}
        />
      )}

      <div className="flex">
        {!isStandalonePage && <Sidebar />}
        <main className={`flex-1 ${!isStandalonePage ? 'p-4 sm:p-6 lg:p-8 pb-24 md:pb-8' : ''}`}>
          {children}
        </main>
      </div>

      {!isStandalonePage && <BottomNav />}

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onSuccess={() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
      />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}

