'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, User as UserIcon, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

import GoogleLoginModal from '../../components/GoogleLoginModal';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, socialLogin, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSocialAuth = async (provider: 'google' | 'github' | 'apple') => {
    if (provider === 'google') {
      setIsGoogleModalOpen(true);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const demoEmail = `${provider}_user@finquest.com`;
      const demoName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} Adventurer`;
      const avatarSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23d97706"/><circle cx="50" cy="38" r="20" fill="%23fef08a"/><path d="M20,90 C20,68 35,55 50,55 C65,55 80,68 80,90 Z" fill="%23b45309"/></svg>`;

      await socialLogin(provider, demoEmail, demoName, avatarSvg);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(`[${provider} OAuth Error]`, err);
      setError(err.message || `Failed to authenticate with ${provider}.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'signin') {
        if (!email || !password) {
          setError('Please fill in both email and password.');
          setSubmitting(false);
          return;
        }
        await login(email, password);
      } else {
        if (!name || !email || !password) {
          setError('Please complete all required fields.');
          setSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setSubmitting(false);
          return;
        }
        await register(name, email, password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      console.error('[Auth Error]', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError(null);
    setSubmitting(true);
    setEmail('demo@finquest.com');
    setPassword('password123');

    try {
      await login('demo@finquest.com', 'password123');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('[Demo Auth Error]', err);
      setError(err.message || 'Failed to login with demo account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between font-sans selection:bg-amber-600 selection:text-white">
      {/* Navigation Bar Header */}
      <header className="border-b border-stone-900 bg-stone-950/80 backdrop-blur px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-amber-600/30">
              Q
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              FinQuest
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-medium text-stone-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md space-y-6">
          {/* Top Brand Banner */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gamified Personal Finance</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {mode === 'signin' ? 'Welcome Back to FinQuest' : 'Create Your Quest Account'}
            </h1>
            <p className="text-xs text-stone-400">
              {mode === 'signin'
                ? 'Sign in to access your financial dashboard, XP progress, and AI coaching.'
                : 'Start tracking expenses, earning achievements, and building your savings habit.'}
            </p>
          </div>

          {/* Quick Demo Credentials Card */}
          <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant Demo Access</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                1-Click Sign In
              </span>
            </div>

            <p className="text-[11px] text-stone-400">
              Log in instantly with seeded demo metrics (<code className="text-amber-300">demo@finquest.com</code>).
            </p>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 hover:text-amber-300 font-bold text-xs border border-stone-700 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <span>Launch Quick Demo Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auth Card */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-2xl space-y-6">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-lg bg-stone-950 p-1 border border-stone-800/80">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                  mode === 'signin'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                  mode === 'register'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Register
              </button>
            </div>

            {/* Social OAuth Login Section */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 text-center block">
                Sign in with Social Provider
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('google')}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-200 text-xs font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
                  title="Sign in with Google"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                {/* GitHub Login Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('github')}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-200 text-xs font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
                  title="Sign in with GitHub"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </button>

                {/* Apple Login Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('apple')}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-200 text-xs font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
                  title="Sign in with Apple"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.92-14.42-6.15-3.56-2.85-7.53-7.66-11.91-14.42-6.42-9.92-11.45-20.91-15.09-32.96-3.64-12.06-5.46-23.75-5.46-35.08 0-14.75 3.69-27.1 11.07-37.04 7.38-9.94 16.71-14.97 27.99-15.09 4.34 0 9.28 1.12 14.83 3.35 5.55 2.23 9.38 3.35 11.49 3.35 1.78 0 5.76-1.18 11.94-3.53 6.18-2.35 11.17-3.41 14.97-3.17 11.05.7 20.21 4.7 27.5 12 4.19 4.19 7.4 9.17 9.62 14.95-10.96 6.64-16.3 15.69-16.03 27.15.27 8.98 3.78 16.48 10.53 22.5 6.75 6.02 14.89 9.32 24.42 9.9-2.45 7.15-5.83 14.28-10.14 21.39zM119.22 31.81c0-7.23 2.61-14.16 7.83-20.79 5.22-6.63 11.91-10.4 20.07-11.02.13 1.05.2 1.95.2 2.7 0 7.23-2.66 14.29-7.98 21.18-5.32 6.89-12.01 10.66-20.07 11.31-.05-.88-.05-2.01-.05-3.38z"/>
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </div>

            {/* Divider Line */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-stone-800" />
              <span className="bg-stone-900 px-3 text-[10px] uppercase font-bold text-stone-500 tracking-wider absolute">
                Or Continue With Email
              </span>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Alex Mercer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={mode === 'register'}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
              >
                {submitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Create FinQuest Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center text-xs text-slate-500">
            <span>Protected by JWT Token Security & Encrypted Password Hashing</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
        <span>© 2026 FinQuest SaaS Platform. All rights reserved.</span>
      </footer>

      <GoogleLoginModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />
    </div>
  );
}
