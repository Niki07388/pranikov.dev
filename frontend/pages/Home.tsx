
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Sparkles, TrendingUp, ShieldCheck, Globe } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { storage } from '../services/storageService';
import { Project, Service } from '../types';
import ParticleBackground from '../components/ParticleBackground';

const Home: React.FC = () => {
  const setReveal = useScrollReveal();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const allProjects = storage.getProjects();
    // Filter for featured projects and limit to a bento-grid friendly number
    setFeaturedProjects(allProjects.filter(p => p.featured).slice(0, 4));
    setServices(storage.getServices().slice(0, 3));
    
    // Analytics: track page visit
    const analytics = storage.getAnalytics();
    analytics.pageViews['/'] = (analytics.pageViews['/'] || 0) + 1;
    storage.saveAnalytics(analytics);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-20">
        <ParticleBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="reveal active" style={{ transitionDelay: '0.1s' }}>
              <span className="inline-flex items-center px-4 py-2 bg-brand-blue/5 dark:bg-brand-blue/20 text-brand-blue dark:text-blue-300 rounded-full text-xs font-bold tracking-widest uppercase mb-8 border border-brand-blue/10">
                <Sparkles size={14} className="mr-2 text-brand-orange" /> Forging Intelligence Into Digital Worlds.
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 leading-[0.95] tracking-tighter reveal active" style={{ transitionDelay: '0.2s' }}>
              Architects of Intelligent <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-blue-500 to-brand-orange">Digital Systems.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl reveal active" style={{ transitionDelay: '0.3s' }}>
             Pranikov builds powerful apps, immersive websites, and AI agents that help brands scale, automate, and lead their digital future.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 reveal active" style={{ transitionDelay: '0.4s' }}>
              <Link to="/projects" className="px-10 py-5 bg-brand-blue text-white rounded-2xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/30 flex items-center justify-center">
                Review Our Portfolio <ArrowRight className="ml-3" size={20} />
              </Link>
              <Link to="/contact" className="px-10 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center">
                Consult With Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      

      {/* Bento Grid Portfolio Spotlight */}
      <section ref={setReveal} className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4 block">Spotlight Gallery</span>
              <h2 className="text-4xl md:text-6xl font-black dark:text-white leading-tight">Development Case <span className="text-brand-blue">Studies.</span></h2>
            </div>
            <Link to="/projects" className="group flex items-center px-8 py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl font-bold dark:text-white hover:bg-brand-blue hover:text-white transition-all">
              View All Systems <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
             {featuredProjects.length > 0 ? featuredProjects.map((p, idx) => {
               // Define spans for the bento grid
               // Project 0: 2 cols, 2 rows (Main focus)
               // Project 1: 2 cols, 1 row
               // Project 2: 1 col, 1 row
               // Project 3: 1 col, 1 row
               const gridClasses = [
                 "md:col-span-2 md:row-span-2",
                 "md:col-span-2 md:row-span-1",
                 "md:col-span-1 md:row-span-1",
                 "md:col-span-1 md:row-span-1"
               ];
               
               return (
                <Link 
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className={`relative group overflow-hidden rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 ${gridClasses[idx] || 'md:col-span-1'}`}
                >
                  <img src={p.images[0]} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                    <h3 className={`font-black text-white mb-2 group-hover:text-brand-orange transition-colors ${idx === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>{p.title}</h3>
                    <p className="text-slate-300 text-sm line-clamp-2 max-w-lg mb-4">{p.description}</p>
                    <div className="flex items-center text-white font-bold text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                      Architecture Overview <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
                </Link>
               );
             }) : (
               <div className="col-span-full py-20 text-center text-slate-500">
                 No featured projects currently available for the spotlight gallery.
               </div>
             )}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section ref={setReveal} className="py-32 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4 block">Core Infrastructure</span>
              <h2 className="text-4xl md:text-5xl font-black dark:text-white mb-8">Capabilities Without Compromise.</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                Our specialized engineering units focus on high-stakes systems where failure is not an option. We build for scale, speed, and absolute reliability.
              </p>
              <div className="space-y-6">
                {services.map((s, i) => (
                  <div key={i} className="flex items-start space-x-6 group">
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all shrink-0">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold dark:text-white mb-1">{s.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <div className="absolute -inset-10 bg-brand-blue/10 rounded-full blur-[120px] animate-pulse"></div>
               <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 rotate-2">
                 <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" alt="Pranikov Tech Infrastructure" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Outreach / CTA */}
      <section ref={setReveal} className="py-32 relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-brand-blue rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-3xl">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
               
               <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Ready to build the <br/>future of your industry?</h2>
               <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
                  Join forces with Pranikov to engineer solutions that set the benchmark for global performance and security.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                  <Link to="/contact" className="px-10 py-5 bg-white text-brand-blue rounded-2xl font-bold hover:bg-brand-orange hover:text-white transition-all shadow-xl">
                     Initialize Consultation
                  </Link>
                  <Link to="/about" className="px-10 py-5 bg-transparent border-2 border-white/20 hover:border-white rounded-2xl font-bold transition-all">
                     Our Strategic Legacy
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
