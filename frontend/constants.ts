
export const ADMIN_SECRET_PATH = '/admin-portal-9876';
export const ADMIN_CREDENTIALS = {
  username: 'pranikov_admin',
  passwordHash: 'e99a18c428cb38d5f260853678922e03' // md5 of 'admin123'
};

export const INITIAL_SERVICES = [
  {
    id: 's1',
    title: 'Enterprise Software',
    description: 'Bespoke software solutions tailored for large-scale operations and complex workflows.',
    icon: 'Terminal',
    features: ['Scalability', 'High Availability', 'Custom Integrations']
  },
  {
    id: 's2',
    title: 'Cloud Infrastructure',
    description: 'Modernizing legacy systems and architecting future-proof cloud environments.',
    icon: 'Cloud',
    features: ['Multi-cloud Strategy', 'Security Compliance', 'DevOps Automation']
  },
  {
    id: 's3',
    title: 'Strategic Consulting',
    description: 'Expert guidance on digital transformation and technical roadmapping.',
    icon: 'TrendingUp',
    features: ['Technical Audits', 'Market Analysis', 'Efficiency Strategy']
  }
];

export const INITIAL_ABOUT = {
  description: "Founded on the principles of engineering excellence and strategic innovation, Pranikov has grown into a global leader in enterprise digital transformation. We bridge the gap between complex technical challenges and elegant, scalable business solutions.",
  mission: "To empower enterprises with intelligent technology that drives sustainable growth and defines the future of industry.",
  vision: "To be the most trusted global partner for high-stakes digital engineering and strategic innovation.",
  profileImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200",
  logo: "", // Default empty to use SVG fallback
  values: [
    { title: "Integrity", desc: "We uphold the highest standards of transparency in every line of code and every client interaction." },
    { title: "Precision", desc: "Our engineering approach is rooted in mathematical accuracy and performance optimization." },
    { title: "Innovation", desc: "We don't just follow trends; we set the benchmark for what's possible in enterprise tech." }
  ],
  milestones: [
    { year: "2015", title: "Inception", desc: "Pranikov founded as a specialized software consultancy in San Francisco." },
    { year: "2018", title: "Global Expansion", desc: "Opened European headquarters and scaled to 50+ enterprise clients." },
    { year: "2023", title: "AI Revolution", desc: "Launched our proprietary AI infrastructure framework for logistics." }
  ]
};

export const INITIAL_PROJECTS = [
  {
    id: 'p1',
    title: 'FinTech Alpha',
    description: 'A revolutionary core banking system designed for micro-service architecture and high-throughput transactions.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    images: ['https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=1200', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200'],
    date: '2023-11-15',
    client: 'Alpha Global Bank',
    featured: true,
    views: 1240
  },
  {
    id: 'p2',
    title: 'Logistics Stream',
    description: 'Real-time supply chain monitoring platform integrating IoT sensors and predictive AI.',
    techStack: ['Python', 'TensorFlow', 'React', 'Go'],
    images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200'],
    date: '2024-01-20',
    client: 'SwiftTrack Logistics',
    featured: true,
    views: 890
  }
];
