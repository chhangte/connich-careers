import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Clock, CheckCircle2, Building2, ExternalLink, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const DEPT_COLORS = {
  Engineering:     { bg: '#eff6ff', text: '#1d4ed8' },
  Education:       { bg: '#f0fdf4', text: '#15803d' },
  Design:          { bg: '#fdf4ff', text: '#7e22ce' },
  Marketing:       { bg: '#fff7ed', text: '#c2410c' },
  Administration:  { bg: '#f0f9ff', text: '#0369a1' },
  Finance:         { bg: '#fefce8', text: '#a16207' },
  Default:         { bg: '#f8fafc', text: '#475569' },
};
const getDeptStyle = (dept) => DEPT_COLORS[dept] || DEPT_COLORS.Default;

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Read auth state directly so this page doesn't need a prop
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  const handleApply = () => {
    if (user) {
      navigate(`/apply/${id}`);
    } else {
      navigate(`/signup?redirect=/apply/${id}`);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-semibold text-text mb-2">Job not found</h2>
        <p className="text-sm text-text-muted mb-4">This listing may have been removed or expired.</p>
        <Link to="/" className="btn-primary no-underline">Browse all jobs</Link>
      </div>
    </div>
  );

  const style = getDeptStyle(job.department);
  const timeAgo = job.createdAt
    ? Math.floor((Date.now() - new Date(job.createdAt)) / 86400000) + ' days ago'
    : 'Recently';

  const company = job.postedBy?.company || {};
  const companyName = company.name || 'Connich';
  const logoUrl = company.logoUrl;
  const initials = companyName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-white pt-14">
      {/* Breadcrumb bar */}
      <div className="border-b border-border bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-text-muted">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 hover:text-text transition-colors">
            <ArrowLeft size={15} /> All jobs
          </button>
          <span>/</span>
          <span className="text-text truncate">{job.title}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* ── Left: Main Content ── */}
          <div className="lg:col-span-2 animate-fade-up">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl border border-border bg-surface-2 flex items-center justify-center shrink-0 overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt={companyName} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="font-bold text-sm" style={{ color: style.text }}>
                      {initials}
                    </span>
                  )}
                </div>
                <div>
                  <Link to={`/company/${job.postedBy?._id}`} className="text-sm text-text-muted flex items-center gap-1.5 hover:text-accent no-underline w-fit">
                    <Building2 size={13} /> {companyName}
                  </Link>
                  <span className="badge text-xs" style={{ background: style.bg, color: style.text }}>
                    {job.department || 'General'}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-text mb-4">{job.title}</h1>

              <div className="flex flex-wrap gap-3">
                {job.location && (
                  <span className="badge-gray flex items-center gap-1.5">
                    <MapPin size={12} /> {job.location}
                  </span>
                )}
                {job.salary && (
                  <span className="badge-blue flex items-center gap-1.5">
                    <Briefcase size={12} /> ₹{job.salary}
                  </span>
                )}
                <span className="badge-gray flex items-center gap-1.5">
                  <Clock size={12} /> Posted {timeAgo}
                </span>
              </div>
            </div>

            <div className="divider" />

            {/* Description */}
            {job.description && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-text mb-3">About this role</h2>
                <p className="text-text-2 leading-relaxed text-sm">{job.description}</p>
              </section>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-text mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-2">
                      <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* About company */}
            <section className="p-5 rounded-xl bg-surface-2 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg border border-border bg-white flex items-center justify-center shrink-0 overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt={companyName} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Briefcase size={16} className="text-text-muted" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm text-text">{companyName}</p>
                  {company.industry && <p className="text-xs text-text-muted">{company.industry}</p>}
                </div>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                {company.about || `${companyName} is hiring for the ${job.title} position.`}
              </p>
              <div className="flex items-center gap-4 mt-3">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:text-accent-hover flex items-center gap-1 no-underline font-medium">
                    Visit Website <ExternalLink size={11} />
                  </a>
                )}
                <Link to={`/company/${job.postedBy?._id}`} className="text-xs text-accent hover:text-accent-hover flex items-center gap-1 no-underline font-medium">
                  View full profile <ArrowLeft size={11} className="rotate-180" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── Right: Apply Panel ── */}
          <div className="animate-fade-up-1">
            <div className="card p-6 sticky top-20">
              <h3 className="font-semibold text-text mb-1">Ready to apply?</h3>
              <p className="text-sm text-text-muted mb-5">
                Submit your application in under 2 minutes. We review every submission.
              </p>

              {/* Key Dates Panel */}
              <div className="bg-surface-2 rounded-lg p-4 mb-5 border border-border">
                <p className="text-xs font-semibold text-text-xmuted uppercase tracking-wider mb-3">Recruitment Timeline</p>
                <div className="space-y-3">
                  {job.hiringMode === 'DEADLINE' && job.lastDateToApply ? (
                    <div className="flex items-start gap-3">
                      <AlertCircle size={15} className={new Date(job.lastDateToApply) < new Date() ? 'text-danger' : 'text-warning'} />
                      <div>
                        <p className="text-xs font-medium text-text">Last Date to Apply</p>
                        <p className="text-xs text-text-muted">{new Date(job.lastDateToApply).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={15} className="text-success" />
                      <div>
                        <p className="text-xs font-medium text-text">Actively Hiring</p>
                        <p className="text-xs text-text-muted">Reviewing applications as they arrive</p>
                      </div>
                    </div>
                  )}

                  {job.interviewDate && (
                    <div className="flex items-start gap-3">
                      <Calendar size={15} className="text-text-muted" />
                      <div>
                        <p className="text-xs font-medium text-text">Interview Date</p>
                        <p className="text-xs text-text-muted">{new Date(job.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  )}

                  {job.interviewVenue && (
                    <div className="flex items-start gap-3">
                      <MapPin size={15} className="text-text-muted" />
                      <div>
                        <p className="text-xs font-medium text-text">Interview Venue</p>
                        <p className="text-xs text-text-muted">{job.interviewVenue}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {job.salary && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Compensation</span>
                    <span className="font-semibold text-text">₹{job.salary}</span>
                  </div>
                )}
                {job.location && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Location</span>
                    <span className="font-medium text-text-2">{job.location}</span>
                  </div>
                )}
                {job.department && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Department</span>
                    <span
                      className="badge text-xs"
                      style={{ background: style.bg, color: style.text }}
                    >
                      {job.department}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-5">
                <button
                  onClick={handleApply}
                  className="btn-primary-lg w-full justify-center"
                >
                  Apply for this role
                </button>
                <p className="text-xs text-center text-text-xmuted mt-3">
                  {user ? 'Takes less than 2 minutes' : 'Sign in to apply · Free account'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
