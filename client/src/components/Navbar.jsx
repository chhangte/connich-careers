import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    if (logout) logout();
    else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    navigate('/login');
    setMobileOpen(false);
  };

  // Don't show navbar on auth pages
  const authRoutes = ['/login', '/signup', '/recruiter/login', '/recruiter/signup'];
  if (authRoutes.includes(location.pathname)) return null;

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const navLinks = [];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center h-14">

        {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline text-text hover:text-text">
            <img src="/logo.png" alt="Connich Careers" className="w-8 h-8 object-contain" />
            <div className="flex items-baseline">
              <span className="font-semibold">Connich</span>
              <span className="font-normal ml-0.5">Recruit</span>
            </div>
          </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors no-underline ${
                isActive(path)
                  ? 'bg-accent-light text-accent'
                  : 'text-text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {user ? (
            <>
              <Link
                to={user.role === 'RECRUITER' ? '/recruiter' : user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className={`px-3 py-1.5 rounded-md text-sm font-medium no-underline flex items-center gap-1.5 transition-colors ${
                  isActive('/dashboard') || isActive('/recruiter') || isActive('/admin')
                    ? 'bg-accent-light text-accent'
                    : 'text-text-muted hover:text-text hover:bg-surface-2'
                }`}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn-ghost text-sm flex items-center gap-1.5"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/browse-companies" className="btn-ghost text-sm no-underline">Companies</Link>
              <Link to="/browse" className="btn-ghost text-sm no-underline">Jobs</Link>
              <Link to="/login" className="btn-ghost text-sm no-underline ml-2">Applicant login</Link>
              <Link to="/recruiter/login" className="btn-ghost text-sm no-underline ml-2">Recruiter login</Link>
              <Link to="/signup" className="btn-primary text-sm no-underline">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden ml-auto p-2 rounded-md text-text-muted hover:bg-surface-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white animate-fade-in">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium no-underline ${
                  isActive(path) ? 'bg-accent-light text-accent' : 'text-text hover:bg-surface-2'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-border my-1 pt-2 flex flex-col gap-1">
              {user ? (
                <>
                  <Link
                    to={user.role === 'RECRUITER' ? '/recruiter' : user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-md text-sm font-medium text-text hover:bg-surface-2 no-underline flex items-center gap-2"
                  >
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm text-left text-danger hover:bg-danger-light">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-sm font-medium text-text hover:bg-surface-2 no-underline">Applicant login</Link>
                  <Link to="/recruiter/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-sm font-medium text-text hover:bg-surface-2 no-underline">Recruiter login</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-sm font-medium bg-accent text-white no-underline">Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
