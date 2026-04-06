import React, { useState, useEffect } from 'react';

// URL de ton backend déployé sur Render
const API_URL = "https://qr-code-generator-python3.onrender.com";

function App() {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger la liste complète des QR Codes depuis le serveur
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/all-qrcodes`);
      const data = await res.json();
      // On inverse la liste pour avoir les plus récents en haut
      setHistory(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error("Erreur de chargement", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    // Optionnel : rafraîchir toutes les 30 secondes pour voir les scans en direct
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
        fetchHistory(); // Rafraîchir la liste après génération
      }
    } catch (err) {
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce QR Code et ses statistiques ?")) return;
    try {
      const res = await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchHistory();
      }
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
          <h1 className="text-4xl font-black mb-2 tracking-tight">QR TRACKER PRO</h1>
          <p className="text-slate-500 font-medium italic">Analysez la provenance de vos scans en temps réel</p>
        </header>

        {/* Formulaire de génération */}
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              {loading ? "Génération..." : "Générer le QR"}
            </button>
          </form>
        </div>

        {/* Dashboard / Liste des QR Codes */}
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          Tableau de bord
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((qr) => (
            <div key={qr.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex gap-5 items-start transition hover:shadow-md">
              {/* Image du QR */}
              <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100 shrink-0">
                <img src={qr.qrImageUrl} alt="QR Code" className="w-24 h-24" />
              </div>
              
              <div className="flex-1 min-w-0">
                {/* URL cible */}
                <p className="text-sm font-bold text-slate-900 truncate mb-2" title={qr.originalUrl}>
                  {qr.originalUrl}
                </p>
                
                {/* Stats principales */}
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider w-fit bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {qr.scanCount} Scans totaux
                  </span>
                  
                  {/* Détails du dernier scan (si existant) */}
                  {qr.last_scan ? (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-400 uppercase text-[9px] mb-1">Dernière activité</p>
                      <p>📍 <b>Ville :</b> {qr.last_scan.city}</p>
                      <p>📱 <b>Appareil :</b> {qr.last_scan.device}</p>
                      <p>📅 <b>Le :</b> {qr.last_scan.date}</p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">Aucun scan enregistré</p>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex gap-4 pt-2 border-t border-slate-50">
                  <button 
                    onClick={() => downloadImage(qr.qrImageUrl, qr.id)}
                    className="text-xs font-bold text-slate-400 hover:text-blue-600 transition"
                  >
                    Télécharger
                  </button>
                  <button 
                    onClick={() => handleDelete(qr.id)}
                    className="text-xs font-bold text-slate-400 hover:text-red-600 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si historique vide */}
        {history.length === 0 && !loading && (
          <div className="text-center py-20 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-medium">
            Aucun QR code trouvé. Lancez votre première campagne !
          </div>
        )}
      </div>
    </div>
  );
}

export default App;