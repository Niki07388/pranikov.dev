import { Project, Service, ContactMessage, AnalyticsData, Theme, AboutData } from '../types';
import { INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_ABOUT } from '../constants';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';
const ADMIN_API_KEY = (import.meta as any).env?.VITE_ADMIN_API_KEY || '';

// Fix: Backend expects X-API-Key, not X-Admin-Key
const adminAuthHeaders = ADMIN_API_KEY ? { 'X-API-Key': ADMIN_API_KEY } : {};

const KEYS = {
  MESSAGE_READ_IDS: 'nexus_message_read_ids',
  ANALYTICS: 'nexus_analytics',
  THEME: 'nexus_theme',
  AUTH: 'nexus_auth'
};

type BackendContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

type BackendProject = {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  featured: boolean;
  createdAt: string;
};

export const storage = {
  // ==================== PROJECTS ====================
  getProjects: async (): Promise<Project[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'GET',
      });
      
      if (!res.ok) {
        console.error('Failed to fetch projects from backend, using initial data');
        return INITIAL_PROJECTS as Project[];
      }
      
      const data = await res.json() as BackendProject[];
      return data.map(p => ({
        id: String(p.id),
        title: p.title,
        description: p.description,
        image: p.image,
        technologies: p.technologies,
        github: p.githubUrl || '',
        demo: p.liveUrl || '',
        category: p.category,
        featured: p.featured,
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return INITIAL_PROJECTS as Project[];
    }
  },

  saveProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...adminAuthHeaders,
      },
      body: JSON.stringify({
        title: project.title,
        description: project.description,
        image: project.image,
        technologies: project.technologies,
        githubUrl: project.github,
        liveUrl: project.demo,
        category: project.category,
        featured: project.featured,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to save project');
    }

    const data = await res.json() as BackendProject;
    return {
      id: String(data.id),
      title: data.title,
      description: data.description,
      image: data.image,
      technologies: data.technologies,
      github: data.githubUrl || '',
      demo: data.liveUrl || '',
      category: data.category,
      featured: data.featured,
    };
  },

  updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...adminAuthHeaders,
      },
      body: JSON.stringify({
        title: project.title,
        description: project.description,
        image: project.image,
        technologies: project.technologies,
        githubUrl: project.github,
        liveUrl: project.demo,
        category: project.category,
        featured: project.featured,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to update project');
    }

    const data = await res.json() as BackendProject;
    return {
      id: String(data.id),
      title: data.title,
      description: data.description,
      image: data.image,
      technologies: data.technologies,
      github: data.githubUrl || '',
      demo: data.liveUrl || '',
      category: data.category,
      featured: data.featured,
    };
  },

  deleteProject: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: adminAuthHeaders,
    });

    if (!res.ok) {
      throw new Error('Failed to delete project');
    }
  },

  // ==================== SERVICES ====================
  // Keep services in localStorage for now if backend doesn't support them
  getServices: (): Service[] => {
    const data = localStorage.getItem('nexus_services');
    if (!data) {
      localStorage.setItem('nexus_services', JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES as any;
    }
    return JSON.parse(data);
  },
  
  saveServices: (services: Service[]) => {
    localStorage.setItem('nexus_services', JSON.stringify(services));
  },

  // ==================== ABOUT ====================
  // Keep about in localStorage for now if backend doesn't support it
  getAbout: (): AboutData => {
    const data = localStorage.getItem('nexus_about');
    if (!data) {
      localStorage.setItem('nexus_about', JSON.stringify(INITIAL_ABOUT));
      return INITIAL_ABOUT as AboutData;
    }
    return JSON.parse(data);
  },
  
  saveAbout: (about: AboutData) => {
    localStorage.setItem('nexus_about', JSON.stringify(about));
  },

  // ==================== IMAGE UPLOAD ====================
  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);

    console.log('Uploading image:', file.name, file.type, file.size);

    const res = await fetch(`${API_BASE_URL}/api/images`, {
      method: 'POST',
      headers: adminAuthHeaders,
      body: form,
    });

    console.log('Upload response status:', res.status);

    if (!res.ok) {
      let message = 'Image upload failed';
      try {
        const data = await res.json();
        if (data?.error) message = data.error;
        console.error('Upload error response:', data);
      } catch (e) {
        const text = await res.text();
        console.error('Upload error text:', text);
      }
      throw new Error(message);
    }

    const data = await res.json() as { id: number; url: string };
    console.log('Upload success:', data);
    return data.url;
  },

  // ==================== CONTACT MESSAGES ====================
  sendContactMessage: async (input: { name: string; email: string; subject: string; message: string; }) => {
    const res = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      let message = 'Failed to send message';
      try {
        const data = await res.json();
        if (data?.error) message = data.error;
      } catch {
        // ignore
      }
      throw new Error(message);
    }

    return await res.json() as BackendContactMessage;
  },

  listContactMessages: async () => {
    const res = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'GET',
      headers: adminAuthHeaders
    });
    
    if (!res.ok) {
      throw new Error('Failed to load messages');
    }
    
    const data = await res.json() as BackendContactMessage[];
    const readIds = storage.getReadMessageIds();
    
    return data.map((m) => ({
      id: String(m.id),
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      date: m.createdAt,
      read: readIds.has(String(m.id)),
    }));
  },

  deleteContactMessage: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/api/contact/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: adminAuthHeaders
    });
    
    if (!res.ok) {
      throw new Error('Failed to delete message');
    }
  },

  getReadMessageIds: (): Set<string> => {
    try {
      const raw = localStorage.getItem(KEYS.MESSAGE_READ_IDS);
      const arr = raw ? (JSON.parse(raw) as string[]) : [];
      return new Set(arr);
    } catch {
      return new Set();
    }
  },

  markMessageRead: (id: string) => {
    const set = storage.getReadMessageIds();
    set.add(id);
    localStorage.setItem(KEYS.MESSAGE_READ_IDS, JSON.stringify(Array.from(set)));
  },

  // ==================== ANALYTICS ====================
  getAnalytics: (): AnalyticsData => {
    const data = localStorage.getItem(KEYS.ANALYTICS);
    const empty: AnalyticsData = {
      pageViews: {},
      interactions: {},
      themeUsage: { light: 0, dark: 0 },
      visitHistory: Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return { date: d.toISOString().split('T')[0], count: Math.floor(Math.random() * 50) + 10 };
      }).reverse()
    };
    return data ? JSON.parse(data) : empty;
  },
  
  saveAnalytics: (data: AnalyticsData) => {
    localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(data));
  },

  // ==================== THEME ====================
  getTheme: (): Theme => (localStorage.getItem(KEYS.THEME) as Theme) || 'light',
  saveTheme: (theme: Theme) => localStorage.setItem(KEYS.THEME, theme),

  // ==================== AUTH ====================
  isLoggedIn: (): boolean => localStorage.getItem(KEYS.AUTH) === 'true',
  setLoggedIn: (val: boolean) => localStorage.setItem(KEYS.AUTH, val ? 'true' : 'false'),

  // ==================== BULK OPERATIONS ====================
  exportAll: async () => {
    const fullData = {
      projects: await storage.getProjects(),
      services: storage.getServices(),
      about: storage.getAbout(),
      messages: await storage.listContactMessages(),
      analytics: storage.getAnalytics()
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pranikov_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  },

  importAll: (json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.services) localStorage.setItem('nexus_services', JSON.stringify(data.services));
      if (data.about) localStorage.setItem('nexus_about', JSON.stringify(data.about));
      if (data.analytics) localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(data.analytics));
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  }
};
