
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, Calendar, User, LayoutGrid, List } from 'lucide-react';
import { storage } from '../services/storageService';
import { Project } from '../types';
import Slideshow from '../components/Slideshow';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Projects: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const setReveal = useScrollReveal();

  useEffect(() => {
    setProjects(storage.getProjects());
    
    // Track page visit
    const analytics = storage.getAnalytics();
    analytics.pageViews['/projects'] = (analytics.pageViews['/projects'] || 0) + 1;
    storage.saveAnalytics(analytics);
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  // Project Detail View
  if (id) {
    const project = projects.find(p => p.id === id);
    if (!project) return <div className="py-40 text-center">Project not found</div>;

    return (
      <div className="py-20 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <Link to="/projects" className="text-blue-600 font-bold mb-8 inline-flex items-center hover:translate-x-[-4px] transition-transform">
             <ArrowRight className="rotate-180 mr-2" size={18} /> Back to Projects
           </Link>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
             <div className="lg:col-span-2">
               <Slideshow images={project.images} />
               <div className="mt-12 space-y-8">
                 <h1 className="text-4xl font-extrabold dark:text-white">{project.title}</h1>
                 <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                   {project.description}
                 </p>
                 <div className="flex flex-wrap gap-2">
                   {project.techStack.map(tech => (
                     <span key={tech} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium dark:text-slate-300">
                       {tech}
                     </span>
                   ))}
                 </div>
               </div>
             </div>

             <div className="space-y-10">
               <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
                 <h3 className="text-xl font-bold mb-6 dark:text-white">Project Specs</h3>
                   <div className="space-y-6">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center text-slate-500 dark:text-slate-400">
                       <User size={18} className="mr-3" /> <span className="text-sm">Client</span>
                     </div>
                     <span className="font-semibold dark:text-white">{project.client}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center text-slate-500 dark:text-slate-400">
                       <Calendar size={18} className="mr-3" /> <span className="text-sm">Completed</span>
                     </div>
                     <span className="font-semibold dark:text-white">{new Date(project.date).toLocaleDateString()}</span>
                   </div>
                 </div>
               </div>
               
               <div className="p-8 bg-blue-600 rounded-3xl text-white">
                  <h3 className="text-xl font-bold mb-4">Interested in something similar?</h3>
                  <p className="text-blue-100 mb-6 text-sm leading-relaxed">Let's discuss how we can adapt these technologies to your specific business needs.</p>
                  <Link to="/contact" className="w-full block text-center py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">Get Started</Link>
               </div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // Gallery View
  return (
    <div className="py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16">
           <h1 className="text-4xl md:text-6xl font-extrabold dark:text-white mb-6">Our Portfolio</h1>
           <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl">Explore the diverse range of industries and technical challenges we've conquered through innovative engineering.</p>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row items-center justify-end gap-6 mb-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
           <div className="relative w-full md:w-80">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Search projects..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
             />
           </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((p) => (
            <div 
              key={p.id} 
              ref={setReveal}
              className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold dark:text-white mb-4">{p.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 line-clamp-2 text-sm leading-relaxed mb-6">{p.description}</p>
                <Link to={`/projects/${p.id}`} className="inline-flex items-center text-blue-600 font-bold group-hover:underline">
                  View Case Study <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500">No projects match your current filters.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
