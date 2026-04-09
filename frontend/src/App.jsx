import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { 
  QrCode, BarChart3, Download, Trash2, X, MapPin, Smartphone, 
  ArrowLeft, PlusCircle, LayoutDashboard, TrendingUp, Link as LinkIcon, 
  Palette, RefreshCw, Settings2, AlertTriangle, Rocket, Zap, 
  Image as ImageIcon, Layers, Eye, ChevronDown, Copy, CheckCircle2
} from 'lucide-react';
import { HexColorPicker } from "react-colorful";
import QRCodeStyling from "qr-code-styling";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const API_URL = "https://qr-code-generator-python3.onrender.com";

// --- CONFIG DESIGNS ---
const SHAPES = [
  { id: 'square', name: 'Carré', type: 'square' },
  { id: 'soft', name: 'Doux', type: 'extra-rounded' },
  { id: 'round', name: 'Rond', type: 'dots' },
  { id: 'classy', name: 'Classy', type: 'classy' }
];

const EYE_SHAPES = [
  { id: 'square', name: 'Carré', type: 'square' },
  { id: 'extra-rounded', name: 'Arrondi', type: 'extra-rounded' }
];

// --- COMPOSANT QR VISUAL RÉPARÉ ---
const QRVisual = ({ options, size = 200 }) => {
  const containerRef = useRef(null);
  const qrCodeInstance = useRef(null);

  useEffect(() => {
    qrCodeInstance.current = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: options.url || "https://qrlyze.io",
      dotsOptions: { color: options.color || "#000000", type: options.dotType || "square" },
      backgroundOptions: { color: options.bgColor || "#ffffff" },
      cornersSquareOptions: { color: options.color || "#000000", type: options.eyeType || "square" },
      imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: options.logoSize || 0.4 }
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = ""; 
      qrCodeInstance.current.append(containerRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.update({
        data: options.url,
        dotsOptions: { color: options.color, type: options.dotType },
        backgroundOptions: { color: options.bgColor },
        cornersSquareOptions: { color: options.color, type: options.eyeType },
        cornersDotOptions: { color: options.color, type: options.eyeType },
        image: options.logo || "",
        imageOptions: { imageSize: options.logoSize || 0.4 }
      });
    }
  }, [options]);

  return <div ref={containerRef} className="flex justify-center items-center rounded-2xl bg-white p-2" />;
};

