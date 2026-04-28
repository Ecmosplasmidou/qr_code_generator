import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { QrCode, Zap, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const location = useLocation();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [location]);

  return (
    <footer className="relative bg-slate-950 text-white pt-24 pb-10 border-t border-white/10 overflow-hidden mt-auto">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-12 lg:gap-16 border-b border-white/10 pb-16">
          
          {/* COLONNE BRANDING */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <QrCode size={20} strokeWidth={2.5} />
              </div>
              <div className="font-black text-2xl italic uppercase tracking-tighter drop-shadow-md">
                QR<span className="text-blue-500">LYZE</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
              L'intelligence marketing derrière chaque scan. Analysez, modifiez et optimisez vos intéractions physiques en toute simplicité.
            </p>
          </div>

          {/* COLONNE LIENS */}
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2">
              <ShieldCheck size={14} /> Espace Client
            </h4>
            <ul className="flex flex-col gap-5 text-[11px] font-black uppercase tracking-widest text-slate-400">
              {token ? (
                <>
                  <li><Link to="/app" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Dashboard Studio</Link></li>
                  <li><Link to="/analytics" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Mes Statistiques</Link></li>
                  <li><Link to="/account" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Mon Compte</Link></li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/auth" className="text-white hover:text-blue-400 hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-2">
                      S'inscrire (PRO)
                    </Link>
                  </li>
                  <li><Link to="/auth" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Se Connecter</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* COLONNE INFRASTRUCTURE */}
          <div className="md:col-span-4 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2">
              <Zap size={14} /> Infrastructure
            </h4>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 space-y-5 hover:bg-white/10 transition-colors duration-500 shadow-inner group">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Serveur</span>
                <span className="flex items-center gap-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20 group-hover:bg-emerald-400/20 transition-colors">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Version</span>
                <span className="text-[10px] font-black text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                  v3.1.0-AI
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} QRLYZE . TOUS DROITS RÉSERVÉS.
          </p>
          <div className="flex gap-6 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            <span className="cursor-pointer hover:text-slate-300 transition-colors">Confidentialité</span>
            <span className="cursor-pointer hover:text-slate-300 transition-colors">CGU</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;