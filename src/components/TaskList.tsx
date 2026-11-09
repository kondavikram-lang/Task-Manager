import React, { useMemo } from 'react';
import { Task, FilterStatus } from '../types';
import { TaskItem } from './TaskItem';
import { Search, X, CheckCheck, ListFilter, Sparkles, ArrowDownWideNarrow } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleTask: (id: string | number, currentStatus: boolean) => void;
  onDeleteTask: (id: string | number) => void;
  onClearCompleted: () => void;
  isClearing?: boolean;
}

// Priority weight: High (0) comes to top, Medium (1), Low (2)
const PRIORITY_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onToggleTask,
  onDeleteTask,
  onClearCompleted,
  isClearing = false,
}) => {
  // Compute counts
  const totalCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.is_done).length;
  const completedCount = tasks.filter((t) => t.is_done).length;

  // Filter and sort tasks
  const sortedTasks = useMemo(() => {
    // 1. Filter
    const filtered = tasks.filter((task) => {
      // Tab filter
      if (filter === 'active' && task.is_done) return false;
      if (filter === 'done' && !task.is_done) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return task.title.toLowerCase().includes(query);
      }
      return true;
    });

    // 2. Sort: First priority is date (ascending), then high-medium-low priority
    return [...filtered].sort((a, b) => {
      // Primary: Due date in ascending order (earliest deadline first)
      const hasDateA = Boolean(a.due_date);
      const hasDateB = Boolean(b.due_date);

      if (hasDateA && hasDateB) {
        const dateComparison = a.due_date!.localeCompare(b.due_date!);
        if (dateComparison !== 0) return dateComparison;
      } else if (hasDateA && !hasDateB) {
        return -1; // tasks with assigned dates come first
      } else if (!hasDateA && hasDateB) {
        return 1;
      }

      // Secondary: Priority (High -> Medium -> Low)
      const priorityA = PRIORITY_ORDER[a.priority] ?? 1;
      const priorityB = PRIORITY_ORDER[b.priority] ?? 1;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Tertiary: Newest created first as a stable tie-breaker
      if (a.created_at && b.created_at) {
        return b.created_at.localeCompare(a.created_at);
      }
      return 0;
    });
  }, [tasks, filter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_4px_-1px_rgba(79,70,229,0.04),0_4px_6px_-1px_rgba(30,41,59,0.05)] border border-slate-200/80 space-y-3">
        {/* Search Box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full h-10 pl-10 pr-9 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips & Counter Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          {/* Filter Chips (All, Active, Done) */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Task filters">
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              onClick={() => onFilterChange('all')}
              className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs border border-indigo-600'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              All ({totalCount})
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={filter === 'active'}
              onClick={() => onFilterChange('active')}
              className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter === 'active'
                  ? 'bg-indigo-600 text-white shadow-xs border border-indigo-600'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Active ({activeCount})
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={filter === 'done'}
              onClick={() => onFilterChange('done')}
              className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter === 'done'
                  ? 'bg-indigo-600 text-white shadow-xs border border-indigo-600'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>

          {/* Counter & Clear Completed Button */}
          <div className="flex items-center gap-3 ml-auto text-xs">
            <span className="font-semibold text-slate-500">
              {activeCount === 1 ? '1 task left' : `${activeCount} tasks left`}
            </span>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={onClearCompleted}
                disabled={isClearing}
                className="text-xs font-medium text-slate-500 hover:text-rose-600 underline underline-offset-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                Clear completed
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Sort Order & Items Count Indicator */}
      {sortedTasks.length > 0 && (
        <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-100">
            <ArrowDownWideNarrow className="w-3.5 h-3.5" />
            <span>Dates ascending &bull; High to Low priority</span>
          </div>
          <span className="text-slate-400">
            {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      )}

      {/* Task List Items */}
      {sortedTasks.length > 0 ? (
        <div className="space-y-2">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-[0_2px_4px_-1px_rgba(79,70,229,0.04)]">
          {searchQuery ? (
            <div className="max-w-xs mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No matching tasks</h3>
              <p className="text-xs text-slate-500 mt-1">
                No tasks found matching "{searchQuery}". Try a different keyword or clear search.
              </p>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="mt-3 inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          ) : filter === 'done' ? (
            <div className="max-w-xs mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <CheckCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No completed tasks yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Check off items from your Active list to see them marked here.
              </p>
            </div>
          ) : filter === 'active' && totalCount > 0 ? (
            <div className="max-w-xs mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">All caught up!</h3>
              <p className="text-xs text-slate-500 mt-1">
                You've completed every task on your list. Enjoy your day or add new goals above.
              </p>
            </div>
          ) : (
            <div className="max-w-xs mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <ListFilter className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your task list is empty</h3>
              <p className="text-xs text-slate-500 mt-1">
                Use the quick-add form above to capture your first priority.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
