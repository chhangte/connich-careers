import React from 'react';
import { Building2, Users, Target, Shield, HeartHandshake, Globe2 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-text tracking-tight mb-4">
            About <span className="text-accent">Connich Careers</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            We are on a mission to connect exceptional talent with schools and institutions that are shaping the future of education.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-16 animate-fade-up-1">
          <section className="bg-surface-2 p-8 md:p-10 rounded-2xl border border-border">
            <h2 className="text-2xl font-bold text-text mb-4">Our Story</h2>
            <div className="space-y-4 text-text-muted leading-relaxed">
              <p>
                Founded with a vision to streamline educational recruitment, Connich Careers was built to solve a specific problem: the disconnect between passionate educators and institutions that need them. 
              </p>
              <p>
                We realized that the hiring process in the education sector was often fragmented, slow, and lacked transparency. By creating a centralized, easy-to-use portal, we aim to make job hunting and hiring an efficient, dignified experience for both candidates and recruiters.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-8 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Target, title: 'Mission-Driven', desc: 'We focus on long-term impact over short-term gains.' },
                { icon: Users, title: 'Community First', desc: 'We build features that serve the best interests of our users.' },
                { icon: Shield, title: 'Trust & Transparency', desc: 'Clear communication and data privacy are non-negotiable.' },
                { icon: HeartHandshake, title: 'Empathy', desc: 'We design experiences that respect the applicant\'s time.' },
              ].map((value, idx) => (
                <div key={idx} className="p-6 rounded-xl border border-border hover:border-accent hover:shadow-sm transition-all bg-white flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
                    <value.icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">{value.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center py-12 border-t border-border">
            <Globe2 size={48} className="mx-auto text-border-2 mb-6" />
            <h2 className="text-2xl font-bold text-text mb-4">Join Us in Shaping the Future</h2>
            <p className="text-text-muted max-w-xl mx-auto mb-8">
              Whether you are an educator looking for your next calling, or a school searching for your next great leader, Connich Careers is here for you.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
