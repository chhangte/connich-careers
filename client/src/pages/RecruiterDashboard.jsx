import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Users, FileText, Printer, MoreVertical,
  Search, ChevronDown, X, Loader2, CheckCircle2,
  AlertCircle, ChevronRight, Trash2, Mail
} from 'lucide-react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const API = '/api';

const STATUS_MAP = {
  SHORTLISTED: { label: 'Shortlisted',  cls: 'badge-green'  },
  PENDING:     { label: 'Under review', cls: 'badge-yellow' },
  REJECTED:    { label: 'Not selected', cls: 'badge-red'    },
  JOINED:      { label: 'Joined',       cls: 'badge-blue'   },
};

const DEPARTMENTS = ['Education', 'Engineering', 'Administration', 'Design', 'Marketing', 'Finance', 'HR', 'Other'];

const KNOWN_APPLICATION_FIELDS = [
  { id: 'phone', label: 'Phone Number' },
  { id: 'dob', label: 'Date of Birth' },
  { id: 'address', label: 'Address' },
  { id: 'maritalStatus', label: 'Marital Status' },
  { id: 'familyInfo', label: 'Family Information' },
  { id: 'educationHistory', label: 'Education Background' },
  { id: 'experience', label: 'Work Experience' },
  { id: 'reference', label: 'Professional Reference' },
  { id: 'languages', label: 'Languages' },
  { id: 'sports', label: 'Sports Interest' },
  { id: 'music', label: 'Music Instruments' },
  { id: 'arts', label: 'Fine/Performing Arts' },
];

