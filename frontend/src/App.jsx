import React, { useState, useEffect } from 'react';

const API_URL = "https://qr-code-generator-python3.onrender.com";

function App() {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/all-qrcodes`);
      const serverData = await res.json();
      const serverArray = Array.isArray(serverData) ? serverData : [];
      const localData = JSON.parse(localStorage.getItem('qr_tracker_storage') || '[]');
      const map = new Map();
      [...localData, ...serverArray].forEach(item => map.set(item.id, item));
      const combined = Array.from(map.values()).sort((a, b) => b.id.localeCompare(a.id));
      setHistory(combined);
      localStorage.setItem('qr_tracker_storage', JSON.stringify(combined));
    } catch (err) {
      const localData = JSON.parse(localStorage.getItem('qr_tracker_storage') || '[]');
      setHistory(localData);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (res.ok) {
        const newQR = await res.json();
        const updated = [newQR, ...history];
        setHistory(updated);
        localStorage.setItem('qr_tracker_storage', JSON.stringify(updated));
        setUrl('');
      }
    } catch (err) { alert("Erreur serveur"); } finally { setLoading(false); }
  };

  // --- NOUVELLE FONCTION : MISE À JOUR DU TITRE ---
  const handleUpdateTitle = async (id) => {
    try {
      const res = await fetch(`${API_URL}/update-title/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: tempTitle })
      });
      if (res.ok) {
        const updatedHistory = history.map(item => 
          item.id === id ? { ...item, title: tempTitle } : item
        );
        setHistory(updatedHistory);
        localStorage.setItem('qr_tracker_storage', JSON.stringify(updatedHistory));
        setEditingId(null);
      }
    } catch (err) { alert("Erreur lors de la modification"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce QR Code ?")) return;
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('qr_tracker_storage', JSON.stringify(updated));
    try { await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' }); } catch (err) {}
  };

  const downloadImage = (base64, id) => {
    const link = document.createElement("a");
    link.href = base64;
    link.download = `qr-${id}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-black mb-2 tracking-tight text-blue-600 uppercase">QR Tracker Pro</h1>
          <p className="text-slate-500 font-medium italic">Gestion et statistiques en temps réel</p>
        </header>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-10">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
            <input 
              type="url" required placeholder="Lien (https://...)"
              className="flex-1 px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none ring-2 ring-transparent focus:ring-blue-500 transition"
              value={url} onChange={(e) => setUrl(e.target.value)}
            />
            <button disabled={loading} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold transition shadow-lg shadow-blue-100 disabled:opacity-50">
              {loading ? "Création..." : "Générer"}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((qr) => (
            <div key={qr.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col transition hover:shadow-md">
              <div className="flex gap-4 items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                  <img src={qr.qrImageUrl} alt="QR" className="w-16 h-16" />
                </div>
                <div className="min-w-0 flex-1">
                  {editingId === qr.id ? (
                    <div className="flex gap-2 mb-1">
                      <input 
                        className="text-sm font-bold bg-slate-50 border rounded px-2 py-1 w-full outline-none focus:ring-1 focus:ring-blue-500"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => handleUpdateTitle(qr.id)} className="text-green-600 text-xs font-bold">OK</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <p className="text-sm font-bold truncate text-slate-700">
                        {qr.title || qr.originalUrl}
                      </p>
                      <button 
                        onClick={() => { setEditingId(qr.id); setTempTitle(qr.title || qr.originalUrl); }}
                        className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-blue-500"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 truncate mb-2">{qr.originalUrl}</p>
                  <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {qr.scanCount || 0} Scans
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-slate-50">
                <button onClick={() => setSelectedQR(qr)} className="flex-1 text-xs font-bold bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition">
                  Détails
                </button>
                <button onClick={() => downloadImage(qr.qrImageUrl, qr.id)} className="px-4 bg-green-500 text-white font-bold rounded-xl text-xs">
                  SAVE
                </button>
                <button onClick={() => handleDelete(qr.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal d'historique (identique) */}
        {selectedQR && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[2rem] max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-black text-xl">Statistiques</h3>
                  <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{selectedQR.title || selectedQR.originalUrl}</p>
                </div>
                <button onClick={() => setSelectedQR(null)} className="w-8 h-8 bg-slate-100 rounded-full font-bold">✕</button>
              </div>
              <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
                {selectedQR.scans_history?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedQR.scans_history.slice().reverse().map((scan, i) => (
                      <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{scan.date}</p>
                          <p className="text-[10px] text-slate-500">📍 {scan.city} • 📱 {scan.device}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-center py-10 text-slate-400 text-sm">Aucun scan.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;