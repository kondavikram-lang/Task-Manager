import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ErrorAlert } from './ErrorAlert';
import { ConfigBanner } from './ConfigBanner';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setNotice(null);
    setValidationError(null);

    // Client-side gentle validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setValidationError('Please enter your email address to continue.');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          // Show the exact error for real Supabase failures
          setAuthError(error.message);
        } else {
          onAuthSuccess();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });

        if (error) {
          // Show the exact error for real Supabase failures
          setAuthError(error.message);
        } else if (data.session) {
          // Immediate sign in if email confirmation is disabled
          onAuthSuccess();
        } else {
          setNotice('Account created! If email confirmation is enabled on your Supabase project, check your inbox to confirm.');
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError('An unexpected authentication error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {!isSupabaseConfigured && <ConfigBanner />}

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_4px_-1px_rgba(79,70,229,0.04),0_4px_6px_-1px_rgba(30,41,59,0.05)] border border-slate-200/80">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100/80">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {mode === 'signin' ? 'Welcome to Task Master' : 'Create your account'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {mode === 'signin'
                ? 'Sign in to access your synchronized tasks'
                : 'Get started with focused task management'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100/90 p-1 rounded-xl mb-6 border border-slate-200/60">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setAuthError(null);
                setNotice(null);
                setValidationError(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setAuthError(null);
                setNotice(null);
                setValidationError(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Exact Real Supabase Error */}
          <ErrorAlert error={authError} onDismiss={() => setAuthError(null)} />

          {/* Success / Info Notice */}
          {notice && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{notice}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="••••••••"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  className="w-full h-12 pl-10 pr-10 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Gentle Validation Message */}
            {validationError && (
              <p className="text-xs text-amber-700 bg-amber-50 py-1.5 px-3 rounded-lg border border-amber-200/80">
                {validationError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              {mode === 'signin' ? (
                <>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setAuthError(null);
                      setNotice(null);
                    }}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 cursor-pointer"
                  >
                    Create one here
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setAuthError(null);
                      setNotice(null);
                    }}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 cursor-pointer"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
