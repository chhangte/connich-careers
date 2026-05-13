import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, ChevronRight, Briefcase, Building2, TrendingUp, Users, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const DEPARTMENTS = ['All', 'Engineering', 'Education', 'Design', 'Marketing', 'Administration', 'Finance'];

const DEPT_COLORS = {
  Engineering:    { bg: '#eff6ff', text: '#1d4ed8' },
  Education:      { bg: '#f0fdf4', text: '#15803d' },
  Design:         { bg: '#fdf4ff', text: '#7e22ce' },
  Marketing:      { bg: '#fff7ed', text: '#c2410c' },
  Administration: { bg: '#f0f9ff', text: '#0369a1' },
  Finance:        { bg: '#fefce8', text: '#a16207' },
  Default:        { bg: '#f8fafc', text: '#475569' },
};

const getDeptStyle = (dept) => DEPT_COLORS[dept] || DEPT_COLORS.Default;

/* ── Deadline badge ───────────────────────── */
const DeadlineBadge = ({ job }) => {
  if (job.hiringMode === 'ROLLING' || !job.hiringMode) {
    return (
      <span className="badge-green flex items-center gap-1">
        <CheckCircle2 size={11} /> Actively hiring
      </span>
    );
  }
  if (job.hiringMode === 'DEADLINE' && job.lastDateToApply) {
    const deadline = new Date(job.lastDateToApply);
    const daysLeft = Math.ceil((deadline - Date.now()) / 86400000);
    if (daysLeft < 0) {
      return <span className="badge-red flex items-center gap-1"><AlertCircle size={11} /> Closed</span>;
    }
    if (daysLeft === 0) {
      return <span className="badge-red flex items-center gap-1"><AlertCircle size={11} /> Closes today</span>;
    }
    if (daysLeft <= 7) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600">
          <Calendar size={11} /> {daysLeft}d left
        </span>
      );
    }
    return (
      <span className="badge-yellow flex items-center gap-1">
        <Calendar size={11} />
        Apply by {deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
      </span>
    );
  }
  return null;
};

/* ── Job Card ─────────────────────────────── */
const JobCard = ({ job }) => {
  const style = getDeptStyle(job.department);
  const company = job.postedBy?.company;
  const companyName = company?.name || 'Connich';
  const logoUrl = company?.logoUrl;
  const initials = companyName.slice(0, 2).toUpperCase();
  const timeAgo = job.createdAt
    ? Math.floor((Date.now() - new Date(job.createdAt)) / 86400000) + 'd ago'
    : 'Recently';

  return (
    <Link to={`/jobs/${job._id}`} className="no-underline block animate-fade-up">
      <div className="card-hover p-5 flex flex-col gap-4 group">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          {/* Company logo / initials */}
          <div className="w-10 h-10 rounded-lg border border-border bg-surface-2 flex items-center justify-center shrink-0 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="w-full h-full object-contain p-1" />
            ) : (
              <span
                className="text-sm font-bold"
                style={{ color: style.text }}
              >
                {initials}
              </span>
            )}
          </div>
          <DeadlineBadge job={job} />
        </div>

        {/* Title & company */}
        <div>
          <h3 className="font-semibold text-text text-base leading-snug group-hover:text-accent transition-colors mb-1">
            {job.title}
          </h3>
          <Link
            to={`/company/${job.postedBy?._id}`}
            className="text-sm text-text-muted flex items-center gap-1.5 hover:text-accent no-underline w-fit"
            onClick={e => e.stopPropagation()}
          >
            <Building2 size={13} /> {companyName}
          </Link>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-auto pt-3 border-t border-border">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {job.location}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1 font-medium text-text-2">
              ₹{job.salary}
            </span>
          )}
          {job.department && (
            <span className="badge text-xs" style={{ background: style.bg, color: style.text }}>
              {job.department}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Clock size={12} /> {timeAgo}
          </span>
        </div>
      </div>
    </Link>
  );
};

