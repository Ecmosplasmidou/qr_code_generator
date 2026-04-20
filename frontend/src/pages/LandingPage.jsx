import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, QrCode, UserPlus, CheckCircle2, ShieldCheck, 
  Zap, Download, Smartphone, Store, 
  ArrowRight, Sparkles, Globe, BarChart3, Fingerprint, RefreshCw 
} from 'lucide-react';
import QRVisual from '../components/QRVisual';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('qr');
  const [inputVal, setInputVal] = useState('');
  const [vCard, setVCard] = useState({ name: '', phone: '', email: '' });

  const getPreviewData = () => {
    if (activeTab === 'vcard') {
      return `BEGIN:VCARD\nFN:${vCard.name}\nTEL:${vCard.phone}\nEMAIL:${vCard.email}\nEND:VCARD`;
    }
    return inputVal || "https://qrlyze.io";
  };

  // FONCTION DE TÉLÉCHARGEMENT FIXÉE
  const downloadSandboxQR = () => {
    const svgElement = document.querySelector("#sandbox-qr svg");
    
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `QRLYZE-${activeTab}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    } else {
      alert("Générez d'abord un QR Code en saisissant une URL.");
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden font-sans">
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px]"></div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32 space-y-32">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-10 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
            <Sparkles size={14} className="text-blue-400"/> L'outil QR nouvelle génération
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85]">
            Capturez <br />
            <span className="text-blue-600 italic">l'audience.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Ne vous contentez pas de créer un QR. <span className="text-slate-900 font-bold underline decoration-blue-500">Traquez-le.</span> Maîtrisez chaque clic, chaque scan, chaque client.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#pro" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl shadow-blue-200">
              Découvrir le Suivi Pro
            </a>
          </div>
        </section>

        {/* SANDBOX SECTION */}
        <section id="sandbox" className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[4rem] blur opacity-25"></div>
          <div className="relative bg-white p-8 md:p-16 rounded-[4rem] border border-slate-100 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">Moteur de génération</h2>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Version d'essai gratuite (Sans suivi)</p>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 w-fit">
                  <TabBtn active={activeTab === 'qr'} onClick={() => setActiveTab('qr')} icon={<QrCode size={14}/>} label="QR Code" />
                  <TabBtn active={activeTab === 'vcard'} onClick={() => setActiveTab('vcard')} icon={<UserPlus size={14}/>} label="vCard Contact" />
                </div>

                <div className="space-y-4">
                  {activeTab === 'vcard' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Nom complet" value={vCard.name} onChange={e => setVCard({...vCard, name: e.target.value})} />
                      <Input placeholder="Mobile" value={vCard.phone} onChange={e => setVCard({...vCard, phone: e.target.value})} />
                      <Input placeholder="Email" className="md:col-span-2" value={vCard.email} onChange={e => setVCard({...vCard, email: e.target.value})} />
                    </div>
                  ) : (
                    <Input placeholder="URL (ex: https://monsite.com)" value={inputVal} onChange={e => setInputVal(e.target.value)} />
                  )}
                  <div className="flex items-center gap-3 text-amber-600 font-black text-[10px] uppercase tracking-widest bg-amber-50 w-fit px-4 py-2 rounded-lg border border-amber-100">
                    <Zap size={14} /> Attention : Aucun suivi disponible en mode essai
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <div id="sandbox-qr" className="bg-white p-6 rounded-3xl shadow-xl mb-8">
                  <QRVisual options={{ url: getPreviewData(), color: "#0F172A", bgColor: "#FFFFFF" }} size={180} />
                </div>
                <button onClick={downloadSandboxQR} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all">
                  <Download size={18}/> Télécharger l'image
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Exploitez la donnée</h2>
            <p className="text-slate-500 font-medium italic underline decoration-blue-500 decoration-2">Le QR n'est que le début, le suivi est la clé.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UseCaseCard 
              icon={<Fingerprint className="text-blue-600" />}
              title="Business Card"
              desc="Transformez chaque rencontre en contact enregistré. Sachez combien de fois votre profil a été consulté."
              img="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=400"
            />
            <UseCaseCard 
              icon={<BarChart3 className="text-indigo-600" />}
              title="Campagnes Print"
              desc="Affiches, Flyers, Menus. Ne devinez plus l'impact de vos supports physiques : mesurez-le précisément."
              img="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=400"
            />
            <UseCaseCard 
              icon={<Store className="text-blue-500" />}
              title="Retail & Shop"
              desc="Boostez vos avis et vos ventes. Analysez les pics de fréquentation via les scans en boutique."
              img="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=400"
            />
          </div>
        </section>

        {/* PRO SECTION : REDIRECTION ET SUIVI MIS EN AVANT */}
        <section id="pro" className="relative bg-slate-900 rounded-[4rem] p-10 md:p-20 text-white overflow-hidden shadow-[0_0_80px_-15px_rgba(37,99,235,0.4)]">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Indispensable pour les Pro
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                Le Suivi est <br /><span className="text-blue-500">votre Force.</span>
              </h2>
              <div className="flex items-baseline gap-3">
                <span className="text-8xl font-black text-blue-500">2€</span>
                <span className="text-xl font-bold text-slate-400">/ mois</span>
              </div>
              <p className="text-lg text-slate-400 font-medium max-w-md">
                Un QR sans suivi est une opportunité perdue. QRLYZE Pro vous donne les yeux là où vous étiez aveugle.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[3.5rem] p-8 md:p-12 border border-white/10 space-y-8">
              <div className="space-y-5">
                <ProFeature icon={<Globe size={24} className="text-blue-500"/>} title="Redirection Dynamique" desc="Changez le lien de destination même après avoir imprimé 10 000 flyers." />
                <ProFeature icon={<BarChart3 size={24} className="text-blue-500"/>} title="Analytics Temps Réel" desc="Villes, appareils, horaires. Gérez vos données comme un expert marketing." />
                <ProFeature icon={<RefreshCw size={24} className="text-blue-500"/>} title="Historique Illimité" desc="Toutes vos créations sauvegardées et modifiables à tout moment." />
                <ProFeature icon={<ShieldCheck size={24} className="text-blue-500"/>} title="Gestion de Compte" desc="Espace privé sécurisé pour gérer votre flotte de QR codes." />
              </div>
              <Link to="/app" className="block w-full bg-blue-600 text-white py-6 rounded-2xl text-center font-black uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-blue-600 transition-all shadow-2xl">
                Activer le Suivi Complet
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black transition-all ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon} {label}
  </button>
);

const Input = ({ className, ...props }) => (
  <input className={`w-full px-6 py-4 rounded-2xl bg-white border-2 border-slate-100 outline-none font-bold text-sm focus:border-blue-600 transition-all ${className}`} {...props} />
);

const UseCaseCard = ({ icon, title, desc, img }) => (
  <div className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
    <div className="h-48 overflow-hidden">
      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    </div>
    <div className="p-8 space-y-4">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">{icon}</div>
      <h3 className="text-xl font-black uppercase tracking-tighter italic">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

const ProFeature = ({ icon, title, desc }) => (
  <div className="flex gap-4">
    <div className="shrink-0 mt-1">{icon}</div>
    <div className="space-y-1">
      <h4 className="font-black text-xs uppercase tracking-wider text-white">{title}</h4>
      <p className="text-[11px] font-medium text-slate-400 leading-tight">{desc}</p>
    </div>
  </div>
);

export default LandingPage;