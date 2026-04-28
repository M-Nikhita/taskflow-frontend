const PRIORITY_CONFIG = {
  High: { label: '🔴 High', classes: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  Medium: { label: '🟡 Medium', classes: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  Low: { label: '🟢 Low', classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const isOverdue = (dueDate, completed) => {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date();
};

const TaskCard = ({ todo, onToggle, onDelete }) => {
  const overdue = isOverdue(todo.dueDate, todo.completed);
  const priority = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.Low;

  return (
    <div
      className={`group bg-slate-800/60 border rounded-xl p-4 flex items-start gap-4 hover:bg-slate-800/90
        ${overdue ? 'border-rose-500/50 shadow-rose-900/20 shadow-lg' : 'border-slate-700/50 hover:border-slate-600/50'}`}
    >
      {/* Checkbox */}
      <button
        id={`toggle-${todo._id}`}
        onClick={() => onToggle(todo._id, !todo.completed)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center cursor-pointer
          ${todo.completed
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-slate-500 hover:border-indigo-400'}`}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug break-words
          ${todo.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
          {todo.title}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {/* Priority badge */}
          <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${priority.classes}`}>
            {priority.label}
          </span>

          {/* Due date */}
          {todo.dueDate && (
            <span className={`text-xs font-medium ${overdue ? 'text-rose-400' : 'text-slate-400'}`}>
              {overdue ? '⚠ Overdue · ' : '📅 '}{formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        id={`delete-${todo._id}`}
        onClick={() => onDelete(todo._id)}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
        aria-label="Delete task"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default TaskCard;