const CustomPicker = ({ label, color, onChange }) => {
  const [show, setShow] = useState(false);
  const popover = useRef();
  useEffect(() => {
    const close = (e) => { if (popover.current && !popover.current.contains(e.target)) setShow(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative flex-1" ref={popover}>
      <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block tracking-widest">{label}</label>
      <button type="button" onClick={() => setShow(!show)} className="w-full flex items-center justify-between p-3 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:border-blue-400 transition-all">
        <div className="w-5 h-5 rounded-full border shadow-sm" style={{ backgroundColor: color }} />
        <span className="text-[10px] font-mono font-black uppercase text-slate-600">{color}</span>
      </button>
      {show && (
        <div className="absolute z-[100] mt-2 p-4 bg-white rounded-3xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

// --- NAVIGATION AGRANDIE & RESPONSIVE ---
const Navbar = () => (
  <header className="bg-white border-b sticky top-0 z-50 px-4 md:px-8 h-20 md:h-24 flex items-center justify-between shadow-sm backdrop-blur-md bg-white/90">
    <Link to="/" className="flex items-center gap-2 md:gap-3 group">
      <div className="bg-blue-600 p-1.5 md:p-2 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
        <QrCode size={24} className="md:w-8 md:h-8"/>
      </div>
      <span className="font-black text-xl md:text-3xl text-slate-900 uppercase italic tracking-tighter">QRLYZE</span>
    </Link>
    <nav className="flex items-center gap-2 md:gap-6">
      <Link to="/app" className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-xs md:text-sm font-black text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-widest">
        <LayoutDashboard size={18}/><span className="hidden md:inline">Dashboard</span>
      </Link>
      <Link to="/analytics" className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-xs md:text-sm font-black text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-widest">
        <TrendingUp size={18}/><span className="hidden md:inline">Analytics</span>
      </Link>
    </nav>
  </header>
);

const Footer = () => (
  <footer className="bg-slate-900 text-white py-16 mt-auto">
    <div className="max-w-6xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
      <div>
        <div className="font-black text-3xl italic uppercase text-blue-500 tracking-tighter mb-2">QRLYZE</div>
        <p className="text-slate-500 text-sm font-medium">L'intelligence derrière chaque visite.</p>
      </div>
      <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">© 2026 QRLYZE AI - ALL RIGHTS RESERVED</p>
    </div>
  </footer>
);

// --- PAGES ---
const DashboardPage = ({ history, fetchHistory, openDeleteModal }) => {
  const [genType, setGenType] = useState('qr');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [dotType, setDotType] = useState('extra-rounded');
  const [eyeType, setEyeType] = useState('square');
  const [logoSize, setLogoSize] = useState(0.4);
  const [logo, setLogo] = useState(null);

  const onGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type: genType, color: qrColor, bg_color: bgColor, design: dotType, eye_design: eyeType, logo_size: logoSize })
      });
      if (res.ok) { await fetchHistory(); setUrl(''); setLogo(null); setShowOptions(false); }
    } catch (err) { alert("Erreur réseau"); } finally { setLoading(false); }
  };

  const handleLogo = (e) => {
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result);
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const filteredHistory = history.filter(item => (item.type || 'qr') === genType);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900">Le studio</h1>
        <div className="flex bg-slate-200 p-1.5 rounded-2xl gap-1 shadow-inner">
            <button onClick={() => setGenType('qr')} className={`px-10 py-3 rounded-xl text-[10px] font-black transition-all ${genType === 'qr' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>QR CODE</button>
            <button onClick={() => setGenType('link')} className={`px-10 py-3 rounded-xl text-[10px] font-black transition-all ${genType === 'link' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>SUIVI LIEN</button>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border-t-[12px] border-blue-600 mb-16">
        <form onSubmit={onGenerate} className="space-y-12">
          <div className="flex flex-col md:flex-row gap-4">
            <input type="url" required placeholder="Saisir l'adresse de destination..." className="flex-1 px-8 py-5 rounded-[2rem] bg-slate-50 outline-none font-black text-base border-2 border-transparent focus:border-blue-500 transition-all shadow-inner" value={url} onChange={(e) => setUrl(e.target.value)} />
            <button disabled={loading || !url} className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3">
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <><PlusCircle size={24} /> GÉNÉRER</>}
            </button>
          </div>

          {genType === 'qr' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-2">
               <div className="flex flex-wrap gap-6 border-b border-slate-100 pb-8">
                  <button type="button" onClick={() => setShowOptions(!showOptions)} className={`flex items-center gap-2 text-xs font-black uppercase px-6 py-3 rounded-2xl transition-all ${showOptions ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 text-blue-600'}`}><Palette size={18}/> Design</button>
                  <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase cursor-pointer hover:text-blue-600"><ImageIcon size={18}/> {logo ? "Logo OK" : "Ajouter Logo"}<input type="file" hidden accept="image/*" onChange={handleLogo}/></label>
               </div>
               {showOptions && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-slate-50/50 p-10 rounded-[3.5rem] border-2 border-dashed border-slate-200">
                     <div className="lg:col-span-4 space-y-8">
                        <CustomPicker label="Couleur QR" color={qrColor} onChange={setQrColor} />
                        <CustomPicker label="Couleur Fond" color={bgColor} onChange={setBgColor} />
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-400">Taille Logo</label>
                          <input type="range" min="0.1" max="0.5" step="0.05" value={logoSize} onChange={e => setLogoSize(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        </div>
                     </div>
                     <div className="lg:col-span-5 space-y-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Layers size={14}/> Style Modules</label>
                          <div className="grid grid-cols-2 gap-3">
                            {SHAPES.map(s => <button key={s.id} type="button" onClick={() => setDotType(s.type)} className={`py-3 rounded-xl border-2 transition-all ${dotType === s.type ? 'border-blue-600 bg-white shadow-md text-blue-600' : 'bg-white/50 text-slate-400'}`}>{s.name}</button>)}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Eye size={14}/> Style Yeux</label>
                          <div className="grid grid-cols-2 gap-3">
                            {EYE_SHAPES.map(e => <button key={e.id} type="button" onClick={() => setEyeType(e.type)} className={`py-3 rounded-xl border-2 transition-all ${eyeType === e.type ? 'border-blue-600 bg-white shadow-md text-blue-600' : 'bg-white/50 text-slate-400'}`}>{e.name}</button>)}
                          </div>
                        </div>
                     </div>
                     <div className="lg:col-span-3 flex flex-col items-center justify-center bg-white p-8 rounded-[3rem] shadow-xl border relative">
                        <div className="absolute top-5 left-5 bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black shadow-lg animate-pulse">PREVIEW</div>
                        <QRVisual options={{ url, color: qrColor, bgColor: bgColor, dotType, eyeType, logo, logoSize }} size={160} />
                        <p className="text-[9px] font-black mt-6 text-blue-600 uppercase tracking-widest">Live Editor</p>
                     </div>
                  </div>
               )}
            </div>
          )}
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {filteredHistory.map(item => <ItemCard key={item.id} item={item} openDeleteModal={openDeleteModal} fetchHistory={fetchHistory} />)}
      </div>
    </main>
  );
};

const ItemCard = ({ item, openDeleteModal, fetchHistory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tTitle, setTTitle] = useState(item.title);
  const [tUrl, setTUrl] = useState(item.originalUrl);
  const [tColor, setTColor] = useState(item.color || "#000000");
  const [tBg, setTBg] = useState(item.bg_color || "#ffffff");
  
  const trackingUrl = `${API_URL}/r/${item.id}`;

  const onSave = async () => {
    await fetch(`${API_URL}/update-title/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: tTitle }) });
    await fetch(`${API_URL}/update-url/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: tUrl }) });
    await fetch(`${API_URL}/update-style/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ color: tColor, bg_color: tBg, design: item.design, eye_design: item.eye_design }) });
    fetchHistory();
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingUrl);
    alert("Lien de visite copié !");
  };

  return (
    <div className="bg-white p-6 rounded-[3rem] border-2 border-transparent hover:border-blue-100 shadow-lg flex flex-col transition-all duration-500 hover:-translate-y-2 group">
      <div className="flex justify-center mb-6 p-8 rounded-[2.5rem] bg-slate-50 relative overflow-hidden h-64 items-center shadow-inner transition-colors" style={{ backgroundColor: item.bg_color }}>
        <div className="absolute top-5 left-5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-xl border-b-4 border-blue-800 z-10">
          <TrendingUp size={12} className="inline mr-1"/> {item.scanCount} VISITES
        </div>
        {item.type === 'link' ? 
           <div className="w-32 h-32 flex items-center justify-center text-blue-600"><LinkIcon size={72} strokeWidth={2.5}/></div> :
           <QRVisual options={{ url: trackingUrl, color: item.color, bgColor: item.bg_color, dotType: item.design, eyeType: item.eye_design }} size={160} id={item.id} />
        }
        <button onClick={() => setIsEditing(!isEditing)} className="absolute top-5 right-5 bg-white/90 p-3 rounded-2xl shadow-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-90 border border-slate-100 z-10">
          <Settings2 size={22}/>
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4 animate-in zoom-in-95 duration-200 p-2">
          <input className="w-full bg-slate-50 rounded-2xl px-5 py-3 text-xs font-black outline-none focus:ring-2 focus:ring-blue-500" value={tTitle} onChange={e => setTTitle(e.target.value)} />
          {item.type !== 'link' && (
            <div className="grid grid-cols-2 gap-3">
                <CustomPicker label="Couleur QR" color={tColor} onChange={setTColor}/>
                <CustomPicker label="Fond" color={tBg} onChange={setTBg}/>
            </div>
          )}
          <button onClick={onSave} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg hover:bg-blue-700 transition">Appliquer</button>
        </div>
      ) : (
        <div className="text-center flex flex-col flex-1 px-2">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight truncate">{item.title}</h2>
          
          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 relative group/copy">
            <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Lien de visite à diffuser :</p>
            <p className="text-[10px] font-mono text-blue-600 truncate">{trackingUrl}</p>
            <button onClick={handleCopy} className="mt-2 w-full flex items-center justify-center gap-2 bg-white py-2 rounded-xl border text-[9px] font-black uppercase text-slate-600 hover:bg-blue-600 hover:text-white transition-all"><Copy size={12}/> Copier le lien</button>
          </div>

          <div className="flex gap-2 pt-8">
            <Link to={`/stats/${item.id}`} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 uppercase hover:bg-blue-600 transition shadow-lg"><BarChart3 size={16}/> Analyse</Link>
            <button onClick={() => openDeleteModal(item.id)} className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition shadow-sm border border-red-100"><Trash2 size={20}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- ANALYTICS PAGE (SYNCHRONISÉE) ---
const AnalyticsPage = ({ history }) => {
  const totalScans = history.reduce((acc, curr) => acc + (curr.scanCount || 0), 0);
  const qrData = history.filter(i => (i.type || 'qr') === 'qr');
  const linkData = history.filter(i => i.type === 'link');

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900">Performance</h1>
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl flex items-center gap-8 border-b-8 border-blue-800">
           <TrendingUp size={32}/>
           <div><p className="text-[10px] font-black uppercase opacity-70">Visites Totales</p><h2 className="text-5xl font-black leading-none">{totalScans}</h2></div>
        </div>
      </div>
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border shadow-sm h-[400px]">
        <Line 
          data={{
            labels: history.slice(0, 10).reverse().map(i => i.title?.substring(0, 10)),
            datasets: [{ label: 'Visites', data: history.slice(0, 10).reverse().map(i => i.scanCount), borderColor: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.05)', fill: true, tension: 0.4 }]
          }} 
          options={{ maintainAspectRatio: false }} 
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
          <h2 className="font-black text-xl mb-6 text-blue-600 uppercase flex items-center gap-2"><QrCode/> QR Codes</h2>
          {qrData.map(q => (
            <div key={q.id} className="flex justify-between items-center p-4 rounded-2xl mb-2" style={{backgroundColor: q.rowColor}}><span className="font-black text-xs uppercase truncate pr-2">{q.title}</span><span className="bg-white px-3 py-1 rounded-full text-[10px] font-black border">{q.scanCount} Visites</span></div>
          ))}
        </div>
        <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
          <h2 className="font-black text-xl mb-6 text-indigo-600 uppercase flex items-center gap-2"><LinkIcon/> Liens</h2>
          {linkData.map(l => (
            <div key={l.id} className="flex justify-between items-center p-4 rounded-2xl mb-2" style={{backgroundColor: l.rowColor}}><span className="font-black text-xs uppercase truncate pr-2">{l.title}</span><span className="bg-white px-3 py-1 rounded-full text-[10px] font-black border">{l.scanCount} Visites</span></div>
          ))}
        </div>
      </div>
    </main>
  );
};

// --- STATS PAGE ---
const StatsPage = ({ history }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = history.find(i => i.id === id);
  if (!item) return <div className="p-20 text-center font-black animate-pulse text-slate-400 uppercase tracking-widest">Chargement des données...</div>;

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase transition-colors"><ArrowLeft size={16}/> Retour Studio</button>
      <div className="bg-white rounded-[3rem] border-2 shadow-2xl overflow-hidden">
        <div className="p-10 md:p-14 border-b flex flex-col md:flex-row items-center gap-12 bg-slate-50/50">
          <div className="p-8 rounded-[3rem] bg-white border-2 shadow-inner">
            {item.type === 'link' ? <LinkIcon size={80} className="text-blue-600 m-10"/> : <QRVisual options={{ url: `${API_URL}/r/${item.id}`, color: item.color, bgColor: item.bg_color, dotType: item.design, eyeType: item.eye_design }} size={160} id={item.id} />}
          </div>
          <div className="flex-1 text-center md:text-left space-y-5">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-tight break-all truncate">{item.title}</h2>
            <p className="text-sm font-mono text-slate-400 break-all">{item.originalUrl}</p>
            <div className="bg-blue-600 text-white inline-block px-10 py-4 rounded-[1.5rem] font-black text-xl shadow-xl border-b-4 border-blue-800">{item.scanCount} VISITES RÉELLES</div>
          </div>
        </div>
        <div className="p-10 md:p-14">
          <h3 className="font-black text-2xl mb-10 uppercase flex items-center gap-3 tracking-tighter"><Zap size={28} className="text-blue-600"/> Historique récent</h3>
          <div className="space-y-4">
            {item.scans_history?.length > 0 ? [...item.scans_history].reverse().map((scan, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-7 rounded-[2rem] bg-slate-50 border hover:bg-white transition-all group shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md text-blue-600 group-hover:scale-110 transition-transform"><Smartphone size={24}/></div>
                  <div className="text-center sm:text-left space-y-0.5"><p className="font-black text-base uppercase text-slate-800">{scan.device}</p><p className="text-[11px] text-slate-400 flex items-center gap-1.5 uppercase font-bold justify-center sm:justify-start"><MapPin size={12} className="text-red-500"/> {scan.city}</p></div>
                </div>
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-4 sm:mt-0">{scan.date}</div>
              </div>
            )) : <p className="text-center text-slate-300 py-16 font-bold uppercase tracking-widest text-lg opacity-50 italic">Aucune visite enregistrée.</p>}
          </div>
        </div>
      </div>
    </main>
  );
};

// --- APP ROOT ---
function App() {
  const [history, setHistory] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/all-qrcodes`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data.reverse() : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<DashboardPage history={history} fetchHistory={fetchHistory} openDeleteModal={setDeleteId}/>} />
          <Route path="/analytics" element={<AnalyticsPage history={history}/>} />
          <Route path="/stats/:id" element={<StatsPage history={history}/>} />
        </Routes>
        <Footer />
        
        {deleteId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-md px-4">
            <div className="bg-white p-12 rounded-[4rem] text-center max-w-sm shadow-2xl animate-in zoom-in">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce"><AlertTriangle size={48}/></div>
              <h3 className="text-3xl font-black uppercase mb-3 tracking-tighter">Supprimer ?</h3>
              <p className="text-slate-400 text-sm font-bold mb-10 leading-relaxed">Action irréversible.</p>
              <div className="flex flex-col gap-3">
                <button onClick={async () => { await fetch(`${API_URL}/delete/${deleteId}`, { method: 'DELETE' }); fetchHistory(); setDeleteId(null); }} className="bg-red-50 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs shadow-xl shadow-red-100 hover:bg-red-600 transition-all">Supprimer</button>
                <button onClick={() => setDeleteId(null)} className="text-slate-400 font-black uppercase text-[11px] py-4">Annuler</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;