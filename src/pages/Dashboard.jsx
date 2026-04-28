import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StatsBar from '../components/StatsBar';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

const FILTERS = ['All', 'Active', 'Completed'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data } = await api.get('/api/todos');
        setTodos(data);
      } catch {
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Add task
  const handleAdd = async (taskData) => {
    try {
      const { data } = await api.post('/api/todos', taskData);
      setTodos((prev) => [data, ...prev]);
      toast.success('Task added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add task');
      throw err;
    }
  };

  // Toggle complete
  const handleToggle = async (id, completed) => {
    try {
      const { data } = await api.put(`/api/todos/${id}`, { completed });
      setTodos((prev) => prev.map((t) => (t._id === id ? data : t)));
      toast.success(completed ? 'Task completed! ✅' : 'Task reopened');
    } catch {
      toast.error('Failed to update task');
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  // Filtered + searched todos
  const filteredTodos = useMemo(() => {
    const now = new Date();
    return todos.filter((t) => {
      if (filter === 'Active' && t.completed) return false;
      if (filter === 'Completed' && !t.completed) return false;
      if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [todos, filter, priorityFilter, search]);

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-white">My Tasks</h1>
          <p className="text-slate-400 text-sm mt-1">Stay on top of your to-dos</p>
        </div>

        {/* Stats */}
        <StatsBar todos={todos} />

        {/* Add Task */}
        <TaskForm onAdd={handleAdd} />

        {/* Filter + Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status filters */}
          <div className="flex gap-1 bg-slate-800/60 border border-slate-700/50 rounded-xl p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                id={`filter-${f.toLowerCase()}`}
                onClick={() => setFilter(f)}
                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer transition-all
                  ${filter === f
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <select
            id="priority-filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-800/60 border border-slate-700/50 text-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p === 'All' ? '🎯 All Priorities' : p}</option>
            ))}
          </select>

          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="task-search-input"
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-3">
              <span className="text-5xl">{search ? '🔍' : filter === 'Completed' ? '🎉' : '📭'}</span>
              <p className="text-slate-400 font-medium">
                {search
                  ? `No tasks matching "${search}"`
                  : filter === 'Completed'
                  ? 'No completed tasks yet'
                  : 'No tasks here — add one above!'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TaskCard
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Results count */}
        {!loading && filteredTodos.length > 0 && (
          <p className="text-center text-slate-500 text-xs">
            Showing {filteredTodos.length} of {todos.length} task{todos.length !== 1 ? 's' : ''}
          </p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
