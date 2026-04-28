import React, { useState } from 'react';
import { 
  RefreshCw, PlusCircle, Palette, ImageIcon, 
  Layers, Eye, QrCode, UserPlus, Text, Link as LinkIcon 
} from 'lucide-react';
import QRVisual from '../components/QRVisual';
import CustomPicker from '../components/CustomPicker';
import ItemCard from '../components/ItemCard';

const API_URL = "https://qr-code-generator-python3.onrender.com";

const SHAPES = [
  { id: 'square', name: 'Carré', type: 'square' },
  { id: 'soft', name: 'Doux', type: 'extra-rounded' },
  { id: 'round', name: 'Rond', type: 'dots' },
  { id: 'classy', name: 'Classy', type: 'classy' }
];

const EYE_SHAPES = [
  { id: 'square', name: 'Carré', type: 'square' },
  { id: 'extra-rounded', name: 'Arrondi', type: 'extra-rounded' }
];

const DashboardPage = ({ history, fetchHistory, openDeleteModal }) => {
  const [genType, setGenType] = useState('qr');
  const [url, setUrl] = useState('');
  const [vCard, setVCard] = useState({ name: '', phone: '', email: '', website: '' });
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const [qrColor, setQrColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [dotType, setDotType] = useState('extra-rounded');
  const [eyeType, setEyeType] = useState('extra-rounded');
  const [logoSize, setLogoSize] = useState(0.4);
  const [logo, setLogo] = useState(null);

  const onGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      url, 
      type: genType, 
      color: qrColor, 
      bg_color: bgColor, 
      design: dotType, 
      eye_design: eyeType, 
      logo_size: logoSize,
      logo: logo,
      vcard: genType === 'vcard' ? vCard : null
    };

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token') 
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) { 
        await fetchHistory(); 
        setUrl(''); 
        setVCard({ name: '', phone: '', email: '', website: '' });
        setLogo(null); 
        setShowOptions(false); 
      }
    } catch (err) { 
      alert("Erreur lors de la génération."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleLogo = (e) => {
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result);
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
  };

  // --- LOGIQUE DE FILTRAGE PAR ONGLET ---
  const filteredHistory = history.filter(item => {
    if (genType === 'vcard') return item.type === 'vcard';
    if (genType === 'texte') return item.type === 'texte';
    if (genType === 'link') return item.type === 'link' || item.type === 'liens';
    return item.type === 'qr' || item.type === 'qr codes' || !item.type;
  });

  const getDisplayTitle = () => {
    if (genType === 'qr') return 'QR CODES';
    if (genType === 'vcard') return 'CARTES DE VISITE';
    if (genType === 'texte') return 'TEXTE';
    if (genType === 'link') return 'LIENS';
    return genType.toUpperCase();
  };

  return (
    <main className="relative max-w-6xl mx-auto px-4 md:px-6 py-12 animate-in fade-in duration-500 min-h-screen">
      
      {/* Background Decor (Subtle Glows) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-40 left-0 w-[300px] h-[300px] bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* HEADER STUDIO */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 relative z-10">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-slate-900 leading-none drop-shadow-sm">
            Studio <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.25em] mt-3">Design & Smart Tracking</p>
        </div>
        
        {/* TABS NAVIGATION */}
        <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-[1.5rem] gap-1 w-full md:w-auto shadow-sm border border-slate-100 overflow-x-auto no-scrollbar">
            <button onClick={() => { setGenType('qr'); setShowOptions(false); }} className={`flex-1 md:flex-none px-6 py-3.5 rounded-xl text-[10px] font-black transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${genType === 'qr' ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}>
              <QrCode size={16}/> QR CODES
            </button>
            <button onClick={() => { setGenType('vcard'); setShowOptions(false); }} className={`flex-1 md:flex-none px-6 py-3.5 rounded-xl text-[10px] font-black transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${genType === 'vcard' ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}>
              <UserPlus size={16}/> VCARDS
            </button>
            <button onClick={() => { setGenType('texte'); setShowOptions(false); }} className={`flex-1 md:flex-none px-6 py-3.5 rounded-xl text-[10px] font-black transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${genType === 'texte' ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Text size={16}/> TEXTE
            </button>
            <button onClick={() => { setGenType('link'); setShowOptions(false); }} className={`flex-1 md:flex-none px-6 py-3.5 rounded-xl text-[10px] font-black transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${genType === 'link' ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}>
              <LinkIcon size={16}/> LIENS
            </button>
        </div>
      </div>

      {/* GENERATOR BOX */}
      <div className="relative bg-white/80 backdrop-blur-2xl p-6 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white mb-16 z-10 overflow-hidden">
        {/* Liseré design supérieur */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <form onSubmit={onGenerate} className="space-y-8 mt-2">
          
          {/* INPUTS AREA */}
          {genType === 'vcard' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
               <input type="text" required placeholder="Nom complet *" className="w-full px-6 py-5 rounded-2xl bg-slate-50 outline-none font-bold text-sm border border-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner" value={vCard.name} onChange={e => setVCard({...vCard, name: e.target.value})} />
               <input type="tel" placeholder="Numéro de téléphone" className="w-full px-6 py-5 rounded-2xl bg-slate-50 outline-none font-bold text-sm border border-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner" value={vCard.phone} onChange={e => setVCard({...vCard, phone: e.target.value})} />
               <input type="email" placeholder="Adresse Email" className="w-full px-6 py-5 rounded-2xl bg-slate-50 outline-none font-bold text-sm border border-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner" value={vCard.email} onChange={e => setVCard({...vCard, email: e.target.value})} />
               <input type="url" placeholder="Lien (Site, Portfolio...)" className="w-full px-6 py-5 rounded-2xl bg-slate-50 outline-none font-bold text-sm border border-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner" value={vCard.website} onChange={e => setVCard({...vCard, website: e.target.value})} />
            </div>
          ) : genType === 'texte' ?(
          <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
              <input type="text" required placeholder="Entrez le texte d evotre choix..." className="w-full px-6 md:px-8 py-6 rounded-[2rem] bg-slate-50 outline-none font-black text-sm md:text-base border border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-inner" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          ) : (
            <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
              <input type="url" required placeholder="Coller l'URL de destination (https://...)" className="w-full px-6 md:px-8 py-6 rounded-[2rem] bg-slate-50 outline-none font-black text-sm md:text-base border border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-inner" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 pt-4">
            <div className="flex flex-wrap justify-center gap-4 w-full lg:w-auto">
               {genType !== 'link' && (
                 <>
                   <button type="button" onClick={() => setShowOptions(!showOptions)} className={`flex items-center justify-center gap-3 text-[10px] font-black uppercase px-8 py-5 rounded-2xl transition-all duration-300 w-full md:w-auto ${showOptions ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
                     <Palette size={16}/> Style & Couleurs
                   </button>
                   <label className="flex items-center justify-center gap-3 text-[10px] font-black text-slate-500 uppercase cursor-pointer hover:text-blue-600 hover:border-blue-300 bg-white px-8 py-5 rounded-2xl transition-all duration-300 border-2 border-dashed border-slate-200 w-full md:w-auto shadow-sm">
                     <ImageIcon size={16} className={logo ? "text-emerald-500" : ""}/> {logo ? "Logo Uploadé" : "Ajouter un Logo"}
                     <input type="file" hidden accept="image/*" onChange={handleLogo}/>
                   </label>
                 </>
               )}
            </div>
            
            <button disabled={loading} className="w-full lg:w-auto bg-blue-600 text-white px-14 py-5 rounded-[2rem] font-black text-xs tracking-widest uppercase hover:bg-blue-700 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0">
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <><PlusCircle size={20} /> Générer</>}
            </button>
          </div>

          {/* OPTIONS PANEL (GLASSMORPHISM) */}
          {showOptions && genType !== 'link' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-slate-50/80 backdrop-blur-sm p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-inner animate-in fade-in slide-in-from-top-8 duration-500 mt-8">
               
               {/* COULEURS & SLIDER */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="flex gap-4">
                    <CustomPicker label="Code QR" color={qrColor} onChange={setQrColor} />
                    <CustomPicker label="Arrière-plan" color={bgColor} onChange={setBgColor} />
                  </div>
                  <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex justify-between tracking-widest">
                      Échelle du Logo <span className="text-blue-600">{Math.round(logoSize*100)}%</span>
                    </label>
                    <input type="range" min="0.1" max="0.5" step="0.05" value={logoSize} onChange={e => setLogoSize(parseFloat(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
               </div>
               
               {/* FORMES */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-widest ml-2"><Layers size={14}/> Modules (Pixels)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {SHAPES.map(s => (
                        <button key={s.id} type="button" onClick={() => setDotType(s.type)} className={`py-4 rounded-2xl border transition-all duration-300 text-[10px] font-black uppercase tracking-wider ${dotType === s.type ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm scale-[1.02]' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:bg-slate-50'}`}>
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-widest ml-2"><Eye size={14}/> Angles (Yeux)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {EYE_SHAPES.map(e => (
                        <button key={e.id} type="button" onClick={() => setEyeType(e.type)} className={`py-4 rounded-2xl border transition-all duration-300 text-[10px] font-black uppercase tracking-wider ${eyeType === e.type ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm scale-[1.02]' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:bg-slate-50'}`}>
                          {e.name}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>

               {/* PREVIEW EN DIRECT */}
               <div className="lg:col-span-4 flex flex-col items-center justify-center bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 relative min-h-[300px] overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                  <div className="absolute top-4 left-4 bg-slate-900 text-white px-3 py-1.5 rounded-full text-[8px] font-black tracking-widest shadow-lg flex items-center gap-2 z-10">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div> RENDU LIVE
                  </div>
                  
                  <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500 mt-4">
                    <QRVisual 
                      options={{ 
                        url: genType === 'vcard' ? "BEGIN:VCARD..." : (url || "https://qrlyze.io"), 
                        color: qrColor, 
                        bgColor: bgColor, 
                        dotType, 
                        eyeType, 
                        logo, 
                        logoSize 
                      }} 
                      size={180} 
                    />
                  </div>
               </div>
            </div>
          )}
        </form>
      </div>

      {/* SEPARATEUR HISTORIQUE */}
      <div className="flex items-center gap-6 mb-12 relative z-10">
          <div className="h-px bg-gradient-to-r from-transparent to-slate-200 flex-1"></div>
          <h2 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] flex items-center gap-3">
            Mes créations <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> {getDisplayTitle()}
          </h2>
          <div className="h-px bg-gradient-to-l from-transparent to-slate-200 flex-1"></div>
      </div>

      {/* GRILLE HISTORIQUE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20 relative z-10">
        {filteredHistory.map(item => (
          <ItemCard key={item.id} item={item} openDeleteModal={openDeleteModal} fetchHistory={fetchHistory} />
        ))}
        {filteredHistory.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Layers size={24} />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Aucun contenu trouvé dans cette catégorie</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;