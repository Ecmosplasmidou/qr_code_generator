import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { QrCode, User, LogOut, BarChart3, LayoutGrid, ArrowRight, Menu, X } from 'lucide-react';

import QrLyzer_logo from '../assets/favicon_qrlyzer-removebg.png';

const Navbar = ({ isPro }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const displayEmail = localStorage.getItem('email'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setIsMobileMenuOpen(false);
    navigate('/');
    window.location.reload();
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group z-20 shrink-0">
          <div className="relative w-9 h-9 md:w-10 md:h-10 shrink-0 overflow-hidden rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
            <img 
              src={QrLyzer_logo} 
              alt="QrLyzer Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-black text-xl text-slate-900 uppercase italic tracking-tighter drop-shadow-sm">
            QRLYZE
          </span>
        </Link>

        {/* --- NAVIGATION DESKTOP --- */}
        
        {/* LIENS CENTRÉS (Desktop) */}
        {token && (
          <nav className="hidden md:flex flex-1 justify-center absolute left-1/2 -translate-x-1/2 items-center gap-2">
            <NavLink to="/app" active={location.pathname === '/app'} icon={<LayoutGrid size={18}/>} label="Studio" />
            <NavLink to="/analytics" active={location.pathname === '/analytics'} icon={<BarChart3 size={18}/>} label="Analyse" />
          </nav>
        )}

        {/* ACTIONS / PROFIL (Desktop) */}
        <div className="hidden md:flex items-center gap-4 z-10 shrink-0">
          {!token ? (
            <div className="flex items-center gap-5">
              <Link 
                to="/auth?mode=login" 
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors"
              >
                Se connecter
              </Link>
              <Link 
                to="/auth?mode=register" 
                className="group flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black text-white bg-blue-600 hover:bg-slate-900 transition-all duration-300 uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                S'inscrire
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-2">
                {isPro && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Premium
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-700 truncate max-w-[140px]">
                  {displayEmail}
                </span>
              </div>
              <Link 
                to="/account" 
                className={`p-3 rounded-xl transition-all duration-300 ${
                  location.pathname === '/account' 
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105' 
                  : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-white hover:border-blue-100 hover:text-blue-600 hover:shadow-sm'
                }`}
                title="Mon Compte"
              >
                <User size={18} strokeWidth={2.5} />
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-slate-50 border border-slate-100 text-slate-400 p-3 rounded-xl hover:bg-red-50 hover:border-red-100 hover:text-red-600 hover:shadow-sm transition-all duration-300"
                title="Déconnexion"
              >
                <LogOut size={18} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* --- BOUTON MENU BURGER (Mobile) --- */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden z-20 p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
        >
          {isMobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
        </button>

      </div>

      {/* --- OVERLAY MENU MOBILE --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[100%] left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col px-6 py-6 animate-in slide-in-from-top-4 fade-in duration-300">
          
          {!token ? (
            <div className="flex flex-col gap-4">
              <Link 
                to="/auth?mode=login" 
                onClick={closeMenu}
                className="w-full text-center py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Se connecter
              </Link>
              <Link 
                to="/auth?mode=register" 
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white bg-blue-600 shadow-md shadow-blue-600/20"
              >
                S'inscrire <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* Infos Profile Mobile */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <User size={20} strokeWidth={2.5}/>
                </div>
                <div>
                  {isPro && <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 block mb-0.5">Premium</span>}
                  <span className="text-xs font-bold text-slate-800 truncate block max-w-[200px]">{displayEmail}</span>
                </div>
              </div>

              {/* Liens Mobile */}
              <nav className="flex flex-col gap-2">
                <MobileNavLink to="/app" active={location.pathname === '/app'} icon={<LayoutGrid size={18}/>} label="Studio" onClick={closeMenu} />
                <MobileNavLink to="/analytics" active={location.pathname === '/analytics'} icon={<BarChart3 size={18}/>} label="Analyse" onClick={closeMenu} />
                <MobileNavLink to="/account" active={location.pathname === '/account'} icon={<User size={18}/>} label="Mon Compte" onClick={closeMenu} />
              </nav>

              <div className="h-px bg-slate-100 w-full my-2"></div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <LogOut size={16} strokeWidth={2.5} /> Déconnexion
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, active, icon, label }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
      active 
        ? 'bg-blue-50 text-blue-600 shadow-sm' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon} {label}
  </Link>
);

const MobileNavLink = ({ to, active, icon, label, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
      active 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
        : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    {icon} {label}
  </Link>
);

export default Navbar;