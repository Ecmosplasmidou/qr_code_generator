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
    <header className="bg-white/90 border-b sticky top-0 z-50 px-4 md:px-10 h-20 flex items-center justify-between backdrop-blur-md">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
          <QrCode size={24}/>
        </div>
        <span className="font-black text-xl text-slate-900 uppercase italic tracking-tighter">QRLYZE</span>
      </Link>

      {token && (
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/app" active={location.pathname === '/app'} icon={<LayoutGrid size={16}/>} label="Studio" />
          <NavLink to="/analytics" active={location.pathname === '/analytics'} icon={<BarChart3 size={16}/>} label="Analyse" />
        </nav>
      )}

      <div className="flex items-center gap-4">
        {!token ? (
          <Link 
            to="/auth" 
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black text-white bg-slate-900 hover:bg-blue-600 transition-all uppercase tracking-widest shadow-xl"
          >
            <ShieldCheck size={14}/> Accès Pro
          </Link>
        ) : (
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:block text-right mr-2">
              {isPro && (
                <p className="text-[9px] font-black uppercase text-blue-600">Premium</p>
              )}
              <p className="text-[10px] font-bold text-slate-900 truncate max-w-[120px]">
                {displayEmail}
              </p>
            </div>
            
            <Link 
              to="/account" 
              className={`p-3 rounded-xl transition-all ${
                location.pathname === '/account' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600'
              }`}
              title="Mon Compte"
            >
              <User size={20} />
            </Link>

            <button 
              onClick={handleLogout}
              className="bg-slate-50 text-slate-400 p-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
              title="Déconnexion"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ to, active, icon, label }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
      active ? 'text-blue-600 scale-105' : 'text-slate-400 hover:text-slate-900 hover:translate-y-[-1px]'
    }`}
  >
    {icon} {label}
  </Link>
);

export default Navbar;