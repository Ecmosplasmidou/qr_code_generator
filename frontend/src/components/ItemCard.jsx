import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings2, BarChart3, Download, Trash2, 
  CheckCircle2, Copy, Link as LinkIcon 
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

  // FONCTION DE SAUVEGARDE (TELECHARGEMENT)
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
    <div className="bg-white p-6 rounded-[3rem] border-2 border-transparent hover:border-blue-100 shadow-lg flex flex-col transition-all duration-500 group relative overflow-hidden">
      {/* Alert Copié */}
      <div className={`absolute top-0 left-0 w-full bg-emerald-500 text-white py-2 text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-transform duration-500 z-50 ${copied ? 'translate-y-0' : '-translate-y-full'}`}>
        <CheckCircle2 size={14} /> Lien copié
      </div>

      <div className="flex justify-center mb-6 p-8 rounded-[2.5rem] bg-slate-50 relative h-64 items-center shadow-inner" style={{ backgroundColor: item.bg_color }}>
        {item.type === 'link' ? (
           <div className="text-blue-600 opacity-20"><LinkIcon size={80}/></div>
        ) : (
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
        )}
        
        {/* BOUTON MODIF : Caché si type === 'link' */}
        {item.type !== 'link' && (
          <button onClick={() => setIsEditing(!isEditing)} className="absolute top-5 right-5 bg-white/90 p-3 rounded-2xl shadow-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">
            <Settings2 size={20}/>
          </button>
        )}

        {/* BOUTON TÉLÉCHARGER : Uniquement pour les QR */}
        {item.type !== 'link' && (
          <button onClick={downloadQR} className="absolute bottom-5 right-5 bg-blue-600 text-white p-3 rounded-2xl shadow-lg hover:bg-slate-900 transition-all transform hover:scale-110">
            <Download size={20}/>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4 p-2 animate-in zoom-in-95">
          <input className="w-full bg-slate-50 rounded-2xl px-5 py-3 text-xs font-black outline-none border-2 border-blue-500" value={tTitle} onChange={e => setTTitle(e.target.value)} />
          <button onClick={onSaveTitle} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px]">Enregistrer</button>
        </div>
      ) : (
        <div className="text-center flex flex-col flex-1">
          <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 truncate px-2">{item.title}</h2>
          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 mx-2">
            <p className="text-[9px] font-mono text-blue-600 truncate mb-2">{trackingUrl}</p>
            <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-[9px] font-black uppercase text-slate-500 hover:bg-blue-600 hover:text-white transition-all">
               <Copy size={12}/> Copier
            </button>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Link to={`/stats/${item.id}`} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 uppercase hover:bg-blue-600 transition shadow-lg">
              <BarChart3 size={16}/> Analyse
            </Link>
            <button onClick={() => openDeleteModal(item.id)} className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition">
              <Trash2 size={20}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;