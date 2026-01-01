
import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Github, Mail, MapPin, Phone, Instagram } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <Logo className="w-10 h-10" />
              <span className="text-xl font-extrabold tracking-tight dark:text-white uppercase">PRANIKOV<span className="text-brand-orange">.</span></span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Empowering global enterprises through cutting-edge technology and strategic innovation. Your partner in digital excellence.
            </p>
            <div className="flex space-x-4">
  <a
    href="https://www.linkedin.com/in/pranikov-dev-04102a3a4"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:text-brand-orange transition-all"
  >
    <Linkedin size={20} />
  </a>

  <a
    href="https://www.instagram.com/pranikov.dev/?__pwa=1"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:text-brand-orange transition-all"
  >
    <Instagram size={20} />
  </a>

  <a
    href="https://github.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="GitHub"
    className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:text-brand-orange transition-all"
  >
    <Github size={20} />
  </a>
</div>

          </div>

          <div>
            <h4 className="font-bold mb-6 dark:text-white">Our Services</h4>
            <ul className="space-y-4">
              <li><Link to="/services" className="text-slate-600 dark:text-slate-400 hover:text-brand-orange transition-colors">Web Development</Link></li>
              <li><Link to="/services" className="text-slate-600 dark:text-slate-400 hover:text-brand-orange transition-colors">App Development</Link></li>
              <li><Link to="/services" className="text-slate-600 dark:text-slate-400 hover:text-brand-orange transition-colors">AI Agents</Link></li>
              <li><Link to="/services" className="text-slate-600 dark:text-slate-400 hover:text-brand-orange transition-colors">Web Management</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 dark:text-white">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-brand-orange transition-colors">About Us</Link></li>
              <li><Link to="/projects" className="text-slate-600 dark:text-slate-400 hover:text-brand-orange transition-colors">Portoflio</Link></li>
              <li><Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-brand-orange transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 dark:text-white">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <MapPin size={18} className="text-brand-orange" />
                <span>Pranikov Office,Hindupur,Andhra Pradesh,India</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Phone size={18} className="text-brand-orange" />
                <span>+91 8247216152</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Mail size={18} className="text-brand-orange" />
                <span>pranikovdev@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Pranikov.dev All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