/* ── New Job Modal ──────────────────────────── */
const NewJobModal = ({ onClose, onCreated, recruiterId }) => {
  const [form, setForm] = useState({
    title: '', department: '', location: '', salary: '', description: '', requirements: '',
    hiringMode: 'ROLLING',
    lastDateToApply: '',
    interviewDate: '',
    interviewVenue: '',
    applicationFields: KNOWN_APPLICATION_FIELDS.map(f => f.id),
    applicationSettings: {
      collectGender: true,
      collectNationality: true,
      collectEthnicity: true,
      collectReligion: true,
      collectCategory: true,
      collectMaritalStatus: true,
      collectFamilyInfo: true,
      collectLanguages: true,
      collectSports: true,
      collectMusic: true,
      collectArts: true,
    },
    showOnHome: true,
  });
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const firstRef = useRef(null);

  useEffect(() => { firstRef.current?.focus(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements
          .split('\n')
          .map(r => r.trim())
          .filter(Boolean),
        postedBy: recruiterId,
        status: 'OPEN',
      };
      const res = await axios.post(`${API}/jobs`, payload);
      onCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing.');
    } finally {
      setSaving(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-up overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white sticky top-0 z-10">
          <div>
            <h2 className="font-semibold text-text">Post a new job listing</h2>
            <p className="text-[10px] text-text-muted">Step {step} of 2: {step === 1 ? 'Job Details' : 'Application Form Configuration'}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-md">
            <X size={18} />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto bg-surface-1">
          {step === 1 ? (
            <div className="p-6 space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-danger-light border border-danger/20 rounded-lg text-sm text-danger">
                  <AlertCircle size={15} className="shrink-0" /> {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="label" htmlFor="job-title">Job title <span className="text-danger">*</span></label>
                  <input ref={firstRef} id="job-title" name="title" required value={form.title}
                    onChange={handleChange} placeholder="e.g. Senior Software Engineer" className="input" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="job-dept">Department <span className="text-danger">*</span></label>
                    <select id="job-dept" name="department" required value={form.department}
                      onChange={handleChange} className="input">
                      <option value="">Select…</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="job-location">Location</label>
                    <input id="job-location" name="location" value={form.location}
                      onChange={handleChange} placeholder="e.g. Remote, HQ" className="input" />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="job-salary">Salary / Compensation</label>
                  <input id="job-salary" name="salary" value={form.salary}
                    onChange={handleChange} placeholder="e.g. 80k – 100k" className="input" />
                </div>

                <div>
                  <label className="label" htmlFor="job-desc">Description <span className="text-danger">*</span></label>
                  <textarea id="job-desc" name="description" required rows={4} value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the role..."
                    className="input resize-none" />
                </div>

                <div>
                  <label className="label" htmlFor="job-reqs">Requirements <span className="text-text-xmuted font-normal">(one per line)</span></label>
                  <textarea id="job-reqs" name="requirements" rows={3} value={form.requirements}
                    onChange={handleChange}
                    placeholder={"Bachelor's degree\n3+ years experience"}
                    className="input resize-none font-mono text-xs" />
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold text-text mb-4">Hiring Timeline</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label" htmlFor="job-mode">Hiring Mode</label>
                      <select id="job-mode" name="hiringMode" value={form.hiringMode}
                        onChange={handleChange} className="input">
                        <option value="ROLLING">Actively Hiring (Rolling)</option>
                        <option value="DEADLINE">Fixed Deadline</option>
                      </select>
                    </div>
                    {form.hiringMode === 'DEADLINE' && (
                      <div>
                        <label className="label" htmlFor="job-deadline">Deadline</label>
                        <input id="job-deadline" type="date" name="lastDateToApply" value={form.lastDateToApply}
                          onChange={handleChange} className="input" required />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold text-text mb-4">Visibility</h3>
                  <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border cursor-pointer hover:border-accent transition-colors">
                    <input type="checkbox" checked={form.showOnHome} onChange={(e) => setForm({ ...form, showOnHome: e.target.checked })} className="w-4 h-4 rounded text-accent" />
                    <div>
                      <p className="text-xs font-semibold">Show on home screen</p>
                      <p className="text-[10px] text-text-muted">Visible to all visitors on the landing page.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-8 bg-surface-2">
              <div className="text-center max-w-md mx-auto">
                <h3 className="text-lg font-bold text-text mb-1">Customize Application Form</h3>
                <p className="text-xs text-text-muted">Toggle the fields you want to collect from candidates. This is a preview of what they will see.</p>
              </div>

              {/* Form Preview */}
              <div className="space-y-6 max-w-lg mx-auto">
                {/* Section: Personal Info */}
                <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
                  <div className="px-4 py-3 bg-surface-1 border-b border-border flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Personal Information</span>
                    <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">Core Section</span>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Fixed fields */}
                    <div className="grid grid-cols-2 gap-4 opacity-50 grayscale-[0.5]">
                      <div className="space-y-1">
                        <div className="h-3 w-16 bg-surface-3 rounded" />
                        <div className="h-9 bg-surface-2 rounded border border-border" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-3 w-20 bg-surface-3 rounded" />
                        <div className="h-9 bg-surface-2 rounded border border-border" />
                      </div>
                    </div>

                    {/* Toggleable fields */}
                    <div className="grid grid-cols-1 gap-3 pt-2">
                      {[
                        { id: 'collectPhone', label: 'Phone Number' },
                        { id: 'collectDOB', label: 'Date of Birth' },
                        { id: 'collectGender', label: 'Gender' },
                        { id: 'collectCategory', label: 'Category' },
                        { id: 'collectNationality', label: 'Nationality' },
                        { id: 'collectEthnicity', label: 'Ethnicity' },
                        { id: 'collectReligion', label: 'Religion' },
                        { id: 'collectMaritalStatus', label: 'Marital Status' },
                        { id: 'collectAddress', label: 'Residential Address' },
                      ].map(item => {
                        const isChecked = form.applicationSettings[item.id];
                        
                        return (
                          <label key={item.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                            isChecked ? 'bg-accent/5 border-accent/20' : 'bg-surface-1 border-border/50 grayscale opacity-60'
                          }`}>
                            <div className="flex items-center gap-3">
                              <input 
                                type="checkbox" 
                                checked={isChecked} 
                                onChange={(e) => {
                                  setForm({ ...form, applicationSettings: { ...form.applicationSettings, [item.id]: e.target.checked } });
                                }}
                                className="w-4 h-4 rounded text-accent"
                              />
                              <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            <div className={`h-6 w-24 rounded border border-dashed flex items-center justify-center ${isChecked ? 'border-accent/30' : 'border-border'}`}>
                              <div className={`h-1.5 w-16 rounded-full ${isChecked ? 'bg-accent/20' : 'bg-surface-3'}`} />
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section: Family Info */}
                <div className={`bg-white rounded-xl border transition-all overflow-hidden shadow-sm ${form.applicationSettings.collectFamilyInfo ? 'border-accent/30 opacity-100' : 'border-border opacity-60 grayscale'}`}>
                   <div className="px-4 py-3 bg-surface-1 border-b border-border flex justify-between items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={form.applicationSettings.collectFamilyInfo}
                        onChange={(e) => setForm({ ...form, applicationSettings: { ...form.applicationSettings, collectFamilyInfo: e.target.checked } })}
                        className="w-4 h-4 rounded text-accent"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Family Information</span>
                    </label>
                  </div>
                  {form.applicationSettings.collectFamilyInfo && (
                    <div className="p-4 grid grid-cols-2 gap-4 animate-fade-down">
                       <div className="h-8 bg-surface-2 rounded border border-border" />
                       <div className="h-8 bg-surface-2 rounded border border-border" />
                       <div className="h-8 bg-surface-2 rounded border border-border" />
                       <div className="h-8 bg-surface-2 rounded border border-border" />
                    </div>
                  )}
                </div>

                {/* Section: Education & Experience */}
                <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
                  <div className="px-4 py-3 bg-surface-1 border-b border-border">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Education & Experience</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      { id: 'collectEducation', label: 'Education History' },
                      { id: 'collectExperience', label: 'Work Experience' },
                      { id: 'collectReference', label: 'Professional References' },
                      { id: 'collectLanguages', label: 'Languages Known' },
                    ].map(item => {
                      const isChecked = form.applicationSettings[item.id];
                      
                      return (
                        <label key={item.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                          isChecked ? 'bg-accent/5 border-accent/20' : 'bg-surface-1 border-border/50 grayscale opacity-60'
                        }`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={isChecked} 
                              onChange={(e) => {
                                setForm({ ...form, applicationSettings: { ...form.applicationSettings, [item.id]: e.target.checked } });
                              }}
                              className="w-4 h-4 rounded text-accent"
                            />
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Section: Hobbies */}
                 <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
                  <div className="px-4 py-3 bg-surface-1 border-b border-border">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Hobbies & Interests</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      { id: 'collectSports', label: 'Sports Interest', type: 'setting' },
                      { id: 'collectMusic', label: 'Music Instruments', type: 'setting' },
                      { id: 'collectArts', label: 'Performing Arts', type: 'setting' },
                    ].map(item => {
                      const isChecked = form.applicationSettings[item.id];
                      return (
                        <label key={item.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                          isChecked ? 'bg-accent/5 border-accent/20' : 'bg-surface-1 border-border/50 grayscale opacity-60'
                        }`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={isChecked} 
                              onChange={(e) => setForm({ ...form, applicationSettings: { ...form.applicationSettings, [item.id]: e.target.checked } })}
                              className="w-4 h-4 rounded text-accent"
                            />
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-white flex items-center justify-between sticky bottom-0 z-10">
          <div className="flex gap-2">
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="btn-ghost text-sm">
                Back to Details
              </button>
            )}
            <button type="button" onClick={onClose} className="btn-ghost text-sm text-danger hover:bg-danger-light">Cancel</button>
          </div>
          
          <div className="flex items-center gap-3">
            {step === 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (form.title && form.department && form.description) setStep(2);
                  else setError('Please fill in all required fields marked with *');
                }}
                className="btn-primary"
              >
                Next: Form Configuration <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="btn-primary min-w-[140px]"
              >
                {saving ? <><Loader2 size={15} className="animate-spin" /> Posting…</> : <><CheckCircle2 size={15} /> Post Job Listing</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Status Dropdown ────────────────────────── */
const StatusDropdown = ({ appId, current, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options = ['PENDING', 'SHORTLISTED', 'REJECTED', 'JOINED'];
  const current_s = STATUS_MAP[current] || STATUS_MAP.PENDING;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`${current_s.cls} cursor-pointer flex items-center gap-1 pr-1.5`}
      >
        {current_s.label} <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-border rounded-lg shadow-lg py-1 w-36 animate-fade-in">
          {options.map(opt => {
            const s = STATUS_MAP[opt];
            return (
              <button
                key={opt}
                onClick={() => { onChange(appId, opt); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-surface-2 flex items-center gap-2 transition-colors ${current === opt ? 'font-semibold' : ''}`}
              >
                <span className={s.cls}>{s.label}</span>
                {current === opt && <CheckCircle2 size={11} className="ml-auto text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── Bio-Data PDF Generator ─────────────────── */
const generateBioData = async (app, jobTitle, companyName) => {
  if (!app) return;

  try {
    const d = app.details || {};
    const name = d.name || app.applicant?.name || 'Applicant Name';
    const email = d.email || app.applicant?.email || '';
    const appliedDate = app.appliedAt
      ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    const appId = String(app._id || '').slice(-8).toUpperCase();
    const val = (v, fallback = '—') => v || fallback;

    const htmlContent = `
<div style="font-family: 'Inter', sans-serif; font-size: 10pt; color: #000; line-height: 1.4; padding: 0; background: white;">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * { box-sizing: border-box; }
    
    .page-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start; 
      margin-bottom: 25px; 
      padding-bottom: 15px; 
      border-bottom: 2px solid #000; 
    }
    
    .header-info h1 { 
      font-size: 20pt; 
      font-weight: 800; 
      color: #000; 
      text-transform: uppercase; 
      letter-spacing: -0.01em; 
      margin-bottom: 2px; 
    }
    
    .header-info .job-title { 
      font-size: 11pt; 
      font-weight: 700; 
      color: #374151; 
      margin-bottom: 6px; 
    }
    
    .header-info .meta { 
      font-size: 8.5pt; 
      color: #6b7280; 
    }
    
    .photo-placeholder { 
      width: 90px; 
      height: 110px; 
      border: 1px solid #000; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      text-align: center; 
      font-size: 7pt; 
      color: #000; 
      font-weight: 600;
      text-transform: uppercase;
    }

    .section { margin-bottom: 20px; }
    
    .section-title { 
      font-size: 9.5pt; 
      font-weight: 800; 
      text-transform: uppercase; 
      letter-spacing: 0.05em; 
      color: #000; 
      margin-bottom: 10px; 
      padding: 4px 8px; 
      background: #f3f4f6;
      border-left: 4px solid #000;
    }
    
    .grid { 
      display: grid; 
      grid-template-columns: repeat(2, 1fr); 
      gap: 10px 20px; 
      padding: 0 8px;
    }
    
    .data-item { display: flex; flex-direction: column; }
    
    .data-label { 
      font-size: 7.5pt; 
      font-weight: 700; 
      color: #4b5563; 
      text-transform: uppercase; 
      margin-bottom: 1px;
    }
    
    .data-value { font-size: 9.5pt; font-weight: 500; color: #000; }
    
    .full-width { grid-column: span 2; }
    
    .list-item { 
      margin-bottom: 8px; 
      padding: 8px; 
      border: 1px solid #e5e7eb;
      background: #fff;
    }
    
    .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
    .item-title { font-weight: 700; font-size: 10pt; color: #000; }
    .item-subtitle { font-weight: 600; color: #374151; font-size: 9pt; }
    .item-meta { font-size: 8.5pt; color: #6b7280; font-weight: 500; }

    .badges { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 2px; }
    .badge { 
      background: #f3f4f6; 
      color: #000; 
      font-size: 8pt; 
      padding: 2px 8px; 
      border: 1px solid #d1d5db;
      font-weight: 600; 
    }

    .footer { 
      margin-top: 35px; 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      font-size: 9pt;
      padding: 0 8px;
    }
    
    .signature-line { 
      width: 170px; 
      border-top: 1px solid #000; 
      text-align: center; 
      padding-top: 5px; 
      font-weight: 700; 
      text-transform: uppercase;
      font-size: 8pt;
    }

    .system-footer { 
      margin-top: 50px; 
      padding-top: 8px; 
      border-top: 1px solid #e5e7eb; 
      display: flex; 
      justify-content: space-between; 
      font-size: 7.5pt; 
      color: #9ca3af; 
    }
    
    .brand-connich { font-weight: 700; color: #4b5563; }
  </style>

  <div class="page-header">
    <div class="header-info">
      <div class="meta">Bio-Data Sheet — ${val(companyName, 'Connich Recruit')}</div>
      <h1>${val(name)}</h1>
      <div class="job-title">Applied For: ${val(jobTitle)}</div>
      <div class="meta">Submission Date: ${appliedDate} · App ID: ${appId}</div>
    </div>
    <div class="photo-placeholder">Paste Photograph Here</div>
  </div>

  <div class="section">
    <div class="section-title">Personal Information</div>
    <div class="grid">
      <div class="data-item"><span class="data-label">Full Name</span><span class="data-value">${val(name)}</span></div>
      <div class="data-item"><span class="data-label">Email Address</span><span class="data-value">${val(email)}</span></div>
      <div class="data-item"><span class="data-label">Phone Number</span><span class="data-value">${val(d.phone)}</span></div>
      <div class="data-item"><span class="data-label">Date of Birth</span><span class="data-value">${val(d.dob)}</span></div>
      <div class="data-item"><span class="data-label">Gender</span><span class="data-value">${val(d.gender)}</span></div>
      <div class="data-item"><span class="data-label">Marital Status</span><span class="data-value">${val(d.maritalStatus)}</span></div>
      <div class="data-item"><span class="data-label">Nationality</span><span class="data-value">${val(d.nationality)}</span></div>
      <div class="data-item"><span class="data-label">Category</span><span class="data-value">${val(d.category)}</span></div>
      <div class="data-item"><span class="data-label">Religion</span><span class="data-value">${val(d.religion)}</span></div>
      <div class="data-item"><span class="data-label">Ethnicity</span><span class="data-value">${val(d.ethnicity)}</span></div>
      <div class="data-item full-width"><span class="data-label">Permanent Address</span><span class="data-value">${val(d.address)}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Family Information</div>
    <div class="grid">
      <div class="data-item"><span class="data-label">Father's Name</span><span class="data-value">${val(d.fatherName)}</span></div>
      <div class="data-item"><span class="data-label">Father's Contact</span><span class="data-value">${val(d.fatherPhone)}</span></div>
      <div class="data-item"><span class="data-label">Mother's Name</span><span class="data-value">${val(d.motherName)}</span></div>
      <div class="data-item"><span class="data-label">Mother's Contact</span><span class="data-value">${val(d.motherPhone)}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Educational Background</div>
    <div style="padding: 0 8px;">
      ${Array.isArray(d.postgraduates) && d.postgraduates.length > 0 ? d.postgraduates.filter(pg => pg.institute || pg.course).map(pg => `
        <div class="list-item">
          <div class="item-header"><span class="item-title">${pg.institute}</span><span class="item-meta">Postgraduate</span></div>
          <div class="item-subtitle">${pg.course}</div>
        </div>
      `).join('') : ''}
      ${d.undergraduateInstitute ? `<div class="list-item"><div class="item-header"><span class="item-title">${d.undergraduateInstitute}</span><span class="item-meta">Undergraduate</span></div><div class="item-subtitle">${d.ugCourse || 'Bachelors'}</div></div>` : ''}
      ${d.diplomaInstitute ? `<div class="list-item"><div class="item-header"><span class="item-title">${d.diplomaInstitute}</span><span class="item-meta">Diploma</span></div><div class="item-subtitle">${d.diplomaCourse}</div></div>` : ''}
    </div>
    
    <div class="grid" style="margin-top: 5px;">
      ${d.higherSecondarySchool ? `<div class="data-item"><span class="data-label">Hr. Secondary School</span><span class="data-value">${d.higherSecondarySchool} ${d.hscStream ? `(${d.hscStream})` : ''}</span></div>` : ''}
      <div class="data-item"><span class="data-label">High School (Class 10)</span><span class="data-value">${val(d.highSchool)}</span></div>
      <div class="data-item"><span class="data-label">Middle School</span><span class="data-value">${val(d.middleSchool)}</span></div>
      <div class="data-item"><span class="data-label">Primary School</span><span class="data-value">${val(d.primarySchool)}</span></div>
    </div>
  </div>

  ${!d.isFresher && Array.isArray(d.experiences) && d.experiences.some(exp => exp.jobTitle) ? `
    <div class="section">
      <div class="section-title">Professional Experience</div>
      <div style="padding: 0 8px;">
        ${d.experiences.filter(exp => exp.jobTitle).map(exp => `
          <div class="list-item">
            <div class="item-header">
              <span class="item-title">${exp.jobTitle}</span>
              <span class="item-meta">${exp.fromMonth} ${exp.fromYear} — ${exp.toMonth} ${exp.toYear}</span>
            </div>
            <div class="data-value" style="font-size: 8.5pt; margin-top: 4px; color: #374151;">${val(exp.description)}</div>
            ${exp.referenceName ? `<div style="margin-top: 6px; border-top: 1px dashed #d1d5db; padding-top: 4px;"><span class="data-label" style="font-size: 7pt;">Reference:</span> <span class="data-value" style="font-size: 8pt;">${exp.referenceName} (${exp.referencePhone})</span></div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  ` : ''}

  <div class="section">
    <div class="section-title">Skills & Extracurriculars</div>
    <div class="grid">
      <div class="data-item full-width">
        <span class="data-label">Languages Known</span>
        <div class="badges">${Array.isArray(d.languages) && d.languages.filter(l => l.name).length > 0 ? d.languages.filter(l => l.name).map(l => `<span class="badge">${l.name} (${l.proficiency})</span>`).join('') : '<span class="data-value">—</span>'}</div>
      </div>
      ${d.sports?.name ? `<div class="data-item"><span class="data-label">Sports</span><span class="data-value">${d.sports.name} ${d.sports.description ? `(${d.sports.description})` : ''}</span></div>` : ''}
      ${d.music?.name ? `<div class="data-item"><span class="data-label">Music</span><span class="data-value">${d.music.name} ${d.music.description ? `(${d.music.description})` : ''}</span></div>` : ''}
      ${d.arts?.name ? `<div class="data-item"><span class="data-label">Arts & Performance</span><span class="data-value">${d.arts.name} ${d.arts.description ? `(${d.arts.description})` : ''}</span></div>` : ''}
    </div>
  </div>

  <div class="footer">
    <div><p><strong>Place:</strong> __________________</p><p style="margin-top: 8px;"><strong>Date:</strong> __________________</p></div>
    <div><div class="signature-line">Candidate Signature</div></div>
  </div>

  <div class="system-footer">
    <span>Printed on ${new Date().toLocaleString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
    <span>Generated by <span class="brand-connich">Connich Recruit</span></span>
  </div>
</div>`;

    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    const opt = {
      margin: 20.32, // 0.8 inches in mm
      filename: `BioData_${name.replace(/\s+/g, '_')}_${appId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().from(element).set(opt).save();
    document.body.removeChild(element);
    
  } catch (err) {
    console.error('Error generating Bio-Data PDF:', err);
    alert('An error occurred while generating the PDF. Please try again.');
  }
};

/* ── View Applicant Modal ───────────────────── */
const ViewApplicantModal = ({ app, jobTitle, companyName, onClose }) => {
  const [msg, setMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!app) return null;
  const d = app.details || {};
  const name = d.name || app.applicant?.name || '—';
  const qualSummary = [d.highestQualification, d.discipline].filter(Boolean).join(' · ') || '—';
  const status = STATUS_MAP[app.status] || STATUS_MAP.PENDING;

  const handleDownload = async () => {
    setDownloading(true);
    await generateBioData(app, jobTitle, companyName);
    setDownloading(false);
  };

  const Row = ({ label, value }) => (
    <div className="flex gap-3 py-2.5 border-b border-border last:border-0">
      <span className="text-xs text-text-xmuted w-44 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-text font-medium break-words">{value || '—'}</span>
    </div>
  );

  const SectionHead = ({ title }) => (
    <p className="text-xs font-semibold uppercase tracking-widest text-text-xmuted mt-5 mb-1">{title}</p>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white h-full w-full max-w-4xl flex flex-col shadow-2xl animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <p className="text-xs text-text-xmuted mb-0.5">Application — {jobTitle}</p>
            <h2 className="font-semibold text-text text-lg">{name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={status.cls}>{status.label}</span>
              {app.applicant?.email && (
                <span className="text-xs text-text-muted">{app.applicant.email}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1.5"
              title="Download Bio-Data Sheet"
            >
              {downloading ? <Loader2 size={13} className="animate-spin" /> : <Printer size={13} />}
              {downloading ? 'Preparing...' : 'Download'}
            </button>
            <button onClick={onClose} className="btn-ghost p-1.5 rounded-md">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Personal & Family */}
            <div className="space-y-8">
              <section>
                <SectionHead title="Personal Details" />
                <div className="space-y-1">
                  <Row label="Full Name" value={name} />
                  <Row label="Email Address" value={d.email || app.applicant?.email} />
                  <Row label="Phone Number" value={d.phone} />
                  <Row label="Date of Birth" value={d.dob} />
                  <Row label="Gender" value={d.gender} />
                  <Row label="Nationality" value={d.nationality} />
                  <Row label="Ethnicity" value={d.ethnicity} />
                  <Row label="Religion" value={d.religion} />
                  <Row label="Category" value={d.category} />
                  <Row label="Marital Status" value={d.maritalStatus} />
                  <Row label="Permanent Address" value={d.address} />
                </div>
              </section>

              <section>
                <SectionHead title="Family Information" />
                <div className="space-y-1">
                  <Row label="Father's Name" value={d.fatherName} />
                  <Row label="Father's Contact" value={d.fatherPhone} />
                  <Row label="Mother's Name" value={d.motherName} />
                  <Row label="Mother's Contact" value={d.motherPhone} />
                </div>
              </section>

              {Array.isArray(d.languages) && d.languages.length > 0 && (
                <section>
                  <SectionHead title="Languages Known" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {d.languages.map((l, i) => (
                      <div key={i} className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-sm">
                        <span className="font-semibold text-blue-700">{l.name}</span>
                        <span className="mx-1 text-blue-400">·</span>
                        <span className="text-blue-600 text-xs font-medium uppercase tracking-wider">{l.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(d.sports?.name || d.music?.name || d.arts?.name) && (
                <section>
                  <SectionHead title="Extracurriculars" />
                  <div className="space-y-3 mt-2">
                    {d.sports?.name && (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-bold text-text-xmuted uppercase tracking-widest mb-1">Sports</p>
                        <p className="text-sm font-semibold">{d.sports.name}</p>
                        {d.sports.description && <p className="text-xs text-text-muted mt-1">{d.sports.description}</p>}
                      </div>
                    )}
                    {d.music?.name && (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-bold text-text-xmuted uppercase tracking-widest mb-1">Music</p>
                        <p className="text-sm font-semibold">{d.music.name}</p>
                        {d.music.description && <p className="text-xs text-text-muted mt-1">{d.music.description}</p>}
                      </div>
                    )}
                    {d.arts?.name && (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-bold text-text-xmuted uppercase tracking-widest mb-1">Fine/Performing Arts</p>
                        <p className="text-sm font-semibold">{d.arts.name}</p>
                        {d.arts.description && <p className="text-xs text-text-muted mt-1">{d.arts.description}</p>}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Education & Experience */}
            <div className="space-y-8">
              <section>
                <SectionHead title="Educational Background" />
                <div className="space-y-3 mt-2">
                  <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl">
                    <Row label="Highest Qual" value={d.highestQualification} />
                    <Row label="Field" value={d.discipline} />
                  </div>
                  
                  {Array.isArray(d.postgraduates) && d.postgraduates.map((pg, i) => (
                    <div key={i} className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                      <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Postgraduate</p>
                      <p className="text-sm font-bold">{pg.institute}</p>
                      <p className="text-xs text-text-muted">{pg.course}</p>
                    </div>
                  ))}

                  {d.undergraduateInstitute && (
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Undergraduate</p>
                      <p className="text-sm font-bold">{d.undergraduateInstitute}</p>
                      <p className="text-xs text-text-muted">{d.ugCourse || 'Bachelors'}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-1">
                    <Row label="Class 12 / HSC" value={d.higherSecondarySchool} />
                    {d.hscStream && <Row label="HSC Stream" value={d.hscStream} />}
                    <Row label="Class 10 / High School" value={d.highSchool} />
                    <Row label="Middle School" value={d.middleSchool} />
                    <Row label="Primary School" value={d.primarySchool} />
                  </div>
                </div>
              </section>

              <section>
                <SectionHead title="Work Experience" />
                <div className="space-y-4 mt-2">
                  {d.isFresher ? (
                    <div className="py-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-sm text-text-muted font-medium italic">Candidate is a fresher</p>
                    </div>
                  ) : Array.isArray(d.experiences) && d.experiences.length > 0 ? (
                    d.experiences.map((exp, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-text">{exp.jobTitle}</h4>
                          <span className="text-[10px] font-bold px-2 py-1 bg-white rounded-md border border-gray-100 text-text-muted whitespace-nowrap">
                            {exp.fromMonth} {exp.fromYear} — {exp.toMonth} {exp.toYear}
                          </span>
                        </div>
                        <p className="text-sm text-text-2 whitespace-pre-wrap mb-3 leading-relaxed">{exp.description}</p>
                        {exp.referenceName && (
                          <div className="pt-2 border-t border-gray-200 flex items-center gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-xmuted">Ref</span>
                            <p className="text-xs text-text font-medium">
                              {exp.referenceName} · <span className="text-text-muted">{exp.referencePhone}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm text-text leading-relaxed">{d.experience || '—'}</p>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <SectionHead title="Internal Status" />
                <div className="bg-slate-900 p-5 rounded-2xl text-white grid grid-cols-2 gap-6 mt-2">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Applied Date</p>
                    <p className="text-sm font-semibold">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Application ID</p>
                    <p className="text-[11px] font-mono font-medium text-slate-300 break-all">{app._id}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>


          <SectionHead title="Communication" />
          <div className="mt-2">
            {!app.applicant ? (
              <div className="p-5 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900">Guest Applicant</p>
                  <p className="text-xs text-amber-700 leading-relaxed mt-1">
                    This candidate applied without a Connich account. You must contact them directly via email at 
                    <span className="font-bold ml-1">{d.email || 'their provided address'}</span> for any updates or interview requests.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-gray-50 border border-gray-100 rounded-xl">
                <p className="text-xs font-bold text-text-xmuted uppercase tracking-widest mb-3">Send Dashboard Message</p>
                <textarea
                  rows={3}
                  className="input resize-none mb-3 bg-white border-gray-200"
                  placeholder="Type a message (e.g. Next steps, Interview details)..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-text-muted italic max-w-[240px]">
                    This message will appear on the candidate's personal dashboard.
                  </p>
                  <button
                    disabled={sendingMsg || !msg.trim()}
                    onClick={async () => {
                      setSendingMsg(true);
                      try {
                        await axios.post(`${API}/applications/${app._id}/message`, { message: msg, sentBy: 'RECRUITER' });
                        setMsg('');
                        alert('Message sent successfully.');
                      } catch (err) {
                        alert('Failed to send message.');
                      } finally {
                        setSendingMsg(false);
                      }
                    }}
                    className="btn-primary py-2 px-4 text-xs font-bold shadow-sm"
                  >
                    {sendingMsg ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary flex-1 justify-center"
          >
            {downloading ? <Loader2 size={15} className="animate-spin" /> : <Printer size={15} />}
            {downloading ? 'Generating Bio-Data Sheet...' : 'Download Bio-Data Sheet'}
          </button>
          <button onClick={onClose} className="btn-outline">Close</button>
        </div>
      </div>
    </div>
  );
};

/* ── Company Profile Tab ──────────────────────── */
const CompanyProfileTab = ({ user, setUser }) => {
  const [form, setForm] = useState({
    name: user?.company?.name || '',
    industry: user?.company?.industry || '',
    location: user?.company?.location || '',
    tagline: user?.company?.tagline || '',
    website: user?.company?.website || '',
    logoUrl: user?.company?.logoUrl || '',
    about: user?.company?.about || '',
    brandPrimary: user?.company?.brandPrimary || '#2563eb',
    brandAccent: user?.company?.brandAccent || '#1e3a5f',
    applicationSettings: user?.company?.applicationSettings || {
      collectGender: true,
      collectNationality: true,
      collectEthnicity: true,
      collectReligion: true,
      collectCategory: true,
      collectMaritalStatus: true,
      collectFamilyInfo: true,
      collectLanguages: true,
      collectSports: true,
      collectMusic: true,
      collectArts: true,
    }
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await axios.patch(`${API}/auth/company/${user.id || user._id}`, { company: form });
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage('Company profile updated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-text mb-1">Company Profile</h2>
        <p className="text-sm text-text-muted mb-6">This information is visible to candidates on your public profile and job listings.</p>

        {message && (
          <div className={`mb-5 p-3 rounded-lg text-sm flex items-center gap-2 ${message.includes('success') ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
            {message.includes('success') ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="cp-name">Company Name <span className="text-danger">*</span></label>
              <input id="cp-name" name="name" required value={form.name} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="cp-ind">Industry</label>
              <input id="cp-ind" name="industry" value={form.industry} onChange={handleChange} className="input" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="cp-loc">HQ Location</label>
              <input id="cp-loc" name="location" value={form.location} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="cp-web">Website</label>
              <input id="cp-web" type="url" name="website" value={form.website} onChange={handleChange} className="input" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="cp-primary">Brand Primary Color</label>
              <div className="flex gap-2">
                <input id="cp-primary" type="color" name="brandPrimary" value={form.brandPrimary} onChange={handleChange} className="w-10 h-10 p-1 rounded border border-border" />
                <input type="text" name="brandPrimary" value={form.brandPrimary} onChange={handleChange} className="input flex-1 font-mono" placeholder="#2563eb" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="cp-accent">Brand Accent Color</label>
              <div className="flex gap-2">
                <input id="cp-accent" type="color" name="brandAccent" value={form.brandAccent} onChange={handleChange} className="w-10 h-10 p-1 rounded border border-border" />
                <input type="text" name="brandAccent" value={form.brandAccent} onChange={handleChange} className="input flex-1 font-mono" placeholder="#1e3a5f" />
              </div>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="cp-tag">Tagline</label>
            <input id="cp-tag" name="tagline" value={form.tagline} onChange={handleChange} className="input" placeholder="A short, catchy description" />
          </div>

          <div>
            <label className="label" htmlFor="cp-logo">Logo URL</label>
            <input id="cp-logo" type="url" name="logoUrl" value={form.logoUrl} onChange={handleChange} className="input" placeholder="https://..." />
            {form.logoUrl && (
              <div className="mt-2 w-16 h-16 border border-border rounded flex items-center justify-center bg-surface-2 p-1">
                <img src={form.logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>

          <div>
            <label className="label" htmlFor="cp-about">About</label>
            <textarea id="cp-about" name="about" rows={5} value={form.about} onChange={handleChange} className="input resize-none" placeholder="Tell candidates what makes your company great..." />
          </div>

          <div className="pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-text mb-4">Application Form Settings</h3>
            <p className="text-xs text-text-muted mb-4">Choose which additional personal details you want to collect from applicants.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'collectGender', label: 'Gender' },
                { key: 'collectNationality', label: 'Nationality' },
                { key: 'collectEthnicity', label: 'Ethnicity' },
                { key: 'collectReligion', label: 'Religion' },
                { key: 'collectCategory', label: 'Category' },
                { key: 'collectMaritalStatus', label: 'Marital Status' },
                { key: 'collectFamilyInfo', label: 'Family Information' },
                { key: 'collectLanguages', label: 'Languages' },
                { key: 'collectSports', label: 'Sports Interest' },
                { key: 'collectMusic', label: 'Music Instruments' },
                { key: 'collectArts', label: 'Fine/Performing Arts' },
              ].map((setting) => (
                <label key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border/50 cursor-pointer hover:bg-white transition-colors">
                  <span className="text-sm font-medium text-text">{setting.label}</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={form.applicationSettings[setting.key]}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          applicationSettings: {
                            ...form.applicationSettings,
                            [setting.key]: e.target.checked
                          }
                        });
                      }}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><CheckCircle2 size={15} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Main Dashboard ─────────────────────────── */
const RecruiterDashboard = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [activeJob, setActiveJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [appLoading, setAppLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewApp, setViewApp] = useState(null); // applicant detail panel
  const [downloadingId, setDownloadingId] = useState(null);
  const statusFilterRef = useRef(null);

  /* Close status filter on outside click */
  useEffect(() => {
    const handler = (e) => { if (!statusFilterRef.current?.contains(e.target)) setStatusFilterOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Fetch jobs */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API}/jobs/recruiter/${user.id || user._id}`);
        setJobs(res.data);
        if (res.data.length > 0) setActiveJob(res.data[0]);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  /* Fetch applicants when active job changes */
  useEffect(() => {
    if (!activeJob) return;
    const fetchApplicants = async () => {
      setAppLoading(true);
      setApplicants([]);
      try {
        const res = await axios.get(`${API}/applications/job/${activeJob._id}`);
        setApplicants(res.data);
      } catch (err) {
        console.error('Error fetching applicants:', err);
      } finally {
        setAppLoading(false);
      }
    };
    fetchApplicants();
  }, [activeJob]);

  /* Add newly created job to sidebar & select it */
  const handleJobCreated = (newJob) => {
    setJobs(prev => [newJob, ...prev]);
    setActiveJob(newJob);
  };

  /* Delete a job listing */
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/jobs/${jobToDelete._id}`);
      setJobs(prev => prev.filter(j => j._id !== jobToDelete._id));
      if (activeJob?._id === jobToDelete._id) {
        const remaining = jobs.filter(j => j._id !== jobToDelete._id);
        setActiveJob(remaining[0] || null);
      }
      setJobToDelete(null);
    } catch (err) {
      console.error('Error deleting job:', err);
    } finally {
      setDeleting(false);
    }
  };

  /* Update applicant status */
  const handleStatusChange = async (appId, newStatus) => {
    try {
      await axios.patch(`${API}/applications/${appId}/status`, { status: newStatus });
      setApplicants(prev =>
        prev.map(a => a._id === appId ? { ...a, status: newStatus } : a)
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  /* Toggle job visibility on home screen */
  const toggleJobHomeVisibility = async (jobId, currentValue) => {
    try {
      const res = await axios.put(`${API}/jobs/${jobId}`, { showOnHome: !currentValue });
      const updatedJob = res.data;
      setJobs(prev => prev.map(j => j._id === jobId ? updatedJob : j));
      if (activeJob?._id === jobId) setActiveJob(updatedJob);
    } catch (err) {
      console.error('Error toggling visibility:', err);
      alert('Failed to update visibility.');
    }
  };

  /* Filtered applicant list */
  const filtered = applicants.filter(a => {
    const name = a.applicant?.name || '';
    const qual = a.details?.highestQualification || '';
    const field = a.details?.discipline || '';
    const matchSearch = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      qual.toLowerCase().includes(search.toLowerCase()) ||
      field.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-surface-2 pt-14 flex flex-col">
      {showModal && (
        <NewJobModal
          onClose={() => setShowModal(false)}
          onCreated={handleJobCreated}
          recruiterId={user?.id || user?._id}
        />
      )}

      {/* Delete confirmation modal */}
      {jobToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget && !deleting) setJobToDelete(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fade-up p-6">
            <div className="w-12 h-12 rounded-xl bg-danger-light flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-danger" />
            </div>
            <h2 className="font-semibold text-text text-center mb-1">Delete job listing?</h2>
            <p className="text-sm text-text-muted text-center mb-6">
              <span className="font-medium text-text">"{jobToDelete.title}"</span> will be permanently removed along with all its applicant data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setJobToDelete(null)}
                disabled={deleting}
                className="btn-outline flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                disabled={deleting}
                className="btn-danger flex-1 justify-center disabled:opacity-60"
              >
                {deleting ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : 'Delete listing'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewApp && (
        <ViewApplicantModal
          app={viewApp}
          jobTitle={activeJob?.title}
          companyName={user?.company?.name}
          onClose={() => setViewApp(null)}
        />
      )}

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text'}`}
          >
            Job Listings
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'company' ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text'}`}
          >
            Company Profile
          </button>
        </div>

        {activeTab === 'jobs' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

          {/* ── Job List Sidebar ── */}
          <aside className="lg:col-span-1 animate-fade-up">
            <div className="card overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex justify-between items-center">
                <h2 className="text-sm font-semibold text-text">Your job listings</h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary p-1.5 rounded-md"
                  title="Post new job"
                >
                  <Plus size={15} />
                </button>
              </div>

              {jobsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={20} className="animate-spin text-text-xmuted" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-text-muted mb-3">No job listings yet</p>
                  <button onClick={() => setShowModal(true)} className="btn-primary text-xs">
                    <Plus size={13} /> Post your first job
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {jobs.map((job) => (
                    <button
                      key={job._id}
                      onClick={() => { setActiveJob(job); setSearch(''); setStatusFilter('ALL'); }}
                      className={`w-full text-left px-4 py-3.5 transition-colors group/job ${
                        activeJob?._id === job._id ? 'bg-accent-light' : 'hover:bg-surface-2'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className={`text-sm font-medium leading-snug flex-1 ${
                          activeJob?._id === job._id ? 'text-accent' : 'text-text'
                        }`}>
                          {job.title}
                        </p>
                        {/* Delete button — visible on hover */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setJobToDelete(job); }}
                          className="opacity-0 group-hover/job:opacity-100 p-1 rounded text-text-xmuted hover:text-danger hover:bg-danger-light transition-all shrink-0 -mt-0.5"
                          title="Delete listing"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Users size={10} /> {job.applicantsCount || 0}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border-2" />
                        <span className="text-xs text-success font-medium">{job.status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="px-4 py-3 border-t border-border">
                <button
                  onClick={() => setShowModal(true)}
                  className="text-xs text-accent hover:text-accent-hover flex items-center gap-1 font-medium transition-colors"
                >
                  <Plus size={12} /> Post a new job
                </button>
              </div>
            </div>
          </aside>

          {/* ── Applicants Main Area ── */}
          <main className="lg:col-span-3 animate-fade-up-1">
            {!activeJob ? (
              <div className="card p-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center mx-auto mb-3">
                  <Users size={20} className="text-text-xmuted" />
                </div>
                <h3 className="font-semibold text-text text-sm mb-1">No job selected</h3>
                <p className="text-sm text-text-muted mb-4">Select a listing from the sidebar or post a new one.</p>
                <button onClick={() => setShowModal(true)} className="btn-primary text-sm mx-auto">
                  <Plus size={14} /> Post a job
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-xl font-bold text-text">{activeJob.title}</h1>
                      <button
                        onClick={() => toggleJobHomeVisibility(activeJob._id, activeJob.showOnHome !== false)}
                        className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border transition-all ${
                          activeJob.showOnHome !== false
                            ? 'bg-success-light text-success border-success/20'
                            : 'bg-surface-3 text-text-xmuted border-border'
                        }`}
                        title={activeJob.showOnHome !== false ? "Visible on main home screen" : "Hidden from main home screen"}
                      >
                        {activeJob.showOnHome !== false ? 'Live on Home' : 'Only Profile'}
                      </button>
                    </div>
                    <p className="text-sm text-text-muted mt-0.5">
                      {filtered.length} applicant{filtered.length !== 1 ? 's' : ''}
                      {activeJob.department && <> · {activeJob.department}</>}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:flex-none">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-xmuted" />
                      <input
                        type="text"
                        placeholder="Search applicants…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input py-2 pl-8 text-sm w-full sm:w-44"
                      />
                    </div>
                    {/* Status filter */}
                    <div className="relative" ref={statusFilterRef}>
                      <button
                        onClick={() => setStatusFilterOpen(!statusFilterOpen)}
                        className="btn-outline py-2 px-3 flex items-center gap-1.5 text-sm"
                      >
                        {statusFilter === 'ALL' ? 'Status' : STATUS_MAP[statusFilter]?.label}
                        <ChevronDown size={13} />
                      </button>
                      {statusFilterOpen && (
                        <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-border rounded-lg shadow-lg py-1 w-36 animate-fade-in">
                          {['ALL', 'PENDING', 'SHORTLISTED', 'REJECTED', 'JOINED'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => { setStatusFilter(opt); setStatusFilterOpen(false); }}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-surface-2 flex items-center gap-2 transition-colors ${statusFilter === opt ? 'font-semibold text-accent' : 'text-text'}`}
                            >
                              {opt === 'ALL' ? 'All statuses' : STATUS_MAP[opt]?.label}
                              {statusFilter === opt && <ChevronRight size={11} className="ml-auto" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Table card */}
                <div className="card border-b-0 pb-0 mb-4">
                  {appLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 size={22} className="animate-spin text-text-xmuted" />
                    </div>
                  ) : (
                    <>
                      {/* Desktop table */}
                      <div className="hidden sm:block">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-surface-2 text-xs text-text-xmuted uppercase tracking-wider border-b border-border">
                              <th className="px-5 py-3 font-medium">Applicant</th>
                              <th className="px-5 py-3 font-medium">Qualification</th>
                              <th className="px-5 py-3 font-medium">Status</th>
                              <th className="px-5 py-3 font-medium">Applied</th>
                              <th className="px-5 py-3 font-medium text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {filtered.length > 0 ? filtered.map((app) => (
                              <tr key={app._id} className="hover:bg-surface-2 transition-colors">
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-accent text-xs font-bold shrink-0">
                                      {(app.applicant?.name || app.details?.name || '?')[0].toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-text">{app.applicant?.name || app.details?.name || '—'}</p>
                                      <p className="text-xs text-text-muted">{app.applicant?.email || app.details?.email || '—'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-4 text-sm text-text-muted">
                                  {[app.details?.highestQualification, app.details?.discipline].filter(Boolean).join(' ') || '—'}
                                </td>
                                <td className="px-5 py-4">
                                  <StatusDropdown
                                    appId={app._id}
                                    current={app.status}
                                    onChange={handleStatusChange}
                                  />
                                </td>
                                <td className="px-5 py-4 text-sm text-text-muted">
                                  {app.appliedAt
                                    ? new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : '—'}
                                </td>
                                <td className="px-5 py-4 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => setViewApp(app)}
                                      className="btn-ghost p-2 text-text-muted hover:text-accent"
                                      title="View full application"
                                    >
                                      <FileText size={14} />
                                    </button>
                                    <button
                                      onClick={async () => {
                                        setDownloadingId(app._id);
                                        await generateBioData(app, activeJob?.title, user?.company?.name);
                                        setDownloadingId(null);
                                      }}
                                      disabled={downloadingId === app._id}
                                      className="btn-ghost p-2 text-text-muted hover:text-accent disabled:opacity-50"
                                      title="Download Bio-Data Sheet"
                                    >
                                      {downloadingId === app._id ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}
                                    </button>
                                    <button className="btn-ghost p-2 text-text-muted">
                                      <MoreVertical size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={5} className="py-14 text-center text-sm text-text-muted">
                                  {applicants.length === 0
                                    ? 'No applications received yet for this role.'
                                    : 'No applicants match your filters.'}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile list */}
                      <div className="sm:hidden divide-y divide-border">
                        {filtered.length > 0 ? filtered.map((app) => {
                          const s = STATUS_MAP[app.status] || STATUS_MAP.PENDING;
                          return (
                            <div key={app._id} className="p-4 flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-accent-light flex items-center justify-center text-accent text-xs font-bold shrink-0">
                                  {(app.applicant?.name || app.details?.name || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-text">{app.applicant?.name || app.details?.name || '—'}</p>
                                  <p className="text-xs text-text-muted">
                                    {[app.details?.highestQualification, app.details?.discipline].filter(Boolean).join(' ') || '—'}
                                  </p>
                                  <div className="mt-1.5">
                                    <StatusDropdown appId={app._id} current={app.status} onChange={handleStatusChange} />
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => setViewApp(app)} className="btn-ghost p-1.5" title="View">
                                  <FileText size={14} />
                                </button>
                                <button
                                  onClick={async () => {
                                    setDownloadingId(app._id);
                                    await generateBioData(app, activeJob?.title, user?.company?.name);
                                    setDownloadingId(null);
                                  }}
                                  disabled={downloadingId === app._id}
                                  className="btn-ghost p-1.5 disabled:opacity-50"
                                  title="Download"
                                >
                                  {downloadingId === app._id ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}
                                </button>
                              </div>
                            </div>
                          );
                        }) : (
                          <p className="py-10 text-center text-sm text-text-muted">No applicants found.</p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="px-5 py-3 bg-surface-2 border-t border-border text-xs text-text-xmuted flex items-center justify-between">
                    <span>{filtered.length} of {applicants.length} applicants shown</span>
                    {statusFilter !== 'ALL' && (
                      <button
                        onClick={() => setStatusFilter('ALL')}
                        className="text-accent hover:text-accent-hover font-medium"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </main>

        </div>
        ) : (
          <CompanyProfileTab user={user} setUser={setUser} />
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
