import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Smartphone, MapPin, Activity, Globe, Link as LinkIcon } from 'lucide-react';
import QRVisual from '../components/QRVisual';

const API_URL = "https://qr-code-generator-python3.onrender.com";

const StatsPage = ({ history }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // On s'assure de trouver l'item
  const item = history.find(i => i.id === id);
  
  if (!item) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <RefreshCw className="animate-spin text-blue-600" size={48} />
        <p className="font-black uppercase text-slate-400 tracking-widest">Recherche des données...</p>
      </div>
    );
  }

  const trackingUrl = `${API_URL}/r/${item.id}`;

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase transition-colors">
        <ArrowLeft size={16}/> Retour
      </button>

      <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl overflow-hidden">
        {/* HEADER DE LA PAGE STATS */}
        <div className="p-8 md:p-14 border-b flex flex-col md:flex-row items-center gap-10 bg-slate-50/50">
          <div className="shrink-0 p-6 rounded-[2.5rem] bg-white border-2 border-slate-100 shadow-inner">
            {item.type === 'link' ? (
              <div className="w-32 h-32 flex items-center justify-center text-blue-600"><LinkIcon size={64}/></div>
            ) : (
              <QRVisual 
                options={{ 
                  url: item.type === 'vcard' ? item.encoded_text : trackingUrl, 
                  color: item.color, 
                  bgColor: item.bg_color, 
                  dotType: item.design, 
                  eyeType: item.eye_design 
                }} 
                size={140} 
              />
            )}
          </div>

          {/* LA DIV CORRIGÉE ICI */}
          <div className="flex-1 text-center md:text-left space-y-4 min-w-0 w-full">
            <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-tight truncate w-full">
              {item.title}
            </h2>
            <p className="text-xs md:text-sm font-mono text-slate-400 break-all line-clamp-2">
              {item.originalUrl}
            </p>
            <div className="bg-blue-600 text-white inline-flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-lg shadow-xl border-b-4 border-blue-800">
              <Activity size={20}/> {item.scanCount} VISITES
            </div>
          </div>
        </div>

        {/* HISTORIQUE DES VISITES */}
        <div className="p-8 md:p-14 space-y-8">
          <h3 className="font-black text-2xl mb-10 uppercase flex items-center gap-3 tracking-tighter">
            <Zap size={28} className="text-blue-600"/> Historique récent
          </h3>
          
          <div className="grid gap-4">
            {item.scans_history && item.scans_history.length > 0 ? (
              [...item.scans_history].reverse().map((scan, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                      <Smartphone size={20}/>
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase text-slate-800">{scan.device}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1.5 uppercase font-bold">
                        <MapPin size={12} className="text-red-500"/> {scan.city || "Inconnue"}
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 sm:mt-0 bg-white px-4 py-2 rounded-full border">
                    {scan.date}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed">
                <Globe size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest">Aucune visite détectée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default StatsPage;