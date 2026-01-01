
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, Info } from 'lucide-react';
import { storage } from '../services/storageService';
import { ADMIN_CREDENTIALS } from '../constants';

const AdminPortal: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock check (in production this would be a secure API call)
    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && password === 'admin123') {
        storage.setLoggedIn(true);
        navigate('/admin-portal-9876/dashboard');
      } else {
        setError('Invalid administrative credentials.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-blue-500/20">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Pranikov Core Access</h1>
          <p className="text-slate-400">Authorization required to proceed.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl space-y-6 border border-slate-800">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
               <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
               <input 
                 required
                 type="text" 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-brand-orange transition-all placeholder:text-slate-600"
                 placeholder="Enter admin ID"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
               <input 
                 required
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-brand-orange transition-all placeholder:text-slate-600"
                 placeholder="••••••••"
               />
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full py-5 bg-brand-blue hover:bg-brand-dark text-white rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-blue-500/20"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Authenticate</span>
                <ShieldCheck size={20} />
              </>
            )}
          </button>

          {/* Demo Credentials Hint */}
          <div className="mt-6 pt-6 border-t border-slate-800 flex items-start space-x-3 text-slate-500">
            <Info size={16} className="shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-slate-400 mb-1">Demo Access:</p>
              <p>User: <code className="text-brand-orange">pranikov_admin</code></p>
              <p>Pass: <code className="text-brand-orange">admin123</code></p>
            </div>
          </div>
        </form>

        <p className="text-center mt-10 text-slate-600 text-[10px] uppercase tracking-widest font-bold">
          PRANIKOV SECURITY ENFORCEMENT &bull; Protocol v2.4.0
        </p>
      </div>
    </div>
  );
};

export default AdminPortal;
