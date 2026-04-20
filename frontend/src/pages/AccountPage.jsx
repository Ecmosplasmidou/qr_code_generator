import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, LogOut, Trash2, ShieldCheck, QrCode, UserPlus, Link as LinkIcon, Save, AlertTriangle } from 'lucide-react';

const AccountPage = ({ history }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
  const [password, setPassword] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const stats = {
    qrs: history.filter(i => i.type === 'qr' || !i.type).length,
    vcards: history.filter(i => i.type === 'vcard').length,
    links: history.filter(i => i.type === 'link').length,
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://qr-code-generator-python3.onrender.com/update-account`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      localStorage.setItem('userEmail', email);
      alert("Informations mises à jour !");
    }
  };

  const handleDeleteAccount = async () => {
    const res = await fetch(`https://qr-code-generator-python3.onrender.com/delete-account`, {
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
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-12 animate-in fade-in duration-500">
      
      {/* HEADER PROFIL */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <User size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Mon Espace</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">{email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all">
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      {/* STATS RAPIDES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<QrCode size={18}/>} count={stats.qrs} label="QR Codes" color="blue" />
        <StatCard icon={<UserPlus size={18}/>} count={stats.vcards} label="vCards" color="emerald" />
        <StatCard icon={<LinkIcon size={18}/>} count={stats.links} label="Liens" color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORMULAIRE MODIFICATION */}
        <section className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
          <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
            <ShieldCheck className="text-blue-600" /> Sécurité
          </h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Modifier Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 font-bold outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Nouveau Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                <input type="password" placeholder="Laissez vide pour garder l'actuel" onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 font-bold outline-none" />
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all">
              <Save size={16}/> Enregistrer les modifications
            </button>
          </form>
        </section>

        {/* ZONE DANGER */}
        <section className="bg-red-50 p-10 rounded-[3rem] border border-red-100 space-y-8">
          <h2 className="text-xl font-black uppercase tracking-tighter text-red-600 flex items-center gap-3">
            <AlertTriangle /> Zone Critique
          </h2>
          <p className="text-red-800/60 text-xs font-bold leading-relaxed uppercase">
            La suppression de votre compte effacera instantanément tous vos QR codes, liens traqués et historiques de visites. Cette action est irréversible.
          </p>
          {!showConfirmDelete ? (
            <button onClick={() => setShowConfirmDelete(true)} className="w-full bg-white text-red-600 border-2 border-red-200 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all">
              Supprimer mon compte
            </button>
          ) : (
            <div className="space-y-3 animate-in zoom-in duration-200">
              <button onClick={handleDeleteAccount} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-200">
                OUI, TOUT SUPPRIMER DÉFINITIVEMENT
              </button>
              <button onClick={() => setShowConfirmDelete(false)} className="w-full text-red-400 font-black uppercase text-[9px] py-2">
                ANNULER
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

const StatCard = ({ icon, count, label, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    indigo: "text-indigo-600 bg-indigo-50",
  };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 shadow-sm">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black leading-none text-slate-900">{count}</p>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
};

export default AccountPage;