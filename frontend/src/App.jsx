import React, { useState, useEffect } from 'react';

const API_URL = "https://qr-code-generator-python3.onrender.com";

function App() {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/all-qrcodes`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error("Erreur de chargement", err);
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
        setUrl('');
        fetchHistory();
      }
    } catch (err) {
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce QR Code et tout son historique ?")) return;
    try {
      await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });
      fetchHistory();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
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
          <h1 className="text-4xl font-black mb-2 tracking-tight text-blue-600">QR TRACKER PRO</h1>
          <p className="text-slate-500 font-medium">Historique complet des scans par appareil et ville</p>
        </header>

        {/* Formulaire */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-10">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
            <input 
              type="url" required 
              placeholder="Lien à transformer (https://...)"
              className="flex-1 px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none ring-2 ring-transparent focus:ring-blue-500 transition"
              value={url} onChange={(e) => setUrl(e.target.value)}
            />
            <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition shadow-lg shadow-blue-100">
              {loading ? "Génération..." : "Générer"}
            </button>
          </form>
        </div>

        {/* Liste */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((qr) => (
            <div key={qr.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col transition hover:shadow-md">
              <div className="flex gap-4 items-center mb-4">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <img src={qr.qrImageUrl} alt="QR" className="w-16 h-16" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate text-slate-700">{qr.originalUrl}</p>
                  <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {qr.scanCount} Scans
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-slate-50">
                <button onClick={() => setSelectedQR(qr)} className="flex-1 text-xs font-bold bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition">
                  📊 Voir les scans
                </button>
                <button onClick={() => downloadImage(qr.qrImageUrl, qr.id)} className="p-2.5 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
                  💾
                </button>
                <button onClick={() => handleDelete(qr.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Fenêtre Modale d'Historique */}
        {selectedQR && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[2rem] max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0">
                <div>
                  <h3 className="font-black text-xl">Historique détaillé</h3>
                  <p className="text-xs text-slate-400 truncate max-w-[250px]">{selectedQR.originalUrl}</p>
                </div>
                <button onClick={() => setSelectedQR(null)} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200 transition text-slate-600 font-bold">✕</button>
              </div>
              
              <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
                {selectedQR.scans_history && selectedQR.scans_history.length > 0 ? (
                  <div className="space-y-3">
                    {selectedQR.scans_history.slice().reverse().map((scan, i) => (
                      <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800">{scan.date}</p>
                          <div className="flex gap-2">
                             <span className="text-[10px] text-slate-500 flex items-center gap-1">📍 {scan.city}</span>
                             <span className="text-[10px] text-slate-500 flex items-center gap-1">📱 {scan.device}</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-black text-slate-300">#{selectedQR.scans_history.length - i}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-3xl mb-2">🏜️</p>
                    <p className="text-slate-400 text-sm font-medium">Aucun scan pour le moment</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;