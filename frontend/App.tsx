
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Journey from './pages/Journey';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminPortal from './pages/AdminPortal';
import AdminDashboard from './pages/AdminDashboard';
import Logo from './components/Logo';
import { storage } from './services/storageService';
import { Theme } from './types';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(storage.getTheme());
  const [loading, setLoading] = useState(true);

  // Use useLayoutEffect to prevent flash of wrong theme
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storage.saveTheme(theme);
    
    // Analytics: Theme usage track
    const analytics = storage.getAnalytics();
    if (!analytics.themeUsage) {
      analytics.themeUsage = { light: 0, dark: 0 };
    }
    analytics.themeUsage[theme]++;
    storage.saveAnalytics(analytics);
  }, [theme]);

  useEffect(() => {
    // Global initial loading simulation
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-950 flex items-center justify-center z-[100] transition-colors">
        <div className="relative flex flex-col items-center">
          <Logo className="w-20 h-20 mb-8 animate-pulse" />
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin absolute inset-0"></div>
          </div>
          <div className="mt-8 text-center">
             <p className="text-lg font-bold tracking-[0.3em] text-slate-400 animate-pulse uppercase">PRANIKOV</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col transition-colors duration-300">
        <Routes>
          {/* Public Routes with Navbar/Footer */}
          <Route path="/*" element={
            <>
              <Navbar theme={theme} toggleTheme={toggleTheme} />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/journey" element={<Journey />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<Projects />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<div className="py-40 text-center dark:text-white font-bold text-2xl">404 | Access Denied</div>} />
                </Routes>
              </main>
              <Footer />
            </>
          } />

          {/* Secret Admin Routes - No Navbar/Footer */}
          <Route path="/admin-portal-9876" element={<AdminPortal />} />
          <Route path="/admin-portal-9876/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
