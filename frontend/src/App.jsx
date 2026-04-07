import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { 
  QrCode, BarChart3, Download, Trash2, Edit2, Check, X, 
  ExternalLink, MapPin, Smartphone, Calendar, ArrowLeft, 
  PlusCircle, LayoutDashboard, TrendingUp, Link as LinkIcon,
  Palette, Sparkles
} from 'lucide-react';

// Configuration Chart.js (inchangé)
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

const API_URL = "https://qr-code-generator-python3.onrender.com";

// --- NAVIGATION ---
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

// --- PAGE 1 : DASHBOARD AVEC MODIFICATION ---
const HomePage = ({ history, fetchHistory, handleUpdateField, handleDelete, downloadImage, loading, setLoading, url, setUrl }) => {
  const [editingId, setEditingId] = useState(null);
  const [editType, setEditType] = useState(''); 
  const [tempValue, setTempValue] = useState('');
  
  // Nouveaux états pour le style
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
        body: JSON.stringify({ 
            url,
            color: qrColor,
            bg_color: bgColor
        })
      });
      if (res.ok) { 
        fetchHistory(); 
        setUrl(''); 
        setShowOptions(false); // Ferme les options après création
      }
    } catch (err) { alert("Erreur serveur"); } finally { setLoading(false); }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Header & Formulaire */}
      <div className="flex flex-col mb-12 gap-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">Studio Créatif</h1>
                <p className="text-slate-500 font-medium">Personnalisez vos QR codes dynamiques.</p>
            </div>
            <button 
                onClick={() => setShowOptions(!showOptions)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${showOptions ? 'bg-blue-100 text-blue-600' : 'bg-white border text-slate-600'}`}
            >
                <Palette size={18} /> {showOptions ? "Masquer le Style" : "Personnaliser Style"}
            </button>
        </div>

        <div className="bg-white p-4 rounded-[2.5rem] shadow-xl shadow-blue-100 border border-slate-100">
          <form onSubmit={onGenerate} className="space-y-4">
            <div className="flex gap-2">
                <input 
                type="url" required placeholder="https://votre-lien-destination.com"
                className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none text-sm font-medium focus:ring-2 focus:ring-blue-500 transition"
                value={url} onChange={(e) => setUrl(e.target.value)}
                />
                <button disabled={loading} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-blue-200">
                {loading ? "Génération..." : <><Sparkles size={18} /> Créer le QR</>}
                </button>
            </div>

            {/* Panneau d'options de style */}
            {showOptions && (
                <div className="flex flex-wrap gap-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">Couleur des points</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none" />
                            <span className="text-xs font-mono font-bold text-slate-600">{qrColor.toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="space-y-2 border-l pl-6">
                        <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">Couleur du fond</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none" />
                            <span className="text-xs font-mono font-bold text-slate-600">{bgColor.toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="flex items-end ml-auto">
                        <div className="flex gap-2">
                            <button type="button" onClick={() => {setQrColor('#2563eb'); setBgColor('#ffffff');}} className="text-[10px] font-bold text-blue-600 underline">Style Blue Ocean</button>
                            <button type="button" onClick={() => {setQrColor('#000000'); setBgColor('#ffffff');}} className="text-[10px] font-bold text-slate-400 underline">Reset</button>
                        </div>
                    </div>
                </div>
            )}
          </form>
        </div>
      </div>

      {/* Grille des QR Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((qr) => (
          <div key={qr.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 hover:border-blue-300 transition-all group relative">
            <div className="absolute top-4 right-4 flex gap-2">
                <span className="bg-white/80 backdrop-blur-sm text-slate-900 text-[10px] font-black px-3 py-1 rounded-full border shadow-sm">
                    {qr.scanCount || 0} SCANS
                </span>
            </div>

            <div className="flex justify-center mb-6 p-6 rounded-3xl border border-slate-50 transition-colors" style={{ backgroundColor: qr.bg_color || '#f8fafc' }}>
              <img src={qr.qrImageUrl} alt="QR" className="w-32 h-32" />
            </div>
            
            <div className="space-y-4 mb-8 text-center">
              <div className="group/edit">
                {editingId === qr.id && editType === 'title' ? (
                  <div className="flex gap-1">
                    <input className="text-sm font-bold border-b-2 border-blue-500 w-full outline-none text-center" value={tempValue} onChange={(e)=>setTempValue(e.target.value)} autoFocus />
                    <button onClick={()=>{handleUpdateField(qr.id, 'title', tempValue); setEditingId(null);}}><Check size={16} className="text-green-600"/></button>
                  </div>
                ) : (
                  <h3 className="font-bold text-slate-800 flex items-center justify-center gap-2">
                    {qr.title || "Sans titre"}
                    <Edit2 size={12} className="cursor-pointer opacity-0 group-hover/edit:opacity-100 text-slate-400" onClick={()=>{setEditingId(qr.id); setEditType('title'); setTempValue(qr.title || "");}}/>
                  </h3>
                )}
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mx-auto max-w-[200px]">
                <div className="flex items-center justify-center gap-2">
                   <div className="w-3 h-3 rounded-full border shadow-sm" style={{ backgroundColor: qr.color || '#000' }}></div>
                   <div className="w-3 h-3 rounded-full border shadow-sm" style={{ backgroundColor: qr.bg_color || '#fff' }}></div>
                   <p className="text-[9px] font-black text-slate-400 tracking-tighter uppercase">Palette Appliquée</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link to={`/stats/${qr.id}`} className="flex-1 bg-slate-900 text-white text-center py-3 rounded-2xl font-bold text-xs hover:bg-blue-600 transition flex items-center justify-center gap-2">
                <BarChart3 size={14} /> ANALYSER
              </Link>
              <button onClick={() => downloadImage(qr.qrImageUrl, qr.id)} className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200"><Download size={16} /></button>
              <button onClick={() => handleDelete(qr.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

// --- PAGES ANALYTICS ET STATS (INCHANGÉES) ---
const AnalyticsPage = ({ history }) => {
  const totalScans = history.reduce((acc, curr) => acc + (curr.scanCount || 0), 0);
  const chartData = {
    labels: history.slice(0, 5).reverse().map(qr => qr.title?.substring(0, 10) || qr.id),
    datasets: [{
      label: 'Scans',
      data: history.slice(0, 5).reverse().map(qr => qr.scanCount),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter uppercase">Statistiques Globales</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
          <p className="text-blue-100 font-bold uppercase text-[10px] tracking-widest mb-2">Total Scans</p>
          <h2 className="text-5xl font-black tracking-tighter">{totalScans}</h2>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">Codes Actifs</p>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{history.length}</h2>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">Meilleur QR</p>
          <h2 className="text-xl font-black text-blue-600 truncate uppercase">{history[0]?.title || "N/A"}</h2>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 h-80">
        <Line data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </main>
  );
};

const StatsPage = ({ history }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qr = history.find(item => item.id === id);
  if (!qr) return <div className="p-20 text-center font-bold">QR Code introuvable...</div>;
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm mb-8 transition">
        <ArrowLeft size={18} /> Retour au Dashboard
      </button>
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex items-center gap-6 bg-slate-50/50">
          <div className="p-4 rounded-3xl" style={{ backgroundColor: qr.bg_color || '#fff' }}>
            <img src={qr.qrImageUrl} alt="QR" className="w-24 h-24 shadow-sm" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{qr.title || "Sans titre"}</h2>
            <p className="text-xs text-slate-400 mb-3 truncate max-w-xs">{qr.originalUrl}</p>
            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase">
              {qr.scanCount} Scans Totaux
            </span>
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            {qr.scans_history?.length > 0 ? (
              qr.scans_history.slice().reverse().map((scan, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm"><Smartphone size={18} /></div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{scan.device}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin size={10} /> {scan.city}</p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] font-bold text-slate-400">
                    <p className="flex items-center gap-1 justify-end"><Calendar size={12} /> {scan.date}</p>
                  </div>
                </div>
              ))
            ) : <p className="text-center text-slate-400 py-10 italic">Aucune activité enregistrée.</p>}
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
      fetchHistory();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce QR code ?")) return;
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
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
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