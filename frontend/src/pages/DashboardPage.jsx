import React, { useState } from 'react';
import { 
  RefreshCw, PlusCircle, Palette, ImageIcon, 
  Layers, Eye, QrCode, UserPlus, Link as LinkIcon 
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
  // On utilise des identifiants simplifiés pour l'état interne
  const [genType, setGenType] = useState('qr');
  const [url, setUrl] = useState('');
  const [vCard, setVCard] = useState({ name: '', phone: '', email: '', website: '' });
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [dotType, setDotType] = useState('extra-rounded');
  const [eyeType, setEyeType] = useState('square');
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
    if (genType === 'link') return item.type === 'link' || item.type === 'liens';
    // Par défaut QR CODES (inclut les anciens sans type)
    return item.type === 'qr' || item.type === 'qr codes' || !item.type;
  });

  // Helper pour l'affichage du titre de section
  const getDisplayTitle = () => {
    if (genType === 'qr') return 'QR CODES';
    if (genType === 'vcard') return 'CARTES DE VISITE';
    if (genType === 'link') return 'LIENS';
    return genType.toUpperCase();
  };

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">Studio</h1>
          <p className="text-slate-400 font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] mt-3">Design & Smart Tracking</p>
        </div>
        
        <div className="flex bg-slate-200 p-1.5 rounded-2xl gap-1 w-full md:w-auto shadow-inner overflow-x-auto no-scrollbar">
            <button onClick={() => { setGenType('qr'); setShowOptions(false); }} className={`flex-1 md:flex-none px-5 py-3 rounded-xl text-[10px] font-black transition-all whitespace-nowrap flex items-center justify-center gap-2 ${genType === 'qr' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>
              <QrCode size={14}/>QR CODES
            </button>
            <button onClick={() => { setGenType('vcard'); setShowOptions(false); }} className={`flex-1 md:flex-none px-5 py-3 rounded-xl text-[10px] font-black transition-all whitespace-nowrap flex items-center justify-center gap-2 ${genType === 'vcard' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>
              <UserPlus size={14}/>CARTES DE VISITE
            </button>
            <button onClick={() => { setGenType('link'); setShowOptions(false); }} className={`flex-1 md:flex-none px-5 py-3 rounded-xl text-[10px] font-black transition-all whitespace-nowrap flex items-center justify-center gap-2 ${genType === 'link' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>
              <LinkIcon size={14}/>LIENS
            </button>
        </div>
      </div>

      <div className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border-t-[12px] border-blue-600 mb-16">
        <form onSubmit={onGenerate} className="space-y-5">
          
          {genType === 'vcard' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in slide-in-from-top-4">
               <input type="text" required placeholder="Nom complet *" className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none font-bold border-2 border-transparent focus:border-blue-500 transition-all shadow-inner" value={vCard.name} onChange={e => setVCard({...vCard, name: e.target.value})} />
               <input type="tel" placeholder="Numéro de téléphone" className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none font-bold border-2 border-transparent focus:border-blue-500 transition-all shadow-inner" value={vCard.phone} onChange={e => setVCard({...vCard, phone: e.target.value})} />
               <input type="email" placeholder="Adresse Email" className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none font-bold border-2 border-transparent focus:border-blue-500 transition-all shadow-inner" value={vCard.email} onChange={e => setVCard({...vCard, email: e.target.value})} />
               <input type="url" placeholder="Lien (Site, Portfolio, etc.)" className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none font-bold border-2 border-transparent focus:border-blue-500 transition-all shadow-inner" value={vCard.website} onChange={e => setVCard({...vCard, website: e.target.value})} />
            </div>
          ) : (
            <div className="space-y-2">
              <input type="url" required placeholder="Coller l'URL de destination (https://...)" className="w-full px-6 md:px-8 py-5 rounded-2xl md:rounded-[2rem] bg-slate-50 outline-none font-black text-sm md:text-base border-2 border-transparent focus:border-blue-500 transition-all shadow-inner" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          )}

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap justify-center gap-4">
               {genType !== 'link' && (
                 <>
                   <button type="button" onClick={() => setShowOptions(!showOptions)} className={`flex items-center gap-2 text-[10px] font-black uppercase px-6 py-4 rounded-2xl transition-all ${showOptions ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                     <Palette size={16}/> Style & Couleurs
                   </button>
                   <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase cursor-pointer hover:text-blue-600 bg-slate-50 px-6 py-4 rounded-2xl transition-all border-2 border-dashed border-slate-200">
                     <ImageIcon size={16}/> {logo ? "Logo OK" : "Logo Central"}
                     <input type="file" hidden accept="image/*" onChange={handleLogo}/>
                   </label>
                 </>
               )}
            </div>
            <button disabled={loading} className="w-full lg:w-auto bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] md:rounded-[2rem] font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <><PlusCircle size={24} /> GÉNÉRER MAINTENANT</>}
            </button>
          </div>

          {showOptions && genType !== 'link' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-slate-50/50 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-dashed border-slate-200 animate-in slide-in-from-top-4">
               <div className="lg:col-span-4 space-y-8">
                  <CustomPicker label="Couleur QR" color={qrColor} onChange={setQrColor} />
                  <CustomPicker label="Couleur Fond" color={bgColor} onChange={setBgColor} />
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex justify-between tracking-widest italic">Taille Logo <span>{Math.round(logoSize*100)}%</span></label>
                    <input type="range" min="0.1" max="0.5" step="0.05" value={logoSize} onChange={e => setLogoSize(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
               </div>
               
               <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-widest"><Layers size={14}/> Style Modules</label>
                    <div className="grid grid-cols-2 gap-3">
                      {SHAPES.map(s => (
                        <button key={s.id} type="button" onClick={() => setDotType(s.type)} className={`py-4 rounded-xl border-2 transition-all text-[10px] font-black uppercase ${dotType === s.type ? 'border-blue-600 bg-white text-blue-600 shadow-md' : 'bg-white/50 border-slate-200 text-slate-400'}`}>
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-widest"><Eye size={14}/> Style Yeux</label>
                    <div className="grid grid-cols-2 gap-3">
                      {EYE_SHAPES.map(e => (
                        <button key={e.id} type="button" onClick={() => setEyeType(e.type)} className={`py-4 rounded-xl border-2 transition-all text-[10px] font-black uppercase ${eyeType === e.type ? 'border-blue-600 bg-white text-blue-600 shadow-md' : 'bg-white/50 border-slate-200 text-slate-400'}`}>
                          {e.name}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>

               <div className="lg:col-span-3 flex flex-col items-center justify-center bg-white p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border-2 border-slate-100 relative min-h-[280px]">
                  <div className="absolute top-5 left-5 bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black shadow-lg animate-pulse">PREVIEW</div>
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
                    size={160} 
                  />
                  <p className="text-[9px] font-black mt-6 text-blue-600 uppercase tracking-widest italic text-center">Live Rendering</p>
               </div>
            </div>
          )}
        </form>
      </div>

      <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-slate-200 flex-1"></div>
          <h2 className="text-xs font-black uppercase text-slate-300 tracking-[0.4em]">Mes créations : {getDisplayTitle()}</h2>
          <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {filteredHistory.map(item => (
          <ItemCard key={item.id} item={item} openDeleteModal={openDeleteModal} fetchHistory={fetchHistory} />
        ))}
        {filteredHistory.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-100/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-300 font-black uppercase tracking-widest text-sm md:text-lg italic">Aucun contenu trouvé dans cette catégorie</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;