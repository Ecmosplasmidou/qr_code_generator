import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { 
  QrCode, BarChart3, Download, Trash2, Edit2, Check, X, 
  ExternalLink, MapPin, Smartphone, Calendar, ArrowLeft, 
  PlusCircle, LayoutDashboard, TrendingUp, Link as LinkIcon,
  Palette, RefreshCw, Save, Settings2
} from 'lucide-react';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

const API_URL = "https://qr-code-generator-python3.onrender.com";

const Navbar = () => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg shadow-blue-200 shadow-md">
          <QrCode size={22} color="white" />
        </div>
        <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">QRLYZE</span>
      </Link>
      <nav className="hidden md:flex gap-8">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition">
          <LayoutDashboard size={16} /> Dashboard
        </Link>
        <Link to="/analytics" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition">
          <TrendingUp size={16} /> Analytics
        </Link>
      </nav>
    </div>
  </header>
);

const HomePage = ({ history, fetchHistory, handleUpdateField, handleDelete, downloadImage, loading, setLoading, url, setUrl }) => {
  // États pour la modification d'un QR existant
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editColor, setEditColor] = useState('#000000');
  const [editBgColor, setEditBgColor] = useState('#ffffff');
  
  // États de style pour la création d'un nouveau QR
  const [showOptions, setShowOptions] = useState(false);
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const onGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, color: qrColor, bg_color: bgColor })
      });
      if (res.ok) { 
        await fetchHistory(); 
        setUrl(''); 
        setShowOptions(false);
      }
    } catch (err) { alert("Erreur serveur"); } finally { setLoading(false); }
  };

  const saveModifications = async (id) => {
    setLoading(true);
    try {
      // 1. Mise à jour Titre et URL
      await handleUpdateField(id, 'title', editTitle);
      await handleUpdateField(id, 'url', editUrl);
      
      // 2. Mise à jour du Style (Régénération de l'image via le backend)
      await fetch(`${API_URL}/update-style/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color: editColor, bg_color: editBgColor })
      });

      await fetchHistory();
      setEditingId(null);
    } catch (err) {
      alert("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col mb-12 gap-6">
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">Studio Créatif</h1>
                <p className="text-slate-500 font-medium">Générez des QR codes uniques et dynamiques.</p>
            </div>
            <button 
                onClick={() => setShowOptions(!showOptions)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${showOptions ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
                <Palette size={18} /> {showOptions ? "Fermer l'éditeur" : "Personnaliser les couleurs"}
            </button>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-blue-100/50 border border-slate-100">
          <form onSubmit={onGenerate} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-3">
                <input 
                    type="url" required placeholder="Lien de destination (ex: https://google.com)"
                    className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent outline-none text-sm font-semibold focus:border-blue-500 focus:bg-white transition-all"
                    value={url} onChange={(e) => setUrl(e.target.value)}
                />
                <button disabled={loading || !url} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50">
                    {loading ? <RefreshCw size={20} className="animate-spin" /> : <><QrCode size={18} /> Créer le QR-code</>}
                </button>
            </div>
            {showOptions && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Couleur du QR</label>
                        <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer bg-white p-1 border" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Couleur de Fond</label>
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer bg-white p-1 border" />
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white rounded-2xl border p-4">
                        <p className="text-[9px] font-black text-slate-300 uppercase mb-2">Aperçu</p>
                        <div className="w-12 h-12 rounded shadow-sm border flex items-center justify-center" style={{ backgroundColor: bgColor }}><QrCode size={32} color={qrColor} /></div>
                    </div>
                </div>
            )}
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {history.map((qr) => (
          <div key={qr.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 hover:border-blue-400 transition-all group shadow-sm hover:shadow-xl">
            
            <div className="flex justify-center mb-6 p-8 rounded-[2rem] border border-slate-50 relative" style={{ backgroundColor: qr.bg_color || '#ffffff' }}>
              <img src={qr.qrImageUrl} alt="QR" className="w-36 h-36 relative z-10" />
              <div className="absolute top-3 right-3 flex gap-2">
                 <button 
                  onClick={() => { 
                    setEditingId(qr.id); 
                    setEditTitle(qr.title || ""); 
                    setEditUrl(qr.originalUrl || ""); 
                    setEditColor(qr.color || "#000000");
                    setEditBgColor(qr.bg_color || "#ffffff");
                  }} 
                  className="bg-white/90 p-2 rounded-full shadow-sm text-slate-600 hover:text-blue-600 transition-colors"
                 >
                    <Settings2 size={16} />
                 </button>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {editingId === qr.id ? (
                <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 space-y-4 animate-in fade-in zoom-in duration-200">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-blue-400 uppercase">Paramètres globaux</label>
                    <input 
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                      value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Titre"
                    />
                    <input 
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                      value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="Lien"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase text-center block">Points</label>
                        <input type="color" className="w-full h-8 rounded-lg cursor-pointer" value={editColor} onChange={(e) => setEditColor(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase text-center block">Fond</label>
                        <input type="color" className="w-full h-8 rounded-lg cursor-pointer" value={editBgColor} onChange={(e) => setEditBgColor(e.target.value)} />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button onClick={() => saveModifications(qr.id)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-blue-700 transition-all">
                      <Save size={14} /> Appliquer
                    </button>
                    <button onClick={() => setEditingId(null)} className="bg-white text-slate-400 px-3 py-2.5 rounded-xl border border-slate-200 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center px-2">
                  <h3 className="font-bold text-slate-800 text-lg truncate mb-1">{qr.title || "Lien sans titre"}</h3>
                  <p className="text-[10px] text-slate-400 font-medium truncate flex items-center justify-center gap-1">
                    <LinkIcon size={10} /> {qr.originalUrl}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        <TrendingUp size={12} className="text-blue-600" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{qr.scanCount || 0} Scans</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Link to={`/stats/${qr.id}`} className="flex-grow bg-slate-900 text-white px-4 py-3 rounded-2xl font-bold text-xs hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                <BarChart3 size={14} /> ANALYSER
              </Link>
              <button onClick={() => downloadImage(qr.qrImageUrl, qr.id)} className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-blue-100 hover:text-blue-600 transition-all">
                <Download size={18} />
              </button>
              <button onClick={() => handleDelete(qr.id)} className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

// --- PAGES ANALYTICS ET STATS ---
const AnalyticsPage = ({ history }) => {
  const totalScans = history.reduce((acc, curr) => acc + (curr.scanCount || 0), 0);
  const chartData = {
    labels: history.slice(0, 5).reverse().map(qr => qr.title?.substring(0, 10) || qr.id),
    datasets: [{
      label: 'Performance des Scans',
      data: history.slice(0, 5).reverse().map(qr => qr.scanCount),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Analytics Global</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-200 flex flex-col justify-between h-48">
          <p className="font-bold text-blue-100 uppercase text-xs tracking-widest">Scans Totaux</p>
          <h2 className="text-6xl font-black">{totalScans}</h2>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 flex flex-col justify-between h-48">
          <p className="font-bold text-slate-400 uppercase text-xs tracking-widest">Qr-codes Actifs</p>
          <h2 className="text-6xl font-black text-slate-900">{history.length}</h2>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 flex flex-col justify-between h-48 text-center items-center">
          <p className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Meilleur QR-code</p>
          <h2 className="text-xl font-black text-blue-600 truncate uppercase">{history[0]?.title || "N/A"}</h2>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 h-96 shadow-sm">
        <Line data={chartData} options={{ maintainAspectRatio: false, responsive: true }} />
      </div>
    </main>
  );
};

const StatsPage = ({ history }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qr = history.find(item => item.id === id);
  if (!qr) return <div className="p-20 text-center font-bold">Chargement...</div>;
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-8 transition-colors">
        <ArrowLeft size={18} /> Retour au Dashboard
      </button>
      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row items-center gap-8 bg-slate-50/30">
          <div className="p-6 rounded-[2rem] shadow-inner" style={{ backgroundColor: qr.bg_color || '#fff' }}>
            <img src={qr.qrImageUrl} alt="QR" className="w-32 h-32" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{qr.title || "Sans titre"}</h2>
            <p className="text-sm text-slate-400 mb-4 font-mono">{qr.originalUrl}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
               <span className="bg-blue-600 text-white text-[11px] font-black px-5 py-2 rounded-full uppercase shadow-lg shadow-blue-100">
                {qr.scanCount} Scans enregistrés
               </span>
               <span className="bg-slate-200 text-slate-600 text-[11px] font-black px-5 py-2 rounded-full uppercase">
                ID: {qr.id}
               </span>
            </div>
          </div>
        </div>
        <div className="p-10">
          <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
            <BarChart3 size={20} className="text-blue-600" /> Flux d'activité récent
          </h3>
          <div className="space-y-3">
            {qr.scans_history?.length > 0 ? (
              qr.scans_history.slice().reverse().map((scan, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100"><Smartphone size={18} /></div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{scan.device}</p>
                      <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 uppercase tracking-wider"><MapPin size={10} className="text-red-500" /> {scan.city}</p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] font-bold text-slate-400">
                    <p className="flex items-center gap-1 justify-end uppercase tracking-tighter"><Calendar size={12} className="text-blue-500"/> {scan.date}</p>
                  </div>
                </div>
              ))
            ) : <p className="text-center text-slate-400 py-10 italic">Aucune donnée de scan pour le moment.</p>}
          </div>
        </div>
      </div>
    </main>
  );
};

// --- COMPOSANT RACINE ---
function App() {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/all-qrcodes`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data.reverse() : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleUpdateField = async (id, field, value) => {
    const route = field === 'title' ? 'update-title' : 'update-url';
    const bodyKey = field === 'title' ? 'title' : 'url';
    try {
      await fetch(`${API_URL}/${route}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [bodyKey]: value })
      });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce QR code ?")) return;
    try { 
      await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' }); 
      fetchHistory(); 
    } catch (err) { console.error(err); }
  };

  const downloadImage = (base64, id) => {
    const link = document.createElement("a");
    link.href = base64;
    link.download = `qr-${id}.png`;
    link.click();
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-600">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <HomePage 
              history={history} fetchHistory={fetchHistory} loading={loading} setLoading={setLoading}
              url={url} setUrl={setUrl} handleUpdateField={handleUpdateField}
              handleDelete={handleDelete} downloadImage={downloadImage}
            />
          } />
          <Route path="/analytics" element={<AnalyticsPage history={history} />} />
          <Route path="/stats/:id" element={<StatsPage history={history} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;