import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notif, setNotif] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://qr-code-generator-python3.onrender.com/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('email', data.email);
          localStorage.setItem('isPro', data.is_pro.toString());
          
          if (onLoginSuccess) {
            onLoginSuccess();
          }

          navigate(data.is_pro ? '/app' : '/upgrade');
        } else {
          setIsLogin(true);
          setNotif({ type: 'success', msg: 'Compte créé ! Connectez-vous.' });
        }
      } else { 
        setNotif({ type: 'error', msg: data.message }); 
      }
    } catch { 
      setNotif({ type: 'error', msg: 'Erreur serveur' }); 
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* BACKGROUND PREMIUM (EFFET ADOBE) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 via-white to-blue-50/50"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>
      </div>

      {/* NOTIFICATIONS */}
      {notif && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm animate-in slide-in-from-top-5 duration-300">
          <div className={`p-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-xl ${notif.type === 'success' ? 'bg-white/90 border-emerald-100 text-emerald-600' : 'bg-white/90 border-red-100 text-red-600'}`}>
            {notif.type === 'success' ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
            <p className="text-[10px] font-black uppercase flex-1 tracking-widest">{notif.msg}</p>
            <X size={16} className="cursor-pointer opacity-50 hover:opacity-100" onClick={() => setNotif(null)}/>
          </div>
        </div>
      )}

      {/* AUTH CARD */}
      <div className="relative z-10 bg-white/80 backdrop-blur-2xl p-8 md:p-14 rounded-[3.5rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)] border border-white w-full max-w-[480px] space-y-10 animate-in fade-in zoom-in-95 duration-700">
        
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-[0_10px_30px_-5px_rgba(37,99,235,0.4)] transform -rotate-6 transition-transform hover:rotate-0 duration-500">
              <ShieldCheck size={32} strokeWidth={2.5}/>
            </div>
            <Sparkles className="absolute -top-2 -right-2 text-amber-400 animate-pulse" size={20} />
          </div>
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              {isLogin ? 'Bon Retour' : 'Rejoindre'}
            </h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">
              {isLogin ? 'Accédez à votre moteur QRLYZE' : 'Créez votre accès professionnel'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Email Professionnel</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18}/>
              <input 
                type="email" 
                required 
                placeholder="nom@entreprise.com" 
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner" 
                value={email} 
                onChange={e => setEmail(e.target.value.toLowerCase())} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Mot de passe</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18}/>
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="••••••••" 
                className="w-full pl-14 pr-14 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 hover:-translate-y-1 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:shadow-blue-500/40 transition-all duration-300 active:scale-95">
            {isLogin ? 'Accéder au Studio' : 'Créer mon compte'} <ArrowRight size={18}/>
          </button>
        </form>

        <div className="space-y-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center">
              <span className="bg-white/0 px-4 text-[9px] font-black uppercase text-slate-300 tracking-[0.3em]">ou continuer avec</span>
            </div>
          </div>

          <button onClick={() => window.location.href='#'} className="w-full flex items-center justify-center gap-4 bg-white border border-slate-200 py-4.5 rounded-2xl font-bold text-xs text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" alt="Google" /> 
            Google Workspace
          </button>

          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="w-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors py-2"
          >
            {isLogin ? "Nouveau ici ? Créer un compte" : "Déjà membre ? Se connecter"}
          </button>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="absolute bottom-10 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
        QRLYZE Secure Authentication
      </div>
    </main>
  );
};

export default AuthPage;