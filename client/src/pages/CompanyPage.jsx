import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, MapPin, Briefcase, Clock, Building2, ExternalLink, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const DEPT_COLORS = {
  Engineering:    { bg: '#eff6ff', text: '#1d4ed8' },
  Education:      { bg: '#f0fdf4', text: '#15803d' },
  Design:         { bg: '#fdf4ff', text: '#7e22ce' },
  Marketing:      { bg: '#fff7ed', text: '#c2410c' },
  Administration: { bg: '#f0f9ff', text: '#0369a1' },
  Finance:        { bg: '#fefce8', text: '#a16207' },
  Default:        { bg: '#f8fafc', text: '#475569' },
};
const getDeptStyle = d => DEPT_COLORS[d] || DEPT_COLORS.Default;

const CompanyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/company/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-semibold text-text mb-2">Company not found</h2>
        <Link to="/" className="btn-primary no-underline">Browse all jobs</Link>
      </div>
    </div>
  );

  const { recruiter, jobs } = data;
  const co = recruiter?.company || {};

  const initials = (co.name || recruiter.name || 'CO').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-white pt-14">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-text-muted">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 hover:text-text transition-colors">
            <ArrowLeft size={15} /> All companies
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center animate-fade-up">
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl border border-border bg-surface-2 flex items-center justify-center shrink-0 overflow-hidden">
            {co.logoUrl ? (
              <img src={co.logoUrl} alt={co.name} className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-2xl font-bold text-text-muted">{initials}</span>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text mb-1">{co.name || recruiter.name}</h1>
            {co.tagline && <p className="text-text-muted text-sm mb-3">{co.tagline}</p>}

            <div className="flex flex-wrap gap-3">
              {co.industry && (
                <span className="badge-gray flex items-center gap-1.5">
                  <Briefcase size={12} /> {co.industry}
                </span>
              )}
              {co.location && (
                <span className="badge-gray flex items-center gap-1.5">
                  <MapPin size={12} /> {co.location}
                </span>
              )}
              {co.website && (
                <a href={co.website} target="_blank" rel="noopener noreferrer"
                  className="badge-blue flex items-center gap-1.5 no-underline hover:opacity-80">
                  <Globe size={12} /> Website <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <p className="text-2xl font-bold text-text">{jobs.length}</p>
            <p className="text-xs text-text-muted">Open position{jobs.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* About */}
          <div className="lg:col-span-1 animate-fade-up">
            <div className="card p-6 sticky top-20">
              <h2 className="text-sm font-semibold text-text mb-4">About {co.name || 'this company'}</h2>
              {co.about ? (
                <p className="text-sm text-text-muted leading-relaxed">{co.about}</p>
              ) : (
                <p className="text-sm text-text-xmuted italic">No description provided.</p>
              )}

              <div className="mt-5 space-y-3 pt-4 border-t border-border">
                {co.industry && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase size={14} className="text-text-xmuted shrink-0" />
                    <span className="text-text-muted">{co.industry}</span>
                  </div>
                )}
                {co.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-text-xmuted shrink-0" />
                    <span className="text-text-muted">{co.location}</span>
                  </div>
                )}
                {co.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe size={14} className="text-text-xmuted shrink-0" />
                    <a href={co.website} target="_blank" rel="noopener noreferrer"
                      className="text-accent hover:text-accent-hover no-underline truncate">
                      {co.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job listings */}
          <div className="lg:col-span-2 animate-fade-up-1">
            <h2 className="text-lg font-semibold text-text mb-5">
              Open Positions <span className="text-text-muted font-normal text-sm ml-1">({jobs.length})</span>
            </h2>

            {jobs.length === 0 ? (
              <div className="card p-10 text-center">
                <Building2 size={32} className="text-text-xmuted mx-auto mb-3" />
                <p className="text-text-muted text-sm">No open positions right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => {
                  const style = getDeptStyle(job.department);
                  const isDeadline = job.hiringMode === 'DEADLINE' && job.lastDateToApply;
                  const deadline = isDeadline ? new Date(job.lastDateToApply) : null;
                  const daysLeft = deadline ? Math.ceil((deadline - Date.now()) / 86400000) : null;
                  const isExpired = daysLeft !== null && daysLeft < 0;
                  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

                  return (
                    <Link key={job._id} to={`/jobs/${job._id}`} className="no-underline block">
                      <div className="card-hover p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                            style={{ background: style.bg, color: style.text }}>
                            {(job.department || 'CO').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-text text-sm group-hover:text-accent transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-text-muted">
                              {job.location && <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>}
                              {job.department && (
                                <span className="badge text-xs" style={{ background: style.bg, color: style.text }}>
                                  {job.department}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {isDeadline && !isExpired ? (
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              isUrgent ? 'bg-danger-light text-danger' : 'bg-warning-light text-warning'
                            }`}>
                              {daysLeft === 0 ? 'Closes today' : `${daysLeft}d left`}
                            </span>
                          ) : !isDeadline ? (
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-success-light text-success flex items-center gap-1">
                              <CheckCircle2 size={11} /> Actively hiring
                            </span>
                          ) : null}
                          <span className="text-xs text-accent font-medium group-hover:underline">View →</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
