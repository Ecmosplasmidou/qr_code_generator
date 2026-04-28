import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, QrCode, UserPlus, CheckCircle2, ShieldCheck, 
  Zap, Download, Smartphone, Store, 
  ArrowRight, Sparkles, Globe, BarChart3, Fingerprint, RefreshCw,
  Plus, Minus, Info, FileText, Bitcoin
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
    <div className="relative min-h-screen bg-white font-sans text-slate-900">
      
      {/* BACKGROUND HERO IMAGE (EFFET ADOBE) */}
      <div className="absolute top-0 left-0 w-full h-[90vh] overflow-hidden pointer-events-none z-0">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
          alt="Abstract 3D Background" 
          className="w-full h-full object-cover opacity-[0.15]"
        />
        {/* Dégradé pour fondre l'image dans le blanc de la page */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_30%,transparent_100%)] mix-blend-multiply opacity-50"></div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32 space-y-40">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-10 animate-in fade-in slide-in-from-top-10 duration-1000">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] drop-shadow-sm">
            Créez votre <br />
            <span className="text-blue-600 italic font-black relative inline-block">
              Code QR.
              <Sparkles className="absolute -top-6 -right-10 text-amber-400 opacity-80" size={40} />
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium backdrop-blur-sm bg-white/30 p-4 rounded-2xl">
            Générez des codes statiques gratuits ou passez au <span className="text-slate-900 font-black underline decoration-blue-500 decoration-4">Niveau Pro</span> pour modifier vos liens après impression.
          </p>
        </section>

        {/* GENERATOR BOX */}
        <section id="sandbox" className="relative">
          <div className="bg-white/80 backdrop-blur-xl p-6 md:p-12 rounded-[3rem] border border-white/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* NAVIGATION TABS (GÔUCHE) */}
              <div className="lg:col-span-8 space-y-8">
                <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-6">
                  <TabItem active={activeTab === 'qr'} onClick={() => setActiveTab('qr')} icon={<Globe size={16}/>} label="URL" />
                  <TabItem active={activeTab === 'vcard'} onClick={() => setActiveTab('vcard')} icon={<UserPlus size={16}/>} label="vCard" />
                  <TabItem active={activeTab === 'text'} onClick={() => setActiveTab('text')} icon={<FileText size={16}/>} label="Texte" />
                </div>

                <div className="min-h-[120px]">
                  {activeTab === 'vcard' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                      <Input placeholder="Nom complet" value={vCard.name} onChange={e => setVCard({...vCard, name: e.target.value})} />
                      <Input placeholder="Téléphone" value={vCard.phone} onChange={e => setVCard({...vCard, phone: e.target.value})} />
                      <Input placeholder="Email" className="md:col-span-2" value={vCard.email} onChange={e => setVCard({...vCard, email: e.target.value})} />
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-500">
                      <textarea 
                        className="w-full p-6 bg-slate-50/50 rounded-2xl border border-slate-100 outline-none font-bold text-lg min-h-[120px] resize-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner"
                        placeholder={activeTab === 'qr' ? "https://votre-site.com" : "Entrez votre texte ici..."}
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50 w-fit px-4 py-2 rounded-xl">
                  <Info size={14} className="text-blue-600" /> Votre code QR est généré instantanément
                </div>
              </div>

              {/* PREVIEW (DROITE) */}
              <div className="lg:col-span-4 relative rounded-[2.5rem] p-8 flex flex-col items-center justify-between shadow-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" 
                  alt="Cyber Background" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"></div>
                
                <div className="relative z-10 w-full flex flex-col items-center">
                  <div id="sandbox-qr" className="bg-white p-4 rounded-2xl shadow-xl transform transition-transform hover:scale-105 duration-300">
                    <QRVisual options={{ url: getPreviewData(), color: "#0F172A", bgColor: "#FFFFFF" }} size={160} />
                  </div>
                  <div className="w-full space-y-3 mt-8">
                    <button onClick={downloadSandboxQR} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                      <Download size={16}/> Télécharger (PNG)
                    </button>
                    <Link to="/auth" className="block text-center text-slate-400 font-bold text-[9px] uppercase tracking-tighter hover:text-white transition-colors">
                      Passer en PRO pour format Vecteur (SVG)
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO SECTION */}
        <section className="space-y-20 relative">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-center">Comment créer un code QR ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <Step number="1" title="Sélectionnez" desc="Choisissez le type de contenu (URL, vCard, PDF) adapté à votre besoin." />
            <Step number="2" title="Générez" desc="Remplissez les champs nécessaires. Le code se met à jour en temps réel." />
            <Step number="3" title="Personnalisez" desc="Ajoutez votre logo et vos couleurs (Mode PRO) puis téléchargez le fichier." />
          </div>
        </section>

        {/* STATIC VS DYNAMIC (IMAGES INTÉGRÉES) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* STATIC CARD */}
          <div className="relative p-10 bg-slate-50 rounded-[3rem] space-y-6 border border-slate-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2000&auto=format&fit=crop" 
              alt="Print Texture" 
              className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 group-hover:scale-105 transition-all duration-700 grayscale"
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Codes Statiques</h3>
              <p className="text-slate-500 font-medium mt-2 mb-6">Gratuits et permanents. Idéaux pour les infos qui ne changent jamais (liens, texte fixe).</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400"><CheckCircle2 size={16} className="text-slate-300"/> Aucun suivi possible</li>
                <li className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400"><CheckCircle2 size={16} className="text-slate-300"/> Lien non modifiable</li>
              </ul>
            </div>
          </div>

          {/* DYNAMIC CARD (PRO) */}
          <div className="relative p-10 bg-blue-600 rounded-[3rem] space-y-6 text-white overflow-hidden group shadow-2xl shadow-blue-200">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop" 
              alt="Data Dashboard" 
              className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay group-hover:opacity-20 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <div className="inline-block px-4 py-1.5 bg-white text-blue-600 rounded-full text-[9px] font-black uppercase shadow-lg mb-4">Recommandé</div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">Codes Dynamiques</h3>
              <p className="text-blue-100 font-medium text-opacity-90 mt-2 mb-6">Flexibilité totale. Modifiez votre destination même après impression et suivez vos performances.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-[11px] font-black uppercase"><CheckCircle2 size={16}/> Suivi des scans en temps réel</li>
                <li className="flex items-center gap-3 text-[11px] font-black uppercase"><CheckCircle2 size={16}/> Modification du lien illimitée</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-center">Foire aux questions</h2>
          <div className="space-y-4 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
            <FaqItem 
              idx={0} active={openFaq} setter={setOpenFaq}
              q="Les QR codes sont-ils gratuits ?" 
              a="Oui, tous nos QR codes statiques sont gratuits et n'expirent jamais. Cependant, ils ne peuvent être ni modifiés, ni suivis, ni stockés." 
            />
            <FaqItem 
              idx={1} active={openFaq} setter={setOpenFaq}
              q="Quelle est la différence entre Statique et Dynamique ?" 
              a="Le code statique encode directement la donnée. Le code dynamique passe par un lien court QRLYZE qui permet de rediriger l'utilisateur et de compter le scan." 
            />
            <FaqItem 
              idx={2} active={openFaq} setter={setOpenFaq}
              q="Puis-je ajouter mon logo ?" 
              a="La personnalisation avancée (logo, formes de yeux, design) est réservée aux membres PRO pour garantir un rendu professionnel." 
            />
          </div>
        </section>

        {/* FINAL CTA (IMAGE BACKGROUND) */}
        <section className="relative bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center space-y-10 text-white overflow-hidden shadow-2xl group">
          {/* IMAGE DE FOND HIGH TECH */}
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop" 
            alt="Space Earth Tech" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen group-hover:scale-105 transition-transform duration-1000"
          />
          {/* MASQUE DE COULEUR POUR LISIBILITÉ */}          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-6 drop-shadow-lg">
              Prêt à passer <br /><span className="text-blue-400">au niveau pro ?</span>
            </h2>
            <p className="text-slate-300 font-medium max-w-md mx-auto mb-10 text-lg">
              Rejoignez les entreprises qui utilisent QRLYZE pour tracker leurs campagnes marketing.
            </p>
            <Link to="/auth" className="inline-flex items-center gap-4 bg-white text-slate-900 px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              Démarrer maintenant <ArrowRight size={20}/>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
};

const TabItem = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-[11px] font-black transition-all ${active ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const Step = ({ number, title, desc }) => (
  <div className="space-y-6 group">
    <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center text-2xl font-black text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
      {number}
    </div>
    <h3 className="text-xl font-black uppercase tracking-tighter">{title}</h3>
    <p className="text-slate-500 font-medium text-sm leading-relaxed">{desc}</p>
  </div>
);

const FaqItem = ({ q, a, idx, active, setter }) => (
  <div className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
    <button onClick={() => setter(active === idx ? null : idx)} className="w-full flex items-center justify-between py-4 text-left group">
      <span className="font-black uppercase tracking-tighter text-sm group-hover:text-blue-600 transition-colors">{q}</span>
      {active === idx ? <Minus size={18} className="text-blue-600"/> : <Plus size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors"/>}
    </button>
    {active === idx && (
      <div className="pb-4 text-slate-500 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
        {a}
      </div>
    )}
  </div>
);

const Input = ({ className, ...props }) => (
  <input className={`w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 outline-none font-bold text-sm focus:ring-2 focus:ring-blue-600 transition-all shadow-sm hover:shadow-md ${className}`} {...props} />
);

export default LandingPage;