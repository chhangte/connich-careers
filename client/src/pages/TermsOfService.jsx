import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text mb-2">Terms of Service</h1>
          <p className="text-text-muted text-sm">Last updated: May 10, 2026</p>
        </div>

        <div className="prose prose-blue max-w-none text-text-muted space-y-6">
          <p>
            Welcome to Connich Careers! These terms and conditions outline the rules and regulations for the use of our Website.
          </p>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Connich Careers if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">2. Description of Service</h2>
          <p>
            Connich Careers provides a platform to connect job seekers (applicants) with educational institutions (recruiters). We facilitate the posting of job opportunities and the submission of job applications. We are not a recruitment agency and do not guarantee employment.
          </p>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">4. Acceptable Use</h2>
          <p>You agree not to use the platform to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Post false, inaccurate, or misleading information.</li>
            <li>Apply for jobs on behalf of someone else.</li>
            <li>Post discriminatory, offensive, or inappropriate content.</li>
            <li>Attempt to breach the security or authentication measures of the platform.</li>
          </ul>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Connich Careers and its licensors.
          </p>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            In no event shall Connich Careers, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">7. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
