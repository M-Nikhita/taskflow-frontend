import { useState } from 'react';
import toast from 'react-hot-toast';

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Low');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }
    setLoading(true);
    try {
      await onAdd({ title: title.trim(), priority, dueDate: dueDate || null });
      setTitle('');
      setPriority('Low');
      setDueDate('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 flex flex-col sm:flex-row gap-3"
    >
      {/* Title */}
      <input
        id="task-title-input"
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 bg-slate-900/60 border border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />

      {/* Priority */}
      <select
        id="task-priority-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="bg-slate-900/60 border border-slate-600 text-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
      >
        <option value="Low">🟢 Low</option>
        <option value="Medium">🟡 Medium</option>
        <option value="High">🔴 High</option>
      </select>

      {/* Due Date */}
      <input
        id="task-due-date-input"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="bg-slate-900/60 border border-slate-600 text-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
      />

      {/* Submit */}
      <button
        id="add-task-btn"
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold text-sm rounded-lg shadow-lg shadow-indigo-900/40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
        ) : (
          '+ Add Task'
        )}
      </button>
    </form>
  );
};

export default TaskForm;
