
import React, { useEffect, useState } from 'react';
import { ChevronRight, Calendar, ArrowUpRight } from 'lucide-react';
import { storage } from '../services/storageService';
import { AboutData } from '../types';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Journey: React.FC = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const setReveal = useScrollReveal();

  useEffect(() => {
    setData(storage.getAbout());
    
    // Analytics
    const analytics = storage.getAnalytics();
    analytics.pageViews['/journey'] = (analytics.pageViews['/journey'] || 0) + 1;
    storage.saveAnalytics(analytics);
  }, []);

  if (!data || !data.milestones) return null;

  return (
    <div className="py-20 overflow-hidden bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-24 text-center" ref={setReveal}>
           <span className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4 block">Strategic Evolution</span>
           <h1 className="text-4xl md:text-7xl font-black dark:text-white mb-8 leading-tight">Our <span className="text-brand-blue">Journey.</span></h1>
           <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
             From a boutique consultancy to a global infrastructure powerhouse, explore the chronological milestones that defined our engineering legacy.
           </p>
        </header>

        <section className="relative">
          {/* Vertical Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

          <div className="space-y-32">
            {data.milestones.map((m, i) => (
              <div 
                key={i} 
                ref={setReveal}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-20 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Image Card */}
                <div className="w-full md:w-1/2">
                   <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl border-4 border-white dark:border-slate-900 transition-transform hover:scale-[1.02]">
                     {m.image ? (
                       <img src={m.image} alt={m.title} className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110" />
                     ) : (
                       <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                         <Calendar size={64} className="opacity-20" />
                       </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                        <span className="text-white font-bold flex items-center">Archive Document <ArrowUpRight className="ml-2" size={18}/></span>
                     </div>
                   </div>
                </div>

                {/* Content Block */}
                <div className="w-full md:w-1/2 space-y-6">
                   <div className="flex items-center space-x-4 mb-4">
                      <span className="px-6 py-2 bg-brand-blue text-white rounded-full font-black text-xl shadow-lg shadow-blue-500/20">{m.year}</span>
                      <div className="h-px w-12 bg-slate-200 dark:bg-slate-800"></div>
                   </div>
                   <h3 className="text-3xl md:text-5xl font-black dark:text-white leading-tight">{m.title}</h3>
                   <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                     {m.desc}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Journey;
