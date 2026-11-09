import React from 'react';
import { CheckSquare, LogOut, User } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface NavbarProps {
  user: SupabaseUser | null;
  onSignOut: () => void;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onSignOut, isLoading }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <CheckSquare className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Task Master</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                Pro
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Indigo Focus Productivity</p>
          </div>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 py-1 px-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-[11px]">
                {user.email ? user.email.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
              </div>
              <span className="max-w-[150px] truncate font-medium text-slate-700">{user.email}</span>
            </div>

            <button
              onClick={onSignOut}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
