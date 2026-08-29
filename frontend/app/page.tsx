'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  Bot,
  PieChart,
  ShieldCheck,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const [showTOS, setShowTOS] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg">
              Q
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
              FinQuest
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
            >
              Start Your Quest
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 max-w-7xl mx-auto text-center space-y-8 overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Gamified Personal Finance</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Turn Your Money Habits Into a <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">Game.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          FinQuest combines smart expense tracking, savings goals, AI-driven coaching, and RPG level progression to make responsible finance engaging, clear, and rewarding.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <span>Start Your Quest</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
          >
            Explore Features
          </a>
        </div>

        {/* Dashboard Preview Card */}
        <div className="mt-12 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl max-w-5xl mx-auto text-left">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800 text-xs text-slate-500">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-[11px]">app.finquest.com/dashboard</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="fin-card p-4 bg-slate-950/60 border-slate-800">
              <div className="text-xs font-semibold text-slate-400">Total Net Savings</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">₹68,500</div>
              <div className="text-[11px] text-slate-500 mt-1">+18% compared to last month</div>
            </div>

            <div className="fin-card p-4 bg-slate-950/60 border-slate-800">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400">Current Level</span>
                <span className="text-amber-400 font-bold">2,450 / 3,000 XP</span>
              </div>
              <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-2">
                Level 12
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-400 h-full w-[80%]" />
              </div>
            </div>

            <div className="fin-card p-4 bg-slate-950/60 border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Streak Active</span>
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-500 mt-1">🔥 14 Days</div>
              <div className="text-[11px] text-slate-500 mt-1">XP multiplier 1.2x enabled</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Engineered for Financial Mastery</h2>
          <p className="text-slate-400 text-base">Comprehensive tools that feel like a polished modern SaaS product.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="fin-card p-6 bg-slate-900/60 border-slate-800 hover:border-indigo-500/50">
            <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Expense Tracking</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Instant AI auto-categorization parses prompts like "Swiggy 450" into structured categories with zero manual hassle.
            </p>
          </div>

          <div className="fin-card p-6 bg-slate-900/60 border-slate-800 hover:border-indigo-500/50">
            <div className="w-12 h-12 rounded-xl bg-violet-950 text-violet-400 flex items-center justify-center mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Financial Coach</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Conversational intelligence anchored in your verified database metrics to answer questions and optimize budgets.
            </p>
          </div>

          <div className="fin-card p-6 bg-slate-900/60 border-slate-800 hover:border-indigo-500/50">
            <div className="w-12 h-12 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Gamified Challenges</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join 7-day budget targets, savings sprints, and custom AI challenges to earn XP, level up, and unlock achievements.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">How FinQuest Works</h2>
            <p className="text-slate-400 text-base">Five simple steps from setup to financial freedom.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Track Money', desc: 'Log daily income & expenses effortlessly.' },
              { step: '02', title: 'Build Habits', desc: 'Maintain streaks by staying on budget.' },
              { step: '03', title: 'Challenges', desc: 'Participate in targeted savings quests.' },
              { step: '04', title: 'Earn XP', desc: 'Watch your financial level & score climb.' },
              { step: '05', title: 'Reach Goals', desc: 'Hit major milestones ahead of schedule.' },
            ].map((s) => (
              <div key={s.step} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <span className="text-xs font-black text-indigo-400 font-mono">{s.step}</span>
                <div className="mt-4">
                  <h4 className="font-bold text-white text-base">{s.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto w-full">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900 border border-indigo-700/50 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to Start Your Financial Quest?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto">
            Build healthy money habits, level up your savings, and let AI guide your journey today.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg"
          >
            <span>Start Your Quest</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 FinQuest. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <button onClick={() => setShowTOS(true)} className="hover:text-slate-300">
              Terms of Service
            </button>
            <button onClick={() => setShowPrivacy(true)} className="hover:text-slate-300">
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>

      {/* TOS Modal */}
      {showTOS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="fin-card max-w-lg p-6 bg-slate-900 border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-white">Terms of Service</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              FinQuest provides gamified financial management and informational AI insights. FinQuest is not a registered financial advisory service. Users are responsible for managing their own funds.
            </p>
            <button
              onClick={() => setShowTOS(false)}
              className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="fin-card max-w-lg p-6 bg-slate-900 border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-white">Privacy Policy</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your financial data is encrypted and strictly isolated to your user account. We do not sell user data to third parties. AI features process anonymized data metrics strictly for generating user coaching responses.
            </p>
            <button
              onClick={() => setShowPrivacy(false)}
              className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
