import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Smartphone, MapPin, Activity, Globe, Link as LinkIcon, RefreshCw, Calendar, ShieldCheck  } from 'lucide-react';
import QRVisual from '../components/QRVisual';

const API_URL = "https://qr-code-generator-python3.onrender.com";

const StatsPage = ({ history }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const item = history.find(i => i.id === id);
  
  if (!item) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
          <RefreshCw className="animate-spin text-blue-600 opacity-20" size={80} />
          <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
        </div>
        <p className="font-black uppercase text-slate-400 tracking-[0.3em] text-xs">Synchronisation des données...</p>
      </div>
    );
  }

  const trackingUrl = `${API_URL}/r/${item.id}`;

  return (
    <main className="relative max-w-5xl mx-auto px-6 py-12 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all"
      >
        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:shadow-md transition-all">
          <ArrowLeft size={14}/>
        </div>
        Retour au studio
      </button>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
        
        {/* HEADER SECTION (DARK GRADIENT) */}
        <div className="relative p-8 md:p-14 border-b border-slate-100 flex flex-col md:flex-row items-center gap-10 overflow-hidden">
          <div className="absolute inset-0 bg-slate-50/50 pointer-events-none"></div>
          
          <div className="relative z-10 shrink-0 p-6 rounded-[2.5rem] bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 transform hover:scale-105 transition-transform duration-500">
            {item.type === 'link' ? (
              <div className="w-32 h-32 flex items-center justify-center text-blue-600 bg-blue-50 rounded-3xl">
                <LinkIcon size={56} strokeWidth={1.5}/>
              </div>
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

          <div className="relative z-10 flex-1 text-center md:text-left space-y-6 min-w-0 w-full">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest mb-3">
                <Globe size={10} /> Tracking Actif
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-tight truncate">
                {item.title}
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-2 truncate opacity-70">
                Cible : {item.originalUrl || item.encoded_text?.substring(0, 50)}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="bg-slate-900 text-white flex items-center gap-4 px-8 py-4 rounded-2xl shadow-xl shadow-slate-200 transform hover:-translate-y-1 transition-all">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                  <Activity size={20} strokeWidth={2.5}/>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-50 tracking-widest leading-none mb-1">Total Scans</p>
                  <h3 className="text-3xl font-black leading-none">{item.scanCount}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOG SECTION */}
        <div className="p-8 md:p-14 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-black text-2xl uppercase flex items-center gap-3 tracking-tighter italic">
              <Zap size={24} className="text-blue-600 animate-pulse"/> Flux d'activité
            </h3>
            <div className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-4 py-2 rounded-full tracking-[0.1em]">
              Temps réel
            </div>
          </div>
          
          <div className="grid gap-3">
            {item.scans_history && item.scans_history.length > 0 ? (
              [...item.scans_history].reverse().map((scan, i) => (
              console.log("Données du scan :", scan),
                <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-[0_10px_30px_-15px_rgba(37,99,235,0.1)] transition-all duration-300 group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <Smartphone size={22} strokeWidth={2.5}/>
                    </div>
                    <div>
                      <p className="font-black text-xs uppercase text-slate-800 tracking-wide">{scan.device || "Appareil Inconnu"}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-[10px] text-slate-400 flex items-center gap-1.5 uppercase font-bold">
                          <MapPin size={12} className="text-red-500 opacity-60"/> {scan.city || "Ville inconnue"}
                        </p>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1.5 uppercase font-bold">
                          <Globe size={12} className="text-blue-500 opacity-60"/> {scan.ip || scan.country || "IP"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase tracking-tighter bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <Calendar size={12} className="text-blue-600"/>
                        {scan.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <Globe size={32} className="text-slate-200" />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">En attente de la première interaction</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER STATS INFO */}
      <div className="flex justify-center">
        <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.3em] flex items-center gap-2">
          <ShieldCheck size={12} /> Données de tracking sécurisées par QRLYZE Engine
        </p>
      </div>
    </main>
  );
};

export default StatsPage;