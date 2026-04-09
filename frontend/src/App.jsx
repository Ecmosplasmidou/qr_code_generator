import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { 
  QrCode, BarChart3, Download, Trash2, Edit2, Check, X, 
  MapPin, Smartphone, Calendar, ArrowLeft, PlusCircle, 
  LayoutDashboard, TrendingUp, Link as LinkIcon, Palette, 
  RefreshCw, Save, Settings2, AlertTriangle, Rocket, Zap
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = "https://qr-code-generator-python3.onrender.com";

// --- NAVIGATION ---
const Navbar = () => (
  <header className="bg-white border-b sticky top-0 z-50 px-6 h-20 flex items-center justify-between shadow-sm">
    <Link to="/" className="flex items-center gap-2 font-black text-2xl text-blue-600 uppercase italic"><QrCode size={28}/> QRLYZE</Link>
    <nav className="flex gap-4">
      <Link to="/app" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 bg-slate-50 px-4 py-2 rounded-xl transition"><LayoutDashboard size={16}/> Dashboard</Link>
      <Link to="/analytics" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 bg-slate-50 px-4 py-2 rounded-xl transition"><TrendingUp size={16}/> Analytics</Link>
    </nav>
  </header>
);

// --- COMPOSANT CARD ---
const ItemCard = ({ item, onEdit, onDelete, onDownload }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(item.title);
  const [tempUrl, setTempUrl] = useState(item.originalUrl);
  const [tempColor, setTempColor] = useState(item.color || "#000000");
  const [tempBg, setTempBg] = useState(item.bg_color || "#ffffff");

  const handleSave = () => {
    onEdit(item.id, tempTitle, tempUrl, tempColor, tempBg);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative group hover:shadow-xl transition-all">
      <div className="flex justify-center mb-6 p-6 rounded-[2rem] bg-slate-50 relative overflow-hidden" style={{ backgroundColor: item.type === 'qr' ? item.bg_color : '#f8fafc' }}>
        {item.type === 'qr' ? (
          <img src={item.qrImageUrl} alt="QR" className="w-32 h-32 relative z-10" />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center text-blue-600"><LinkIcon size={48} /></div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={() => setIsEditing(!isEditing)} className="bg-white/90 p-2 rounded-full shadow-sm text-slate-600 hover:text-blue-600"><Settings2 size={16}/></button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3 animate-in zoom-in duration-200">
          <input className="w-full bg-slate-100 rounded-xl px-4 py-2 text-xs font-bold" value={tempTitle} onChange={e => setTempTitle(e.target.value)} placeholder="Titre" />
          <input className="w-full bg-slate-100 rounded-xl px-4 py-2 text-xs" value={tempUrl} onChange={e => setTempUrl(e.target.value)} placeholder="Lien" />
          {item.type === 'qr' && (
            <div className="flex gap-2">
              <input type="color" className="flex-1 h-8 rounded-lg cursor-pointer" value={tempColor} onChange={e => setTempColor(e.target.value)} />
              <input type="color" className="flex-1 h-8 rounded-lg cursor-pointer" value={tempBg} onChange={e => setTempBg(e.target.value)} />
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-[10px] font-black"><Save size={14} className="inline mr-1"/> SAUVER</button>
            <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400"><X size={16}/></button>
          </div>
        </div>
      ) : (
        <div className="text-center mb-6">
          <h3 className="font-black text-slate-800 truncate uppercase">{item.title}</h3>
          <p className="text-[10px] text-slate-400 truncate mb-4">{item.originalUrl}</p>
          <div className="flex justify-center gap-2">
            <Link to={`/stats/${item.id}`} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-1 hover:bg-blue-600"><BarChart3 size={12}/> ANALYSE</Link>
            {item.type === 'qr' && (
              <button onClick={() => onDownload(item.qrImageUrl, item.id)} className="bg-blue-50 text-blue-600 p-2 rounded-xl hover:bg-blue-100"><Download size={16}/></button>
            )}
            <button onClick={() => onDelete(item.id)} className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-100"><Trash2 size={16}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- ANALYTICS PAGE ---
const AnalyticsPage = ({ history }) => {
  const totalScans = history.reduce((acc, curr) => acc + (curr.scanCount || 0), 0);
  const chartData = {
    labels: history.slice(0, 7).map(i => i.title.substring(0, 8)),
    datasets: [{
      label: 'Performance par élément',
      data: history.slice(0, 7).map(i => i.scanCount),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-black mb-10 tracking-tighter uppercase">Performance Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl">
          <p className="text-blue-100 font-bold text-xs uppercase mb-2">Total Activité</p>
          <h2 className="text-5xl font-black">{totalScans}</h2>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
          <p className="text-slate-400 font-bold text-xs uppercase mb-2">Points d'accès</p>
          <h2 className="text-5xl font-black text-slate-900">{history.length}</h2>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border shadow-sm flex flex-col justify-center">
            <p className="text-slate-400 font-bold text-xs uppercase mb-2">Meilleur score</p>
            <p className="font-black text-blue-600 truncate uppercase">{history.sort((a,b) => b.scanCount - a.scanCount)[0]?.title || "N/A"}</p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm h-[400px]">
        <Line data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </main>
  );
};

// --- DASHBOARD (HOME) ---
const DashboardPage = ({ history, fetchHistory, openDeleteModal }) => {
  const [genType, setGenType] = useState('qr');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showOptions, setShowOptions] = useState(false);

  const onGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type: genType, color: qrColor, bg_color: bgColor })
      });
      if (res.ok) { fetchHistory(); setUrl(''); setShowOptions(false); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleEdit = async (id, title, newUrl, color, bg) => {
    try {
        await fetch(`${API_URL}/update-title/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
        await fetch(`${API_URL}/update-url/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: newUrl }) });
        if (genType === 'qr') {
            await fetch(`${API_URL}/update-style/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ color, bg_color: bg }) });
        }
        fetchHistory();
    } catch (err) { console.error(err); }
  };

  // FILTRAGE ICI
  const filteredHistory = history.filter(item => item.type === genType);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col mb-12 gap-6">
        <div className="flex justify-between items-center">
            <h1 className="text-4xl font-black tracking-tighter uppercase">Studio</h1>
            <div className="flex bg-slate-200 p-1.5 rounded-2xl gap-1 font-black text-[10px]">
                <button onClick={() => setGenType('qr')} className={`px-5 py-2.5 rounded-xl transition ${genType === 'qr' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>QR CODES</button>
                <button onClick={() => setGenType('link')} className={`px-5 py-2.5 rounded-xl transition ${genType === 'link' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>LIENS</button>
            </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border">
          <form onSubmit={onGenerate} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-3">
                <input type="url" required placeholder="https://..." className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 outline-none font-bold focus:ring-2 focus:ring-blue-500 transition-all" value={url} onChange={(e) => setUrl(e.target.value)} />
                <button disabled={loading} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2">
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : <><PlusCircle size={18} /> CRÉER {genType.toUpperCase()}</>}
                </button>
            </div>
            {genType === 'qr' && (
                <button type="button" onClick={() => setShowOptions(!showOptions)} className="text-[10px] font-black text-slate-400 hover:text-blue-600 flex items-center gap-1 uppercase tracking-widest"><Palette size={14}/> Personnaliser Design</button>
            )}
            {showOptions && genType === 'qr' && (
                <div className="p-6 bg-slate-50 rounded-[2rem] grid grid-cols-2 md:grid-cols-4 gap-6 animate-in slide-in-from-top-4 border-2 border-dashed">
                    <div className="space-y-1"><label className="text-[10px] font-black text-slate-400">QR</label><input type="color" className="w-full h-10 rounded-xl" value={qrColor} onChange={(e) => setQrColor(e.target.value)} /></div>
                    <div className="space-y-1"><label className="text-[10px] font-black text-slate-400">FOND</label><input type="color" className="w-full h-10 rounded-xl" value={bgColor} onChange={(e) => setBgColor(e.target.value)} /></div>
                    <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-4 border"><QrCode size={32} color={qrColor} style={{backgroundColor: bgColor}}/><p className="text-[8px] font-black mt-2">PREVIEW</p></div>
                </div>
            )}
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHistory.map((item) => (
          <ItemCard 
            key={item.id} 
            item={item} 
            onEdit={handleEdit} 
            onDelete={openDeleteModal} 
            onDownload={(base64, id) => {
              const link = document.createElement("a");
              link.href = base64;
              link.download = `qr-${id}.png`;
              link.click();
            }}
          />
        ))}
      </div>
    </main>
  );
};

// --- APP COMPONENT ---
function App() {
  const [history, setHistory] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/all-qrcodes`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data.reverse() : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const confirmDelete = async () => {
    try { await fetch(`${API_URL}/delete/${deleteId}`, { method: 'DELETE' }); await fetchHistory(); setDeleteId(null); } catch (err) { console.error(err); }
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<DashboardPage history={history} fetchHistory={fetchHistory} openDeleteModal={setDeleteId} />} />
          <Route path="/app" element={<DashboardPage history={history} fetchHistory={fetchHistory} openDeleteModal={setDeleteId} />} />
          <Route path="/analytics" element={<AnalyticsPage history={history} />} />
          <Route path="/stats/:id" element={<div className="p-20">Page Stats...</div>} />
        </Routes>

        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white p-10 rounded-[2.5rem] text-center max-w-sm shadow-2xl animate-in zoom-in">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32}/></div>
              <h3 className="text-xl font-black mb-4">DÉTRUIRE ?</h3>
              <button onClick={confirmDelete} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black mb-2 hover:bg-red-600 transition">CONFIRMER</button>
              <button onClick={() => setDeleteId(null)} className="w-full text-slate-400 font-bold">ANNULER</button>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;