
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { storage } from '../services/storageService';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Contact: React.FC = () => {
  const setReveal = useScrollReveal();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await storage.sendContactMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Analytics click track
      const analytics = storage.getAnalytics();
      analytics.interactions['contact_submit'] = (analytics.interactions['contact_submit'] || 0) + 1;
      storage.saveAnalytics(analytics);
    } catch (err: any) {
      alert(err?.message || 'Failed to send message');
      setStatus('idle');
    }
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold dark:text-white mb-6">Let's Connect</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Have a complex challenge? We have the engineers to solve it. Reach out to start a conversation.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div ref={setReveal} className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                  <Mail size={24} />
                </div>
                <h4 className="font-bold mb-2 dark:text-white">Email Us</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">pranikovdev@gmail.com</p>
              </div>
              <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                  <Phone size={24} />
                </div>
                <h4 className="font-bold mb-2 dark:text-white">Call Us</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">+91 8247216152</p>
              </div>
            </div>

            <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <h3 className="text-2xl font-bold mb-6">Our Vision</h3>
               <div className="flex items-start space-x-4 mb-8">
                
               </div>
               <div className="aspect-video w-full rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                 <img src="data:image/jpeg;base64,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" alt="Map" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>

          <div ref={setReveal} className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative">
            {status === 'success' ? (
              <div className="text-center py-20 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-bold dark:text-white mb-4">Message Sent!</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-10">Our team will review your inquiry and get back to you within 24 hours.</p>
                <button onClick={() => setStatus('idle')} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Subject</label>
                  <input 
                    required
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    placeholder="Project Inquiry"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Your Message</label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    placeholder="Tell us about your project goals..."
                  ></textarea>
                </div>
                <button 
                  disabled={status === 'sending'}
                  type="submit" 
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02]"
                >
                  {status === 'sending' ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
