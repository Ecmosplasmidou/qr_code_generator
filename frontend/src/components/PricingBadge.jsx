import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const PricingBadge = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== "null" && token !== "undefined") {
      setIsVisible(false);
    } else {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [location]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-700 pointer-events-none">
      <Link 
        to="/auth" 
        className="group relative flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl p-2 pr-6 rounded-full shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] border border-white/10 hover:border-blue-500/50 hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.6)] transition-all duration-500 hover:-translate-y-1 pointer-events-auto overflow-hidden"
      >
        {/* Glow effect interne au survol */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Icône */}
        <div className="relative w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
          <ShieldCheck size={22} strokeWidth={2.5} />
        </div>
        
        {/* Textes */}
        <div className="relative flex flex-col justify-center">
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-0.5">
            Débloquez tout le potentiel
          </span>
          <span className="text-[13px] md:text-sm font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
            QRLYZE PRO : 2€/MOIS
            <ArrowRight size={14} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          </span>
        </div>
      </Link>
    </div>
  );
};

export default PricingBadge;