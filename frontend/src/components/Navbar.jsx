import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { QrCode, ShieldCheck, User, LogOut, BarChart3, LayoutGrid } from 'lucide-react';

const Navbar = ({ isPro }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const displayEmail = localStorage.getItem('email'); 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
            <QrCode size={22} strokeWidth={2.5}/>
          </div>
          <span className="font-black text-xl text-slate-900 uppercase italic tracking-tighter drop-shadow-sm">
            QRLYZE
          </span>
        </Link>

        {token && (
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/app" active={location.pathname === '/app'} icon={<LayoutGrid size={16}/>} label="Studio" />
            <NavLink to="/analytics" active={location.pathname === '/analytics'} icon={<BarChart3 size={16}/>} label="Analyse" />
          </nav>
        )}

        <div className="flex items-center gap-4">
          {!token ? (
            <Link 
              to="/auth" 
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black text-white bg-slate-900 hover:bg-blue-600 transition-all duration-300 uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              <ShieldCheck size={16}/> Accès Pro
            </Link>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden sm:flex flex-col items-end mr-2">
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
      </div>
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

export default Navbar;