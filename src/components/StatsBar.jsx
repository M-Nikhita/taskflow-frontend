import { useMemo } from 'react';

const StatCard = ({ label, value, color, icon }) => (
  <div className={`flex-1 min-w-[120px] bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-1`}>
    <div className="flex items-center justify-between">
      <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</span>
      <span className="text-lg">{icon}</span>
    </div>
    <span className={`text-2xl font-bold ${color}`}>{value}</span>
  </div>
);

const StatsBar = ({ todos }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = todos.filter((t) => !t.completed).length;
    const overdue = todos.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now
    ).length;
    return { total, completed, pending, overdue };
  }, [todos]);

  return (
    <div className="flex flex-wrap gap-3">
      <StatCard label="Total" value={stats.total} color="text-indigo-400" icon="📋" />
      <StatCard label="Completed" value={stats.completed} color="text-emerald-400" icon="✅" />
      <StatCard label="Pending" value={stats.pending} color="text-amber-400" icon="⏳" />
      <StatCard label="Overdue" value={stats.overdue} color="text-rose-400" icon="🔥" />
    </div>
  );
};

export default StatsBar;
