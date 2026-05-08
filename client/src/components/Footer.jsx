import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface-2 border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 no-underline text-text hover:text-text">
              <img src="/logo.png" alt="Connich Careers" className="w-8 h-8 object-contain" />
              <span className="font-semibold text-sm">Connich Careers</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Find your next opportunity at Connich. Empowering educators and professionals worldwide.
            </p>
          </div>

          {/* Company links */}
          <div>
            <p className="section-label mb-3">Company</p>
            <ul className="space-y-2">
              {['About', 'Blog', 'Press'].map(l => (
                <li key={l}><a href="#" className="text-sm text-text-muted hover:text-text no-underline">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Candidates links */}
          <div>
            <p className="section-label mb-3">Candidates</p>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-text-muted hover:text-text no-underline">Browse Jobs</Link></li>
              <li><Link to="/dashboard" className="text-sm text-text-muted hover:text-text no-underline">Your Applications</Link></li>
              <li><a href="#" className="text-sm text-text-muted hover:text-text no-underline">Career Resources</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="section-label mb-3">Legal</p>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                <li key={l}><a href="#" className="text-sm text-text-muted hover:text-text no-underline">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recruiter CTA banner */}
        <div className="rounded-xl border border-border bg-white p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' }}>
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Are you an employer?</p>
              <p className="text-xs text-text-muted">Post jobs, manage applications, and find great talent.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/recruiter/login"
              className="text-sm font-medium text-text-muted hover:text-text no-underline transition-colors"
            >
              Recruiter sign in
            </Link>
            <Link
              to="/recruiter/signup"
              className="btn-primary text-sm py-2 px-4 no-underline flex items-center gap-1.5"
            >
              Post a job <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-xmuted">© {new Date().getFullYear()} Connich. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {['Twitter', 'LinkedIn', 'GitHub'].map((name) => (
              <a key={name} href="#" className="text-xs text-text-xmuted hover:text-text no-underline transition-colors">
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
