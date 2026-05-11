import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Clock, Briefcase, Filter } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const DEPARTMENTS = ['All', 'Engineering', 'Education', 'Design', 'Marketing', 'Administration', 'Finance'];

// Format time ago (same as Home)
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

const BrowseJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [activeDept, setActiveDept] = useState('All');
  const [sortBy, setSortBy] = useState('latest'); // latest, oldest, salary-high, salary-low

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/jobs`);
        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setSearchParams({ q: search.trim() });
    } else {
      setSearchParams({});
    }
  };

  const currentSearch = searchParams.get('q') || '';

  const filteredAndSortedJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];
    
    let result = jobs.filter((j) => {
      const matchesDept = activeDept === 'All' || j.department === activeDept;
      const companyName = j.postedBy?.company?.name || '';
      const matchesSearch =
        !currentSearch ||
        j.title?.toLowerCase().includes(currentSearch.toLowerCase()) ||
        j.location?.toLowerCase().includes(currentSearch.toLowerCase()) ||
        j.department?.toLowerCase().includes(currentSearch.toLowerCase()) ||
        companyName.toLowerCase().includes(currentSearch.toLowerCase());
      return matchesDept && matchesSearch;
    });

    result.sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === 'salary-high') {
        const salaryA = parseInt(String(a.salary || '').replace(/[^0-9]/g, '') || '0', 10);
        const salaryB = parseInt(String(b.salary || '').replace(/[^0-9]/g, '') || '0', 10);
        return salaryB - salaryA;
      }
      if (sortBy === 'salary-low') {
        const salaryA = parseInt(String(a.salary || '').replace(/[^0-9]/g, '') || '0', 10);
        const salaryB = parseInt(String(b.salary || '').replace(/[^0-9]/g, '') || '0', 10);
        return salaryA - salaryB;
      }
      return 0;
    });

    return result;
  }, [jobs, activeDept, currentSearch, sortBy]);

  return (
    <div className="min-h-screen bg-surface-2 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-text mb-8 animate-fade-up">Browse Jobs</h1>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0 bg-white p-5 rounded-xl border border-border sticky top-24 animate-fade-up-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text mb-4 flex items-center gap-2">
              <Filter size={16} /> Filters
            </h2>
            
            <form onSubmit={handleSearchSubmit} className="mb-6">
              <label className="block text-xs font-medium text-text-muted mb-2">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-xmuted" />
                <input 
                  type="text" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Job title, company..." 
                  className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:border-accent outline-none transition-colors"
                />
              </div>
            </form>

            <div className="mb-6">
              <label className="block text-xs font-medium text-text-muted mb-2">Department</label>
              <div className="space-y-1">
                {DEPARTMENTS.map(dept => (
                  <button
                    key={dept}
                    onClick={() => setActiveDept(dept)}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${activeDept === dept ? 'bg-accent-light text-accent font-medium' : 'text-text-muted hover:bg-surface-3'}`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-2">Sort By</label>
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:border-accent outline-none transition-colors bg-white"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="salary-high">Salary (High to Low)</option>
                <option value="salary-low">Salary (Low to High)</option>
              </select>
            </div>
          </div>

          {/* Job List */}
          <div className="flex-1 w-full space-y-4 animate-fade-up-2">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="bg-white p-5 rounded-xl border border-border animate-pulse h-32" />
              ))
            ) : filteredAndSortedJobs.length > 0 ? (
              filteredAndSortedJobs.map(job => (
                <Link key={job._id} to={`/jobs/${job._id}`} className="block bg-white p-5 rounded-xl border border-border hover:border-accent hover:shadow-sm transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-text group-hover:text-accent transition-colors">{job.title}</h3>
                      <p className="text-sm text-text-muted">{job.postedBy?.company?.name || 'Company Name'}</p>
                    </div>
                    {job.postedBy?.company?.logo && (
                      <img src={job.postedBy.company.logo} alt="Logo" className="w-10 h-10 rounded object-cover border border-border/50" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                    {job.location && (
                      <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                    )}
                    {job.salary && (
                      <span className="flex items-center gap-1 font-medium text-text-2">₹{job.salary}</span>
                    )}
                    {job.department && (
                      <span className="bg-surface-3 px-2 py-1 rounded-md text-text">{job.department}</span>
                    )}
                    <span className="flex items-center gap-1 ml-auto"><Clock size={14} /> {timeAgo(job.createdAt)}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white p-10 rounded-xl border border-border text-center">
                <Briefcase size={32} className="mx-auto text-border-2 mb-3" />
                <h3 className="text-lg font-medium text-text mb-1">No jobs found</h3>
                <p className="text-text-muted">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseJobs;
