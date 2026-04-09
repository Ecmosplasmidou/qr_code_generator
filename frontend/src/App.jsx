import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { 
  QrCode, BarChart3, Download, Trash2, Edit2, Check, X, MapPin, Smartphone, 
  Calendar, ArrowLeft, PlusCircle, LayoutDashboard, TrendingUp, Link as LinkIcon, 
  Palette, RefreshCw, Save, Settings2, AlertTriangle, Rocket, Zap, MousePointerClick,
  Image as ImageIcon, Square, Circle, Layout, Github, Twitter, Globe
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = "https://qr-code-generator-python3.onrender.com";

// --- CONFIGURATION DESIGN ---
const FRAMES = [
  { id: 'none', name: 'Sans cadre', class: '' },
  { id: 'minimal', name: 'Minimal', class: 'p-4 border-4 border-blue-600' },
  { id: 'chat', name: 'Bulle', class: 'p-4 border-4 border-slate-900 rounded-tr-[3rem]' },
  { id: 'badge', name: 'Badge', class: 'p-4 outline-double outline-4 outline-offset-4 outline-blue-600' }
];

const SHAPES = [
  { id: 'square', name: 'Carré', radius: '0%' },
  { id: 'soft', name: 'Doux', radius: '15%' },
  { id: 'round', name: 'Rond', radius: '50%' }
];

// --- COMPOSANT D'AFFICHAGE QR AVEC LOGO ET CADRE ---
const QRDisplay = ({ src, color, bgColor, design, frame, logo, size = "w-32 h-32" }) => {
  const frameStyle = FRAMES.find(f => f.id === frame) || FRAMES[0];
  const shapeRadius = SHAPES.find(s => s.id === design)?.radius || '0%';

  return (
    <div className={`relative inline-block transition-all duration-300 ${frameStyle.class}`} style={{ backgroundColor: bgColor }}>
      <img 
        src={src} 
        alt="QR" 
        className={`${size} relative z-10`} 
        style={{ borderRadius: shapeRadius }} 
      />
      {logo && (
        <div className="absolute inset-0 m-auto w-1/4 h-1/4 z-20 bg-white p-1 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
          <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
};

// --- LANDING PAGE ---
const LandingPage = () => (
  <div className="bg-white min-h-screen">
    <nav className="h-20 flex items-center justify-between max-w-6xl mx-auto px-6 font-black uppercase italic">
      <div className="flex items-center gap-2 text-2xl text-blue-600 tracking-tighter"><QrCode size={28}/> QRLYZE</div>
      <Link to="/app" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl">Ouvrir l'App</Link>
    </nav>
    <main className="max-w-6xl mx-auto px-6 py-20 text-center space-y-12">
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest"><Rocket size={14}/> Créez le futur de votre marketing</div>
      <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">QR Codes <br/><span className="text-blue-600 italic">Hyper-Design.</span></h1>
      <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Cadres, formes, logos et couleurs. Transformez vos liens en outils de conversion magnifiques avec tracking temps réel.</p>
      <div className="flex justify-center gap-4">
        <Link to="/app" className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 hover:scale-105 transition">C'est parti</Link>
      </div>
    </main>
    <Footer />
  </div>
);

// --- COMPOSANT DASHBOARD ---
const DashboardPage = ({ history, fetchHistory, openDeleteModal }) => {
  const [genType, setGenType] = useState('qr');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  // Design states
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [design, setDesign] = useState('square');
  const [frame, setFrame] = useState('none');
  const [logo, setLogo] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type: genType, color: qrColor, bg_color: bgColor, design, frame })
      });
      if (res.ok) { await fetchHistory(); setUrl(''); setShowOptions(false); setLogo(null); }
    } catch (err) { alert("Erreur"); } finally { setLoading(false); }
  };

  const filteredHistory = history.filter(item => (item.type || 'qr') === genType);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col mb-12 gap-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Studio de création</h1>
            <div className="flex bg-slate-200 p-1.5 rounded-2xl gap-1">
                <button onClick={() => setGenType('qr')} className={`px-5 py-2 rounded-xl text-[10px] font-black transition ${genType === 'qr' ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>QR CODE</button>
                <button onClick={() => setGenType('link')} className={`px-5 py-2 rounded-xl text-[10px] font-black transition ${genType === 'link' ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>LIEN SIMPLE</button>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <form onSubmit={onGenerate} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-3">
              <input type="url" required placeholder="Collez votre lien ici..." className="flex-1 px-8 py-5 rounded-[1.5rem] bg-slate-50 outline-none font-black text-sm focus:ring-4 ring-blue-50 transition-all" value={url} onChange={(e) => setUrl(e.target.value)} />
              <button disabled={loading || !url} className="bg-blue-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-sm hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2">
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <><PlusCircle size={20}/> Générer</>}
              </button>
            </div>

            {genType === 'qr' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-8 border-b pb-4">
                    <button type="button" onClick={() => setShowOptions(!showOptions)} className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest"><Palette size={16}/> Configurer le design</button>
                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-blue-600">
                      <ImageIcon size={16}/> {logo ? "Logo ajouté" : "Ajouter un logo"}
                      <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                    </label>
                </div>

                {showOptions && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 bg-slate-50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-400">Couleurs</label>
                      <div className="flex gap-4">
                        <input type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} className="w-12 h-12 rounded-xl" />
                        <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-12 h-12 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-400">Forme & Cadre</label>
                      <div className="flex flex-wrap gap-2">
                        {SHAPES.map(s => (
                          <button key={s.id} type="button" onClick={() => setDesign(s.id)} className={`p-2 rounded-lg border-2 ${design === s.id ? 'border-blue-600 bg-blue-50' : 'bg-white'}`}><Square size={16}/></button>
                        ))}
                        <div className="w-[2px] h-6 bg-slate-200 mx-2" />
                        {FRAMES.map(f => (
                          <button key={f.id} type="button" onClick={() => setFrame(f.id)} className={`px-3 py-1 rounded-lg text-[10px] font-black border-2 ${frame === f.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'bg-white text-slate-400'}`}>{f.name}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white rounded-[2rem] border p-4 shadow-inner">
                      <QRDisplay src="/qr-placeholder.png" color={qrColor} bgColor={bgColor} design={design} frame={frame} logo={logo} size="w-24 h-24" />
                      <p className="text-[8px] font-black mt-3 text-slate-300 uppercase tracking-widest">Aperçu direct</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHistory.map((item) => (
          <ItemCard key={item.id} item={item} openDeleteModal={openDeleteModal} fetchHistory={fetchHistory} />
        ))}
      </div>
    </main>
  );
};

// --- COMPOSANT ITEM CARD ---
const ItemCard = ({ item, openDeleteModal, fetchHistory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tTitle, setTTitle] = useState(item.title);
  const [tUrl, setTUrl] = useState(item.originalUrl);
  const [tColor, setTColor] = useState(item.color);
  const [tBg, setTBg] = useState(item.bg_color);
  const [tDesign, setTDesign] = useState(item.design || 'square');
  const [tFrame, setTFrame] = useState(item.frame || 'none');

  const onSave = async () => {
    await fetch(`${API_URL}/update-title/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: tTitle }) });
    await fetch(`${API_URL}/update-url/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: tUrl }) });
    await fetch(`${API_URL}/update-style/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ color: tColor, bg_color: tBg, design: tDesign, frame: tFrame }) });
    fetchHistory();
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative group flex flex-col h-full">
      <div className="absolute top-4 left-4 z-20 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">{item.scanCount} CLICS</div>
      
      <div className="flex justify-center mb-6 p-6 rounded-[2rem] bg-slate-50 relative overflow-hidden h-48 items-center" style={{ backgroundColor: item.bg_color }}>
        {item.type === 'qr' ? (
          <QRDisplay src={item.qrImageUrl} color={item.color} bgColor={item.bg_color} design={item.design} frame={item.frame} logo={null} />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center text-blue-600"><LinkIcon size={48} /></div>
        )}
        <button onClick={() => setIsEditing(!isEditing)} className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm text-slate-600 hover:text-blue-600"><Settings2 size={16}/></button>
      </div>

      {isEditing ? (
        <div className="space-y-4 animate-in zoom-in duration-200">
          <input className="w-full bg-slate-100 rounded-xl px-4 py-2 text-xs font-bold" value={tTitle} onChange={e => setTTitle(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input type="color" value={tColor} onChange={e => setTColor(e.target.value)} className="w-full h-8 rounded-lg" />
            <input type="color" value={tBg} onChange={e => setTBg(e.target.value)} className="w-full h-8 rounded-lg" />
          </div>
          <div className="flex gap-2">
             <button onClick={() => setTDesign('round')} className={`p-2 rounded-lg border-2 ${tDesign === 'round' ? 'border-blue-600' : ''}`}><Circle size={14}/></button>
             <button onClick={() => setTDesign('square')} className={`p-2 rounded-lg border-2 ${tDesign === 'square' ? 'border-blue-600' : ''}`}><Square size={14}/></button>
             <select value={tFrame} onChange={e => setTFrame(e.target.value)} className="text-[10px] font-black border rounded-lg p-1 flex-1">
                {FRAMES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
             </select>
          </div>
          <button onClick={onSave} className="w-full bg-blue-600 text-white py-2 rounded-xl text-[10px] font-black uppercase">Enregistrer</button>
        </div>
      ) : (
        <div className="text-center flex flex-col flex-1">
          <h3 className="font-black text-slate-800 truncate uppercase text-lg mb-1">{item.title}</h3>
          <p className="text-[10px] text-slate-400 truncate mb-auto font-mono">{item.originalUrl}</p>
          <div className="flex gap-2 mt-6">
            <Link to={`/stats/${item.id}`} className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition shadow-md"><BarChart3 size={14}/> ANALYSER</Link>
            <button onClick={() => openDeleteModal(item.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition"><Trash2 size={18}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- PAGES ANALYTICS ---
const AnalyticsPage = ({ history }) => {
  const qrData = history.filter(i => (i.type || 'qr') === 'qr');
  const linkData = history.filter(i => i.type === 'link');
  
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-black mb-10 tracking-tighter uppercase italic">Insights Global</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm">
          <h2 className="font-black text-xl mb-6 text-blue-600 uppercase">Top 5 QR Codes</h2>
          <div className="space-y-4">
            {qrData.sort((a,b) => b.scanCount - a.scanCount).slice(0,5).map(q => (
              <div key={q.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50" style={{backgroundColor: q.rowColor}}>
                <span className="font-black text-xs uppercase">{q.title}</span>
                <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black border">{q.scanCount} SCANS</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm">
          <h2 className="font-black text-xl mb-6 text-indigo-600 uppercase">Top 5 Liens</h2>
          <div className="space-y-4">
            {linkData.sort((a,b) => b.scanCount - a.scanCount).slice(0,5).map(l => (
              <div key={l.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50" style={{backgroundColor: l.rowColor}}>
                <span className="font-black text-xs uppercase">{l.title}</span>
                <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black border">{l.scanCount} CLICS</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

// --- FOOTER ---
const Footer = () => (
  <footer className="bg-slate-900 text-white py-20 mt-20">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-2 space-y-6">
        <div className="font-black text-3xl tracking-tighter italic"><QrCode className="inline mr-2 text-blue-500" /> QRLYZE</div>
        <p className="text-slate-400 font-medium max-w-sm">Simplifiez votre marketing numérique. Une seule plateforme pour vos QR codes personnalisés et vos liens de suivi intelligents.</p>
      </div>
      <div>
        <h4 className="font-black text-xs uppercase tracking-widest text-slate-500 mb-6">Navigation</h4>
        <ul className="space-y-4 font-bold text-sm">
          <li><Link to="/app" className="hover:text-blue-400">Dashboard</Link></li>
          <li><Link to="/analytics" className="hover:text-blue-400">Analytics</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-black text-xs uppercase tracking-widest text-slate-500 mb-6">Social</h4>
        <div className="flex gap-4">
          <Twitter className="cursor-pointer hover:text-blue-400" />
          <Github className="cursor-pointer hover:text-blue-400" />
        </div>
      </div>
    </div>
  </footer>
);

// --- COMPOSANT RACINE ---
function App() {
  const [history, setHistory] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const fetchHistory = async () => {
    const res = await fetch(`${API_URL}/all-qrcodes`);
    const data = await res.json();
    setHistory(data.reverse());
  };

  useEffect(() => { fetchHistory(); }, []);

  const confirmDelete = async () => {
    await fetch(`${API_URL}/delete/${deleteId}`, { method: 'DELETE' });
    fetchHistory();
    setDeleteId(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<><Navbar /><DashboardPage history={history} fetchHistory={fetchHistory} openDeleteModal={setDeleteId} /><Footer /></>} />
          <Route path="/analytics" element={<><Navbar /><AnalyticsPage history={history} /><Footer /></>} />
          <Route path="/stats/:id" element={<><Navbar /><div className="p-20 text-center font-black">Stats Page Active...</div><Footer /></>} />
        </Routes>
        
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white p-12 rounded-[3rem] text-center max-w-sm shadow-2xl">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce"><AlertTriangle size={40}/></div>
              <h3 className="text-2xl font-black uppercase mb-2">Supprimer ?</h3>
              <p className="text-slate-400 text-sm font-bold mb-8">Action irréversible.</p>
              <div className="flex flex-col gap-2">
                <button onClick={confirmDelete} className="bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-100">Confirmer</button>
                <button onClick={() => setDeleteId(null)} className="text-slate-400 font-black uppercase text-[10px] py-4">Annuler</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;