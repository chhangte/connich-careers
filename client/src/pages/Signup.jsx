import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Briefcase, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const Signup = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, role: 'APPLICANT' });
      const { user, token } = res.data;
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      navigate(redirectTo || '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden md:flex md:w-[45%] bg-surface-2 border-r border-border flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 no-underline text-text hover:text-text">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Briefcase size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold">Connich Careers</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-text leading-snug mb-4">
            Join thousands of professionals building their careers at Connich.
          </h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Create your free account and get access to hundreds of curated opportunities across education, tech, administration and more.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex -space-x-2 mb-3">
            {['AK', 'JD', 'MB', 'SR', 'TL'].map((initials, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                style={{ background: ['#2563eb', '#7c3aed', '#db2777', '#16a34a', '#d97706'][i] }}
              >
                {initials}
              </div>
            ))}
          </div>
          <p className="text-xs text-text-muted">
            <span className="font-semibold text-text">1,200+ candidates</span> already on the platform
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="md:hidden mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Briefcase size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold">Connich Careers</span>
        </div>

        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text mb-2">Create your account</h1>
            <p className="text-sm text-text-muted">Create an account to apply for jobs and track your applications.</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-danger-light border border-danger/20 rounded-lg text-sm text-danger">
              <span className="mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="label" htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="input"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="label" htmlFor="signup-email">Email address</label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="signup-password">Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="input pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted hover:text-text-muted"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60"
            >
              {loading ? 'Creating account…' : (
                <>Create account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/*<div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-text-xmuted">or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="btn-outline justify-center gap-2 text-sm">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Google
            </button>
            <button className="btn-outline justify-center gap-2 text-sm">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" /></svg>
              Facebook
            </button>
          </div> */}

          <p className="text-xs text-text-xmuted text-center mt-5 leading-relaxed">
            By creating an account you agree to our{' '}
            <a href="#" className="underline text-text-muted hover:text-text">Terms of Service</a> and{' '}
            <a href="#" className="underline text-text-muted hover:text-text">Privacy Policy</a>.
          </p>

          <div className="mt-10 pt-8 border-t border-border">
            <p className="text-center text-sm text-text-muted mb-4">
              Already have an account?
            </p>
            <Link 
              to={`/login${redirectTo ? `?redirect=${redirectTo}` : ''}`} 
              className="btn-outline w-full justify-center no-underline text-text hover:text-text"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
