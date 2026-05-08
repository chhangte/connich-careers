import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, ArrowRight, CheckCircle2, Upload, Globe, MapPin, Briefcase, ChevronDown } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const INDUSTRIES = [
  'Education & EdTech',
  'Technology & Software',
  'Healthcare',
  'Finance & Banking',
  'Manufacturing',
  'Retail & E-commerce',
  'Media & Entertainment',
  'Government & Public Sector',
  'Non-Profit / NGO',
  'Consulting',
  'Real Estate',
  'Other',
];

const STEPS = ['Account', 'Company Profile'];

const Step1 = ({ form, setForm, showPassword, setShowPassword }) => (
  <div className="space-y-4">
    <div>
      <label className="label" htmlFor="r-name">Your full name <span className="text-danger">*</span></label>
      <input id="r-name" type="text" required value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        placeholder="Jane Smith" className="input" autoComplete="name" />
    </div>
    <div>
      <label className="label" htmlFor="r-email">Work email <span className="text-danger">*</span></label>
      <input id="r-email" type="email" required value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        placeholder="jane@company.com" className="input" autoComplete="email" />
    </div>
    <div>
      <label className="label" htmlFor="r-password">Password <span className="text-danger">*</span></label>
      <div className="relative">
        <input id="r-password" type={showPassword ? 'text' : 'password'} required
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          placeholder="Min. 8 characters" className="input pr-10" autoComplete="new-password" />
        <button type="button" onClick={() => setShowPassword(p => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted hover:text-text-muted" tabIndex={-1}>
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  </div>
);

const Step2 = ({ form, setForm }) => (
  <div className="space-y-4">
    <div>
      <label className="label" htmlFor="c-name">Company name <span className="text-danger">*</span></label>
      <input id="c-name" type="text" required value={form.company.name}
        onChange={e => setForm(f => ({ ...f, company: { ...f.company, name: e.target.value } }))}
        placeholder="Acme Corp." className="input" />
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="label" htmlFor="c-industry">Industry <span className="text-danger">*</span></label>
        <div className="relative">
          <select id="c-industry" required value={form.company.industry}
            onChange={e => setForm(f => ({ ...f, company: { ...f.company, industry: e.target.value } }))}
            className="input appearance-none cursor-pointer pr-8">
            <option value="">Select…</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted pointer-events-none" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-location">HQ Location</label>
        <div className="relative">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-xmuted" />
          <input id="c-location" type="text" value={form.company.location}
            onChange={e => setForm(f => ({ ...f, company: { ...f.company, location: e.target.value } }))}
            placeholder="e.g. Mumbai, India" className="input pl-8" />
        </div>
      </div>
    </div>

    <div>
      <label className="label" htmlFor="c-tagline">Tagline</label>
      <input id="c-tagline" type="text" value={form.company.tagline}
        onChange={e => setForm(f => ({ ...f, company: { ...f.company, tagline: e.target.value } }))}
        placeholder="Empowering the next generation of builders" className="input" />
    </div>

    <div>
      <label className="label" htmlFor="c-website">Website</label>
      <div className="relative">
        <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-xmuted" />
        <input id="c-website" type="url" value={form.company.website}
          onChange={e => setForm(f => ({ ...f, company: { ...f.company, website: e.target.value } }))}
          placeholder="https://company.com" className="input pl-8" />
      </div>
    </div>

    <div>
      <label className="label" htmlFor="c-logo">Logo URL <span className="text-xs text-text-xmuted font-normal">(optional — paste a direct image link)</span></label>
      <div className="relative">
        <Upload size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-xmuted" />
        <input id="c-logo" type="url" value={form.company.logoUrl}
          onChange={e => setForm(f => ({ ...f, company: { ...f.company, logoUrl: e.target.value } }))}
          placeholder="https://…/logo.png" className="input pl-8" />
      </div>
    </div>

    <div>
      <label className="label" htmlFor="c-about">About your company</label>
      <textarea id="c-about" rows={4} value={form.company.about}
        onChange={e => setForm(f => ({ ...f, company: { ...f.company, about: e.target.value } }))}
        placeholder="Tell candidates who you are, what you do, and why they should join you…"
        className="input resize-none" />
    </div>
  </div>
);

const RecruiterSignup = ({ setUser }) => {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '',
    company: {
      name: '', industry: '', location: '', tagline: '', website: '', logoUrl: '', about: '',
    },
  });

  const validateStep0 = () => {
    if (!form.name.trim()) return 'Please enter your full name.';
    if (!form.email.trim()) return 'Please enter your work email.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    return '';
  };

  const validateStep1 = () => {
    if (!form.company.name.trim()) return 'Company name is required.';
    if (!form.company.industry) return 'Please select an industry.';
    return '';
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    const err = validateStep0();
    if (err) { setError(err); return; }
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validateStep1();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'RECRUITER',
        company: form.company,
      });
      const { user, token } = res.data;
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      navigate('/recruiter');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex md:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #2563eb 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }} />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
              <Briefcase size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-white">Connich Careers</span>
          </Link>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Building2 size={12} /> For Employers
          </div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Reach 1,200+ qualified candidates across India.
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Post jobs, manage applications, and build your employer brand — all in one place.
          </p>

          <div className="mt-10 space-y-3">
            {[
              'Create your company profile with logo & branding',
              'Set custom application forms per job',
              'Manage deadlines, interview dates & venues',
              'Download applicant bio-data sheets instantly',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={11} className="text-white" />
                </div>
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/40 text-xs">
          Already have an account?{' '}
          <Link to="/recruiter/login" className="text-white/70 hover:text-white no-underline font-medium">Sign in</Link>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <div className="md:hidden mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Building2 size={16} className="text-white" />
          </div>
          <span className="font-semibold">Connich — Employers</span>
        </div>

        <div className="w-full max-w-md animate-fade-up">
          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((label, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step ? 'bg-success text-white' :
                    i === step ? 'bg-accent text-white' :
                    'bg-surface-3 text-text-xmuted'
                  }`}>
                    {i < step ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${i === step ? 'text-text' : 'text-text-xmuted'}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 transition-colors ${i < step ? 'bg-success' : 'bg-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text mb-1">
              {step === 0 ? 'Create your recruiter account' : 'Set up your company profile'}
            </h1>
            <p className="text-sm text-text-muted">
              {step === 0 ? 'Step 1 of 2 — Your login credentials' : 'Step 2 of 2 — Visible to all candidates'}
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-danger-light border border-danger/20 rounded-lg text-sm text-danger">
              <span className="mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={step === 0 ? handleNext : handleSubmit} className="space-y-5">
            {step === 0
              ? <Step1 form={form} setForm={setForm} showPassword={showPassword} setShowPassword={setShowPassword} />
              : <Step2 form={form} setForm={setForm} />
            }

            <div className="flex gap-3 pt-1">
              {step === 1 && (
                <button type="button" onClick={() => { setStep(0); setError(''); }}
                  className="btn-outline flex-1 justify-center">
                  Back
                </button>
              )}
              <button type="submit" disabled={loading}
                className="btn-primary flex-1 justify-center disabled:opacity-60">
                {loading ? 'Creating account…' : step === 0
                  ? <><span>Continue</span> <ArrowRight size={15} /></>
                  : <><CheckCircle2 size={15} /> Create company account</>
                }
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/recruiter/login" className="text-accent font-medium hover:text-accent-hover no-underline">Sign in</Link>
          </p>

          <p className="mt-3 text-center text-xs text-text-xmuted">
            Looking for a job instead?{' '}
            <Link to="/signup" className="text-text-muted hover:text-text no-underline underline">Applicant sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterSignup;
