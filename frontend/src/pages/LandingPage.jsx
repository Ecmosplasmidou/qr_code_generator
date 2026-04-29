import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, QrCode, UserPlus, CheckCircle2, ShieldCheck, 
  Zap, Download, Smartphone, Store, 
  ArrowRight, Sparkles, Globe, BarChart3, Fingerprint, RefreshCw,
  Plus, Minus, Info, FileText, Bitcoin, Palette, Activity
} from 'lucide-react';
import QRVisual from '../components/QRVisual';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('qr');
  const [inputVal, setInputVal] = useState('');
  const [vCard, setVCard] = useState({ name: '', phone: '', email: '' });
  const [openFaq, setOpenFaq] = useState(0);

  const getPreviewData = () => {
    if (activeTab === 'vcard') {
      return `BEGIN:VCARD\nFN:${vCard.name}\nTEL:${vCard.phone}\nEMAIL:${vCard.email}\nEND:VCARD`;
    }
    return inputVal || "https://qrlyze.io";
  };

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
    }
  };

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* BACKGROUND HERO IMAGE (EFFET ADOBE) */}
      <div className="absolute top-0 left-0 w-full h-[80vh] md:h-[90vh] overflow-hidden pointer-events-none z-0">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
          alt="Abstract 3D Background" 
          className="w-full h-full object-cover opacity-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_30%,transparent_100%)] mix-blend-multiply opacity-50"></div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-24 pb-20 md:pb-32 space-y-24 md:space-y-40">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-8 md:space-y-10 animate-in fade-in slide-in-from-top-10 duration-1000">
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.9] md:leading-[0.85] drop-shadow-sm px-2">
            Créez votre <br />
            <span className="text-blue-600 italic font-black relative inline-block">
              QR Code.
              <Sparkles className="absolute -top-4 -right-6 md:-top-6 md:-right-10 text-amber-400 opacity-80 w-6 h-6 md:w-10 md:h-10" />
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium backdrop-blur-sm bg-white/30 p-4 rounded-2xl">
            Générez des codes statiques gratuits ou passez au <span className="text-slate-900 font-black underline decoration-blue-500 decoration-4">Niveau Pro</span> pour modifier vos liens après impression.
          </p>
        </section>

        {/* GENERATOR BOX */}
        <section id="sandbox" className="relative">
          <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-white/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] md:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
              
              {/* NAVIGATION TABS & INPUTS (GÔUCHE) */}
              <div className="lg:col-span-8 space-y-6 md:space-y-8">
                
                {/* Tabs scrollables sur mobile */}
                <div className="flex overflow-x-auto snap-x no-scrollbar pb-4 gap-2 border-b border-slate-100 -mx-5 px-5 md:mx-0 md:px-0">
                  <TabItem active={activeTab === 'qr'} onClick={() => setActiveTab('qr')} icon={<Globe size={16}/>} label="URL" />
                  <TabItem active={activeTab === 'vcard'} onClick={() => setActiveTab('vcard')} icon={<UserPlus size={16}/>} label="vCard" />
                  <TabItem active={activeTab === 'text'} onClick={() => setActiveTab('text')} icon={<FileText size={16}/>} label="Texte" />
                </div>

                <div className="min-h-[120px]">
                  {activeTab === 'vcard' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 animate-in fade-in duration-500">
                      <Input placeholder="Nom complet" value={vCard.name} onChange={e => setVCard({...vCard, name: e.target.value})} />
                      <Input placeholder="Téléphone" value={vCard.phone} onChange={e => setVCard({...vCard, phone: e.target.value})} />
                      <Input placeholder="Email" className="sm:col-span-2" value={vCard.email} onChange={e => setVCard({...vCard, email: e.target.value})} />
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-500">
                      <textarea 
                        className="w-full p-5 md:p-6 bg-slate-50/50 rounded-2xl border border-slate-100 outline-none font-bold text-base md:text-lg min-h-[120px] resize-y focus:ring-2 focus:ring-blue-600 transition-all shadow-inner"
                        placeholder={activeTab === 'qr' ? "https://votre-site.com" : "Entrez votre texte ici..."}
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-widest bg-slate-50 w-fit px-3 py-2 md:px-4 md:py-2 rounded-xl">
                  <Info size={14} className="text-blue-600 shrink-0" /> Votre QR code est généré instantanément
                </div>
              </div>

              {/* PREVIEW (DROITE) */}
              <div className="lg:col-span-4 relative rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center justify-between shadow-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" 
                  alt="Cyber Background" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"></div>
                
                <div className="relative z-10 w-full flex flex-col items-center">
                  <div id="sandbox-qr" className="bg-white p-3 md:p-4 rounded-2xl shadow-xl transform transition-transform hover:scale-105 duration-300">
                    <QRVisual options={{ url: getPreviewData(), color: "#0F172A", bgColor: "#FFFFFF" }} size={160} />
                  </div>
                  <div className="w-full space-y-3 mt-6 md:mt-8">
                    <button onClick={downloadSandboxQR} className="w-full bg-blue-600 text-white py-3.5 md:py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                      <Download size={16}/> Télécharger (PNG)
                    </button>
                    <Link to="/auth?mode=register" className="block text-center text-slate-400 font-bold text-[9px] uppercase tracking-tighter hover:text-white transition-colors px-2">
                      Passer en PRO pour format Vecteur (SVG)
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- NOUVELLE SECTION : POURQUOI PASSER PRO ? --- */}
        <section className="relative bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-14 lg:p-20 overflow-hidden shadow-2xl group mx-2 md:mx-0">
          {/* Lueur arrière-plan */}
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop')] opacity-[0.05] mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            
            {/* Texte et Valeur */}
            <div className="flex-1 text-center lg:text-left space-y-6 md:space-y-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter italic text-white leading-[0.9]">
                Pensez plus grand avec <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">QRLYZE Pro.</span>
              </h2>
              <p className="text-slate-400 font-medium text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                Vous venez de créer un QR code statique. C'est bien. Mais imaginez pouvoir <strong>modifier le lien</strong> une fois imprimé, <strong>suivre qui le scanne</strong>, ou ajouter <strong>votre logo au centre</strong>. Tout cela est possible pour le prix d'un café.
              </p>
              
              <Link to="/auth?mode=register" className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 md:py-5 rounded-2xl md:rounded-[1.25rem] font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] w-full sm:w-auto">
                Devenir Pro pour 2€/mois <ArrowRight size={18}/>
              </Link>
            </div>

            {/* Grille des fonctionnalités Pro */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                  <Activity size={24} strokeWidth={2.5}/>
                </div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Analytics Précis</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">Sachez où, quand et avec quel appareil vos codes sont scannés.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                  <RefreshCw size={24} strokeWidth={2.5}/>
                </div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Liens Dynamiques</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">Corrigez une faute ou changez de campagne sans réimprimer vos supports.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                  <Palette size={24} strokeWidth={2.5}/>
                </div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Studio Design</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">Customisez les couleurs, les formes, et intégrez votre propre logo.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                  <ShieldCheck size={24} strokeWidth={2.5}/>
                </div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">0 Engagement</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">Gérez votre abonnement via Stripe. Annulez en un clic à tout moment.</p>
              </div>
            </div>

          </div>
        </section>

        {/* HOW TO SECTION */}
        <section className="space-y-12 md:space-y-20 relative">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-center px-4">Comment créer un code QR ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            <Step number="1" title="Sélectionnez" desc="Choisissez le type de contenu (URL, vCard, PDF) adapté à votre besoin." />
            <Step number="2" title="Générez" desc="Remplissez les champs nécessaires. Le code se met à jour en temps réel." />
            <Step number="3" title="Personnalisez" desc="Ajoutez votre logo et vos couleurs (Mode PRO) puis téléchargez le fichier." />
          </div>
        </section>

        {/* STATIC VS DYNAMIC */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* STATIC CARD */}
          <div className="relative p-8 md:p-10 bg-slate-50 rounded-[2.5rem] md:rounded-[3rem] space-y-6 border border-slate-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2000&auto=format&fit=crop" 
              alt="Print Texture" 
              className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 group-hover:scale-105 transition-all duration-700 grayscale"
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Codes Statiques</h3>
              <p className="text-slate-500 font-medium mt-2 mb-6 text-sm md:text-base">Gratuits et permanents. Idéaux pour les infos qui ne changent jamais (liens, texte fixe).</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400"><CheckCircle2 size={16} className="text-slate-300 shrink-0"/> Aucun suivi possible</li>
                <li className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400"><CheckCircle2 size={16} className="text-slate-300 shrink-0"/> Lien non modifiable</li>
              </ul>
            </div>
          </div>

          {/* DYNAMIC CARD (PRO) */}
          <div className="relative p-8 md:p-10 bg-blue-600 rounded-[2.5rem] md:rounded-[3rem] space-y-6 text-white overflow-hidden group shadow-2xl shadow-blue-200">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop" 
              alt="Data Dashboard" 
              className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay group-hover:opacity-20 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <div className="inline-block px-3 py-1.5 bg-white text-blue-600 rounded-full text-[9px] font-black uppercase shadow-lg mb-4">Recommandé</div>
              <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Codes Dynamiques</h3>
              <p className="text-blue-100 font-medium text-opacity-90 mt-2 mb-6 text-sm md:text-base">Flexibilité totale. Modifiez votre destination même après impression et suivez vos performances.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase"><CheckCircle2 size={16} className="shrink-0"/> Suivi des scans en temps réel</li>
                <li className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase"><CheckCircle2 size={16} className="shrink-0"/> Modification du lien illimitée</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-3xl mx-auto space-y-8 md:space-y-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-center">Foire aux questions</h2>
          <div className="space-y-2 md:space-y-4 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-50">
            <FaqItem 
              idx={0} active={openFaq} setter={setOpenFaq}
              q="Les QR codes sont-ils gratuits ?" 
              a="Oui, tous nos QR codes statiques sont gratuits et n'expirent jamais. Cependant, ils ne peuvent être ni modifiés, ni suivis, ni stockés." 
            />
            <FaqItem 
              idx={1} active={openFaq} setter={setOpenFaq}
              q="Statique ou Dynamique ?" 
              a="Le code statique encode directement la donnée. Le code dynamique passe par un lien court QRLYZE qui permet de rediriger l'utilisateur et de compter le scan." 
            />
            <FaqItem 
              idx={2} active={openFaq} setter={setOpenFaq}
              q="Puis-je ajouter mon logo ?" 
              a="La personnalisation avancée (logo, formes de yeux, design) est réservée aux membres PRO pour garantir un rendu professionnel." 
            />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 py-16 md:p-24 text-center space-y-8 md:space-y-10 text-white overflow-hidden shadow-2xl group mx-2 md:mx-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop" 
            alt="Space Earth Tech" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-blue-900/40"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4 md:mb-6 drop-shadow-lg">
              Prêt à passer <br /><span className="text-blue-400">au niveau pro ?</span>
            </h2>
            <p className="text-slate-300 font-medium max-w-md mx-auto mb-8 md:mb-10 text-sm md:text-lg px-4">
              Rejoignez les entreprises qui utilisent QRLYZE pour tracker leurs campagnes marketing.
            </p>
            <Link to="/auth?mode=register" className="inline-flex items-center justify-center gap-3 md:gap-4 bg-white text-slate-900 px-8 py-5 md:px-12 md:py-6 rounded-2xl md:rounded-[1.25rem] font-black uppercase text-xs md:text-sm tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] w-full sm:w-auto">
              Démarrer maintenant <ArrowRight size={20}/>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
};

