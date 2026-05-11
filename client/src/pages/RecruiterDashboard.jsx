import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Users, FileText, Printer, MoreVertical,
  Search, ChevronDown, X, Loader2, CheckCircle2,
  AlertCircle, ChevronRight, Trash2
} from 'lucide-react';
import axios from 'axios';

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
  });
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text">Post a new job listing</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-md">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh]">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-danger-light border border-danger/20 rounded-lg text-sm text-danger">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="label" htmlFor="job-title">Job title <span className="text-danger">*</span></label>
            <input ref={firstRef} id="job-title" name="title" required value={form.title}
              onChange={handleChange} placeholder="e.g. Senior Software Engineer" className="input" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="label" htmlFor="job-dept">Department <span className="text-danger">*</span></label>
              <select id="job-dept" name="department" required value={form.department}
                onChange={handleChange} className="input">
                <option value="">Select…</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {/* Location */}
            <div>
              <label className="label" htmlFor="job-location">Location</label>
              <input id="job-location" name="location" value={form.location}
                onChange={handleChange} placeholder="e.g. Lagos, Nigeria" className="input" />
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="label" htmlFor="job-salary">Salary / Compensation</label>
            <input id="job-salary" name="salary" value={form.salary}
              onChange={handleChange} placeholder="e.g. 80,000 – 100,000" className="input" />
          </div>

          {/* Description */}
          <div>
            <label className="label" htmlFor="job-desc">Description <span className="text-danger">*</span></label>
            <textarea id="job-desc" name="description" required rows={3} value={form.description}
              onChange={handleChange}
              placeholder="Briefly describe the role, responsibilities, and team…"
              className="input resize-none" />
          </div>

          {/* Requirements */}
          <div>
            <label className="label" htmlFor="job-reqs">
              Requirements <span className="text-text-xmuted font-normal">(one per line)</span>
            </label>
            <textarea id="job-reqs" name="requirements" rows={3} value={form.requirements}
              onChange={handleChange}
              placeholder={"Bachelor's degree in relevant field\n3+ years of experience"}
              className="input resize-none font-mono text-xs" />
          </div>

          <div className="border-t border-border my-4 pt-4">
            <h3 className="font-semibold text-text mb-3">Recruitment Timeline</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
                  <label className="label" htmlFor="job-deadline">Last Date to Apply</label>
                  <input id="job-deadline" type="date" name="lastDateToApply" value={form.lastDateToApply}
                    onChange={handleChange} className="input" required />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="job-int-date">Interview Date</label>
                <input id="job-int-date" type="date" name="interviewDate" value={form.interviewDate}
                  onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="job-int-venue">Interview Venue</label>
                <input id="job-int-venue" name="interviewVenue" value={form.interviewVenue}
                  onChange={handleChange} placeholder="e.g. Virtual, HQ Office" className="input" />
              </div>
            </div>
          </div>

          <div className="border-t border-border my-4 pt-4">
            <h3 className="font-semibold text-text mb-1">Application Form Fields</h3>
            <p className="text-xs text-text-muted mb-3">Select the information applicants must provide. Name and Email are always required.</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 bg-surface-2 p-3 rounded-lg border border-border">
              {KNOWN_APPLICATION_FIELDS.map(f => (
                <label key={f.id} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center shrink-0">
                    <input
                      type="checkbox"
                      checked={form.applicationFields.includes(f.id)}
                      onChange={(e) => {
                        if (e.target.checked) setForm({ ...form, applicationFields: [...form.applicationFields, f.id] });
                        else setForm({ ...form, applicationFields: form.applicationFields.filter(id => id !== f.id) });
                      }}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      form.applicationFields.includes(f.id) ? 'bg-accent border-accent' : 'bg-white border-border group-hover:border-accent'
                    }`}>
                      {form.applicationFields.includes(f.id) && <CheckCircle2 size={10} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <span className="text-xs text-text-2 group-hover:text-text transition-colors">{f.label}</span>
                </label>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-surface-2">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary disabled:opacity-60"
          >
            {saving ? <><Loader2 size={15} className="animate-spin" /> Posting…</> : <><CheckCircle2 size={15} /> Post listing</>}
          </button>
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
const generateBioData = (app, jobTitle) => {
  const d = app.details || {};
  const name = d.name || app.applicant?.name || '';
  const qual = [d.highestQualification, d.discipline].filter(Boolean).join(' ');
  const appliedDate = app.appliedAt
    ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  const field = (label, value, style = '') =>
    `<div class="field-row" style="${style}">
      <span class="label">${label}</span>
      <span class="line">&nbsp;${value || ''}</span>
    </div>`;

  const halfField = (label, value) =>
    `<div class="half-field">
      <span class="label">${label}</span>
      <span class="line">&nbsp;${value || ''}</span>
    </div>`;

  const html = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Bio-Data — ${name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 11.5pt; color: #000;
         padding: 18mm 20mm 15mm 20mm; }
  .header { text-align: center; position: relative; margin-bottom: 22px; }
  .photo-box { position: absolute; top: 0; right: 0; width: 88px; height: 112px;
               border: 1.5px solid #000; display: flex; flex-direction: column;
               align-items: center; justify-content: center;
               text-align: center; font-size: 8.5pt; padding: 6px; line-height: 1.5; }
  h1 { font-size: 18pt; font-weight: bold; letter-spacing: 1.5px; margin-bottom: 6px; }
  h2 { font-size: 12pt; font-weight: bold; letter-spacing: 3px; margin-bottom: 4px; }
  .subtitle { font-size: 10pt; color: #333; margin-bottom: 24px; }
  .field-row { display: flex; align-items: flex-end; margin-bottom: 13px; width: 100%; }
  .label { white-space: nowrap; font-size: 11pt; }
  .line { flex: 1; border-bottom: 1px solid #000; min-width: 60px; padding-bottom: 1px; }
  .two-col { display: flex; gap: 24px; margin-bottom: 13px; }
  .half-field { display: flex; align-items: flex-end; flex: 1; }
  .half-field .line { flex: 1; border-bottom: 1px solid #000; padding-bottom: 1px; }
  .half-field .label { white-space: nowrap; font-size: 11pt; margin-right: 4px; }
  .divider { border-top: 1px solid #333; margin: 14px 0; }
  .exp-label { font-size: 11pt; margin-bottom: 8px; }
  .exp-line { border-bottom: 1px solid #000; height: 20px; margin-bottom: 9px; font-size: 10pt; padding: 0 4px 2px; }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px; }
  .footer-col .field-row { margin-bottom: 12px; }
  @media print { body { padding: 12mm 18mm 10mm 18mm; } @page { margin: 0; } }
</style>
</head><body>
  <div class="header">
    <div class="photo-box">Paste<br>photograph<br>here<br>(3.5 x 4.5)</div>
    <h1>CONNICH</h1>
    <h2>CANDIDATE'S BIO-DATA SHEET</h2>
    <div class="subtitle">Connich Education Technology</div>
  </div>

  ${field('Application for :', jobTitle)}
  ${field('Name :', name)}

  <div class="two-col">
    ${halfField('Date of Birth &amp; Age :', d.dob)}
    ${halfField('Qualification(s) :', qual)}
  </div>
  <div class="two-col">
    ${halfField('Phone :', d.phone)}
    ${halfField('Marital Status :', d.maritalStatus)}
  </div>

  ${field('Address :', d.address)}

  <div class="divider"></div>

  <div class="two-col">
    ${halfField("Father's Name :", d.fatherName)}
    ${halfField('Phone :', d.fatherPhone)}
  </div>
  <div class="two-col">
    ${halfField("Mother's Name :", d.motherName)}
    ${halfField('Phone :', d.motherPhone)}
  </div>

  ${field('Primary School attended :', d.primarySchool)}
  ${field('Middle School attended :', d.middleSchool)}
  ${field('High School attended :', d.highSchool)}
  ${field('Hr. Sec. School attended :', d.higherSecondarySchool)}
  ${field('Under Graduate Inst. attended :', d.undergraduateInstitute)}

  <div class="divider"></div>

  ${field('Post Graduate Inst. attended :', d.postgraduateInstitute)}

  <div class="divider"></div>

  <div class="exp-label">Experience (if any) :</div>
  <div class="exp-line">${d.experience || ''}</div>
  <div class="exp-line"></div>
  ${d.referenceeName ? `<div class="two-col" style="margin-top:6px">
    ${halfField('Reference :', d.referenceeName)}
    ${halfField('Phone :', d.referencePhone)}
  </div>` : '<div class="exp-line"></div>'}

  <div class="footer">
    <div class="footer-col">
      <div class="field-row">
        <span class="label">Date :</span>
        <span class="line" style="min-width:130px">&nbsp;${appliedDate}</span>
      </div>
      <div class="field-row">
        <span class="label">Place :</span>
        <span class="line" style="min-width:130px"></span>
      </div>
    </div>
    <span style="font-size:11pt">Signature</span>
  </div>
</body></html>`;

  const win = window.open('', '_blank', 'width=800,height=900');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 600);
};

