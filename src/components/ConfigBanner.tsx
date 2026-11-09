import React from 'react';
import { Database, AlertTriangle, ExternalLink } from 'lucide-react';

export const ConfigBanner: React.FC = () => {
  return (
    <div className="mb-6 rounded-2xl bg-amber-50/90 border border-amber-200 p-4 text-amber-900 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
          <Database className="w-5 h-5" />
        </div>
        <div className="text-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-amber-950">Supabase Connection Required</span>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-200/80 font-medium text-amber-800">
              <AlertTriangle className="w-3 h-3" /> Setup Needed
            </span>
          </div>
          <p className="text-amber-800 leading-relaxed text-xs sm:text-sm">
            To authenticate and save tasks to your database, make sure to supply your project's credentials in your environment:
          </p>
          <div className="mt-2.5 space-y-1 font-mono text-xs bg-amber-100/70 p-2.5 rounded-lg border border-amber-200/60 text-amber-950 overflow-x-auto">
            <div>VITE_SUPABASE_URL="https://your-project.supabase.co"</div>
            <div>VITE_SUPABASE_PUBLISHABLE_KEY="sbp_... or anon key"</div>
          </div>
          <p className="mt-2 text-xs text-amber-700 flex items-center gap-1">
            <span>Read directly from <code className="font-semibold bg-amber-100 px-1 py-0.5 rounded">import.meta.env</code></span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </p>
        </div>
      </div>
    </div>
  );
};
