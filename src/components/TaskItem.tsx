import React from 'react';
import { Task } from '../types';
import { Check, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { formatDueDate } from '../utils/date';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string | number, currentStatus: boolean) => void;
  onDelete: (id: string | number) => void;
  isUpdating?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, isUpdating = false }) => {
  const { text: formattedDate, isOverdue, isToday } = formatDueDate(task.due_date);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-rose-50 text-rose-600 border border-rose-100">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Med
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-blue-600 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Low
          </span>
        );
    }
  };

  return (
    <div
      className={`group bg-white rounded-2xl p-3.5 sm:p-4 border transition-all duration-200 shadow-[0_2px_4px_-1px_rgba(79,70,229,0.04),0_4px_6px_-1px_rgba(30,41,59,0.05)] hover:shadow-md hover:border-slate-300 ${
        task.is_done
          ? 'opacity-75 bg-slate-50/70 border-slate-200'
          : 'border-slate-200/90'
      }`}
    >
      <div className="flex items-start sm:items-center justify-between gap-3">
        {/* Leading Checkbox + Title + Badges */}
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
          {/* Custom Checkbox (22x22px, rounded-md (6px)) */}
          <button
            type="button"
            role="checkbox"
            aria-checked={task.is_done}
            disabled={isUpdating}
            onClick={() => onToggle(task.id, task.is_done)}
            className={`mt-0.5 sm:mt-0 w-[22px] h-[22px] rounded-md flex items-center justify-center shrink-0 transition-all cursor-pointer ${
              task.is_done
                ? 'bg-indigo-600 border-2 border-indigo-600 text-white shadow-xs'
                : 'border-2 border-slate-300 hover:border-indigo-500 bg-white'
            }`}
          >
            {task.is_done && <Check className="w-3.5 h-3.5 stroke-[3] animate-scaleIn" />}
          </button>

          {/* Title and metadata */}
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm sm:text-base font-medium break-words transition-all leading-snug ${
                task.is_done
                  ? 'line-through text-slate-400'
                  : 'text-slate-900 font-semibold'
              }`}
            >
              {task.title}
            </p>

            {/* Badges / Due Date */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {getPriorityBadge(task.priority)}

              {task.due_date && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border ${
                    task.is_done
                      ? 'bg-slate-100 text-slate-400 border-slate-200'
                      : isOverdue
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : isToday
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                  title={`Due: ${task.due_date}`}
                >
                  {isOverdue && !task.is_done ? (
                    <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                  ) : (
                    <Calendar className="w-3 h-3 opacity-70 shrink-0" />
                  )}
                  <span>{formattedDate}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Trailing Delete Button */}
        <div className="flex items-center self-center shrink-0">
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            disabled={isUpdating}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer opacity-70 group-hover:opacity-100 focus:opacity-100"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
