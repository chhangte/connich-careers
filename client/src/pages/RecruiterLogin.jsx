import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Briefcase, ArrowRight, Building2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const RecruiterLogin = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { user, token } = res.data;

      if (user.role !== 'RECRUITER' && user.role !== 'ADMIN') {
        setError('This portal is for recruiters only. Please use the applicant login.');
        setLoading(false);
        return;
      }

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      if (user.role === 'ADMIN') navigate('/admin');
      else navigate('/recruiter');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div
        className="hidden md:flex md:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #2563eb 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img src="/logo.png" alt="Connich Careers" className="w-8 h-8 object-contain brightness-0 invert" />
            <span className="font-semibold text-white">Connich Careers</span>
          </Link>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Building2 size={12} /> Recruiter Portal
          </div>
          <blockquote className="text-2xl font-semibold text-white leading-snug mb-6">
            "The right hire changes everything. Find them faster with Connich."
          </blockquote>
          <p className="text-white/60 text-sm leading-relaxed">
            Manage your listings, review applications, and build your employer brand — all from one dashboard.
          </p>
        </div>

        <div className="relative z-10 text-white/40 text-xs">
          New to Connich?{' '}
          <Link to="/recruiter/signup" className="text-white/70 hover:text-white no-underline font-medium">
            Register your company
          </Link>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <div className="md:hidden mb-8 flex items-center gap-2">
          <img src="/logo.png" alt="Connich Careers" className="w-8 h-8 object-contain" />
          <span className="font-semibold">Recruiter Portal</span>
        </div>

        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-accent-light text-accent text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Building2 size={12} /> Recruiter sign in
            </div>
            <h1 className="text-2xl font-bold text-text mb-1">Welcome back</h1>
            <p className="text-sm text-text-muted">Sign in to your recruiter account</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-danger-light border border-danger/20 rounded-lg text-sm text-danger">
              <span className="mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label" htmlFor="rl-email">Work email</label>
              <input
                id="rl-email" type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com" className="input" autoComplete="email"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0" htmlFor="rl-password">Password</label>
                <Link to="#" className="text-xs text-accent hover:text-accent-hover no-underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  id="rl-password"
                  type={showPassword ? 'text' : 'password'}
                  required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="input pr-10" autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted hover:text-text-muted" tabIndex={-1}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60">
              {loading ? 'Signing in…' : <><span>Sign in</span> <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            Don't have a recruiter account?{' '}
            <Link to="/recruiter/signup" className="text-accent font-medium hover:text-accent-hover no-underline">
              Register your company
            </Link>
          </p>

          <p className="mt-3 text-center text-xs text-text-xmuted">
            Looking for a job?{' '}
            <Link to="/login" className="text-text-muted hover:text-text no-underline underline">
              Applicant sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterLogin;
