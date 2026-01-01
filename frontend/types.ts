
export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  images: string[]; // Base64 strings or URLs
  date: string;
  client: string;
  featured: boolean;
  views: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: 'Cloud' | 'Terminal' | 'TrendingUp' | 'Shield' | 'Zap' | 'Globe';
  features: string[];
}

export interface Milestone {
  year: string;
  title: string;
  desc: string;
  image?: string; // New field for journey images
}

export interface AboutData {
  mission: string;
  vision: string;
  description: string;
  profileImage: string;
  logo?: string; // Added field for custom logo
  values: { title: string; desc: string }[];
  milestones: Milestone[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface AnalyticsData {
  pageViews: Record<string, number>;
  interactions: Record<string, number>;
  themeUsage: { light: number; dark: number };
  visitHistory: { date: string; count: number }[];
}

export type Theme = 'light' | 'dark';
