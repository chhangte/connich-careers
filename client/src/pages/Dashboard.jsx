import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Clock, ChevronRight, User, LogOut, FileText, Bell, Settings, MapPin, X } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const STATUS_MAP = {
  PENDING:     { label: 'Under review', cls: 'badge-yellow' },
  SHORTLISTED: { label: 'Shortlisted',  cls: 'badge-green'  },
  REJECTED:    { label: 'Not selected', cls: 'badge-red'    },
  JOINED:      { label: 'Joined',       cls: 'badge-blue'   },
};

const QUALIFICATIONS = [
  'HSS (Year 12)', 'Diploma', 'Bachelors', 'Masters', 'PhD',
];

const FIELDS = [
  'Arts', 'Science', 'Commerce', 'Business / Management', 'Engineering / Technology', 'Design and Media', 'Law', 'Medicine', 'Other',
];

const Dashboard = ({ user, setUser }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('My Applications');
  const [activeApp, setActiveApp] = useState(null); // Slide-over
  const [otherField, setOtherField] = useState('');

  // Account Settings state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    profile: user?.profile || {
      phone: '', address: '', dob: '', maritalStatus: '',
      fatherName: '', fatherPhone: '', motherName: '', motherPhone: '',
      highestQualification: '', discipline: '', primarySchool: '', middleSchool: '',
      highSchool: '', higherSecondarySchool: '', undergraduateInstitute: '', postgraduateInstitute: '',
      experience: '', referenceeName: '', referencePhone: ''
    }
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    // Initialize otherField if discipline is not in the list
    if (user?.profile?.discipline && !FIELDS.includes(user.profile.discipline)) {
      setOtherField(user.profile.discipline);
      setFormData(prev => ({
        ...prev,
        profile: { ...prev.profile, discipline: 'Other' }
      }));
    }
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/applications/my/${user.id || user._id}`);
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user, navigate]);

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const disc = formData.profile.discipline === 'Other' ? otherField : formData.profile.discipline;
      const payload = {
        name: formData.name,
        email: formData.email,
        profile: {
          ...formData.profile,
          discipline: disc
        }
      };
      if (formData.password) payload.password = formData.password;

      const res = await axios.patch(`${API_BASE_URL}/auth/user/${user.id || user._id}`, payload);
      
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
    } catch (err) {
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
  };

  const sideNav = [
    { icon: FileText, label: 'My Applications' },
    { icon: Bell, label: 'Notifications' },
    { icon: Settings, label: 'Account settings' },
  ];

  // Flatten messages from all applications for notifications
  const allMessages = applications.reduce((acc, app) => {
    if (app.messages && app.messages.length > 0) {
      const msgs = app.messages.map(m => ({
        ...m,
        jobTitle: app.job?.title || 'Unknown Position',
        appId: app._id,
        appObj: app
      }));
      return [...acc, ...msgs];
    }
    return acc;
  }, []).sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

  const [lastRead, setLastRead] = useState(parseInt(localStorage.getItem('lastReadNotifications') || '0', 10));
  const newNotificationsCount = allMessages.filter(m => new Date(m.sentAt).getTime() > lastRead).length;
  const hasNewNotifications = newNotificationsCount > 0;

  const handleTabClick = (label) => {
    setActiveTab(label);
    if (label === 'Notifications' && hasNewNotifications) {
      const now = Date.now();
      localStorage.setItem('lastReadNotifications', now.toString());
      setLastRead(now);
    }
  };

  return (
    <div className="min-h-screen bg-surface-2 pt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

          {/* ── Sidebar ── */}
          <aside className="md:col-span-1 animate-fade-up">
            <div className="card p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {initials}
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-sm text-text truncate">{user.name}</p>
                  <p className="text-xs text-text-muted truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-xs text-text-muted">Applicant account</span>
              </div>
            </div>

            <nav className="card divide-y divide-border overflow-hidden">
              {sideNav.map(({ icon: Icon, label }) => {
                const active = activeTab === label;
                return (
                  <button
                    key={label}
                    onClick={() => handleTabClick(label)}
                    className={`relative w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                      active ? 'bg-accent-light text-accent font-medium' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={15} />
                      {label}
                    </div>
                    {label === 'Notifications' && hasNewNotifications && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-success">{newNotificationsCount}</span>
                        <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-danger hover:bg-danger-light transition-colors"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </nav>
          </aside>

          {/* ── Main ── */}
          <main className="md:col-span-3 animate-fade-up-1">
            
            {activeTab === 'My Applications' && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h1 className="text-xl font-bold text-text">My Applications</h1>
                    <p className="text-sm text-text-muted mt-0.5">Track the status of your submitted applications</p>
                  </div>
                  <Link to="/" className="btn-outline text-sm no-underline">
                    Browse jobs
                  </Link>
                </div>

                {!loading && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Total', value: applications.length, color: 'text-text' },
                      { label: 'Under review', value: applications.filter(a => a.status === 'PENDING').length, color: 'text-warning' },
                      { label: 'Shortlisted', value: applications.filter(a => a.status === 'SHORTLISTED').length, color: 'text-success' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="card p-4 text-center">
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-text-muted mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="card overflow-hidden">
                  {loading ? (
                    <div className="divide-y divide-border">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-5 flex items-center gap-4 animate-pulse">
                          <div className="w-10 h-10 rounded-lg bg-surface-3 shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-surface-3 rounded w-1/2" />
                            <div className="h-3 bg-surface-3 rounded w-1/3" />
                          </div>
                          <div className="w-20 h-5 bg-surface-3 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : applications.length > 0 ? (
                    <div className="divide-y divide-border">
                      {applications.map((app) => {
                        const status = STATUS_MAP[app.status] || STATUS_MAP.PENDING;
                        return (
                          <div 
                            key={app._id} 
                            onClick={() => setActiveApp(app)}
                            className="p-5 flex items-center gap-4 hover:bg-surface-2 transition-colors cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
                              <Briefcase size={16} className="text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-text truncate">{app.job?.title || 'Unknown Position'}</p>
                              <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                                <Clock size={11} /> Applied {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <span className={status.cls}>{status.label}</span>
                            <div className="text-text-xmuted hover:text-text p-1">
                              <ChevronRight size={15} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4">
                      <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center mx-auto mb-3">
                        <Briefcase size={20} className="text-text-xmuted" />
                      </div>
                      <h3 className="font-semibold text-text text-sm mb-1">No applications yet</h3>
                      <p className="text-sm text-text-muted mb-5">Start applying to roles and they'll show up here.</p>
                      <Link to="/" className="btn-primary text-sm no-underline">Browse open roles</Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'Notifications' && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h1 className="text-xl font-bold text-text">Notifications</h1>
                    <p className="text-sm text-text-muted mt-0.5">Messages and updates from recruiters</p>
                  </div>
                </div>

                <div className="card overflow-hidden">
                  {allMessages.length > 0 ? (
                    <div className="divide-y divide-border">
                      {allMessages.map((msg, i) => (
                        <div key={i} className="p-5 hover:bg-surface-2 transition-colors cursor-pointer" onClick={() => setActiveApp(msg.appObj)}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-accent flex items-center gap-1.5">
                              <Briefcase size={13}/> {msg.jobTitle}
                            </span>
                            <span className="text-xs text-text-xmuted">
                              {new Date(msg.sentAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          <p className="text-xs text-text-xmuted mt-2">— Sent by Recruiter</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4">
                      <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center mx-auto mb-3">
                        <Bell size={20} className="text-text-xmuted" />
                      </div>
                      <h3 className="font-semibold text-text text-sm mb-1">No notifications</h3>
                      <p className="text-sm text-text-muted mb-0">You're all caught up!</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'Account settings' && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h1 className="text-xl font-bold text-text">Account settings</h1>
                    <p className="text-sm text-text-muted mt-0.5">Manage your login details and application autofill profile</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Basic Info */}
                  <div className="card p-6">
                    <h2 className="text-base font-semibold text-text mb-4">Login Credentials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="field-group">
                        <label className="label">Full Name</label>
                        <input type="text" className="input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      <div className="field-group">
                        <label className="label">Email Address</label>
                        <input type="email" className="input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                      </div>
                      <div className="field-group md:col-span-2">
                        <label className="label">New Password <span className="text-text-xmuted font-normal">(leave blank to keep current)</span></label>
                        <input type="password" className="input" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* Profile Autofill Info */}
                  <div className="card p-6">
                    <h2 className="text-base font-semibold text-text mb-1">Autofill Profile</h2>
                    <p className="text-xs text-text-muted mb-5">Save your details here to auto-fill future job applications.</p>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold text-text mb-3">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="field-group">
                            <label className="label">Phone</label>
                            <input type="tel" className="input" value={formData.profile.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} />
                          </div>
                          <div className="field-group">
                            <label className="label">Date of Birth</label>
                            <input type="date" className="input" value={formData.profile.dob} onChange={(e) => handleProfileChange('dob', e.target.value)} />
                          </div>
                          <div className="field-group md:col-span-2">
                            <label className="label">Address</label>
                            <textarea className="input resize-none" rows="2" value={formData.profile.address} onChange={(e) => handleProfileChange('address', e.target.value)} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-text mb-3">Education</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="field-group">
                            <label className="label">Highest Qualification</label>
                            <div className="relative">
                              <select className="input appearance-none cursor-pointer" value={formData.profile.highestQualification} onChange={(e) => handleProfileChange('highestQualification', e.target.value)}>
                                <option value="">Select qualification…</option>
                                {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                              </select>
                              <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted rotate-90" />
                            </div>
                          </div>
                          <div className="field-group">
                            <label className="label">Field</label>
                            <div className="relative">
                              <select className="input appearance-none cursor-pointer" value={formData.profile.discipline} onChange={(e) => handleProfileChange('discipline', e.target.value)}>
                                <option value="">Select field…</option>
                                {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                              </select>
                              <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-xmuted rotate-90" />
                            </div>
                          </div>
                          {formData.profile.discipline === 'Other' && (
                            <div className="field-group md:col-span-2">
                              <label className="label">Specify Other Field</label>
                              <input type="text" className="input" value={otherField} onChange={(e) => setOtherField(e.target.value)} placeholder="Enter your field of study" />
                            </div>
                          )}
                          <div className="field-group md:col-span-2">
                            <label className="label">Undergraduate Institute</label>
                            <input type="text" className="input" value={formData.profile.undergraduateInstitute} onChange={(e) => handleProfileChange('undergraduateInstitute', e.target.value)} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-text mb-3">Experience</h3>
                        <div className="field-group">
                          <label className="label">Work Experience</label>
                          <textarea className="input resize-y" rows="3" placeholder="Briefly describe your previous roles..." value={formData.profile.experience} onChange={(e) => handleProfileChange('experience', e.target.value)} />
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto px-8">
                      {saving ? 'Saving...' : 'Save settings'}
                    </button>
                  </div>
                </form>
              </>
            )}

          </main>
        </div>
      </div>

      {/* ── Slide-over Application Details ── */}
      {activeApp && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }} onClick={(e) => { if (e.target === e.currentTarget) setActiveApp(null); }}>
          <div className="bg-surface-2 h-full w-full max-w-md shadow-2xl animate-fade-left flex flex-col">
            <div className="px-5 py-4 border-b border-border bg-white flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-semibold text-text">Application Details</h2>
                <p className="text-xs text-text-muted mt-0.5">{activeApp.job?.title || 'Unknown Position'}</p>
              </div>
              <button onClick={() => setActiveApp(null)} className="btn-ghost p-1.5 rounded-md">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              <div className="card p-4 mb-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-text-xmuted uppercase tracking-widest">Status</span>
                  <span className={(STATUS_MAP[activeApp.status] || STATUS_MAP.PENDING).cls}>{(STATUS_MAP[activeApp.status] || STATUS_MAP.PENDING).label}</span>
                </div>
                <div className="border-t border-border pt-3 mt-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Applied On</span>
                    <span className="font-medium text-text">{new Date(activeApp.appliedAt || activeApp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {activeApp.messages && activeApp.messages.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-text-xmuted mb-3 px-1">Recruiter Messages</h3>
                  <div className="space-y-3">
                    {activeApp.messages.map((msg, i) => (
                      <div key={i} className="card p-3.5 bg-accent-light/30 border-accent/20">
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-xs font-medium text-accent">Recruiter</span>
                          <span className="text-[10px] text-text-xmuted">{new Date(msg.sentAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-xmuted mb-3 px-1">Job Details</h3>
                <div className="card p-0 divide-y divide-border">
                  {activeApp.job?.location && (
                    <div className="flex items-center gap-3 p-3">
                      <MapPin size={15} className="text-text-xmuted" />
                      <span className="text-sm text-text">{activeApp.job.location}</span>
                    </div>
                  )}
                  {activeApp.job?.salary && (
                    <div className="flex items-center gap-3 p-3">
                      <Briefcase size={15} className="text-text-xmuted" />
                      <span className="text-sm text-text">₹{activeApp.job.salary}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-xmuted mb-3 px-1">Submitted Information</h3>
                <div className="card p-4 space-y-3">
                  {Object.entries(activeApp.details || {}).filter(([_, val]) => val).map(([key, val]) => {
                    const label = key === 'discipline' ? 'Field' : key.replace(/([A-Z])/g, ' $1').trim();
                    return (
                      <div key={key}>
                        <span className="block text-[11px] text-text-xmuted capitalize mb-0.5">{label}</span>
                        <span className="block text-sm text-text whitespace-pre-wrap">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border bg-white shrink-0">
              <Link to={`/jobs/${activeApp.job?._id}`} className="btn-outline w-full justify-center no-underline text-text">
                View Original Job Posting
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
