import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">T</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Task<span className="text-indigo-400">Flow</span>
          </span>
        </div>

        {/* User info + logout */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-slate-300 text-sm font-medium">{user.name}</span>
            </div>
            <button
              id="logout-btn"
              onClick={handleLogout}
              className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 rounded-lg hover:bg-slate-700/50 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
