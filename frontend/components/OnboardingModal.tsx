'use client';

import React, { useState } from 'react';
import { Target, DollarSign, Award, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { fetchAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

const FINANCIAL_GOALS = [
  { id: 'emergency_fund', label: 'Build Emergency Fund', icon: '🛡️', desc: 'Reserve 3-6 months of expenses for safety' },
  { id: 'save_purchase', label: 'Save for Major Purchase', icon: '🎯', desc: 'Car, home downpayment, or vacation' },
  { id: 'debt_payoff', label: 'Pay Off Debt', icon: '💳', desc: 'Clear high-interest credit or loans' },
  { id: 'wealth_building', label: 'Invest & Build Wealth', icon: '📈', desc: 'Stocks, mutual funds, and passive income' },
  { id: 'expense_tracking', label: 'Track Daily Expenses', icon: '📝', desc: 'Gain clarity on monthly cash flow' },
];

const CURRENCIES = [
  { symbol: '₹', code: 'INR', label: 'Indian Rupee (₹)' },
  { symbol: '$', code: 'USD', label: 'US Dollar ($)' },
  { symbol: '€', code: 'EUR', label: 'Euro (€)' },
  { symbol: '£', code: 'GBP', label: 'British Pound (£)' },
];

export default function OnboardingModal({ isOpen, onSuccess }: OnboardingModalProps) {
  const { updateUserProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [monthlyIncome, setMonthlyIncome] = useState<string>('50000');
  const [monthlyBudget, setMonthlyBudget] = useState<string>('30000');
  const [selectedGoal, setSelectedGoal] = useState<string>('Build Emergency Fund');
  const [currency, setCurrency] = useState<string>('₹');
  const [experience, setExperience] = useState<string>('intermediate');

  if (!isOpen) return null;

  const handleSubmitOnboarding = async () => {
    setLoading(true);
    try {
      const incomeNum = Math.max(0, parseFloat(monthlyIncome) || 0);
      const budgetNum = Math.max(0, parseFloat(monthlyBudget) || 0);

      const res = await fetchAPI('/auth/onboarding', {
        method: 'POST',
        body: JSON.stringify({
          monthly_income: incomeNum,
          monthly_budget_target: budgetNum,
          main_financial_goal: selectedGoal,
          currency: currency,
          financial_experience: experience,
        })
      });

      if (res && res.is_onboarded) {
        updateUserProfile(res);
        onSuccess();
      }
    } catch (err) {
      console.error('[OnboardingModal] Failed to submit onboarding data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="fin-card w-full max-w-xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-6">
        {/* Header Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100 tracking-tight">
                Welcome Adventurer! Setup Your Profile
              </h2>
              <p className="text-xs text-slate-500">
                Step {step} of 3 • Registered inputs power your personalized analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-6 h-1.5 rounded-full transition-colors ${
                  step === s ? 'bg-amber-600' : step > s ? 'bg-amber-500/40' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Income & Budget Targets */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-500" />
                Income & Budget Targets
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Set your monthly income baseline and target spending limit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Monthly Income ({currency})
                </label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Target Monthly Budget ({currency})
                </label>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  placeholder="e.g. 30000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                Preferred Currency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.symbol)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all ${
                      currency === c.symbol
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all mt-4"
            >
              <span>Next: Primary Financial Goal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Main Financial Goal Selection */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                Select Your Main Financial Goal
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Which quest objective matters most to you right now?
              </p>
            </div>

            <div className="space-y-2">
              {FINANCIAL_GOALS.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGoal(g.label)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedGoal === g.label
                      ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{g.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs">{g.label}</h4>
                      <p className="text-[11px] text-slate-500">{g.desc}</p>
                    </div>
                  </div>
                  {selectedGoal === g.label && <CheckCircle className="w-4 h-4 text-amber-500" />}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all"
              >
                <span>Next: Experience Level</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Experience Level & Confirmation */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Budgeting Experience Level
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Helps the AI Coach tailor recommendations to your comfort zone.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { id: 'beginner', title: 'Beginner', desc: 'Just starting to track spending' },
                { id: 'intermediate', title: 'Intermediate', desc: 'Familiar with budget caps' },
                { id: 'advanced', title: 'Advanced', desc: 'Optimizing savings & investments' },
              ].map((exp) => (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setExperience(exp.id)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    experience === exp.id
                      ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-slate-100 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold text-slate-900 dark:text-slate-100">{exp.title}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{exp.desc}</span>
                </button>
              ))}
            </div>

            {/* Confirmation Summary Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[10px]">
                Profile Summary
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <div>Monthly Income: <strong className="text-slate-900 dark:text-white">{currency}{parseFloat(monthlyIncome || '0').toLocaleString()}</strong></div>
                <div>Target Budget: <strong className="text-slate-900 dark:text-white">{currency}{parseFloat(monthlyBudget || '0').toLocaleString()}</strong></div>
                <div className="col-span-2">Goal: <strong className="text-slate-900 dark:text-white">{selectedGoal}</strong></div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmitOnboarding}
                disabled={loading}
                className="w-2/3 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all disabled:opacity-50"
              >
                {loading ? 'Saving Profile...' : 'Complete & Start Quest 🔥'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
