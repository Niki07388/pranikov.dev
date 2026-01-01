
import React, { useEffect, useState } from 'react';
import { Cloud, Terminal, TrendingUp, Shield, Zap, Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import { storage } from '../services/storageService';
import { Service } from '../types';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Link } from 'react-router-dom';

const IconMap: any = { Cloud, Terminal, TrendingUp, Shield, Zap, Globe };

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const setReveal = useScrollReveal();

  useEffect(() => {
    setServices(storage.getServices());
    
    // Analytics
    const analytics = storage.getAnalytics();
    analytics.pageViews['/services'] = (analytics.pageViews['/services'] || 0) + 1;
    storage.saveAnalytics(analytics);
  }, []);

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-20" ref={setReveal}>
           <span className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4 block">Core Capabilities</span>
           <h1 className="text-4xl md:text-6xl font-extrabold dark:text-white mb-6">Expertise Driven by <br/><span className="text-brand-blue">Innovation.</span></h1>
           <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl">We provide specialized development services designed to handle the scale and security requirements of modern enterprises.</p>
        </header>

        <div className="grid grid-cols-1 gap-12 mb-32">
          {services.map((service, idx) => {
            const Icon = IconMap[service.icon] || Zap;
            return (
              <div 
                key={service.id} 
                ref={setReveal}
                className={`flex flex-col lg:flex-row gap-12 p-8 md:p-16 rounded-[3.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group hover:border-brand-blue/30 transition-all ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                 <div className="lg:w-1/2 space-y-8">
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 text-brand-blue rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/10 group-hover:scale-110 transition-transform">
                       <Icon size={40} />
                    </div>
                    <h2 className="text-4xl font-bold dark:text-white">{service.title}</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                       {service.description}
                    </p>
                    <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-lg shadow-blue-500/20">
                      Inquire About {service.title} <ArrowRight className="ml-2" size={20} />
                    </Link>
                 </div>
                 <div className="lg:w-1/2 bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold dark:text-white mb-8 flex items-center">
                       <Shield size={18} className="mr-2 text-brand-orange" /> Standard Features
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       {service.features.map((f, i) => (
                         <div key={i} className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl group/item hover:bg-brand-blue hover:text-white transition-all">
                            <CheckCircle2 size={18} className="text-brand-blue group-hover/item:text-white mt-0.5 shrink-0" />
                            <span className="font-semibold text-sm">{f}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
