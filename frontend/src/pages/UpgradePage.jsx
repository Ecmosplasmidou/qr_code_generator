import React, { useState } from 'react';
import { ShieldCheck, Zap, BarChart3, QrCode, CheckCircle2, Loader2, Sparkles, Lock, ArrowRight } from 'lucide-react';

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
        window.location.href = data.url;
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
    <main className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2532&auto=format&fit=crop" 
          alt="Abstract Background" 
          className="w-full h-full object-cover opacity-10 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* TEXT CONTENT */}
        <div className="space-y-12 animate-in slide-in-from-left-10 duration-1000">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={14} /> Offre Exclusive
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-slate-900 leading-[0.85]">
              Passez au <br /><span className="text-blue-600">Niveau Pro</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg uppercase tracking-tight max-w-md">
              Libérez l'intelligence marketing de vos QR Codes avec le tracking dynamique.
            </p>
          </div>

          <div className="grid gap-8">
            <FeatureItem icon={<Zap />} title="Génération Illimitée" desc="Créez des QR, vCards et Liens sans aucune restriction de volume." />
            <FeatureItem icon={<BarChart3 />} title="Analytics en Temps Réel" desc="Identifiez la ville, l'appareil et l'heure précise de chaque scan." />
            <FeatureItem icon={<QrCode />} title="Édition Post-Impression" desc="Changez le lien de destination sans jamais réimprimer vos supports." />
          </div>
        </div>

        {/* PRICING CARD (ADOBE STYLE) */}
        <div className="relative animate-in zoom-in-95 duration-700">
          {/* Lueur d'arrière-plan de la carte */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-[4.5rem] blur-2xl opacity-20"></div>
          
          <div className="relative bg-white/80 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)] border border-white flex flex-col items-center text-center space-y-10">
            
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-blue-50 px-6 py-2 rounded-full">
                Professional Plan
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-8xl font-black text-slate-900 tracking-tighter">2€</span>
                <div className="text-left">
                  <p className="text-slate-400 font-bold text-xl uppercase leading-none">/ mois</p>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">TVA Incluse</p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-4">
              <button 
                onClick={handlePayment}
                disabled={loading}
                className="group w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.25em] flex items-center justify-center gap-4 hover:bg-blue-600 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <ShieldCheck size={20} strokeWidth={2.5} /> 
                    Activer l'accès PRO
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <Lock size={10} /> Paiement sécurisé via Stripe
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-slate-100">
              <div className="space-y-1 text-left">
                <p className="text-slate-900 font-black text-[10px] uppercase">Sans Engagement</p>
                <p className="text-slate-400 text-[9px] font-bold uppercase">Annulable en 1 clic</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-slate-900 font-black text-[10px] uppercase">Support 24/7</p>
                <p className="text-slate-400 text-[9px] font-bold uppercase">Prioritaire</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-6 group">
    <div className="shrink-0 bg-white w-14 h-14 rounded-2xl shadow-sm text-blue-600 border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
      {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
    </div>
    <div className="space-y-1">
      <h3 className="font-black uppercase text-sm text-slate-900 tracking-wider leading-none">{title}</h3>
      <p className="text-slate-400 text-[13px] font-medium leading-relaxed max-w-xs italic">{desc}</p>
    </div>
  </div>
);

export default UpgradePage;