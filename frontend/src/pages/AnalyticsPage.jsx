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
import { Activity, QrCode, Link as LinkIcon, UserPlus, Award } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AnalyticsPage = ({ history }) => {
  const totalVisits = history.reduce((acc, curr) => acc + (curr.scanCount || 0), 0);
  const qrData = history.filter(i => i.type === 'qr' || !i.type);
  const vcardData = history.filter(i => i.type === 'vcard');
  const linkData = history.filter(i => i.type === 'link');
  
  const topPerformer = [...history].sort((a,b) => b.scanCount - a.scanCount)[0];

  const chartData = {
    labels: history.slice(0, 15).reverse().map(i => i.title?.substring(0, 10) || "Sans titre"),
    datasets: [{
      label: 'Visites',
      data: history.slice(0, 15).reverse().map(i => i.scanCount),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#2563eb',
      pointBorderWidth: 2,
    }]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 13, weight: 'bold', family: 'Inter' },
        bodyFont: { size: 14, weight: 'bold', family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
        ticks: { font: { family: 'Inter', weight: 'bold' }, color: '#94a3b8' }
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { font: { family: 'Inter', weight: 'bold', size: 10 }, color: '#94a3b8', maxRotation: 45, minRotation: 45 }
      }
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-12 animate-in fade-in duration-500">
      
      {/* HEADER & TOTAL SCORE (PREMIUM DARK/BLUE) */}
      <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-900 p-10 md:p-12 rounded-[3.5rem] shadow-2xl overflow-hidden group">
        {/* Abstract Dark Background */}
        <img 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop" 
          alt="Abstract Dark" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-900/80"></div>

        <div className="relative z-10 w-full md:w-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white drop-shadow-sm">Analyse Globale</h1>
          <p className="text-blue-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-3 flex items-center gap-2">
            <Activity size={14} /> Data Insight Center
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] text-white flex items-center gap-6 border border-white/20 shadow-[0_0_40px_rgba(37,99,235,0.3)] w-full md:w-auto">
           <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-inner"><Activity size={32} strokeWidth={2.5}/></div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Passages Totaux</p>
             <h2 className="text-5xl md:text-6xl font-black leading-none tracking-tighter">{totalVisits}</h2>
           </div>
        </div>
      </div>

      {/* MINI STATS CARDS (GLASSMORPHISM STYLE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<QrCode size={16}/>} label="QR Codes" count={qrData.length} color="blue" />
        <StatCard icon={<UserPlus size={16}/>} label="vCards" count={vcardData.length} color="emerald" />
        <StatCard icon={<LinkIcon size={16}/>} label="Liens Suivis" count={linkData.length} color="indigo" />
        
        <div className="bg-gradient-to-br from-amber-100 to-orange-50 p-8 rounded-[2.5rem] border border-amber-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-6 -top-6 text-amber-200/50 transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <Award size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-2">
              <Award size={14}/> Top Élément
            </span>
            <span className="text-xl font-black text-amber-900 truncate uppercase block">{topPerformer?.title || "N/A"}</span>
            <span className="text-xs font-bold text-amber-700/60 mt-1 block">{topPerformer ? `${topPerformer.scanCount} scans` : ''}</span>
          </div>
        </div>
      </div>

      {/* GRAPHIQUE PRINCIPAL */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -z-10"></div>
        <h3 className="font-black uppercase text-slate-400 text-[10px] tracking-[0.2em] mb-8 flex items-center gap-2">
          <Activity size={14} className="text-blue-600" /> Volume d'interactions (15 derniers éléments)
        </h3>
        <div className="h-[400px] w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* LISTES DÉTAILLÉES PAR CATÉGORIE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <DataColumn title="QR Codes" icon={<QrCode size={20}/>} data={qrData} color="blue" />
        <DataColumn title="Contacts" icon={<UserPlus size={20}/>} data={vcardData} color="emerald" />
        <DataColumn title="Liens" icon={<LinkIcon size={20}/>} data={linkData} color="indigo" />
      </div>

    </main>
  );
};

const StatCard = ({ icon, label, count, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
  };
  
  return (
    <div className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}>
      <div className="absolute -right-4 -top-4 opacity-5 transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
        {React.cloneElement(icon, { size: 100 })}
      </div>
      <div className="relative z-10">
        <span className={`text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${colors[color].split(' ')[0]}`}>
          {icon} {label}
        </span>
        <span className="text-4xl font-black text-slate-900 tracking-tighter">{count}</span>
      </div>
    </div>
  );
};

const DataColumn = ({ title, icon, data, color }) => {
  const colorMap = {
    blue: "text-blue-600 border-blue-100",
    emerald: "text-emerald-600 border-emerald-100",
    indigo: "text-indigo-600 border-indigo-100"
  };

  const badgeColors = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    indigo: "bg-indigo-50 text-indigo-700"
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-lg relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-full h-2 ${colorMap[color].split(' ')[0].replace('text', 'bg')}`}></div>
      <h2 className={`font-black text-xl mb-6 uppercase italic flex items-center gap-3 border-b border-slate-100 pb-5 mt-2 ${colorMap[color].split(' ')[0]}`}>
        {icon} {title}
      </h2>
      <div className="space-y-3">
        {data.sort((a,b) => b.scanCount - a.scanCount).slice(0,8).map((item, index) => (
          <div key={item.id} className="flex justify-between items-center p-4 rounded-2xl transition-all border border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-md">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-[10px] font-black text-slate-300 w-4">{index + 1}.</span>
              <span className="font-bold text-[11px] uppercase text-slate-700 truncate pr-2 tracking-wide">{item.title || 'Sans titre'}</span>
            </div>
            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm whitespace-nowrap ${badgeColors[color]}`}>
              {item.scanCount} scans
            </span>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-10">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
              {icon}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Aucune donnée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;