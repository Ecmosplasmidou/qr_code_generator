import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, X, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <main className="min-h-screen flex items-center justify-center px-4 py-20 bg-slate-50">
      {notif && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm">
          <div className={`p-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${notif.type === 'success' ? 'bg-white border-emerald-100 text-emerald-600' : 'bg-white border-red-100 text-red-600'}`}>
            {notif.type === 'success' ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
            <p className="text-[10px] font-black uppercase flex-1">{notif.msg}</p>
            <X size={16} className="cursor-pointer" onClick={() => setNotif(null)}/>
          </div>
        </div>
      )}
      <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-2xl w-full max-w-[450px] space-y-8">
        <div className="text-center space-y-2">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-100">
            <ShieldCheck size={28}/>
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            required 
            placeholder="Email" 
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none font-bold shadow-inner" 
            value={email} 
            onChange={e => setEmail(e.target.value.toLowerCase())} 
          />
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              placeholder="Mot de passe" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none font-bold shadow-inner" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>
          <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all">
            {isLogin ? 'Accéder' : 'S\'inscrire'} <ArrowRight size={16}/>
          </button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-[9px] font-black uppercase text-slate-300 bg-white px-2">Ou</div>
        </div>
        <button onClick={() => window.location.href='#'} className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" alt="Google" /> 
          Continuer avec Google
        </button>
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600"
        >
          {isLogin ? "Créer un compte" : "Se connecter"}
        </button>
      </div>
    </main>
  );
};

export default AuthPage;