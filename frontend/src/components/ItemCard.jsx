import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings2, BarChart3, Download, Trash2, 
  CheckCircle2, Copy, Link as LinkIcon, Save
} from 'lucide-react';
import QRVisual from './QRVisual';

const API_URL = "https://qr-code-generator-python3.onrender.com";

const ItemCard = ({ item, openDeleteModal, fetchHistory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tTitle, setTTitle] = useState(item.title);
  
  const trackingUrl = `${API_URL}/r/${item.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${item.id}`);
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR-${item.title}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const onSaveTitle = async () => {
    await fetch(`${API_URL}/update-title/${item.id}`, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ title: tTitle }) 
    });
    fetchHistory();
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(37,99,235,0.15)] flex flex-col transition-all duration-500 group relative">
      
      {/* Alert Copié (Pilule Flottante Premium) */}
      <div className={`absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-emerald-400 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 z-50 shadow-xl transition-all duration-300 ${copied ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
        <CheckCircle2 size={16} /> Lien copié
      </div>

      {/* ZONE VISUELLE */}
      <div 
        className="flex justify-center mb-8 p-8 rounded-[2.5rem] relative h-64 items-center shadow-inner overflow-hidden border border-slate-100/50" 
        style={{ backgroundColor: item.bg_color }}
      >
        {item.type === 'link' ? (
           <div className="text-slate-900/10 transform group-hover:scale-110 transition-transform duration-700">
             <LinkIcon size={100} strokeWidth={1.5}/>
           </div>
        ) : (
           <div className="transform group-hover:scale-105 transition-transform duration-500">
             <QRVisual 
               options={{ 
                 url: item.type === 'vcard' ? item.encoded_text : trackingUrl, 
                 color: item.color, 
                 bgColor: item.bg_color, 
                 dotType: item.design, 
                 eyeType: item.eye_design,
                 logo: item.logo
               }} 
               size={160} 
               id={item.id} 
             />
           </div>
        )}
        
        {/* BOUTON MODIF (Glassmorphism) */}
        {item.type !== 'link' && (
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3.5 rounded-2xl shadow-sm border border-white text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-md transition-all transform hover:-rotate-3"
            title="Modifier le titre"
          >
            <Settings2 size={18} strokeWidth={2.5}/>
          </button>
        )}

        {/* BOUTON TÉLÉCHARGER (Glassmorphism inversé) */}
        {item.type !== 'link' && (
          <button 
            onClick={downloadQR} 
            className="absolute bottom-4 right-4 bg-blue-600/90 backdrop-blur-md border border-blue-500/50 text-white p-3.5 rounded-2xl shadow-lg hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform hover:scale-105"
            title="Télécharger l'image"
          >
            <Download size={18} strokeWidth={2.5}/>
          </button>
        )}
      </div>

      {/* ZONE CONTENU */}
      {isEditing ? (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300 flex-1 flex flex-col justify-center">
          <input 
            className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 outline-none border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all shadow-inner" 
            value={tTitle} 
            onChange={e => setTTitle(e.target.value)}
            autoFocus 
          />
          <button 
            onClick={onSaveTitle} 
            className="w-full bg-blue-600 text-white py-4.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Save size={16} /> Enregistrer
          </button>
        </div>
      ) : (
        <div className="text-center flex flex-col flex-1">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 truncate px-2">{item.title || "Sans titre"}</h2>
          
          {/* Bloc Lien & Copie */}
          <div className="mt-5 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-3 group-hover:bg-slate-50 transition-colors">
            <p className="text-[10px] font-mono font-bold text-blue-600 truncate px-2">{trackingUrl}</p>
            <button 
              onClick={handleCopy} 
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
               <Copy size={14}/> Copier le lien
            </button>
          </div>
          
          <div className="mt-auto pt-6 flex gap-3">
            <Link 
              to={`/stats/${item.id}`} 
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              <BarChart3 size={16}/> Analyse
            </Link>
            <button 
              onClick={() => openDeleteModal(item.id)} 
              className="p-4 bg-white border border-red-100 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
              title="Supprimer"
            >
              <Trash2 size={18} strokeWidth={2.5}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;