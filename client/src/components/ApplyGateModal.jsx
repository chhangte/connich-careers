import React, { useState } from 'react';
import { X, Mail, Users, CheckCircle2, ChevronRight, LayoutGrid, MessageSquare } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ApplyGateModal = ({ isOpen, onClose, jobId, company }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleGuestContinue = () => {
    const slug = company?.slug;
    const path = slug ? `/${slug}/apply/${jobId}` : `/apply/${jobId}`;
    navigate(path);
    onClose();
  };

  const brandPrimary = company?.brandPrimary || '#2563eb';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-fade-up overflow-hidden relative border border-gray-100 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 bg-white/80 backdrop-blur-sm"
          aria-label="Close modal"
        >
          <X size={18} className="text-gray-400" />
        </button>

        <div className="p-6 sm:p-10">
          {/* Header */}
          <div className="text-center sm:text-left mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create an Account on Connich</h2>
            <p className="text-sm text-gray-500">
              Recommended for the best experience.
            </p>
          </div>

          {/* Benefits */}
          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <LayoutGrid size={18} className="text-green-600" />
              </div>
              Track status in real-time
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="text-blue-600" />
              </div>
              Direct inbox from recruiters
            </li>
          </ul>

          {/* Primary Action */}
          <Link
            to={`/signup?redirect=/apply/${jobId}`}
            className="btn-primary w-full py-2.5 rounded-xl text-base mb-5 no-underline shadow-md hover:shadow-lg active:scale-[0.98]"
            style={{ background: brandPrimary }}
          >
            Sign Up & Apply <ChevronRight size={18} />
          </Link>

          {/* Login Link */}
          <p className="text-sm text-center text-gray-500 mb-8">
            Already have an account? <Link to={`/login?redirect=/apply/${jobId}`} className="text-blue-600 font-semibold hover:underline">Log In</Link>
          </p>

          {/* Guest Action */}
          <div className="pt-8 border-t border-gray-100 flex flex-col items-center">
            <button
              onClick={handleGuestContinue}
              className="btn-outline w-full py-2.5 rounded-xl text-base bg-gray-50/50 hover:bg-gray-100 transition-all border-gray-400 font-semibold flex items-center justify-center gap-2 group"
            >
              Continue without account <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
            </button>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-3 text-center tracking-wider font-medium">
              All updates will be sent only to your email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyGateModal;
