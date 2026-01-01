
import React, { useEffect, useState } from 'react';
import { Shield, Target, Lightbulb } from 'lucide-react';
import { storage } from '../services/storageService';
import { AboutData } from '../types';
import { useScrollReveal } from '../hooks/useScrollReveal';

const IconMap: any = {
  Integrity: Shield,
  Precision: Target,
  Innovation: Lightbulb
};

const About: React.FC = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const setReveal = useScrollReveal();

  useEffect(() => {
    setData(storage.getAbout());
    
    // Analytics
    const analytics = storage.getAnalytics();
    analytics.pageViews['/about'] = (analytics.pageViews['/about'] || 0) + 1;
    storage.saveAnalytics(analytics);
  }, []);

  if (!data) return null;

  return (
    <div className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-24 text-center" ref={setReveal}>
           <span className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4 block">Our DNA</span>
           <h1 className="text-4xl md:text-6xl font-extrabold dark:text-white mb-8">Architecting the <br/><span className="text-brand-blue">Global Future.</span></h1>
        </header>

        {/* Profile Section */}
        <section ref={setReveal} className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
           <div className="relative">
              <div className="absolute -inset-4 bg-brand-blue/10 rounded-[3rem] blur-2xl"></div>
              <img 
                src={data.profileImage} 
                alt="Corporate Office" 
                className="relative rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800" 
              />
           </div>
           <div className="space-y-8">
              <p className="text-2xl text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "{data.description}"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <h3 className="text-brand-blue font-bold mb-4 flex items-center"><Target className="mr-2" size={20}/> Mission</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{data.mission}</p>
                 </div>
                 <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <h3 className="text-brand-orange font-bold mb-4 flex items-center"><Lightbulb className="mr-2" size={20}/> Vision</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{data.vision}</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Values Section */}
        <section ref={setReveal} className="mb-32">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold dark:text-white">Our Core Values</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.values.map((v, i) => {
                const Icon = IconMap[v.title] || Shield;
                return (
                  <div key={i} className="p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-all">
                     <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-brand-blue mb-8">
                        <Icon size={28} />
                     </div>
                     <h4 className="text-xl font-bold dark:text-white mb-4">{v.title}</h4>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        {v.desc}
                     </p>
                  </div>
                );
              })}
           </div>
        </section>
      </div>
    </div>
  );
};

export default About;
