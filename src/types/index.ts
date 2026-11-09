export type Priority = 'low' | 'medium' | 'high';

export type FilterStatus = 'all' | 'active' | 'done';

export interface Task {
  id: string | number;
  user_id?: string;
  title: string;
  is_done: boolean;
  priority: Priority;
  due_date: string | null;
  created_at?: string;
}