const SkeletonCard = () => (
  <div className="card p-5 space-y-4 animate-pulse">
    <div className="flex justify-between">
      <div className="w-10 h-10 bg-surface-3 rounded-lg" />
      <div className="w-20 h-5 bg-surface-3 rounded-full" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-surface-3 rounded w-3/4" />
      <div className="h-3 bg-surface-3 rounded w-1/2" />
    </div>
    <div className="pt-3 border-t border-border flex gap-3">
      <div className="h-3 bg-surface-3 rounded w-20" />
      <div className="h-3 bg-surface-3 rounded w-16 ml-auto" />
    </div>
  </div>
);

const StatCard = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-4 p-5 card">
    <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
      <Icon size={18} className="text-accent" />
    </div>
    <div>
      <p className="text-xl font-bold text-text leading-none mb-0.5">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  </div>
);

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeDept, setActiveDept] = useState('All');
  const [stats, setStats] = useState({ jobsCount: 0, companiesCount: 0, candidatesCount: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobsAndStats = async () => {
      try {
        const [jobsRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/jobs`),
          axios.get(`${API_BASE_URL}/stats`)
        ]);
        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
        setStats(statsRes.data || { jobsCount: 0, companiesCount: 0, candidatesCount: 0 });
      } catch (err) {
        console.error('Error fetching data:', err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobsAndStats();
  }, []);

  const filtered = (Array.isArray(jobs) ? jobs : []).filter((j) => {
    const matchesDept = activeDept === 'All' || j.department === activeDept;
    const companyName = j.postedBy?.company?.name || '';
    const matchesSearch =
      !search ||
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase()) ||
      j.department?.toLowerCase().includes(search.toLowerCase()) ||
      companyName.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/browse?q=${encodeURIComponent(search.trim())}`);
    } else {
      navigate(`/browse`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 bg-white border-b border-border">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 badge-blue text-xs font-medium mb-5 px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            Now hiring across 12 departments
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text tracking-tight leading-tight mb-4">
            Find your next role{' '}
            <span className="text-accent">on Connich Careers</span>
          </h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Browse open positions from companies that care. Apply in minutes, hear back faster.
          </p>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-lg mx-auto animate-fade-up-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-xmuted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, company, location, or department…"
              className="input-lg pl-11 w-full shadow-sm"
            />
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>
      </section>

      {/* Main Content Area - Just a spacer or secondary info if needed */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/browse" className="p-8 rounded-3xl bg-surface-2 border border-border hover:border-accent hover:shadow-xl transition-all no-underline group text-center">
               <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="text-accent" size={28} />
               </div>
               <h3 className="text-xl font-bold text-text mb-2">Search Jobs</h3>
               <p className="text-sm text-text-muted leading-relaxed">Discover thousands of opportunities across 12+ departments.</p>
               <div className="mt-6 text-accent font-semibold flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                  Browse Jobs <ChevronRight size={18} />
               </div>
            </Link>

            <Link to="/browse-companies" className="p-8 rounded-3xl bg-surface-2 border border-border hover:border-accent hover:shadow-xl transition-all no-underline group text-center">
               <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="text-accent" size={28} />
               </div>
               <h3 className="text-xl font-bold text-text mb-2">Explore Companies</h3>
               <p className="text-sm text-text-muted leading-relaxed">View detailed profiles of companies that are actively hiring.</p>
               <div className="mt-6 text-accent font-semibold flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                  Browse Companies <ChevronRight size={18} />
               </div>
            </Link>

            <Link to="/signup" className="p-8 rounded-3xl bg-accent text-white hover:shadow-xl transition-all no-underline group text-center">
               <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="text-white" size={28} />
               </div>
               <h3 className="text-xl font-bold mb-2">Join as Candidate</h3>
               <p className="text-white/80 text-sm leading-relaxed">Create a profile to track your applications and message recruiters.</p>
               <div className="mt-6 font-semibold flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                  Get Started <ChevronRight size={18} />
               </div>
            </Link>
         </div>
      </div>
    </div>
  );
};

export default Home;