/* ── View Applicant Modal ───────────────────── */
const ViewApplicantModal = ({ app, jobTitle, onClose }) => {
  const [msg, setMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  if (!app) return null;
  const d = app.details || {};
  const name = d.name || app.applicant?.name || '—';
  const qualSummary = [d.highestQualification, d.discipline].filter(Boolean).join(' · ') || '—';
  const status = STATUS_MAP[app.status] || STATUS_MAP.PENDING;

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
      <div className="bg-white h-full w-full max-w-xl flex flex-col shadow-2xl animate-fade-in overflow-hidden">
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
              onClick={() => generateBioData(app, jobTitle)}
              className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1.5"
              title="Download Bio-Data Sheet"
            >
              <Printer size={13} /> Download
            </button>
            <button onClick={onClose} className="btn-ghost p-1.5 rounded-md">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <SectionHead title="Personal Information" />
          <Row label="Full Name" value={name} />
          <Row label="Email" value={d.email || app.applicant?.email} />
          <Row label="Phone" value={d.phone} />
          <Row label="Date of Birth" value={d.dob} />
          <Row label="Address" value={d.address} />
          <Row label="Marital Status" value={d.maritalStatus} />

          <SectionHead title="Family" />
          <Row label="Father's Name" value={d.fatherName} />
          <Row label="Father's Phone" value={d.fatherPhone} />
          <Row label="Mother's Name" value={d.motherName} />
          <Row label="Mother's Phone" value={d.motherPhone} />

          <SectionHead title="Educational Background" />
          <Row label="Highest Qualification" value={d.highestQualification} />
          <Row label="Field" value={d.discipline} />
          <Row label="Primary School" value={d.primarySchool} />
          <Row label="Middle School" value={d.middleSchool} />
          <Row label="High School" value={d.highSchool} />
          <Row label="Higher Secondary School" value={d.higherSecondarySchool} />
          <Row label="Undergraduate Institute" value={d.undergraduateInstitute} />
          <Row label="Postgraduate Institute" value={d.postgraduateInstitute} />

          <SectionHead title="Work Experience" />
          <div className="py-2.5 border-b border-border">
            <p className="text-xs text-text-xmuted mb-1">Experience</p>
            <p className="text-sm text-text whitespace-pre-wrap">{d.experience || '—'}</p>
          </div>
          <Row label="Reference Name" value={d.referenceeName} />
          <Row label="Reference Phone" value={d.referencePhone} />

          <SectionHead title="Application Details" />
          <Row label="Applied On" value={app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'} />
          <Row label="Application ID" value={app._id} />

          <SectionHead title="Message Applicant" />
          <div className="pt-2">
            <textarea
              rows={3}
              className="input resize-none mb-2"
              placeholder="Type a message (e.g. Next steps, Interview details)..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
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
              className="btn-outline text-xs py-1.5 px-3"
            >
              {sendingMsg ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex gap-3">
          <button
            onClick={() => generateBioData(app, jobTitle)}
            className="btn-primary flex-1 justify-center"
          >
            <Printer size={15} /> Download Bio-Data Sheet
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
                    <h1 className="text-xl font-bold text-text">{activeJob.title}</h1>
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
                                      {(app.applicant?.name || '?')[0].toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-text">{app.applicant?.name || '—'}</p>
                                      <p className="text-xs text-text-muted">{app.applicant?.email || ''}</p>
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
                                      onClick={() => generateBioData(app, activeJob?.title)}
                                      className="btn-ghost p-2 text-text-muted hover:text-accent"
                                      title="Download Bio-Data Sheet"
                                    >
                                      <Printer size={14} />
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
                                  {(app.applicant?.name || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-text">{app.applicant?.name || '—'}</p>
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
                                <button onClick={() => generateBioData(app, activeJob?.title)} className="btn-ghost p-1.5" title="Download">
                                  <Printer size={14} />
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
