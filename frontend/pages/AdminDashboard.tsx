
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Plus, Settings, LogOut, 
  MessageSquare, Briefcase, Layout, Trash2, Edit, ChevronRight,
  TrendingUp, Eye, BookOpen, X, Upload, Image as ImageIcon,
  CheckCircle2, Globe, Shield, Zap, Terminal, Cloud, ListPlus,
  Info, Calendar, Save, Sparkles, Download, FileJson, RefreshCcw, HardDrive,
  Target, Lightbulb, UserCheck, Palette
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { storage } from '../services/storageService';
import { Project, Service, ContactMessage, AnalyticsData, AboutData, Milestone } from '../types';

const RECOMMENDED_ICONS = ['Cloud', 'Terminal', 'TrendingUp', 'Shield', 'Zap', 'Globe'];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const importInputRef = useRef<HTMLInputElement>(null);
  const milestoneImageRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const logoUploadRef = useRef<HTMLInputElement>(null);
  const projectImageRef = useRef<HTMLInputElement>(null);
  const milestoneUploadIdx = useRef<number>(-1);
  
  const [activeTab, setActiveTab] = useState<'analytics' | 'projects' | 'services' | 'journey' | 'about' | 'messages' | 'settings'>('analytics');
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  // Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Form States
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', client: '',
    techStack: '', featured: false, images: [] as string[]
  });
  
  const [serviceForm, setServiceForm] = useState({
    title: '', description: '', icon: 'Zap', features: ''
  });

  useEffect(() => {
    if (!storage.isLoggedIn()) {
      navigate('/admin-portal-9876');
      return;
    }
    refreshData();
  }, [navigate]);

  const refreshData = async () => {
    const p = storage.getProjects();
    const s = storage.getServices();
    const a = storage.getAnalytics();
    const ab = storage.getAbout();
    
    setProjects(p);
    setServices(s);
    setAnalytics(a);
    setAboutData(ab);

    try {
      const backendMessages = await storage.listContactMessages();
      setMessages(backendMessages);
    } catch {
      // If backend is down, fall back to local messages (legacy behavior)
      setMessages(storage.getMessages());
    }
  };

  const handleLogout = () => {
    storage.setLoggedIn(false);
    navigate('/');
  };

  const handleImageUpload = (file: File): Promise<string> => {
    return storage.uploadImage(file);
  };

  // AI Assistant
  const enhanceDescription = async (current: string, target: 'project' | 'service' | 'about') => {
    if (!current || current.length < 10) return alert("Please provide more context for AI polishing.");
    setAiLoading(true);
    try {
      // Use process.env.API_KEY directly as per @google/genai guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as an elite corporate engineering copywriter for "Pranikov". Enhance this draft description for a ${target}. Make it professional, sophisticated, and impactful. Draft: ${current}`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      const enhanced = response.text || current;
      
      if (target === 'project') setProjectForm(prev => ({ ...prev, description: enhanced }));
      else if (target === 'service') setServiceForm(prev => ({ ...prev, description: enhanced }));
      else if (target === 'about' && aboutData) {
        setAboutData({ ...aboutData, description: enhanced });
        storage.saveAbout({ ...aboutData, description: enhanced });
      }
    } catch (error) {
      alert("AI Assistant unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  // Profile / About Methods
  const handleProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file && aboutData) {
      try {
        const url = await handleImageUpload(file);
        const updated = { ...aboutData, profileImage: url };
        setAboutData(updated);
        storage.saveAbout(updated);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Image upload failed');
      }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file && aboutData) {
      try {
        const url = await handleImageUpload(file);
        const updated = { ...aboutData, logo: url };
        setAboutData(updated);
        storage.saveAbout(updated);
        alert('Logo updated! Refresh to see changes in header.');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Image upload failed');
      }
    }
  };

  const removeLogo = () => {
    if (aboutData && confirm('Restore default system logo?')) {
      const updated = { ...aboutData, logo: '' };
      setAboutData(updated);
      storage.saveAbout(updated);
    }
  };

  const updateAboutField = (field: keyof AboutData, value: string) => {
    if (!aboutData) return;
    const updated = { ...aboutData, [field]: value };
    setAboutData(updated);
    storage.saveAbout(updated);
  };

  // Values CRUD
  const addValue = () => {
    if (!aboutData) return;
    const newVal = { title: 'New Value', desc: 'Briefly describe this value.' };
    const updated = { ...aboutData, values: [...aboutData.values, newVal] };
    setAboutData(updated);
    storage.saveAbout(updated);
  };

  const updateValue = (idx: number, field: 'title' | 'desc', val: string) => {
    if (!aboutData) return;
    const newValues = [...aboutData.values];
    newValues[idx][field] = val;
    const updated = { ...aboutData, values: newValues };
    setAboutData(updated);
    storage.saveAbout(updated);
  };

  const deleteValue = (idx: number) => {
    if (!aboutData || !confirm('Discard this corporate value?')) return;
    const newValues = aboutData.values.filter((_, i) => i !== idx);
    const updated = { ...aboutData, values: newValues };
    setAboutData(updated);
    storage.saveAbout(updated);
  };

  // Journey / Milestone Methods
  const triggerMilestoneImage = (idx: number) => {
    milestoneUploadIdx.current = idx;
    milestoneImageRef.current?.click();
  };

  const handleMilestoneImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const idx = milestoneUploadIdx.current;
    e.target.value = '';
    if (file && idx !== -1 && aboutData) {
      try {
        const url = await handleImageUpload(file);
        const newMilestones = [...aboutData.milestones];
        newMilestones[idx].image = url;
        const updated = { ...aboutData, milestones: newMilestones };
        setAboutData(updated);
        storage.saveAbout(updated);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Image upload failed');
      } finally {
        milestoneUploadIdx.current = -1;
      }
    }
  };

  const addMilestone = () => {
    if (!aboutData) return;
    const newMilestone: Milestone = { year: new Date().getFullYear().toString(), title: 'New Achievement', desc: 'Detailed milestone description...', image: '' };
    const updated = { ...aboutData, milestones: [newMilestone, ...aboutData.milestones] };
    setAboutData(updated);
    storage.saveAbout(updated);
  };

  const updateMilestone = (idx: number, field: keyof Milestone, val: string) => {
    if (!aboutData) return;
    const newMilestones = [...aboutData.milestones];
    (newMilestones[idx] as any)[field] = val;
    const updated = { ...aboutData, milestones: newMilestones };
    setAboutData(updated);
    storage.saveAbout(updated);
  };

  const deleteMilestone = (idx: number) => {
    if (!aboutData || !confirm('Discard this milestone?')) return;
    const newMilestones = aboutData.milestones.filter((_, i) => i !== idx);
    const updated = { ...aboutData, milestones: newMilestones };
    setAboutData(updated);
    storage.saveAbout(updated);
  };

  // Service CRUD
  const openServiceModal = (service?: Service) => {
    if (service) {
      setEditingItem(service);
      setServiceForm({
        title: service.title,
        description: service.description,
        icon: service.icon,
        features: service.features.join(', ')
      });
    } else {
      setEditingItem(null);
      setServiceForm({ title: '', description: '', icon: 'Zap', features: '' });
    }
    setIsServiceModalOpen(true);
  };

  const saveService = (e: React.FormEvent) => {
    e.preventDefault();
    const newService: Service = {
      id: editingItem ? editingItem.id : Math.random().toString(36).substr(2, 9),
      title: serviceForm.title,
      description: serviceForm.description,
      icon: serviceForm.icon as any,
      features: serviceForm.features.split(',').map(f => f.trim()).filter(f => f !== '')
    };
    const updated = editingItem ? services.map(s => s.id === editingItem.id ? newService : s) : [...services, newService];
    storage.saveServices(updated);
    setServices(updated);
    setIsServiceModalOpen(false);
  };

  // Project CRUD
  const openProjectModal = (project?: Project) => {
    if (project) {
      setEditingItem(project);
      setProjectForm({
        title: project.title, description: project.description,
        client: project.client, techStack: project.techStack.join(', '), featured: project.featured, images: project.images
      });
    } else {
      setEditingItem(null);
      setProjectForm({ title: '', description: '', client: '', techStack: '', featured: false, images: [] });
    }
    setIsProjectModalOpen(true);
  };

  const addProjectImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    for (const file of files) {
      try {
        const url = await handleImageUpload(file);
        setProjectForm((prev) => ({ ...prev, images: [...prev.images, url] }));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Image upload failed');
        break;
      }
    }
  };

  const removeProjectImage = (index: number) => {
    setProjectForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const saveProject = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const pData: Project = {
      id: editingItem ? editingItem.id : Math.random().toString(36).substr(2, 9),
      ...projectForm,
      techStack: projectForm.techStack.split(',').map(s => s.trim()).filter(s => s !== ''),
      images: projectForm.images.length > 0 ? projectForm.images : ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200'],
      date: editingItem ? editingItem.date : new Date().toISOString(),
      views: editingItem ? editingItem.views : 0
    };
    setTimeout(() => {
      const updated = editingItem ? projects.map(p => p.id === editingItem.id ? pData : p) : [pData, ...projects];
      storage.saveProjects(updated);
      setProjects(updated);
      setIsProjectModalOpen(false);
      setFormLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col h-screen sticky top-0">
        <div className="flex items-center space-x-2 mb-10 px-2">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center font-bold text-white uppercase">P</div>
          <span className="text-lg font-extrabold dark:text-white tracking-tight">Admin Hub</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {[
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
            { id: 'projects', label: 'Projects', icon: <Briefcase size={20} /> },
            { id: 'services', label: 'Services', icon: <Layout size={20} /> },
            { id: 'about', label: 'About & Branding', icon: <UserCheck size={20} /> },
            { id: 'journey', label: 'Our Journey', icon: <Calendar size={20} /> },
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
            { id: 'settings', label: 'Backup/Restore', icon: <HardDrive size={20} /> },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div className="relative">
                {item.icon}
                {item.id === 'messages' && messages.filter(m => !m.read).length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-orange rounded-full"></span>}
              </div>
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl mt-auto transition-all"><LogOut size={20} /> <span className="font-semibold">Logout</span></button>
      </aside>

      <main className="flex-1 p-10 overflow-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold dark:text-white capitalize">{activeTab.replace('_', ' ')}</h1>
            <p className="text-slate-500">Pranikov Infrastructure Control Center</p>
          </div>
        </header>

        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  // Explicitly type reduce parameters to fix TS error on line 347
                  { label: 'Visits', val: Object.values(analytics.pageViews).reduce((a: number, b: number) => a + b, 0), icon: <Eye size={16}/> },
                  { label: 'Projects', val: projects.length, icon: <Briefcase size={16}/> },
                  { label: 'Services', val: services.length, icon: <Layout size={16}/> },
                  { label: 'Messages', val: messages.filter(m=>!m.read).length, icon: <MessageSquare size={16}/> }
                ].map(stat => (
                   <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center space-x-2 text-slate-500 mb-2">{stat.icon} <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span></div>
                      <p className="text-3xl font-bold dark:text-white">{stat.val}</p>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'projects' && (
           <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                   <h3 className="text-xl font-bold dark:text-white">Engineering Portfolio</h3>
                   <button onClick={() => openProjectModal()} className="flex items-center space-x-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all shadow-lg"><Plus size={20} /> <span>New Project</span></button>
                </div>
                <table className="w-full">
                   <thead><tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800"><th className="px-8 py-4">Project</th><th className="px-8 py-4">Client</th><th className="px-8 py-4 text-right">Action</th></tr></thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {projects.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                           <td className="px-8 py-5 flex items-center space-x-4">
                              <img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover" />
                              <span className="font-bold dark:text-white">{p.title}</span>
                           </td>
                           <td className="px-8 py-5 text-sm text-slate-500">{p.client}</td>
                           <td className="px-8 py-5 text-right">
                              <button onClick={() => openProjectModal(p)} className="p-2 text-slate-400 hover:text-brand-blue transition-colors"><Edit size={16} /></button>
                              <button onClick={() => {if(confirm('Delete Project?')){const u = projects.filter(pr=>pr.id!==p.id); setProjects(u); storage.saveProjects(u)}}} className="p-2 text-slate-400 hover:text-red-500 ml-2 transition-colors"><Trash2 size={16}/></button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           </div>
        )}

        {activeTab === 'services' && (
           <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                   <h3 className="text-xl font-bold dark:text-white">Capabilities Matrix</h3>
                   <button onClick={() => openServiceModal()} className="flex items-center space-x-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all shadow-lg"><Plus size={20} /> <span>New Capability</span></button>
                </div>
                {services.length === 0 ? (
                  <div className="p-20 text-center text-slate-400">No services deployed. Use the button above to add one.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-8 gap-6">
                    {services.map(s => (
                          <div key={s.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 group hover:border-brand-blue/30 transition-all">
                            <div className="flex justify-between mb-4">
                                <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-lg flex items-center justify-center font-bold">
                                  <Zap size={20} />
                                </div>
                                <div className="flex space-x-1">
                                  <button onClick={() => openServiceModal(s)} className="p-2 text-slate-400 hover:text-brand-blue"><Edit size={16} /></button>
                                  <button onClick={() => {if(confirm('Purge Service?')){const u = services.filter(ser=>ser.id!==s.id); setServices(u); storage.saveServices(u)}}} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <h4 className="font-bold dark:text-white text-lg mb-2">{s.title}</h4>
                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{s.description}</p>
                          </div>
                    ))}
                  </div>
                )}
             </div>
           </div>
        )}

        {activeTab === 'about' && aboutData && (
          <div className="animate-in fade-in duration-500 space-y-8 pb-10">
            {/* Branding Section (Logo Upload) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8">
               <h3 className="text-xl font-bold dark:text-white mb-8 flex items-center"><Palette className="mr-3 text-brand-orange" /> Corporate Branding</h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="space-y-4">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">System Logo (Appears in Header/Footer)</label>
                     <div className="flex items-center space-x-8">
                        <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 relative group/logo">
                           {aboutData.logo ? (
                              <img src={aboutData.logo} className="w-full h-full object-contain" alt="Current Logo" />
                           ) : (
                              <div className="text-center text-slate-400">
                                 <Zap size={32} className="mx-auto mb-2 opacity-20" />
                                 <span className="text-[9px] font-bold uppercase">Default SVG</span>
                              </div>
                           )}
                           <button onClick={() => logoUploadRef.current?.click()} className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center text-white transition-opacity"><Upload size={20} /></button>
                        </div>
                        <div className="space-y-3">
                           <button onClick={() => logoUploadRef.current?.click()} className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-dark transition-all">Upload New Logo</button>
                           {aboutData.logo && (
                             <button onClick={removeLogo} className="block text-xs font-bold text-red-500 hover:underline">Reset to Default</button>
                           )}
                           <p className="text-[9px] text-slate-400 uppercase tracking-widest">Supports PNG, JPG, SVG (Base64)</p>
                        </div>
                        <input type="file" className="hidden" ref={logoUploadRef} accept="image/*" onChange={handleLogoUpload} />
                     </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                     <div className="flex items-center space-x-2 text-slate-500 mb-2">
                        <Info size={14}/>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Logo Guidelines</span>
                     </div>
                     <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        The uploaded logo will replace the default "P" icon across the entire platform. 
                        We recommend using a square aspect ratio (1:1) and a transparent background for optimal visual consistency.
                     </p>
                  </div>
               </div>
            </div>

            {/* Profile Management */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8">
               <h3 className="text-xl font-bold dark:text-white mb-8 flex items-center"><UserCheck className="mr-3 text-brand-blue" /> Corporate Profile</h3>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Profile / Hero Image</label>
                     <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-[2rem] overflow-hidden relative group/img border border-slate-200 dark:border-slate-700">
                        <img src={aboutData.profileImage} className="w-full h-full object-cover" />
                        <button onClick={() => profileImageRef.current?.click()} className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity"><Upload size={24} /></button>
                        <input type="file" className="hidden" ref={profileImageRef} accept="image/*" onChange={handleProfileImage} />
                     </div>
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                     <div className="space-y-2">
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Primary Description</label>
                          <button onClick={() => enhanceDescription(aboutData.description, 'about')} disabled={aiLoading} className="text-[10px] font-bold text-brand-blue flex items-center space-x-1 disabled:opacity-50"><Sparkles size={12}/> <span>{aiLoading ? 'Thinking...' : 'AI Expand'}</span></button>
                        </div>
                        <textarea value={aboutData.description} onChange={e => updateAboutField('description', e.target.value)} rows={5} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none dark:text-white resize-none leading-relaxed" />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center"><Target className="mr-1" size={10}/> Our Mission</label>
                           <textarea value={aboutData.mission} onChange={e => updateAboutField('mission', e.target.value)} rows={3} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none dark:text-white text-sm" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center"><Lightbulb className="mr-1" size={10}/> Our Vision</label>
                           <textarea value={aboutData.vision} onChange={e => updateAboutField('vision', e.target.value)} rows={3} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none dark:text-white text-sm" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Core Values CRUD */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="text-xl font-bold dark:text-white flex items-center"><Shield className="mr-3 text-brand-orange" /> Core Values CRUD</h3>
                  <button onClick={addValue} className="flex items-center space-x-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all shadow-lg"><Plus size={20} /> <span>New Value</span></button>
               </div>
               <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aboutData.values.map((v, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4 relative group">
                       <button onClick={() => deleteValue(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                       <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Value Title</label>
                          <input value={v.title} onChange={e => updateValue(idx, 'title', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 outline-none font-bold py-1 dark:text-white" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Detailed Definition</label>
                          <textarea value={v.desc} onChange={e => updateValue(idx, 'desc', e.target.value)} rows={3} className="w-full bg-transparent outline-none text-xs text-slate-600 dark:text-slate-400 resize-none leading-relaxed" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'journey' && aboutData && (
           <div className="animate-in fade-in duration-500 space-y-8 pb-10">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="text-xl font-bold dark:text-white">Evolution Timeline</h3>
                  <button onClick={addMilestone} className="flex items-center space-x-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg"><Plus size={20} /> <span>Add Milestone</span></button>
                </div>
                <div className="p-8 space-y-8">
                  {aboutData.milestones.map((m, idx) => (
                    <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-8 animate-in slide-in-from-top-4">
                      <div className="md:w-56 space-y-4">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Fiscal Year</label>
                          <input type="text" value={m.year} onChange={e => updateMilestone(idx, 'year', e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border rounded-xl outline-none font-bold dark:text-white" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Event Visual</label>
                           <div className="aspect-video bg-white dark:bg-slate-900 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-700 group/img">
                             {m.image ? (
                               <img src={m.image} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={24} /></div>
                             )}
                             <button onClick={() => triggerMilestoneImage(idx)} className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity"><Upload size={20} /></button>
                           </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Strategic Milestone Header</label>
                        <input type="text" value={m.title} onChange={e => updateMilestone(idx, 'title', e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border rounded-xl outline-none font-bold dark:text-white text-lg" />
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Historical Narrative</label>
                        <textarea value={m.desc} rows={4} onChange={e => updateMilestone(idx, 'desc', e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border rounded-xl outline-none resize-none text-sm dark:text-white leading-relaxed" />
                      </div>
                      <button onClick={() => deleteMilestone(idx)} className="p-2 text-slate-400 hover:text-red-500 mt-6"><Trash2 size={20} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <input type="file" className="hidden" ref={milestoneImageRef} accept="image/*" onChange={handleMilestoneImage} />
           </div>
        )}

        {/* Project Modal */}
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                   <h3 className="text-2xl font-black dark:text-white">{editingItem ? 'Audit Case Study' : 'Initiate New Deployment'}</h3>
                   <button onClick={() => setIsProjectModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={24} /></button>
                </header>
                <form onSubmit={saveProject} className="p-8 overflow-auto flex-1 space-y-8">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Asset Identity</label>
                        <input value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-blue" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Global Partner</label>
                        <input value={projectForm.client} onChange={e => setProjectForm({...projectForm, client: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-blue" required />
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Technology Stack</label>
                      <input value={projectForm.techStack} onChange={e => setProjectForm({...projectForm, techStack: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-blue" placeholder="React, Node.js, AWS" />
                   </div>
                   
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Visual Assets (Slideshow Gallery)</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {projectForm.images.map((img, i) => (
                           <div key={i} className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative group">
                              <img src={img} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeProjectImage(i)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                           </div>
                         ))}
                         <button type="button" onClick={() => projectImageRef.current?.click()} className="aspect-video border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-brand-blue hover:text-brand-blue transition-all">
                            <Plus size={24} /> <span className="text-[10px] font-bold mt-1 uppercase">Upload Image</span>
                         </button>
                         <input type="file" multiple className="hidden" ref={projectImageRef} accept="image/*" onChange={addProjectImages} />
                      </div>
                   </div>

                   <div className="space-y-2 relative">
                      <div className="flex justify-between items-center mb-1 px-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Engineering Logic Description</label>
                        <button type="button" onClick={() => enhanceDescription(projectForm.description, 'project')} disabled={aiLoading} className="text-[10px] font-bold text-brand-blue flex items-center space-x-1 disabled:opacity-50"><Sparkles size={12} /> <span>{aiLoading ? 'Synthesizing...' : 'Expand via AI'}</span></button>
                      </div>
                      <textarea value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} rows={5} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none resize-none dark:text-white leading-relaxed focus:ring-2 focus:ring-brand-blue" required />
                   </div>
                </form>
                <footer className="p-8 border-t bg-slate-50/50 dark:bg-slate-800/50 flex justify-end space-x-4">
                   <button onClick={() => setIsProjectModalOpen(false)} className="px-6 py-2 font-bold text-slate-500">Cancel</button>
                   <button onClick={saveProject} className="px-10 py-4 bg-brand-blue text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20">Commit Asset</button>
                </footer>
             </div>
          </div>
        )}

        {/* Service Modal */}
        {isServiceModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white dark:bg-slate-900 w-full max-w-2xl overflow-hidden rounded-[3rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                   <h3 className="text-2xl font-black dark:text-white">{editingItem ? 'Modify Protocol' : 'Deploy Protocol'}</h3>
                   <button onClick={() => setIsServiceModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={24} /></button>
                </header>
                <form onSubmit={saveService} className="p-8 space-y-6">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Service Designation</label>
                      <input required value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-blue" />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Icon ID</label>
                         <input list="icon-list" value={serviceForm.icon} onChange={e => setServiceForm({...serviceForm, icon: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-blue" />
                         <datalist id="icon-list">{RECOMMENDED_ICONS.map(i => <option key={i} value={i}/>)}</datalist>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Core Tech Matrix</label>
                         <input value={serviceForm.features} onChange={e => setServiceForm({...serviceForm, features: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-blue" />
                      </div>
                   </div>
                   <div className="space-y-1 relative">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Capabilities</label>
                        <button type="button" onClick={() => enhanceDescription(serviceForm.description, 'service')} disabled={aiLoading} className="text-[10px] font-bold text-brand-blue flex items-center space-x-1 disabled:opacity-50"><Sparkles size={12} /> <span>AI Polish</span></button>
                      </div>
                      <textarea rows={4} required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none dark:text-white resize-none focus:ring-2 focus:ring-brand-blue" />
                   </div>
                </form>
                <footer className="p-8 border-t bg-slate-50/50 dark:bg-slate-800/50 flex justify-end space-x-4">
                   <button onClick={() => setIsServiceModalOpen(false)} className="px-6 py-2 font-bold text-slate-500">Abort</button>
                   <button onClick={saveService} className="px-10 py-4 bg-brand-blue text-white rounded-2xl font-bold transition-all">Commit Capability</button>
                </footer>
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-500">
             <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl">
                <h3 className="text-2xl font-black mb-6 dark:text-white">System Portability</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
                   Export your entire infrastructure state (Projects, About, Services, Journey) as an encrypted JSON backup.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button onClick={storage.exportAll} className="flex-1 px-8 py-5 bg-brand-blue text-white rounded-2xl font-bold flex items-center justify-center space-x-3 shadow-lg shadow-blue-500/20">
                    <Download size={20}/> <span>Export State</span>
                  </button>
                  <button onClick={() => importInputRef.current?.click()} className="flex-1 px-8 py-5 border-2 border-slate-200 dark:border-slate-800 dark:text-white rounded-2xl font-bold flex items-center justify-center space-x-3">
                    <RefreshCcw size={20}/> <span>Sync Backup</span>
                  </button>
                </div>
                <input type="file" ref={importInputRef} className="hidden" accept=".json" onChange={(e)=>{
                   const file = e.target.files?.[0];
                   if(file){
                     const r = new FileReader();
                     r.onload=(ev)=>{if(storage.importAll(ev.target?.result as string)){alert('Sync Complete!'); refreshData();}};
                     r.readAsText(file);
                   }
                }} />
             </div>
          </div>
        )}

        {activeTab === 'messages' && (
           <div className="space-y-6">
              {messages.length === 0 ? (
                <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-[0.2em] opacity-30">No active communication logs.</div>
              ) : messages.map((m) => (
                <div key={m.id} className={`p-8 bg-white dark:bg-slate-900 border ${m.read ? 'border-slate-200 dark:border-slate-800' : 'border-brand-blue ring-1 ring-brand-blue/30 shadow-lg'} rounded-[2rem] transition-all`}>
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-black text-brand-blue text-xl">{m.name.charAt(0)}</div>
                        <div>
                          <h4 className="font-bold dark:text-white text-lg leading-tight">{m.subject}</h4>
                          <p className="text-sm text-slate-500">{m.name} &bull; {m.email}</p>
                        </div>
                      </div>
                      {!m.read && <span className="px-3 py-1 bg-brand-orange text-white text-[10px] font-bold rounded-full uppercase">Priority Inquiry</span>}
                   </div>
                   <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic mb-8 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">"{m.message}"</p>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(m.date).toLocaleString()}</span>
                      <div className="flex space-x-3">
                        {!m.read && (
                          <button
                            onClick={() => {
                              storage.markMessageRead(m.id);
                              setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, read: true } : msg));
                            }}
                            className="px-6 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-dark transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (!confirm('Purge Message?')) return;
                            try {
                              await storage.deleteContactMessage(m.id);
                              await refreshData();
                            } catch (err: any) {
                              alert(err?.message || 'Failed to delete message');
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
