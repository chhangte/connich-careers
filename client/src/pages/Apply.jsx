import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Building2, Briefcase, Info, ChevronDown, Plus, Trash2, PlusCircle, X } from 'lucide-react';
import axios from 'axios';
import { useCompany } from '../context/CompanyContext';
import CompanyNavbar from '../components/CompanyNavbar';
import TenantFooter from '../components/TenantFooter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE_URL = '/api';

const QUALIFICATIONS = [
  'Year 10 / SSC', 'Year 12 / HSC', 'Diploma', 'Bachelors', 'Masters', 'PhD',
];

const CATEGORIES = [
  'General / Unreserved (UR)', 
  'Other Backward Classes (OBC) - Creamy Layer', 
  'Other Backward Classes (OBC) - Non-Creamy Layer', 
  'Scheduled Castes (SC)', 
  'Scheduled Tribes (ST)', 
  'Economically Weaker Sections (EWS)'
];

const FIELDS = [
  'Arts', 'Science', 'Commerce', 'Business / Management', 'Engineering / Technology', 'Design / Media', 'Law', 'Medicine', 'Other',
];

const STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Outside India'
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS = Array.from({ length: 40 }, (_, i) => (new Date().getFullYear() - i).toString());

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
  const location = useLocation();
  const guestEmail = location.state?.guestEmail || '';
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [otherField, setOtherField] = useState('');

  const [form, setForm] = useState({
    // Personal
    name: user?.name || '',
    email: user?.email || guestEmail || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    houseNumber: '',
    area: '',
    city: '',
    state: '',
    country: '',
    pin: '',
    dob: user?.profile?.dob || '',
    gender: user?.profile?.gender || '',
    nationality: user?.profile?.nationality || '',
    ethnicity: user?.profile?.ethnicity || '',
    religion: user?.profile?.religion || '',
    category: user?.profile?.category || '',
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
    hscStream: user?.profile?.hscStream || '',
    undergraduateInstitute: user?.profile?.undergraduateInstitute || '',
    ugCourse: user?.profile?.ugCourse || '',
    diplomaInstitute: user?.profile?.diplomaInstitute || '',
    diplomaCourse: user?.profile?.diplomaCourse || '',
    postgraduates: user?.profile?.postgraduates || [{ institute: '', course: '' }],
    // Experience
    isFresher: user?.profile?.isFresher || false,
    experiences: user?.profile?.experiences || [{ jobTitle: '', description: '', fromMonth: '', fromYear: '', toMonth: '', toYear: '', referenceName: '', referencePhone: '' }],
    // Extracurriculars
    languages: user?.profile?.languages || [{ name: '', proficiency: '' }],
    sports: user?.profile?.sports || { name: '', description: '' },
    music: user?.profile?.music || { name: '', description: '' },
    arts: user?.profile?.arts || { name: '', description: '' },
  });

  const { company: contextCompany } = useCompany();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/jobs/${id}`);
        setJob(res.data);
        
        // If we're on the generic /apply/:id path, redirect to branded /:slug/apply/:id
        const slug = res.data.postedBy?.company?.slug;
        if (slug && !location.pathname.startsWith(`/${slug}`)) {
          navigate(`/${slug}/apply/${id}`, { state: location.state, replace: true });
        }
      } catch (err) {
        console.error('Error fetching job:', err);
      } finally {
        setJobLoading(false);
      }
    };
    fetchJob();
  }, [id, location, navigate]);

  const company = contextCompany || job?.postedBy?.company;
  const primaryColor = company?.brandPrimary || '#2563eb';
  const accentColor = company?.brandAccent || '#1e3a5f';

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleDOBChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);

    let res = "";
    for (let i = 0; i < val.length; i++) {
      if (i === 2 || i === 4) res += "-";
      res += val[i];
    }
    setForm(prev => ({ ...prev, dob: res }));
  };

  const addPostgraduate = () => {
    setForm({ ...form, postgraduates: [...form.postgraduates, { institute: '', course: '' }] });
  };

  const removePostgraduate = (index) => {
    const updated = form.postgraduates.filter((_, i) => i !== index);
    setForm({ ...form, postgraduates: updated.length ? updated : [{ institute: '', course: '' }] });
  };

  const updatePostgraduate = (index, field, value) => {
    const updated = form.postgraduates.map((pg, i) =>
      i === index ? { ...pg, [field]: value } : pg
    );
    setForm({ ...form, postgraduates: updated });
  };

  const addExperience = () => {
    setForm(prev => ({
      ...prev,
      experiences: [...prev.experiences, { jobTitle: '', description: '', fromMonth: '', fromYear: '', toMonth: '', toYear: '', referenceName: '', referencePhone: '' }]
    }));
  };

  const removeExperience = (index) => {
    if (form.experiences.length <= 1) {
      setForm(prev => ({
        ...prev,
        experiences: [{ jobTitle: '', description: '', referenceName: '', referencePhone: '' }]
      }));
      return;
    }
    setForm(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index, field, value) => {
    setForm(prev => {
      const updated = [...prev.experiences];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experiences: updated };
    });
  };

  const addLanguage = () => {
    setForm({ ...form, languages: [...form.languages, { name: '', proficiency: '' }] });
  };
  const removeLanguage = (index) => {
    const updated = form.languages.filter((_, i) => i !== index);
    setForm({ ...form, languages: updated.length ? updated : [{ name: '', proficiency: '' }] });
  };
  const updateLanguage = (index, field, value) => {
    const updated = form.languages.map((l, i) => i === index ? { ...l, [field]: value } : l);
    setForm({ ...form, languages: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    setSubmitting(true);
    try {
      const disc = form.discipline === 'Other' ? otherField : form.discipline;
      const displayState = form.state === 'Outside India' ? form.country : form.state;
      const combinedAddress = `${form.houseNumber}, ${form.area}, ${form.city}, ${displayState} - ${form.pin}`;
      await axios.post(`${API_BASE_URL}/applications`, {
        job: id,
        applicant: user?.id || user?._id || null, // null for guest
        details: {
          ...form,
          address: combinedAddress,
          discipline: disc,
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

  const getSetting = (name, legacyKey = null) => {
    // 1. Job-level overrides (new object structure)
    if (job?.applicationSettings && job.applicationSettings[name] !== undefined) {
      return job.applicationSettings[name];
    }
    // 2. Job-level overrides (legacy array structure)
    if (legacyKey && job?.applicationFields && job.applicationFields.length > 0) {
      return job.applicationFields.includes(legacyKey);
    }
    // 3. Company-level defaults
    if (company?.applicationSettings && company.applicationSettings[name] !== undefined) {
      return company.applicationSettings[name];
    }
    // 4. Global default
    return true;
  };

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
          {user ? (
            <Link to="/dashboard" className="btn-primary no-underline justify-center" style={{ background: primaryColor }}>View my applications</Link>
          ) : (
            <div className="text-xs text-text-muted mt-2">An update will be sent to your email.</div>
          )}
          <Link to="/" className="btn-outline no-underline justify-center">Browse more jobs</Link>
        </div>
      </div>
    </div>
  );

  const inputCls = 'input';
  const selectCls = 'input appearance-none cursor-pointer';

  // If we are inside TenantLayout, useCompany() will have the company.
  // If not (e.g. during redirect or fallback), we use the one from job.
  const isBranded = !!contextCompany || !!job?.postedBy?.company?.slug;

  return (
    <div className="flex flex-col min-h-screen bg-surface-2">
      {contextCompany ? null : isBranded && job?.postedBy?.company ? (
        // Temporary navbar if not yet in TenantLayout
        <div className="fixed top-0 inset-x-0 z-50 h-14 bg-white border-b flex items-center px-4 sm:px-6">
           <div className="w-8 h-8 rounded bg-gray-100 mr-2 shrink-0" />
           <span className="font-semibold text-sm">{job.postedBy.company.name}</span>
        </div>
      ) : (
        <Navbar user={user} />
      )}

      <div className="flex-1 pt-14">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-text-muted">
          <button 
            onClick={() => {
              const slug = company?.slug || job?.companyId?.slug;
              if (slug) navigate(`/${slug}/jobs/${id}`);
              else navigate(`/jobs/${id}`);
            }} 
            className="hover:text-text transition-colors flex items-center gap-1"
          >
            ← Back to role
          </button>
          {job && <><span>/</span><span className="text-text truncate">Apply — {job.title}</span></>}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-6 animate-fade-up">
          <h2 className="text-xl font-bold text-text">Job Application Form</h2>
          {job && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-7 h-7 rounded-md bg-accent-light flex items-center justify-center">
                <Briefcase size={13} className="text-accent" />
              </div>
              <span className="text-sm text-text-muted">
                <span className="font-medium text-text">{job.title}</span>
                {job.department && <> · {job.department}</>}
                <span className="flex items-center gap-1 inline-flex ml-2">
                  <Building2 size={12} /> {job.postedBy?.company?.name || 'Connich'}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Important notice */}
        <div className="flex gap-3 p-4 bg-accent-light border border-accent/25 rounded-xl mb-6 animate-fade-up-1">
          <Info size={18} className="text-accent shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-text mb-0.5">Please note before proceeding</p>
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
              <Field label="Email Address" required={!user} hint={user ? "Autofilled from your account" : "Updates will be sent here"}>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  readOnly={!!user}
                  className={`${inputCls} ${user ? 'bg-surface-2 text-text-muted cursor-not-allowed' : ''}`}
                />
              </Field>
              {getSetting('collectPhone', 'phone') && (
                <Field label="Phone Number" required>
                  <input type="tel" required value={form.phone} onChange={set('phone')}
                    placeholder="+91 98765 43210" className={inputCls} />
                </Field>
              )}
              {getSetting('collectDOB', 'dob') && (
                <Field label="Date of Birth" required hint="DD-MM-YYYY">
                  <input type="text" required value={form.dob} onChange={handleDOBChange}
                    placeholder="DD-MM-YYYY" maxLength={10}
                    className={inputCls} />
                </Field>
              )}

              {getSetting('collectGender') && (
                <Field label="Gender" required>
                  <div className="relative">
                    <select required value={form.gender} onChange={set('gender')} className={selectCls}>
                      <option value="">Select gender…</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                  </div>
                </Field>
              )}

              {getSetting('collectCategory') && (
                <Field label="Category" required>
                  <div className="relative">
                    <select required value={form.category} onChange={set('category')} className={selectCls}>
                      <option value="">Select category…</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                  </div>
                </Field>
              )}

              {getSetting('collectNationality') && (
                <Field label="Nationality" required>
                  <input type="text" required value={form.nationality} onChange={set('nationality')}
                    placeholder="e.g. Indian" className={inputCls} />
                </Field>
              )}

              {getSetting('collectEthnicity') && (
                <Field label="Ethnicity" required>
                  <div className="relative">
                    <select required value={form.ethnicity} onChange={set('ethnicity')} className={selectCls}>
                      <option value="">Select ethnicity…</option>
                      <option value="Asian">Asian</option>
                      <option value="Black / African">Black / African</option>
                      <option value="Hispanic / Latino">Hispanic / Latino</option>
                      <option value="White / Caucasian">White / Caucasian</option>
                      <option value="Middle Eastern">Middle Eastern</option>
                      <option value="Native American">Native American</option>
                      <option value="Pacific Islander">Pacific Islander</option>
                      <option value="Mixed / Multiple">Mixed / Multiple</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                  </div>
                </Field>
              )}

              {getSetting('collectReligion') && (
                <Field label="Religion" required>
                  <div className="relative">
                    <select required value={form.religion} onChange={set('religion')} className={selectCls}>
                      <option value="">Select religion…</option>
                      <option value="Hinduism">Hinduism</option>
                      <option value="Islam">Islam</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Sikhism">Sikhism</option>
                      <option value="Buddhism">Buddhism</option>
                      <option value="Jainism">Jainism</option>
                      <option value="Zoroastrianism">Zoroastrianism (Parsi)</option>
                      <option value="No Religion / Secular">No Religion / Secular</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                  </div>
                </Field>
              )}

              {getSetting('collectMaritalStatus', 'maritalStatus') && (
                <Field label="Marital Status" required>
                  <div className="relative">
                    <select required value={form.maritalStatus}
                      onChange={set('maritalStatus')}
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

            {/* Address */}
            {getSetting('collectAddress', 'address') && (
              <div className="space-y-4">
                <Section title="Residential Address" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <Field label="House Number" required>
                    <input type="text" required value={form.houseNumber} onChange={set('houseNumber')}
                      placeholder="e.g. Flat 402, Building A" className={inputCls} />
                  </Field>
                  <Field label="Area / Locality" required>
                    <input type="text" required value={form.area} onChange={set('area')}
                      placeholder="e.g. Sector 15, Near Mall" className={inputCls} />
                  </Field>
                  <Field label="City" required>
                    <input type="text" required value={form.city} onChange={set('city')}
                      placeholder="e.g. Mumbai" className={inputCls} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="State" required>
                      <div className="relative">
                        <select required value={form.state} onChange={set('state')} className={`${inputCls} appearance-none pr-10`}>
                          <option value="">Select State</option>
                          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                      </div>
                    </Field>
                    <Field label="PIN Code" required>
                      <input type="text" required value={form.pin} onChange={set('pin')}
                        placeholder="400001" className={inputCls} />
                    </Field>
                  </div>
                  {form.state === 'Outside India' && (
                    <Field label="Country" required>
                      <input type="text" required value={form.country} onChange={set('country')}
                        placeholder="e.g. United Kingdom" className={inputCls} />
                    </Field>
                  )}
                </div>
              </div>
            )}
          </div>

            {getSetting('collectFamilyInfo', 'familyInfo') && (
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
          {getSetting('collectEducation', 'educationHistory') && (
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
                <Field label="Field" required>
                  <div className="relative">
                    <select required value={form.discipline}
                      onChange={set('discipline')} className={selectCls}>
                      <option value="">Select field…</option>
                      {FIELDS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                  </div>
                </Field>
                {form.discipline === 'Other' && (
                  <div className="sm:col-start-2">
                    <Field label="Specify Other Field" required>
                      <input type="text" required value={otherField} onChange={(e) => setOtherField(e.target.value)}
                        placeholder="Enter your field of study" className={inputCls} />
                    </Field>
                  </div>
                )}
              </div>

              {/* School names */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name of Primary School Attended" required>
                    <input type="text" required value={form.primarySchool} onChange={set('primarySchool')}
                      placeholder="School name" className={inputCls} />
                  </Field>
                  <Field label="Name of Middle School Attended" required>
                    <input type="text" required value={form.middleSchool} onChange={set('middleSchool')}
                      placeholder="School name" className={inputCls} />
                  </Field>
                  <Field label="Name of High School Attended (Class 10)" required>
                    <input type="text" required value={form.highSchool} onChange={set('highSchool')}
                      placeholder="School name" className={inputCls} />
                  </Field>
                </div>

                {['Year 12 / HSC', 'Diploma', 'Bachelors', 'Masters', 'PhD'].includes(form.highestQualification) && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Higher Secondary School (Class 12)" required>
                        <input type="text" required value={form.higherSecondarySchool} onChange={set('higherSecondarySchool')}
                          placeholder="School name" className={inputCls} />
                      </Field>
                      <Field label="Stream" required>
                        <div className="relative">
                          <select required value={form.hscStream} onChange={set('hscStream')} className={selectCls}>
                            <option value="">Select Stream</option>
                            <option value="Arts">Arts</option>
                            <option value="Science">Science</option>
                            <option value="Commerce">Commerce</option>
                            <option value="Other">Other</option>
                          </select>
                          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                        </div>
                      </Field>
                    </div>
                  </div>
                )}

                {form.highestQualification === 'Diploma' && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Diploma Institute Attended" required>
                        <input type="text" required value={form.diplomaInstitute} onChange={set('diplomaInstitute')}
                          placeholder="Institute name" className={inputCls} />
                      </Field>
                      <Field label="Diploma Course" required>
                        <input type="text" required value={form.diplomaCourse} onChange={set('diplomaCourse')}
                          placeholder="e.g. Diploma in Civil Engineering" className={inputCls} />
                      </Field>
                    </div>
                  </div>
                )}

                {['Bachelors', 'Masters', 'PhD'].includes(form.highestQualification) && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Undergraduate Institute Attended" required>
                        <input type="text" required value={form.undergraduateInstitute} onChange={set('undergraduateInstitute')}
                          placeholder="College / University name" className={inputCls} />
                      </Field>
                      <Field label="Course / Major" required>
                        <input type="text" required value={form.ugCourse} onChange={set('ugCourse')}
                          placeholder="e.g. B.A. English, B.Sc. Physics" className={inputCls} />
                      </Field>
                    </div>
                  </div>
                )}

                {['Masters', 'PhD'].includes(form.highestQualification) && (
                  <div className="space-y-4">
                    {form.postgraduates.map((pg, index) => (
                      <div key={index} className="pt-4 border-t border-border/50 animate-fade-up">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-text-xmuted">Postgraduate #{index + 1}</p>
                          {form.postgraduates.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePostgraduate(index)}
                              className="text-danger hover:bg-danger-light p-1 rounded-md transition-colors"
                              title="Remove"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Postgraduate Institute Attended" required>
                            <input type="text" required value={pg.institute} onChange={(e) => updatePostgraduate(index, 'institute', e.target.value)}
                              placeholder="College / University name" className={inputCls} />
                          </Field>
                          <Field label="Course / Major" required>
                            <input type="text" required value={pg.course} onChange={(e) => updatePostgraduate(index, 'course', e.target.value)}
                              placeholder="e.g. M.A. Psychology" className={inputCls} />
                          </Field>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPostgraduate}
                      className="text-accent text-xs font-bold hover:underline flex items-center gap-1.5 mt-2"
                    >
                      <Plus size={14} /> Add Postgraduate Institute
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {(getSetting('collectExperience', 'experience') || getSetting('collectReference', 'reference')) && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
              <Section
                title="Work Experience"
                subtitle="Mention your professional journey. You may include internships as work experience."
              />

              {/* Fresher Checkbox */}
              <label className="flex items-center gap-3 p-4 bg-surface-2 rounded-xl border border-border/50 cursor-pointer group hover:border-accent transition-colors">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={form.isFresher}
                    onChange={(e) => setForm({ ...form, isFresher: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${form.isFresher ? 'bg-accent border-accent' : 'border-border-2 group-hover:border-accent'
                    }`}>
                    {form.isFresher && <CheckCircle2 size={12} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
                <span className="text-sm font-medium text-text">I am a Fresher (No prior work experience)</span>
              </label>

              {!form.isFresher && (
                <div className="space-y-6">
                  {form.experiences.map((exp, index) => (
                    <div key={index} className="relative p-5 rounded-xl bg-surface-2 border border-border/50 space-y-4 animate-fade-up">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-text-muted flex items-center gap-2 uppercase tracking-tight">
                          <Briefcase size={14} /> Experience #{index + 1}
                        </h4>
                        {form.experiences.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="text-danger hover:bg-danger-light p-1.5 rounded-md transition-colors"
                            title="Remove experience"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Field label="Job Title" required>
                          <input
                            type="text"
                            required
                            value={exp.jobTitle}
                            onChange={(e) => updateExperience(index, 'jobTitle', e.target.value)}
                            placeholder="e.g. Software Engineer"
                            className={inputCls}
                          />
                        </Field>

                        <Field label="Description / Responsibilities" required>
                          <textarea
                            required
                            value={exp.description}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                            rows={3}
                            placeholder="Briefly describe your role and achievements"
                            className={`${inputCls} resize-none`}
                          />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="From" required>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <select required value={exp.fromMonth} onChange={(e) => updateExperience(index, 'fromMonth', e.target.value)} className={selectCls}>
                                  <option value="">Month</option>
                                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                              </div>
                              <div className="relative">
                                <select required value={exp.fromYear} onChange={(e) => updateExperience(index, 'fromYear', e.target.value)} className={selectCls}>
                                  <option value="">Year</option>
                                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                              </div>
                            </div>
                          </Field>
                          <Field label="To" required hint="Use current date if ongoing">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <select required value={exp.toMonth} onChange={(e) => updateExperience(index, 'toMonth', e.target.value)} className={selectCls}>
                                  <option value="">Month</option>
                                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                              </div>
                              <div className="relative">
                                <select required value={exp.toYear} onChange={(e) => updateExperience(index, 'toYear', e.target.value)} className={selectCls}>
                                  <option value="">Year</option>
                                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                              </div>
                            </div>
                          </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Reference Name" required>
                            <input
                              type="text"
                              required
                              value={exp.referenceName}
                              onChange={(e) => updateExperience(index, 'referenceName', e.target.value)}
                              placeholder="Full Name"
                              className={inputCls}
                            />
                          </Field>
                          <Field label="Reference Phone Number" required>
                            <input
                              type="tel"
                              required
                              value={exp.referencePhone}
                              onChange={(e) => updateExperience(index, 'referencePhone', e.target.value)}
                              placeholder="+91 98765 43210"
                              className={inputCls}
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addExperience}
                    className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-accent hover:bg-accent-light text-text-muted hover:text-accent rounded-xl transition-all font-medium group"
                  >
                    <Plus size={20} className="group-hover:scale-110 transition-transform" />
                    Add another work experience
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── 5. Languages Known ── */}
          {getSetting('collectLanguages') && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
              <Section title="Languages Known" />
              <div className="space-y-4">
                {form.languages.map((lang, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border/50 bg-surface-2/50 relative group animate-fade-up">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label={`Language #${idx + 1}`} required>
                        <input
                          type="text"
                          required
                          value={lang.name}
                          onChange={(e) => updateLanguage(idx, 'name', e.target.value)}
                          placeholder="e.g. English, Hindi, Mizo"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Proficiency" required>
                        <div className="relative">
                          <select
                            required
                            value={lang.proficiency}
                            onChange={(e) => updateLanguage(idx, 'proficiency', e.target.value)}
                            className={selectCls}
                          >
                            <option value="">Select proficiency…</option>
                            <option value="Native / Bilingual">Native / Bilingual</option>
                            <option value="Fluent / Professional">Fluent / Professional</option>
                            <option value="Intermediate / Professional Working">Intermediate / Professional Working</option>
                            <option value="Elementary / Limited Working">Elementary / Limited Working</option>
                            <option value="Beginner / Basic">Beginner / Basic</option>
                          </select>
                          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                        </div>
                      </Field>
                    </div>
                    {form.languages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLanguage(idx)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-danger/20 text-danger shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-light"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLanguage}
                  className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors px-1"
                >
                  <PlusCircle size={16} /> Add Language
                </button>
              </div>
            </div>
          )}

          {/* ── 6. Extracurricular Interests ── */}
          {(getSetting('collectSports') || 
             getSetting('collectMusic') || 
             getSetting('collectArts')) && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-6">
              <Section title="Extracurricular Interests" subtitle="Select interests and provide optional details like certifications or achievements." />
              
              <div className="space-y-6">
                {getSetting('collectSports') && (
                  <div className="space-y-4">
                    <Field label="Sports Interest">
                      <div className="relative">
                        <select
                          value={form.sports.name}
                          onChange={(e) => setForm({ ...form, sports: { ...form.sports, name: e.target.value } })}
                          className={selectCls}
                        >
                          <option value="">None / Not specified</option>
                          {['Football', 'Basketball', 'Cricket', 'Badminton', 'Tennis', 'Table Tennis', 'Volleyball', 'Athletics', 'Swimming', 'Boxing / Martial Arts', 'Chess', 'E-Sports', 'Other'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="Sports Achievements / Certifications (Optional)">
                      <textarea
                        rows={2}
                        value={form.sports.description}
                        onChange={(e) => setForm({ ...form, sports: { ...form.sports, description: e.target.value } })}
                        placeholder="Describe your role, certificates, or notable achievements..."
                        className="input min-h-[80px] py-2"
                      />
                    </Field>
                  </div>
                )}

                {getSetting('collectMusic') && (
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <Field label="Musical Instruments">
                      <div className="relative">
                        <select
                          value={form.music.name}
                          onChange={(e) => setForm({ ...form, music: { ...form.music, name: e.target.value } })}
                          className={selectCls}
                        >
                          <option value="">None / Not specified</option>
                          {['Guitar (Acoustic/Electric)', 'Piano / Keyboard', 'Drums / Percussion', 'Violin', 'Flute', 'Vocals', 'Bass Guitar', 'Other'].map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="Music Achievements / Certifications (Optional)">
                      <textarea
                        rows={2}
                        value={form.music.description}
                        onChange={(e) => setForm({ ...form, music: { ...form.music, description: e.target.value } })}
                        placeholder="Grade levels, performances, or certifications..."
                        className="input min-h-[80px] py-2"
                      />
                    </Field>
                  </div>
                )}

                {getSetting('collectArts') && (
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <Field label="Fine / Performing Arts">
                      <div className="relative">
                        <select
                          value={form.arts.name}
                          onChange={(e) => setForm({ ...form, arts: { ...form.arts, name: e.target.value } })}
                          className={selectCls}
                        >
                          <option value="">None / Not specified</option>
                          {['Painting / Sketching', 'Dance (Modern/Classical)', 'Theatre / Drama', 'Photography', 'Sculpting', 'Graphic Design / Digital Art', 'Other'].map(a => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="Arts Achievements / Certifications (Optional)">
                      <textarea
                        rows={2}
                        value={form.arts.description}
                        onChange={(e) => setForm({ ...form, arts: { ...form.arts, description: e.target.value } })}
                        placeholder="Exhibitions, stage shows, or art certifications..."
                        className="input min-h-[80px] py-2"
                      />
                    </Field>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Final Agreement ── */}
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
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${agreed ? 'bg-accent border-accent' : 'border-border-2 group-hover:border-accent'
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
              <button type="button" onClick={() => navigate(-1)} className="btn-outline">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !agreed}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: agreed ? primaryColor : undefined }}
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>
          </div>

        </form>
      </div>
      </div>
      {contextCompany ? null : isBranded ? <TenantFooter /> : <Footer />}
    </div>
  );
};

export default Apply;
