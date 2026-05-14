import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Briefcase, Clock, CheckCircle2, Building2,
  Globe, Calendar, AlertCircle, ExternalLink, ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { useCompany } from '../context/CompanyContext';
import ApplyGateModal from '../components/ApplyGateModal';

const DEPT_COLORS = {
  Engineering: { bg: '#eff6ff', text: '#1d4ed8' },
  Education: { bg: '#f0fdf4', text: '#15803d' },
  Design: { bg: '#fdf4ff', text: '#7e22ce' },
  Marketing: { bg: '#fff7ed', text: '#c2410c' },
  Administration: { bg: '#f0f9ff', text: '#0369a1' },
  Finance: { bg: '#fefce8', text: '#a16207' },
  Default: { bg: '#f8fafc', text: '#475569' },
};
const getDeptStyle = d => DEPT_COLORS[d] || DEPT_COLORS.Default;

const CompanyJobDetail = () => {
  const { slug, jobId } = useParams();
  const navigate = useNavigate();
  const { company } = useCompany();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Auth state (for apply button CTA)
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  useEffect(() => {
    if (!company) return;

    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/companies/${slug}/jobs/${jobId}`);
        setJob(res.data.job);
        // Update SEO title
        document.title = `${res.data.job.title} at ${company.name} | Connich Careers`;
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
        else console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();

    return () => { document.title = `${company.name} Careers | Connich`; };
  }, [company, slug, jobId]);

  const handleApply = () => {
    if (user) {
      navigate(`/${slug}/apply/${jobId}`);
    } else {
      setIsApplyModalOpen(true);
    }
  };

  if (!company) return null;

  const primary = company.brandPrimary || '#2563eb';
  const accent = company.brandAccent || '#1e3a5f';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-14">
      <div className="w-8 h-8 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: primary }} />
    </div>
  );

  if (notFound || !job) return (
    <div className="min-h-screen flex items-center justify-center pt-14 px-4">
      <div className="text-center">
        <h2 className="font-bold text-gray-900 mb-2">Position not found</h2>
        <p className="text-sm text-gray-400 mb-5">This role may have been filled or removed.</p>
        <Link
          to={`/${slug}/jobs`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl no-underline hover:opacity-90 transition-all"
          style={{ background: primary }}
        >
          View all open positions
        </Link>
      </div>
    </div>
  );

  const style = getDeptStyle(job.department);
  const timeAgo = job.createdAt
    ? Math.floor((Date.now() - new Date(job.createdAt)) / 86400000)
    : 0;
  const isDeadline = job.hiringMode === 'DEADLINE' && job.lastDateToApply;
  const isExpired = isDeadline && new Date(job.lastDateToApply) < new Date();

  return (
    <div className="min-h-screen bg-white pt-14">
      {/* ── Breadcrumb ─────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-gray-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-400">
          <Link
            to={`/${slug}`}
            className="hover:text-gray-600 transition-colors no-underline flex items-center gap-1"
          >
            {company.name}
          </Link>
          <ChevronRight size={13} />
          <Link
            to={`/${slug}/jobs`}
            className="hover:text-gray-600 transition-colors no-underline"
          >
            Open Positions
          </Link>
          <ChevronRight size={13} />
          <span className="text-gray-600 truncate max-w-[200px]">{job.title}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* ── Left: Job Content ─────────────────────── */}
          <div className="lg:col-span-2 animate-fade-up">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                {/* Company logo */}
                <div
                  className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ borderColor: `${primary}20`, background: `${primary}08` }}
                >
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="font-bold text-sm" style={{ color: primary }}>
                      {company.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <Link
                    to={`/${slug}`}
                    className="text-sm flex items-center gap-1.5 no-underline w-fit hover:underline"
                    style={{ color: primary }}
                  >
                    <Building2 size={13} /> {company.name}
                  </Link>
                  <span
                    className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5"
                    style={{ background: style.bg, color: style.text }}
                  >
                    {job.department || 'General'}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>

              <div className="flex flex-wrap gap-3">
                {job.location && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    <MapPin size={13} /> {job.location}
                  </span>
                )}
                {job.salary && (
                  <span className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full"
                    style={{ background: `${primary}10`, color: primary }}>
                    <Briefcase size={13} /> {job.salary}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                  <Clock size={13} /> Posted {timeAgo === 0 ? 'today' : `${timeAgo}d ago`}
                </span>
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Description */}
            {job.description && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About this role</h2>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{job.description}</p>
              </section>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: primary }} />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* About company */}
            <section
              className="p-5 rounded-2xl border"
              style={{ borderColor: `${primary}15`, background: `${primary}04` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ borderColor: `${primary}20`, background: `white` }}
                >
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Building2 size={16} style={{ color: primary }} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{company.name}</p>
                  {company.industry && <p className="text-xs text-gray-400">{company.industry}</p>}
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {company.about || `${company.name} is hiring for the ${job.title} position.`}
              </p>
              <div className="flex items-center gap-4 mt-3">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium flex items-center gap-1 no-underline hover:underline"
                    style={{ color: primary }}
                  >
                    Visit Website <ExternalLink size={11} />
                  </a>
                )}
                <Link
                  to={`/${slug}`}
                  className="text-xs font-medium flex items-center gap-1 no-underline hover:underline"
                  style={{ color: primary }}
                >
                  View company profile <ChevronRight size={11} />
                </Link>
              </div>
            </section>
          </div>

          {/* ── Right: Apply Panel ───────────────────── */}
          <div className="animate-fade-up-1">
            <div className="rounded-2xl border border-gray-100 p-6 sticky top-20 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-1">Ready to apply?</h3>
              <p className="text-sm text-gray-400 mb-5">
                Submit your application in under 2 minutes.
              </p>

              {/* Recruitment Timeline */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  Recruitment Timeline
                </p>
                <div className="space-y-3">
                  {isDeadline ? (
                    <div className="flex items-start gap-3">
                      <AlertCircle size={15} className={isExpired ? 'text-red-400' : 'text-amber-400'} />
                      <div>
                        <p className="text-xs font-medium text-gray-700">Last date to apply</p>
                        <p className="text-xs text-gray-400">
                          {new Date(job.lastDateToApply).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={15} className="text-green-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-700">Actively Hiring</p>
                        <p className="text-xs text-gray-400">Rolling applications — apply any time</p>
                      </div>
                    </div>
                  )}

                  {job.interviewDate && (
                    <div className="flex items-start gap-3">
                      <Calendar size={15} className="text-gray-300" />
                      <div>
                        <p className="text-xs font-medium text-gray-700">Interview Date</p>
                        <p className="text-xs text-gray-400">
                          {new Date(job.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )}

                  {job.interviewVenue && (
                    <div className="flex items-start gap-3">
                      <MapPin size={15} className="text-gray-300" />
                      <div>
                        <p className="text-xs font-medium text-gray-700">Interview Venue</p>
                        <p className="text-xs text-gray-400">{job.interviewVenue}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Key facts */}
              <div className="space-y-2 mb-5">
                {job.salary && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Compensation</span>
                    <span className="font-semibold text-gray-700">{job.salary}</span>
                  </div>
                )}
                {job.location && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Location</span>
                    <span className="font-medium text-gray-600">{job.location}</span>
                  </div>
                )}
                {job.department && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Department</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: style.bg, color: style.text }}>
                      {job.department}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-5">
                {isExpired ? (
                  <div className="w-full text-center py-3 rounded-xl bg-gray-100 text-sm text-gray-400 font-medium">
                    Applications closed
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    className="btn-primary w-full py-2.5 rounded-xl text-sm font-bold shadow-sm"
                    style={{ backgroundColor: primary }}
                  >
                    Apply for this role
                  </button>
                )}
                <p className="text-xs text-center text-gray-300 mt-3">
                  {user ? 'Your profile is pre-filled' : 'Account creation is optional'}
                </p>
              </div>

              {/* Back to jobs */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to={`/${slug}/jobs`}
                  className="text-xs text-gray-400 hover:text-gray-600 no-underline flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft size={11} /> View all open positions at {company.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ApplyGateModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobId={jobId}
        company={company}
      />
    </div>
  );
};

export default CompanyJobDetail;
