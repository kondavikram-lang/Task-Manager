import React, { useState } from 'react';
import { Priority } from '../types';
import { Plus, Calendar, AlertCircle } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (title: string, priority: Priority, dueDate: string | null) => Promise<boolean>;
  isSubmitting?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, isSubmitting = false }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [showGentleValidation, setShowGentleValidation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      // Gentle validation message under the input, not a red database error
      setShowGentleValidation(true);
      return;
    }

    setShowGentleValidation(false);
    const success = await onAddTask(trimmedTitle, priority, dueDate || null);
    if (success) {
      setTitle('');
      setDueDate('');
      setPriority('medium');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_4px_-1px_rgba(79,70,229,0.04),0_4px_6px_-1px_rgba(30,41,59,0.05)] border border-slate-200/80 mb-6 transition-all">
      <form onSubmit={handleSubmit}>
        {/* Title input */}
        <div className="mb-3">
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (showGentleValidation && e.target.value.trim()) {
                  setShowGentleValidation(false);
                }
              }}
              placeholder="What needs to be accomplished today?"
              className={`w-full h-12 px-4 bg-white border ${
                showGentleValidation ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
              } rounded-xl text-slate-900 text-sm sm:text-base placeholder-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-100 transition-all`}
            />
          </div>

          {/* Gentle message under the input if empty */}
          {showGentleValidation && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50/80 px-3 py-1.5 rounded-lg border border-amber-200/60 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Please enter a task title to continue</span>
            </div>
          )}
        </div>

        {/* Priority & Due Date row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Priority selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 hidden xs:inline">Priority:</span>
            <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200/70">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  priority === 'low'
                    ? 'bg-emerald-50 text-emerald-700 shadow-xs ring-1 ring-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Low</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  priority === 'medium'
                    ? 'bg-amber-50 text-amber-700 shadow-xs ring-1 ring-amber-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Medium</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  priority === 'high'
                    ? 'bg-rose-50 text-rose-700 shadow-xs ring-1 ring-rose-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>High</span>
              </button>
            </div>
          </div>

          {/* Due date and submit button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full sm:w-auto h-9 pl-8 pr-2.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                title="Optional due date"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-sm shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Task</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
