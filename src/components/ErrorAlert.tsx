import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  error: string | null;
  onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-4 shadow-sm transition-all animate-fadeIn">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
        <div className="flex-1 text-sm text-rose-900">
          <p className="font-semibold text-rose-800 mb-0.5">Database / Supabase Error</p>
          <p className="font-mono text-xs text-rose-700 break-words leading-relaxed">{error}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-rose-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
          title="Dismiss error"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
