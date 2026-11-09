export function formatDueDate(dateString: string | null): { text: string; isOverdue: boolean; isToday: boolean } {
  if (!dateString) {
    return { text: '', isOverdue: false, isToday: false };
  }

  // Parse YYYY-MM-DD safely in local time
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return { text: dateString, isOverdue: false, isToday: false };
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const targetDate = new Date(year, month, day);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const isToday = diffDays === 0;
  const isOverdue = diffDays < 0;

  if (diffDays === 0) {
    return { text: 'Today', isOverdue: false, isToday: true };
  }
  if (diffDays === 1) {
    return { text: 'Tomorrow', isOverdue: false, isToday: false };
  }
  if (diffDays === -1) {
    return { text: 'Yesterday', isOverdue: true, isToday: false };
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formatted = `${months[month]} ${day}${targetDate.getFullYear() !== today.getFullYear() ? `, ${targetDate.getFullYear()}` : ''}`;

  return {
    text: formatted,
    isOverdue,
    isToday,
  };
}
