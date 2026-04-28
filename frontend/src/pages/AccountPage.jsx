import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, LogOut, ShieldCheck, QrCode, UserPlus, Link as LinkIcon, Save, AlertTriangle } from 'lucide-react';

const API_URL = "https://qr-code-generator-python3.onrender.com";

const AccountPage = ({ history }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const stats = {
    qrs: history.filter(i => i.type === 'qr' || !i.type).length,
    vcards: history.filter(i => i.type === 'vcard').length,
    links: history.filter(i => i.type === 'link').length,
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/update-account`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      localStorage.setItem('email', email);
      alert("Informations mises à jour !");
    }
  };

  const handleDeleteAccount = async () => {
    const res = await fetch(`${API_URL}/delete-account`, {
      method: 'DELETE',
      headers: { 'x-access-token': localStorage.getItem('token') }
    });
    if (res.ok) {
      localStorage.clear();
      navigate('/');
      window.location.reload();
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 space-y-12 animate-in fade-in duration-500">
      
      {/* HEADER PROFIL (PREMIUM DARK) */}
      <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl overflow-hidden group">
        {/* Background Image Subtile */}
        <img 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop" 
          alt="Abstract Dark" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>

        <div className="relative z-10 flex items-center gap-8 w-full md:w-auto">
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]">
            <User size={48} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-white">Mon Espace</h1>
            <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mt-3">{email}</p>
          </div>
        </div>

        <button onClick={logout} className="relative z-10 w-full md:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:border-red-600 shadow-xl transition-all">
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      {/* STATS RAPIDES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<QrCode size={20}/>} count={stats.qrs} label="QR Codes" color="blue" />
        <StatCard icon={<UserPlus size={20}/>} count={stats.vcards} label="vCards" color="emerald" />
        <StatCard icon={<LinkIcon size={20}/>} count={stats.links} label="Liens" color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FORMULAIRE MODIFICATION */}
        <section className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 space-y-8 relative overflow-hidden">
          <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 relative z-10">
            <ShieldCheck className="text-blue-600" size={28} /> Sécurité
          </h2>
          <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Modifier Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                <input type="email" value={email} onChange={e => setEmail(e.target.value.toLowerCase())} className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-600 font-bold outline-none shadow-inner transition-all text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Nouveau Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                <input type="password" placeholder="Laisser vide pour conserver" onChange={e => setPassword(e.target.value)} className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-600 font-bold outline-none shadow-inner transition-all text-sm" />
              </div>
            </div>
            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 shadow-xl transition-all mt-4">
              <Save size={16}/> Enregistrer les modifications
            </button>
          </form>
        </section>

        {/* ZONE DANGER */}
        <section className="bg-red-50 p-10 md:p-12 rounded-[3rem] border border-red-100 space-y-8 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 text-red-100/50 transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <AlertTriangle size={250} strokeWidth={1} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-red-600 flex items-center gap-3 mb-4">
              <AlertTriangle size={28} /> Zone Critique
            </h2>
            <p className="text-red-900/60 text-xs font-bold leading-relaxed uppercase mb-8">
              La suppression de votre compte effacera instantanément tous vos QR codes, liens traqués et historiques de visites. Cette action est irréversible.
            </p>
            
            {!showConfirmDelete ? (
              <button onClick={() => setShowConfirmDelete(true)} className="w-full bg-white text-red-600 border-2 border-red-200 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm transition-all">
                Supprimer mon compte
              </button>
            ) : (
              <div className="space-y-3 animate-in zoom-in duration-300">
                <button onClick={handleDeleteAccount} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition-colors">
                  OUI, TOUT SUPPRIMER DÉFINITIVEMENT
                </button>
                <button onClick={() => setShowConfirmDelete(false)} className="w-full text-red-400 font-black uppercase text-[10px] py-4 tracking-widest hover:text-red-700 transition-colors">
                  ANNULER
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

const StatCard = ({ icon, count, label, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
  };
  
  return (
    <div className={`bg-white p-8 rounded-[2.5rem] border ${colors[color].split(' ')[2]} flex items-center gap-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${colors[color].split(' ').slice(0, 2).join(' ')}`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black leading-none text-slate-900">{count}</p>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">{label}</p>
      </div>
    </div>
  );
};

export default AccountPage;