// COMPOSANTS INTERNES
const TabItem = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`shrink-0 snap-center flex items-center gap-2 px-5 py-3 md:px-6 md:py-3.5 rounded-xl text-[10px] md:text-[11px] font-black transition-all ${active ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const Step = ({ number, title, desc }) => (
  <div className="space-y-4 md:space-y-6 group flex flex-col items-center text-center md:items-start md:text-left">
    <div className="w-14 h-14 md:w-16 md:h-16 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
      {number}
    </div>
    <div>
      <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter mb-2">{title}</h3>
      <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const FaqItem = ({ q, a, idx, active, setter }) => (
  <div className="border-b border-slate-100 last:border-0 pb-2 md:pb-4 last:pb-0">
    <button onClick={() => setter(active === idx ? null : idx)} className="w-full flex items-center justify-between py-4 text-left group">
      <span className="font-black uppercase tracking-tighter text-xs md:text-sm pr-4 group-hover:text-blue-600 transition-colors">{q}</span>
      <div className="shrink-0">
        {active === idx ? <Minus size={18} className="text-blue-600"/> : <Plus size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors"/>}
      </div>
    </button>
    {active === idx && (
      <div className="pb-4 text-slate-500 text-xs md:text-sm font-medium animate-in slide-in-from-top-2 duration-300 pr-8">
        {a}
      </div>
    )}
  </div>
);

const Input = ({ className, ...props }) => (
  <input className={`w-full px-5 py-4 md:px-6 md:py-4 rounded-2xl bg-white border border-slate-100 outline-none font-bold text-sm focus:ring-2 focus:ring-blue-600 transition-all shadow-sm hover:shadow-md ${className}`} {...props} />
);

export default LandingPage;