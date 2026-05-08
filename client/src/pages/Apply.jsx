import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Building2, Briefcase, AlertTriangle, ChevronDown } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const QUALIFICATIONS = [
  'BA', 'BSc', 'BCom', 'BBA', 'LLB', 'BE / BTech',
  'MA', 'MSc', 'MCom', 'MBA', 'Other',
];

/* ── Small reusable field wrapper ── */
const Field = ({ label, required, children, hint }) => (
  <div>
    <label className="label">
      {label}{required && <span className="text-danger ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-text-xmuted mt-1">{hint}</p>}
  </div>
);

/* ── Section divider ── */
const Section = ({ title, subtitle }) => (
  <div className="pt-2 pb-1">
    <h2 className="text-sm font-semibold text-text uppercase tracking-wide">{title}</h2>
    {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
    <div className="border-t border-border mt-2" />
  </div>
);

const Apply = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [otherQual, setOtherQual] = useState('');

  const [form, setForm] = useState({
    // Personal
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    dob: user?.profile?.dob || '',
    maritalStatus: user?.profile?.maritalStatus || '',
    // Family
    fatherName: user?.profile?.fatherName || '',
    fatherPhone: user?.profile?.fatherPhone || '',
    motherName: user?.profile?.motherName || '',
    motherPhone: user?.profile?.motherPhone || '',
    // Education
    highestQualification: user?.profile?.highestQualification || '',
    discipline: user?.profile?.discipline || '',
    primarySchool: user?.profile?.primarySchool || '',
    middleSchool: user?.profile?.middleSchool || '',
    highSchool: user?.profile?.highSchool || '',
    higherSecondarySchool: user?.profile?.higherSecondarySchool || '',
    undergraduateInstitute: user?.profile?.undergraduateInstitute || '',
    postgraduateInstitute: user?.profile?.postgraduateInstitute || '',
    // Experience
    experience: user?.profile?.experience || '',
    referenceeName: user?.profile?.referenceeName || '',
    referencePhone: user?.profile?.referencePhone || '',
  });

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/apply/${id}`);
      return;
    }
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error('Error fetching job:', err);
      } finally {
        setJobLoading(false);
      }
    };
    fetchJob();
  }, [id, user, navigate]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    setSubmitting(true);
    try {
      const qual = form.highestQualification === 'Other' ? otherQual : form.highestQualification;
      await axios.post(`${API_BASE_URL}/applications`, {
        job: id,
        applicant: user.id || user._id,
        details: {
          ...form,
          highestQualification: qual,
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasField = (f) => !job?.applicationFields || job.applicationFields.length === 0 || job.applicationFields.includes(f);

  if (jobLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
    </div>
  );

  /* ── Success screen ── */
  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-14">
      <div className="text-center max-w-sm animate-fade-up">
        <div className="w-16 h-16 rounded-2xl bg-success-light flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-success" />
        </div>
        <h1 className="text-2xl font-bold text-text mb-2">Application submitted!</h1>
        <p className="text-text-muted text-sm leading-relaxed mb-2">
          Thank you for applying for <span className="font-medium text-text">{job?.title}</span>.
        </p>
        <p className="text-xs text-text-xmuted mb-8">
          We will review your application carefully and get back to you within 5–7 business days. Please note that submitted applications cannot be edited or revoked.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard" className="btn-primary no-underline justify-center">View my applications</Link>
          <Link to="/" className="btn-outline no-underline justify-center">Browse more jobs</Link>
        </div>
      </div>
    </div>
  );

  const inputCls = 'input';
  const selectCls = 'input appearance-none cursor-pointer';

  return (
    <div className="min-h-screen bg-surface-2 pt-14">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-text-muted">
          <button onClick={() => navigate(`/jobs/${id}`)} className="hover:text-text transition-colors flex items-center gap-1">
            ← Back to role
          </button>
          {job && <><span>/</span><span className="text-text truncate">Apply — {job.title}</span></>}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-6 animate-fade-up">
          <h1 className="text-2xl font-bold text-text">Job Application Form</h1>
          {job && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-7 h-7 rounded-md bg-accent-light flex items-center justify-center">
                <Briefcase size={13} className="text-accent" />
              </div>
              <span className="text-sm text-text-muted">
                <span className="font-medium text-text">{job.title}</span>
                {job.department && <> · {job.department}</>}
                <span className="flex items-center gap-1 inline-flex ml-2">
                  <Building2 size={12} /> Connich
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Important notice */}
        <div className="flex gap-3 p-4 bg-warning-light border border-warning/25 rounded-xl mb-6 animate-fade-up-1">
          <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-text mb-0.5">Please read before proceeding</p>
            <p className="text-text-muted leading-relaxed">
              Ensure all information entered is accurate and complete. <strong className="text-text">Applications once submitted cannot be edited or revoked.</strong> Fields marked <span className="text-danger font-bold">*</span> are required.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up-2">

          {/* ── 1. Personal Information ── */}
          <div className="bg-white rounded-xl border border-border p-6 space-y-5">
            <Section title="Personal Information" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" required>
                <input type="text" required value={form.name} onChange={set('name')}
                  placeholder="As per official documents" className={inputCls} />
              </Field>
              <Field label="Email Address" hint="Autofilled from your account">
                <input type="email" value={form.email} readOnly
                  className={`${inputCls} bg-surface-2 text-text-muted cursor-not-allowed`} />
              </Field>
              {hasField('phone') && (
                <Field label="Phone Number" required>
                  <input type="tel" required value={form.phone} onChange={set('phone')}
                    placeholder="+91 98765 43210" className={inputCls} />
                </Field>
              )}
              {hasField('dob') && (
                <Field label="Date of Birth" required hint="DD/MM/YYYY">
                  <input type="text" required value={form.dob} onChange={set('dob')}
                    placeholder="DD/MM/YYYY" maxLength={10}
                    pattern="\d{2}/\d{2}/\d{4}"
                    className={inputCls} />
                </Field>
              )}
            </div>

            {/* Address */}
            {hasField('address') && (
              <Field label="Address" required>
                <textarea required value={form.address} onChange={set('address')}
                  placeholder="Full Residential Address" rows="3" className="input resize-none" />
              </Field>
            )}

            {hasField('maritalStatus') && (
              <Field label="Marital Status" required>
                <div className="relative">
                  <select required value={form.maritalStatus} onChange={set('maritalStatus')}
                    className={selectCls}>
                    <option value="">Select status…</option>
                    <option value="Single/Unmarried">Single / Unmarried</option>
                    <option value="Married">Married</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                </div>
              </Field>
            )}
          </div>

          {/* ── 2. Family Information ── */}
          {hasField('familyInfo') && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
              <Section title="Family Information" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Father's Name" required>
                  <input type="text" required value={form.fatherName} onChange={set('fatherName')}
                    placeholder="Full name" className={inputCls} />
                </Field>
                <Field label="Father's Phone Number" required>
                  <input type="tel" required value={form.fatherPhone} onChange={set('fatherPhone')}
                    placeholder="+91 98765 43210" className={inputCls} />
                </Field>
                <Field label="Mother's Name" required>
                  <input type="text" required value={form.motherName} onChange={set('motherName')}
                    placeholder="Full name" className={inputCls} />
                </Field>
                <Field label="Mother's Phone Number" required>
                  <input type="tel" required value={form.motherPhone} onChange={set('motherPhone')}
                    placeholder="+91 98765 43210" className={inputCls} />
                </Field>
              </div>
            </div>
          )}

          {/* ── 3. Educational Background ── */}
          {hasField('educationHistory') && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
            <Section
              title="Educational Background"
              subtitle="All fields are required. Enter 'N/A' if a level was not attended."
            />

            {/* Highest Qualification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Highest Qualification" required>
                <div className="relative">
                  <select required value={form.highestQualification}
                    onChange={set('highestQualification')} className={selectCls}>
                    <option value="">Select qualification…</option>
                    {QUALIFICATIONS.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                </div>
              </Field>
              <Field label="Discipline / Subject" required>
                {form.highestQualification === 'Other' ? (
                  <input type="text" required value={otherQual} onChange={(e) => setOtherQual(e.target.value)}
                    placeholder="Specify your qualification" className={inputCls} />
                ) : (
                  <input type="text" required value={form.discipline} onChange={set('discipline')}
                    placeholder="e.g. Computer Science, Commerce" className={inputCls} />
                )}
              </Field>
            </div>

            {/* School names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name of Primary School Attended" required>
                <input type="text" required value={form.primarySchool} onChange={set('primarySchool')}
                  placeholder="School name" className={inputCls} />
              </Field>
              <Field label="Name of Middle School Attended" required>
                <input type="text" required value={form.middleSchool} onChange={set('middleSchool')}
                  placeholder="School name" className={inputCls} />
              </Field>
              <Field label="Name of High School Attended" required>
                <input type="text" required value={form.highSchool} onChange={set('highSchool')}
                  placeholder="School name (Class 10)" className={inputCls} />
              </Field>
              <Field label="Name of Higher Secondary School Attended" required>
                <input type="text" required value={form.higherSecondarySchool} onChange={set('higherSecondarySchool')}
                  placeholder="School / College name (Class 12)" className={inputCls} />
              </Field>
              <Field label="Name of Undergraduate Institute Attended" required>
                <input type="text" required value={form.undergraduateInstitute} onChange={set('undergraduateInstitute')}
                  placeholder="College / University name" className={inputCls} />
              </Field>
              <Field label="Name of Postgraduate Institute Attended" required>
                <input type="text" required value={form.postgraduateInstitute} onChange={set('postgraduateInstitute')}
                  placeholder="College / University name" className={inputCls} />
              </Field>
            </div>
          </div>
          )}

          {/* ── 4. Work Experience ── */}
          {(hasField('experience') || hasField('reference')) && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
            <Section
              title="Work Experience"
              subtitle="Describe your relevant experience and provide a professional reference."
            />

            {hasField('experience') && (
              <Field label="Work Experience" required>
                <textarea required value={form.experience} onChange={set('experience')} rows={4}
                  placeholder="Describe your previous roles, responsibilities, and duration. If you are a fresher, write 'No prior experience'."
                  className={`${inputCls} resize-none`} />
              </Field>
            )}

            {hasField('reference') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Reference Name" hint="A professional contact who can vouch for your work">
                  <input type="text" value={form.referenceeName} onChange={set('referenceeName')}
                    placeholder="Full name" className={inputCls} />
                </Field>
                <Field label="Reference Phone Number">
                  <input type="tel" value={form.referencePhone} onChange={set('referencePhone')}
                    placeholder="+91 98765 43210" className={inputCls} />
                </Field>
              </div>
            )}
          </div>
          )}

          {/* ── 5. Declaration ── */}
          <div className="bg-white rounded-xl border border-border p-6">
            <Section title="Declaration" />

            <label className={`flex items-start gap-3 mt-4 cursor-pointer group`}>
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  id="agree-declaration"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                  required
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  agreed ? 'bg-accent border-accent' : 'border-border-2 group-hover:border-accent'
                }`}>
                  {agreed && <CheckCircle2 size={12} className="text-white" strokeWidth={3} />}
                </div>
              </div>
              <p className="text-sm text-text-2 leading-relaxed">
                I hereby declare that all information furnished in this application is true, complete, and accurate to the best of my knowledge and belief. I understand that any misrepresentation, falsification, or material omission of information in this application may result in{' '}
                <strong className="text-text">rejection of my application</strong>. Furthermore, if any such discrepancy is discovered after my appointment, it may lead to{' '}
                <strong className="text-text">immediate termination of my employment</strong>, regardless of my tenure or position, without any liability to the organisation.
              </p>
            </label>
          </div>

          {/* ── Submit ── */}
          <div className="bg-white rounded-xl border border-border p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <p className="text-xs text-text-muted leading-relaxed max-w-sm">
              By clicking <strong>Submit Application</strong>, you confirm that you have read and agreed to the declaration above. Submitted applications cannot be modified or withdrawn.
            </p>
            <div className="flex gap-3 shrink-0">
              <button type="button" onClick={() => navigate(`/jobs/${id}`)} className="btn-outline">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !agreed}
                title={!agreed ? 'Please accept the declaration to submit' : ''}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Apply;
