'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [showTOS, setShowTOS] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <nav className="border-b border-slate-800 bg-slate-950 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
              Q
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              FinQuest
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Start Your Quest
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-20 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-block px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold">
          Gamified Personal Finance Platform
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-tight tracking-tight">
          Turn Your Money Habits Into a Game.
        </h1>

        <p className="text-base text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          FinQuest combines smart expense tracking, savings goals, AI-driven coaching, and RPG level progression to make responsible personal finance clear and structured.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Start Your Quest
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-6 py-3 rounded-md text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            Explore System Architecture
          </a>
        </div>

        {/* Real Product Demo Data Preview */}
        <div className="mt-12 p-6 rounded-lg bg-slate-900 border border-slate-800 max-w-4xl mx-auto text-left space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="font-bold text-white">System Demo Preview</span>
            <span>Level 12 • 2,450 / 3,000 XP • 14-Day Streak</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Total Net Worth</span>
              <p className="text-xl font-bold text-white mt-1">₹2,48,500</p>
              <span className="text-blue-400 text-[11px] mt-1 inline-block">+12.4% this month</span>
            </div>

            <div className="p-4 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Financial Health Index</span>
              <p className="text-xl font-bold text-blue-400 mt-1">78 / 100</p>
              <span className="text-slate-500 text-[11px] mt-1 inline-block">Deterministic Factor Rating</span>
            </div>

            <div className="p-4 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Active Quest</span>
              <p className="text-sm font-bold text-white mt-1">7-Day Budget Challenge</p>
              <span className="text-slate-400 text-[11px] mt-1 inline-block">4 / 7 Days Completed (+250 XP)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2-Column Product Capabilities */}
      <section id="features" className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-slate-900">
        <div className="text-left mb-12">
          <h2 className="text-2xl font-bold text-white">Core System Features</h2>
          <p className="text-slate-400 text-sm mt-1">Engineered for habit formation and automated transaction analysis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="font-bold text-base text-white">Smart Expense Categorization</h3>
            <p className="text-slate-400 leading-relaxed">
              Input entries naturally like "Swiggy 450" or "Uber 250". The system proposes category, amount, and type for confirmation.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-base">Conversational AI Financial Coach</h3>
            <p className="text-slate-400 leading-relaxed">
              Query spending trends and receive advice grounded strictly in your verified database metrics with user isolation.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-base">RPG Progression Engine</h3>
            <p className="text-slate-400 leading-relaxed">
              Earn XP for logging transactions, building daily activity streaks, completing challenges, and reaching savings milestones.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-base">Machine Learning Analytics</h3>
            <p className="text-slate-400 leading-relaxed">
              Ridge Regression spending forecasting and Isolation Forest transaction anomaly detection.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-slate-900/50 border-t border-slate-900">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold text-white">Workflow Pipeline</h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-mono text-blue-400 font-bold">STEP 01</span>
              <h4 className="font-bold text-white text-sm">Track Income & Expenses</h4>
              <p className="text-slate-400">Log entries manually or via AI quick-add parser.</p>
            </div>

            <div className="p-4 rounded bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-mono text-blue-400 font-bold">STEP 02</span>
              <h4 className="font-bold text-white text-sm">Maintain Activity Streaks</h4>
              <p className="text-slate-400">Build continuous tracking habits to earn multipliers.</p>
            </div>

            <div className="p-4 rounded bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-mono text-blue-400 font-bold">STEP 03</span>
              <h4 className="font-bold text-white text-sm">Participate in Quests</h4>
              <p className="text-slate-400">Complete 7-day budget targets and savings sprints.</p>
            </div>

            <div className="p-4 rounded bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-mono text-blue-400 font-bold">STEP 04</span>
              <h4 className="font-bold text-white text-sm">Earn XP & Level Up</h4>
              <p className="text-slate-400">Unlock achievements and improve financial health.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center max-w-3xl mx-auto w-full">
        <div className="p-8 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Start Your Financial Quest Today
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Build responsible money habits, track your progress, and let AI guide your financial goals.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Launch Application
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 FinQuest SaaS Platform. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <button onClick={() => setShowTOS(true)} className="hover:text-slate-300 text-slate-400">
              Terms of Service
            </button>
            <button onClick={() => setShowPrivacy(true)} className="hover:text-slate-300 text-slate-400">
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>

      {/* Working Terms of Service Modal */}
      {showTOS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
          <div className="fin-card max-w-lg p-6 bg-slate-900 border-slate-800 space-y-4 text-left">
            <h3 className="font-bold text-base text-white">Terms of Service</h3>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2 max-h-60 overflow-y-auto pr-2">
              <p>1. <strong>Informational Platform:</strong> FinQuest provides gamified expense management and informational insights. It is not a licensed financial advisory service.</p>
              <p>2. <strong>Account Responsibility:</strong> Users are responsible for maintaining the accuracy of their entered transaction data.</p>
              <p>3. <strong>Data Ownership:</strong> You retain ownership of your financial records and can export or delete them at any time.</p>
            </div>
            <button
              onClick={() => setShowTOS(false)}
              className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-md"
            >
              Close Terms of Service
            </button>
          </div>
        </div>
      )}

      {/* Working Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
          <div className="fin-card max-w-lg p-6 bg-slate-900 border-slate-800 space-y-4 text-left">
            <h3 className="font-bold text-base text-white">Privacy Policy</h3>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2 max-h-60 overflow-y-auto pr-2">
              <p>1. <strong>Data Minimization:</strong> Financial data is strictly isolated to your authenticated account.</p>
              <p>2. <strong>No Third-Party Data Sales:</strong> We do not sell or monetize personal financial entries.</p>
              <p>3. <strong>AI Analytics:</strong> AI requests process aggregated, anonymized metrics strictly to provide user financial summaries.</p>
            </div>
            <button
              onClick={() => setShowPrivacy(false)}
              className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-md"
            >
              Close Privacy Policy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
