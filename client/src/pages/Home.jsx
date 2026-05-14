import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Clock, ChevronRight, Briefcase, Building2, 
  TrendingUp, Users, CheckCircle2, Calendar, AlertCircle,
  Zap, Shield, Globe, BarChart3, Mail, Layers, Cpu, Play
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const Home = () => {
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ jobsCount: 0, companiesCount: 0, candidatesCount: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await axios.get(`${API_BASE_URL}/stats`);
        setStats(statsRes.data || { jobsCount: 0, companiesCount: 0, candidatesCount: 0 });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/browse?q=${encodeURIComponent(search.trim())}`);
    } else {
      navigate(`/browse`);
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-accent/10 selection:text-accent">
      
      {/* ── HERO SECTION ─────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 bg-mesh">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Hero Content */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-8">
              <Zap size={14} className="fill-accent" />
              <span>The future of hiring is here</span>
            </div>
            <h1 className="heading-hero text-text mb-6">
              Celebrate growth <br />
              <span className="text-accent">with every new hire</span>
            </h1>
            <p className="text-xl text-text-2 mb-10 max-w-xl leading-relaxed">
              Say hello to Connich — your AI-powered, automation-friendly recruitment tool. Build better teams, faster than ever.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/browse" className="btn-primary-lg px-8 py-4 rounded-2xl shadow-xl shadow-accent/20">
                Explore Jobs
              </Link>
              <button className="btn-outline px-8 py-4 rounded-2xl flex items-center gap-2 border-2">
                <Play size={18} className="fill-text" />
                Request Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-surface-3 flex items-center justify-center text-[10px] font-bold text-text-muted overflow-hidden">
                       <Users size={16} />
                    </div>
                  ))}
               </div>
               <p className="text-sm text-text-muted">
                 Joined by <span className="font-bold text-text">800,000+</span> recruiters worldwide
               </p>
            </div>
          </div>

          {/* Hero Form / Card */}
          <div className="animate-fade-up-1">
             <div className="glass p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                
                <h3 className="text-2xl font-semibold text-text mb-2">Start your journey</h3>
                <p className="text-text-muted mb-8 text-sm">No credit card required. Cancel anytime.</p>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-accent bg-accent/5 cursor-pointer transition-all">
                         <input type="radio" name="role" defaultChecked className="accent-accent" />
                         <span className="text-sm font-semibold text-text">Agency</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-border hover:border-accent/50 cursor-pointer transition-all">
                         <input type="radio" name="role" className="accent-accent" />
                         <span className="text-sm font-semibold text-text">Corporate</span>
                      </label>
                   </div>

                   <input type="text" placeholder="Full Name" className="input-lg rounded-xl border-border/60 bg-white/50" />
                   <input type="email" placeholder="Email Address *" className="input-lg rounded-xl border-border/60 bg-white/50" />
                   <input type="password" placeholder="Create Password *" className="input-lg rounded-xl border-border/60 bg-white/50" />
                   
                   <button className="w-full btn-primary-lg py-4 rounded-xl text-lg font-semibold shadow-lg shadow-accent/20 mt-4">
                      Get Started Free
                   </button>

                   <p className="text-[11px] text-text-xmuted text-center mt-6 leading-relaxed">
                     By signing up, you agree to our <span className="text-accent cursor-pointer">Terms</span> and <span className="text-accent cursor-pointer">Privacy Policy</span>.
                   </p>
                </form>
             </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ────────────────────────── */}
      <section className="bg-text py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="heading-section text-white mb-8">
                Holistic hiring <br />
                <span className="opacity-50">experience</span>
              </h2>
              <p className="text-lg text-slate-400 mb-12 max-w-lg">
                We've spent a decade perfecting the art of talent acquisition. Our platform is built for speed, accuracy, and joy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { label: 'Lesser cost of hire', value: '2X', color: 'text-orange-500' },
                { label: 'Faster time to hire', value: '3X', color: 'text-accent' },
                { label: 'Application rates', value: '7X', color: 'text-emerald-500' },
              ].map((stat, i) => (
                <div key={i} className="glass-dark p-8 rounded-3xl border-white/5 group hover:border-white/20 transition-all">
                  <div className={`text-5xl font-bold mb-4 ${stat.color} group-hover:scale-110 transition-transform origin-left`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-300 leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS SECTION ─────────────────────── */}
      <section className="py-32 px-6 bg-white relative">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 animate-fade-up">
               <div className="text-accent font-black tracking-widest uppercase text-xs mb-4">Our Solutions</div>
               <h2 className="heading-section text-text mb-6 italic tracking-tight">Built for every stage of your growth</h2>
               <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
                 Whether you're a startup or a global enterprise, Connich scales with your ambition.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {[
                 { title: 'Source Smarter', desc: 'Find talent across 200+ job boards and social networks with one click. AI-driven sourcing at its best.', icon: Globe, accent: 'bg-blue-50 text-blue-600' },
                 { title: 'Automate Workflow', desc: 'Reduce manual tasks by 60% with our smart automation engine. From screening to scheduling.', icon: Cpu, accent: 'bg-purple-50 text-purple-600' },
                 { title: 'Collaborative Hiring', desc: 'Get your whole team involved with shared feedback, interview kits, and real-time scorecards.', icon: Users, accent: 'bg-emerald-50 text-emerald-600' },
                 { title: 'Insightful Analytics', desc: 'Track every stage of your funnel with beautiful, real-time reports. data-driven decisions.', icon: BarChart3, accent: 'bg-orange-50 text-orange-600' },
                 { title: 'Secure & Compliant', desc: 'Enterprise-grade security and GDPR compliance baked into the core. Your data is safe with us.', icon: Shield, accent: 'bg-rose-50 text-rose-600' },
                 { title: 'Custom Branding', desc: 'Create a career site that feels like home. Full control over colors, fonts, and layout.', icon: Layers, accent: 'bg-amber-50 text-amber-600' },
               ].map((feat, i) => (
                 <div key={i} className="group p-12 rounded-[3rem] bg-white border border-border/60 hover:border-accent hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500">
                    <div className={`w-16 h-16 rounded-2xl ${feat.accent} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                       <feat.icon size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-semibold text-text mb-4">{feat.title}</h3>
                    <p className="text-text-muted leading-relaxed text-base">{feat.desc}</p>
                    <div className="mt-8 pt-8 border-t border-border/40 opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-accent font-bold text-sm flex items-center gap-2">
                         Learn more <ChevronRight size={16} />
                       </span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* ── INTEGRATIONS ─────────────────────────── */}
      <section className="py-24 px-6 bg-surface-2 border-y border-border overflow-hidden relative">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 blur-[120px] rounded-full -mr-1/4" />
         
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
            <div>
               <h2 className="heading-section text-text mb-8">
                 We like building <br />
                 <span className="text-accent italic">teams together</span>
               </h2>
               <p className="text-lg text-text-muted mb-10 max-w-lg leading-relaxed">
                 Connich comes integrated out-of-the-box with over 200 applications that your organization uses on the daily. Connect your tools in seconds.
               </p>
               <button className="px-8 py-4 rounded-xl bg-white border border-border shadow-sm text-text font-bold flex items-center gap-3 group hover:border-accent transition-all">
                 Explore all 200+ integrations 
                 <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ChevronRight size={16} />
                 </div>
               </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
               {[
                 { name: 'Google', icon: 'G', color: 'text-blue-500' },
                 { name: 'Slack', icon: 'S', color: 'text-purple-500' },
                 { name: 'LinkedIn', icon: 'in', color: 'text-blue-700' },
                 { name: 'Microsoft', icon: 'M', color: 'text-red-500' },
                 { name: 'Zoom', icon: 'Z', color: 'text-blue-400' },
                 { name: 'Dropbox', icon: 'D', color: 'text-blue-600' },
                 { name: 'Notion', icon: 'N', color: 'text-slate-800' },
                 { name: 'Jira', icon: 'J', color: 'text-blue-500' },
               ].map((brand, i) => (
                 <div key={i} className="aspect-square bg-white border border-border/60 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-accent hover:shadow-xl transition-all duration-300 group">
                    <div className={`text-3xl font-bold ${brand.color} group-hover:scale-125 transition-transform`}>
                       {brand.icon}
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-xmuted">{brand.name}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-12 flex justify-center gap-1">
               {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-accent" />)}
            </div>
            <h2 className="text-2xl sm:text-4xl font-medium text-text leading-tight mb-12 italic">
              "Connich connects students with their dream internship using smart matching and real-time feedback loops. It's the most intuitive ATS we've ever used."
            </h2>
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-surface-3 mb-4 flex items-center justify-center text-accent font-bold">CK</div>
               <h4 className="text-lg font-bold text-text">Caleb Kauffman</h4>
               <p className="text-sm text-text-muted">CEO, CareerUp</p>
            </div>
         </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="pb-32 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="bg-accent rounded-[3rem] p-12 sm:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-accent/30">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-float" />
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
               
               <div className="relative z-10">
                  <h2 className="heading-section mb-8">
                    Find your next MVP <br />
                    with our ATS
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4">
                     <Link to="/signup" className="px-10 py-5 bg-white text-accent rounded-2xl font-semibold text-lg hover:scale-105 transition-all shadow-xl">
                        Get Started
                     </Link>
                     <button className="px-10 py-5 bg-accent-hover text-white border border-white/20 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all">
                        Register for a demo
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;
