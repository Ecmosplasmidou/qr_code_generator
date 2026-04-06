import React, { useState, useEffect } from 'react';

// Si tu déploies, remplace cette variable par ton URL Render
const API_URL = "http://localhost:5000";

function App() {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (!window.confirm("Supprimer ce QR Code ?")) return;
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
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">QR TRACKER</h1>
          <p className="text-slate-500 font-medium">Générez, gérez et suivez vos scans</p>
        </header>

        {/* Formulaire */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-10">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
            <input 
              type="url" 
              required 
              placeholder="Collez votre lien ici (https://...)"
              className="flex-1 px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none ring-2 ring-transparent focus:ring-blue-500 transition"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition disabled:opacity-50"
            >
              {loading ? "Génération..." : "Générer le QR"}
            </button>
          </form>
        </div>

        {/* Dashboard / Liste */}
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
          <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
          Historique des QR Codes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((qr) => (
            <div key={qr.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex gap-5 items-center transition hover:shadow-md">
              <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100 shrink-0">
                <img src={qr.qrImageUrl} alt="QR" className="w-24 h-24" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate mb-1">{qr.originalUrl}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {qr.scanCount} Scans
                  </span>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => downloadImage(qr.qrImageUrl, qr.id)}
                    className="text-xs font-bold text-slate-400 hover:text-blue-600"
                  >
                    Télécharger
                  </button>
                  <button 
                    onClick={() => handleDelete(qr.id)}
                    className="text-xs font-bold text-slate-400 hover:text-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {history.length === 0 && !loading && (
          <div className="text-center py-20 text-slate-400 font-medium italic">
            Aucun QR code trouvé. Commencez par en générer un !
          </div>
        )}
      </div>
    </div>
  );
}

export default App;