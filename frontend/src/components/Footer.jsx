import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { QrCode, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const location = useLocation();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [location]);

  return (
    <footer className="bg-slate-900 text-white py-20 mt-auto border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <QrCode size={20} />
              </div>
              <div className="font-black text-2xl italic uppercase tracking-tighter">
                QR<span className="text-blue-500">LYZE</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium italic max-w-sm">
              L'intelligence marketing derrière chaque scan. Analysez, modifiez et optimisez vos interactions physiques.
            </p>
          </div>

          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Espace Client</h4>
            <ul className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
              {token ? (
                <>
                  <li><Link to="/app" className="hover:text-white transition">Dashboard Studio</Link></li>
                  <li><Link to="/analytics" className="hover:text-white transition">Mes Statistiques</Link></li>
                  <li><Link to="/account" className="hover:text-white transition">Mon Compte</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/auth" className="hover:text-white transition underline decoration-blue-600 underline-offset-4">S'inscrire (Pro)</Link></li>
                  <li><Link to="/auth" className="hover:text-white transition">Se Connecter</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Infrastructure</h4>
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase">Serveur</span>
                <span className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase">
                  <Zap size={10} /> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase">Version</span>
                <span className="text-[9px] font-black text-white">v3.1.0-AI</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} QRLYZE
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;