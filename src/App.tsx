import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { Task, Priority, FilterStatus } from './types';
import { Navbar } from './components/Navbar';
import { AuthPage } from './components/AuthPage';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { ErrorAlert } from './components/ErrorAlert';
import { ConfigBanner } from './components/ConfigBanner';
import { RefreshCw, CheckCircle } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Tasks state (strictly in memory & Supabase, never localStorage)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Filters and search
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Real Supabase error display (exact error message string)
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Check auth status on mount and listen to changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setSupabaseError(error.message);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setInitialLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch tasks from Supabase
  const fetchTasks = useCallback(async () => {
    if (!user) return;

    setIsLoadingTasks(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Show exact error only for real Supabase failures
      setSupabaseError(error.message);
    } else {
      setTasks(data || []);
      setSupabaseError(null);
    }
    setIsLoadingTasks(false);
  }, [user]);

  // When user is authenticated, fetch tasks
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user, fetchTasks]);

  // Add task: do NOT send user_id from client as database fills it automatically
  const handleAddTask = async (
    title: string,
    priority: Priority,
    dueDate: string | null
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setSupabaseError(null);

    try {
      const payload: { title: string; priority: Priority; due_date: string | null } = {
        title,
        priority,
        due_date: dueDate || null,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([payload])
        .select();

      if (error) {
        // Show exact error only for real Supabase failures
        setSupabaseError(error.message);
        return false;
      }

      if (data && data.length > 0) {
        setTasks((prev) => [data[0] as Task, ...prev]);
      } else {
        await fetchTasks();
      }

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSupabaseError(err.message);
      } else {
        setSupabaseError('An unexpected error occurred while saving the task.');
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle task completion
  const handleToggleTask = async (id: string | number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // Optimistically update UI
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_done: newStatus } : t))
    );

    const { error } = await supabase
      .from('tasks')
      .update({ is_done: newStatus })
      .eq('id', id);

    if (error) {
      // Revert on failure & show exact error
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_done: currentStatus } : t))
      );
      setSupabaseError(error.message);
    } else {
      setSupabaseError(null);
    }
  };

  // Delete single task
  const handleDeleteTask = async (id: string | number) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      setTasks(previousTasks);
      setSupabaseError(error.message);
    } else {
      setSupabaseError(null);
    }
  };

  // Clear completed tasks
  const handleClearCompleted = async () => {
    setIsClearing(true);
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => !t.is_done));

    const { error } = await supabase.from('tasks').delete().eq('is_done', true);

    if (error) {
      setTasks(previousTasks);
      setSupabaseError(error.message);
    } else {
      setSupabaseError(null);
    }
    setIsClearing(false);
  };

  // Sign out
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setSupabaseError(error.message);
    } else {
      setUser(null);
      setSession(null);
      setTasks([]);
      setSupabaseError(null);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading Task Master...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-slate-800 antialiased font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar user={user} onSignOut={handleSignOut} />

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!session || !user ? (
          /* Login/Sign Up Page */
          <AuthPage onAuthSuccess={() => fetchTasks()} />
        ) : (
          /* Tasks Page */
          <div className="space-y-6">
            {/* Header info / Greeting */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  My Tasks
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Organize, prioritize, and track your daily progress
                </p>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={() => fetchTasks()}
                disabled={isLoadingTasks}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer disabled:opacity-50"
                title="Reload tasks from database"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoadingTasks ? 'animate-spin text-indigo-600' : ''}`}
                />
                <span className="hidden xs:inline">Refresh</span>
              </button>
            </div>

            {/* Config banner if Supabase env is not yet set */}
            {!isSupabaseConfigured && <ConfigBanner />}

            {/* Exact Supabase Error Alert */}
            <ErrorAlert
              error={supabaseError}
              onDismiss={() => setSupabaseError(null)}
            />

            {/* Add Task Form with gentle title validation */}
            <TaskForm
              onAddTask={handleAddTask}
              isSubmitting={isSubmitting}
            />

            {/* Task List with Search, Filter Tabs, Counter & Clear Completed */}
            <TaskList
              tasks={tasks}
              filter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onClearCompleted={handleClearCompleted}
              isClearing={isClearing}
            />

            {/* Small Footer Branding */}
            <div className="pt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Task Master &bull; Powered by Supabase</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
