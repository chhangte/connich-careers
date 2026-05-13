import React, { useState } from 'react';
import { X, Mail, UserPlus, ArrowRight, MessageSquare, LayoutDashboard, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ApplyGateModal = ({ isOpen, onClose, jobId, company }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGuestContinue = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    // Navigate to apply page with email in state
    navigate(`/apply/${jobId}`, { state: { guestEmail: email } });
    onClose();
  };

  const primary = company?.brandPrimary || '#2563eb';

  return (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center px-4 py-6 sm:py-10 overflow-y-auto" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)' }}>
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-fade-up my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${primary}15` }}>
              <Mail size={20} style={{ color: primary }} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Choose how to apply</h2>
              <p className="text-xs sm:text-sm text-gray-500">To proceed with your application</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Option 1: Create Account */}
          <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                <UserPlus size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Create an Account</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Recommended for tracking and direct messaging.
              </p>

              <ul className="space-y-2.5 mb-6">
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <LayoutDashboard size={16} className="text-green-500" /> Track status in real-time
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <MessageSquare size={16} className="text-blue-500" /> Direct inbox from recruiters
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate(`/signup?redirect=/apply/${jobId}`)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all group"
            >
              Sign Up & Apply <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center mt-4 text-xs text-gray-400">
              Already have an account? <button onClick={() => navigate(`/login?redirect=/apply/${jobId}`)} className="text-blue-600 font-semibold hover:underline">Log In</button>
            </p>
          </div>

          {/* Option 2: Continue as Guest */}
          <div className="p-6 sm:p-8 bg-white">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <Mail size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Continue as Guest</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Apply quickly without an account. <span className="font-medium text-gray-900">Updates will be sent to your email.</span>
              </p>
            </div>

            <form onSubmit={handleGuestContinue} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                  required
                />
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-white border-2 border-gray-100 text-gray-900 rounded-xl font-bold hover:border-gray-900 transition-all"
              >
                Continue as Guest
              </button>

              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100/50 mt-4">
                <p className="text-[11px] text-amber-700 leading-tight">
                  <span className="font-bold uppercase text-[9px] tracking-wider mr-1">Notice:</span>
                  Status updates are sent via email only. No portal tracking for guests.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyGateModal;
