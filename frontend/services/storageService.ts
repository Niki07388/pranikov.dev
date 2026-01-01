
import { Project, Service, ContactMessage, AnalyticsData, Theme, AboutData } from '../types';
import { INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_ABOUT } from '../constants';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';
const ADMIN_API_KEY = (import.meta as any).env?.VITE_ADMIN_API_KEY || '';

const adminAuthHeaders = ADMIN_API_KEY ? { 'X-Admin-Key': ADMIN_API_KEY } : {};

const KEYS = {
  PROJECTS: 'nexus_projects',
  SERVICES: 'nexus_services',
  ABOUT: 'nexus_about',
  MESSAGES: 'nexus_messages',
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

export const storage = {
  // ... existing methods ...

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
    const url = data.url || '';
    return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  },

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
    const res = await fetch(`${API_BASE_URL}/api/contact`, { method: 'GET', headers: adminAuthHeaders });
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
    const res = await fetch(`${API_BASE_URL}/api/contact/${encodeURIComponent(id)}`, { method: 'DELETE', headers: adminAuthHeaders });
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
  getProjects: (): Project[] => {
    const data = localStorage.getItem(KEYS.PROJECTS);
    if (!data) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS as Project[];
    }
    return JSON.parse(data);
  },
  saveProjects: (projects: Project[]) => localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects)),

  getServices: (): Service[] => {
    const data = localStorage.getItem(KEYS.SERVICES);
    if (!data) {
      localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES as any;
    }
    return JSON.parse(data);
  },
  saveServices: (services: Service[]) => localStorage.setItem(KEYS.SERVICES, JSON.stringify(services)),

  getAbout: (): AboutData => {
    const data = localStorage.getItem(KEYS.ABOUT);
    if (!data) {
      localStorage.setItem(KEYS.ABOUT, JSON.stringify(INITIAL_ABOUT));
      return INITIAL_ABOUT as AboutData;
    }
    return JSON.parse(data);
  },
  saveAbout: (about: AboutData) => localStorage.setItem(KEYS.ABOUT, JSON.stringify(about)),

  getMessages: (): ContactMessage[] => JSON.parse(localStorage.getItem(KEYS.MESSAGES) || '[]'),
  saveMessage: (msg: ContactMessage) => {
    const msgs = storage.getMessages();
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify([msg, ...msgs]));
  },

  getAnalytics: (): AnalyticsData => {
    const data = localStorage.getItem(KEYS.ANALYTICS);
    const empty: AnalyticsData = { 
        pageViews: {}, 
        interactions: {}, 
        themeUsage: { light: 0, dark: 0 },
        visitHistory: Array.from({length: 7}, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return { date: d.toISOString().split('T')[0], count: Math.floor(Math.random() * 50) + 10 };
        }).reverse()
    };
    return data ? JSON.parse(data) : empty;
  },
  saveAnalytics: (data: AnalyticsData) => localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(data)),

  getTheme: (): Theme => (localStorage.getItem(KEYS.THEME) as Theme) || 'light',
  saveTheme: (theme: Theme) => localStorage.setItem(KEYS.THEME, theme),

  isLoggedIn: (): boolean => localStorage.getItem(KEYS.AUTH) === 'true',
  setLoggedIn: (val: boolean) => localStorage.setItem(KEYS.AUTH, val ? 'true' : 'false'),

  // Bulk Import/Export
  exportAll: () => {
    const fullData = {
      projects: storage.getProjects(),
      services: storage.getServices(),
      about: storage.getAbout(),
      messages: storage.getMessages(),
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
      if (data.projects) localStorage.setItem(KEYS.PROJECTS, JSON.stringify(data.projects));
      if (data.services) localStorage.setItem(KEYS.SERVICES, JSON.stringify(data.services));
      if (data.about) localStorage.setItem(KEYS.ABOUT, JSON.stringify(data.about));
      if (data.messages) localStorage.setItem(KEYS.MESSAGES, JSON.stringify(data.messages));
      if (data.analytics) localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(data.analytics));
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  }
};
