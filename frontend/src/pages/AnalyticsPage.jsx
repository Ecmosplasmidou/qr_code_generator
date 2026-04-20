import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Activity, QrCode, Link as LinkIcon, UserPlus, Award } from 'lucide-react';

// Enregistrement des composants Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AnalyticsPage = ({ history }) => {
  // Calculs des stats par type
  const totalVisits = history.reduce((acc, curr) => acc + (curr.scanCount || 0), 0);
  const qrData = history.filter(i => i.type === 'qr' || !i.type);
  const vcardData = history.filter(i => i.type === 'vcard');
  const linkData = history.filter(i => i.type === 'link');
  
  // Top performer global
  const topPerformer = [...history].sort((a,b) => b.scanCount - a.scanCount)[0];

  // Configuration du graphique
  const chartData = {
    labels: history.slice(0, 15).reverse().map(i => i.title?.substring(0, 10) || "Sans titre"),
    datasets: [{
      label: 'Visites cumulées',
      data: history.slice(0, 15).reverse().map(i => i.scanCount),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 4,
      pointRadius: 4,
      pointBackgroundColor: '#fff'
    }]
  };

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-10 animate-in fade-in duration-500">
      
      {/* --- HEADER & TOTAL SCORE --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-slate-900">Analyse des données</h1>
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mt-2">Data Insight Center</p>
        </div>
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl flex items-center gap-8 border-b-8 border-blue-800 w-full md:w-auto">
           <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center"><Activity size={28}/></div>
           <div>
             <p className="text-[10px] font-black uppercase opacity-70 mb-1">Passages Totaux</p>
             <h2 className="text-5xl font-black leading-none">{totalVisits}</h2>
           </div>
        </div>
      </div>

      {/* --- MINI STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-black uppercase text-slate-400 mb-2 flex items-center gap-2"><QrCode size={12}/> QR Codes</span>
              <span className="text-3xl font-black text-slate-900">{qrData.length}</span>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-black uppercase text-slate-400 mb-2 flex items-center gap-2"><UserPlus size={12}/> vCards</span>
              <span className="text-3xl font-black text-slate-900">{vcardData.length}</span>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-black uppercase text-slate-400 mb-2 flex items-center gap-2"><LinkIcon size={12}/> Suivis</span>
              <span className="text-3xl font-black text-slate-900">{linkData.length}</span>
          </div>
          <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex flex-col justify-center">
              <span className="text-[9px] font-black uppercase text-amber-600 mb-2 flex items-center gap-2"><Award size={12}/> Top Élément</span>
              <span className="text-sm font-black text-amber-900 truncate uppercase">{topPerformer?.title || "N/A"}</span>
          </div>
      </div>

      {/* --- GRAPHIQUE PRINCIPAL --- */}
      <div className="bg-white p-6 md:p-10 rounded-[3rem] border shadow-xl h-[450px]">
        <h3 className="font-black uppercase text-slate-300 text-[10px] tracking-widest mb-6">Volume d'interactions par création</h3>
        <Line data={chartData} options={{ maintainAspectRatio: false, responsive: true, plugins: { legend: { display: false } } }} />
      </div>

      {/* --- LISTES DÉTAILLÉES PAR CATÉGORIE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        
        {/* COLONNE QR CODES */}
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
          <h2 className="font-black text-xl mb-6 text-blue-600 uppercase italic flex items-center gap-3 border-b pb-4"><QrCode size={20}/> QR Codes</h2>
          <div className="space-y-3">
            {qrData.sort((a,b) => b.scanCount - a.scanCount).slice(0,8).map(q => (
              <div key={q.id} className="flex justify-between items-center p-4 rounded-2xl transition-all border border-transparent hover:border-slate-100" style={{backgroundColor: q.rowColor}}>
                <span className="font-black text-[10px] uppercase text-slate-800 truncate pr-2">{q.title}</span>
                <span className="bg-white px-3 py-1 rounded-full text-[9px] font-black shadow-sm border whitespace-nowrap">{q.scanCount}</span>
              </div>
            ))}
            {qrData.length === 0 && <p className="text-center py-6 text-slate-300 text-xs italic">Aucune donnée</p>}
          </div>
        </div>

        {/* COLONNE VCARDS */}
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
          <h2 className="font-black text-xl mb-6 text-emerald-600 uppercase italic flex items-center gap-3 border-b pb-4"><UserPlus size={20}/> Contacts</h2>
          <div className="space-y-3">
            {vcardData.sort((a,b) => b.scanCount - a.scanCount).slice(0,8).map(v => (
              <div key={v.id} className="flex justify-between items-center p-4 rounded-2xl transition-all border border-transparent hover:border-slate-100" style={{backgroundColor: v.rowColor}}>
                <span className="font-black text-[10px] uppercase text-slate-800 truncate pr-2">{v.title}</span>
                <span className="bg-white px-3 py-1 rounded-full text-[9px] font-black shadow-sm border whitespace-nowrap">{v.scanCount}</span>
              </div>
            ))}
            {vcardData.length === 0 && <p className="text-center py-6 text-slate-300 text-xs italic">Aucun contact</p>}
          </div>
        </div>

        {/* COLONNE LIENS */}
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
          <h2 className="font-black text-xl mb-6 text-indigo-600 uppercase italic flex items-center gap-3 border-b pb-4"><LinkIcon size={20}/> Liens Suivis</h2>
          <div className="space-y-3">
            {linkData.sort((a,b) => b.scanCount - a.scanCount).slice(0,8).map(l => (
              <div key={l.id} className="flex justify-between items-center p-4 rounded-2xl transition-all border border-transparent hover:border-slate-100" style={{backgroundColor: l.rowColor}}>
                <span className="font-black text-[10px] uppercase text-slate-800 truncate pr-2">{l.title}</span>
                <span className="bg-white px-3 py-1 rounded-full text-[9px] font-black shadow-sm border whitespace-nowrap">{l.scanCount}</span>
              </div>
            ))}
            {linkData.length === 0 && <p className="text-center py-6 text-slate-300 text-xs italic">Aucun lien</p>}
          </div>
        </div>

      </div>
    </main>
  );
};

export default AnalyticsPage;