import React, { useState } from 'react';
import { ShieldCheck, Zap, BarChart3, QrCode, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

const UpgradePage = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://qr-code-generator-python3.onrender.com/create-checkout-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token') 
        }
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url; // Redirection vers Stripe
      } else {
        alert("Impossible de générer la session de paiement.");
        setLoading(false);
      }
    } catch (err) {
      alert("Erreur réseau. Vérifiez votre connexion.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* AVANTAGES */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-slate-900 leading-[0.9]">
              Passez au <br /><span className="text-blue-600">Niveau Pro</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg uppercase tracking-tight">
              Libérez tout le potentiel de vos QR Codes et Liens.
            </p>
          </div>

          <div className="grid gap-6">
            <FeatureItem icon={<Zap />} title="Génération Illimitée" desc="Créez des QR, vCards et Liens sans aucune restriction." />
            <FeatureItem icon={<BarChart3 />} title="Analytics Avancés" desc="Suivez en temps réel qui scanne vos codes et depuis quel appareil." />
            <FeatureItem icon={<QrCode />} title="Design Sur-Mesure" desc="Personnalisez les couleurs, les formes et ajoutez votre propre logo." />
          </div>
        </div>

        {/* BOX DE PRIX */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[4rem] blur opacity-20"></div>
          
          <div className="relative bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-8">
            <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic">
              Abonnement Mensuel
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-7xl font-black text-slate-900 tracking-tighter">2€</span>
                <span className="text-slate-400 font-bold text-xl uppercase">/ mois</span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Sans engagement • Annulable à tout moment</p>
            </div>

            <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 hover:scale-[1.02] transition-all shadow-2xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><ShieldCheck /> Activer mon accès PRO</>}
            </button>
            
            <div className="flex items-center justify-center gap-4 text-slate-400 font-bold text-[9px] uppercase tracking-tighter opacity-60">
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Stripe Secure</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Accès instantané</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-5 group">
    <div className="bg-white p-4 rounded-2xl shadow-sm text-blue-600 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <h3 className="font-black uppercase text-xs text-slate-900 tracking-wider mb-1">{title}</h3>
      <p className="text-slate-400 text-xs font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default UpgradePage;