import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text mb-2">Privacy Policy</h1>
          <p className="text-text-muted text-sm">Last updated: May 10, 2026</p>
        </div>

        <div className="prose prose-blue max-w-none text-text-muted space-y-6">
          <p>
            At Connich Careers, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Connich Careers and how we use it.
          </p>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">1. Information We Collect</h2>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account Data:</strong> Name, email address, phone number, and password when you register.</li>
            <li><strong>Application Data:</strong> Resumes, educational background, work experience, and reference details when you apply for a job.</li>
            <li><strong>Usage Data:</strong> Information on how you interact with our website, including IP addresses, browser types, and pages visited.</li>
          </ul>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide, operate, and maintain our website and services.</li>
            <li>Improve, personalize, and expand our website.</li>
            <li>Process job applications and share necessary details with prospective employers (recruiters).</li>
            <li>Communicate with you for customer service, updates, and other information relating to the website.</li>
            <li>Find and prevent fraud.</li>
          </ul>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">3. Data Sharing</h2>
          <p>
            When you apply for a job, your profile and application details are shared with the specific recruiter or institution offering that job. We do not sell your personal data to third parties. We may share data with service providers (e.g., hosting, database management) who assist us in operating our platform, under strict confidentiality agreements.
          </p>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">4. Security</h2>
          <p>
            We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
          </p>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete the information we have on you. You can do this by logging into your account or by contacting us directly.
          </p>

          <h2 className="text-xl font-bold text-text mt-8 mb-4">6. Contact Us</h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at privacy@connich.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
