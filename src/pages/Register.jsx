import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// Password rules
const RULES = [
  { id: 'len',     label: 'At least 8 characters',        test: (p) => p.length >= 8 },
  { id: 'upper',   label: 'One uppercase letter (A-Z)',    test: (p) => /[A-Z]/.test(p) },
  { id: 'number',  label: 'One number (0-9)',              test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character (!@#$…)', test: (p) => /[!@#$%^&*(),.?":{}|<>_\-]/.test(p) },
];

const validatePassword = (password) => {
  if (!password) return null;
  const failed = RULES.find((r) => !r.test(password));
  return failed ? failed.label : null;
};

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleBlur  = (e) => setTouched({ ...touched, [e.target.name]: true });

  // Live rule checks
  const ruleResults = useMemo(() =>
    RULES.map((r) => ({ ...r, passed: r.test(form.password) })),
    [form.password]
  );
  const allRulesPassed = ruleResults.every((r) => r.passed);

  // Show strength bar
  const passedCount  = ruleResults.filter((r) => r.passed).length;
  const strengthColor = ['bg-rose-500', 'bg-orange-500', 'bg-amber-400', 'bg-emerald-400'][passedCount - 1] || 'bg-slate-600';
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passedCount];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });

    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (!form.email.trim()) { toast.error('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { toast.error('Enter a valid email address'); return; }

    const pwdError = validatePassword(form.password);
    if (pwdError) { toast.error(pwdError); return; }

    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', form);
      login(data.token, data.user);
      toast.success(`Welcome, ${data.user.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === 'Email already in use') {
        toast.error('An account with this email already exists');
      } else if (err.code === 'ERR_NETWORK') {
        toast.error('Cannot reach server — please try again');
      } else {
        toast.error(msg || 'Registration failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-900">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-white font-bold text-2xl">Task<span className="text-indigo-400">Flow</span></span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
          <p className="text-slate-400 text-sm">Start managing your tasks privately</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-slate-900/60 border text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500
                  ${touched.name && !form.name.trim() ? 'border-rose-500 focus:border-rose-500' : 'border-slate-600 focus:border-indigo-500'}`}
              />
              {touched.name && !form.name.trim() && (
                <p className="text-rose-400 text-xs mt-1">Name is required</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-slate-900/60 border text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500
                  ${touched.email && !/\S+@\S+\.\S+/.test(form.email) ? 'border-rose-500 focus:border-rose-500' : 'border-slate-600 focus:border-indigo-500'}`}
              />
              {touched.email && !form.email && (
                <p className="text-rose-400 text-xs mt-1">Email is required</p>
              )}
              {touched.email && form.email && !/\S+@\S+\.\S+/.test(form.email) && (
                <p className="text-rose-400 text-xs mt-1">Enter a valid email address</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Min 8 chars, uppercase, number, symbol"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-slate-900/60 border text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500
                  ${touched.password && !allRulesPassed && form.password ? 'border-rose-500 focus:border-rose-500' : 'border-slate-600 focus:border-indigo-500'}`}
              />

              {/* Strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {RULES.map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i < passedCount ? strengthColor : 'bg-slate-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">{strengthLabel}</p>
                </div>
              )}

              {/* Rule checklist */}
              {form.password && (
                <ul className="mt-2 flex flex-col gap-0.5">
                  {ruleResults.map((r) => (
                    <li key={r.id} className={`text-xs flex items-center gap-1.5 ${r.passed ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <span>{r.passed ? '✓' : '○'}</span> {r.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 text-white font-semibold text-sm rounded-lg shadow-lg shadow-indigo-900/40 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
