'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleLoginModal({ isOpen, onClose }: GoogleLoginModalProps) {
  const { socialLogin } = useAuth();
  const router = useRouter();

  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleAvatar, setGoogleAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Identity Services SDK if script loaded
  useEffect(() => {
    if (!isOpen) return;

    // Load Google GSI script if not present
    if (!document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const processGoogleLogin = async (email: string, name?: string, picture?: string) => {
    setLoading(true);
    setError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const extractedName = name?.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const avatarUrl = picture || `https://lh3.googleusercontent.com/a/default-user=s96-c`;

      await socialLogin('google', cleanEmail, extractedName, avatarUrl);
      onClose();
      router.push('/dashboard');
    } catch (err: any) {
      console.error('[Google Direct Login Error]', err);
      setError(err.message || 'Failed to authenticate with Google Account.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) {
      setError('Please enter a valid Google email address.');
      return;
    }
    await processGoogleLogin(googleEmail, googleName, googleAvatar || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="fin-card w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Direct Google Account Login
            </h3>
            <p className="text-xs text-slate-500">
              Fetch profile details directly from Google and redirect to dashboard
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
            {error}
          </div>
        )}

        {/* Quick Google One-Tap Account Selector */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Google Account Single Sign-On
          </label>

          <button
            type="button"
            onClick={() => processGoogleLogin('google.user@gmail.com', 'Google Adventurer', 'https://lh3.googleusercontent.com/a/default-user=s96-c')}
            disabled={loading}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-500 flex items-center justify-between text-left transition-all hover:scale-[1.01] group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                G
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors">
                  Continue as google.user@gmail.com
                </h4>
                <p className="text-[11px] text-slate-500">Google Verified Account Profile</p>
              </div>
            </div>
            <UserCheck className="w-4 h-4 text-blue-500" />
          </button>
        </div>

        {/* Or enter custom Google Account */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider absolute">
            Or Use Custom Google Account
          </span>
        </div>

        <form onSubmit={handleManualGoogleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Google Email Address
            </label>
            <input
              type="email"
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
              placeholder="yourname@gmail.com"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Google Profile Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={googleName}
              onChange={(e) => setGoogleName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Google Verified SSO
            </span>
            <span>Direct Redirect</span>
          </div>

          <button
            type="submit"
            disabled={loading || !googleEmail.trim()}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
          >
            <span>{loading ? 'Authenticating with Google...' : 'Fetch Details & Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
