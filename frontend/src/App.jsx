import React, { useState, useEffect } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger l'historique au démarrage et après chaque génération
  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:5000/all-qrcodes');
      const data = await res.json();
      setHistory(data.reverse()); // Les plus récents en premier
    } catch (err) {
      console.error("Erreur chargement historique", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (res.ok) {
        setUrl('');
        fetchHistory(); // Rafraîchir la liste
      }
    } catch (err) {
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (qrImageUrl, id) => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `qrcode-${id}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-2">QR Tracker Pro</h1>
          <p className="text-slate-600">Gérez et suivez vos QR codes en un clin d'œil.</p>
        </header>

        {/* Formulaire de génération */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-12">
          <form onSubmit={handleGenerate} className="flex gap-4">
            <input 
              type="url" 
              required 
              placeholder="Entrez votre URL (ex: https://google.com)"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition disabled:opacity-50"
            >
              {loading ? "..." : "Générer"}
            </button>
          </form>
        </div>

        {/* Section Historique / Dashboard */}
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Mes QR Codes ({history.length})</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {history.map((qr) => (
            <div key={qr.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex gap-5 items-center">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <img src={qr.qrImageUrl} alt="QR" className="w-24 h-24" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-blue-600 truncate mb-1">{qr.originalUrl}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                    {qr.scanCount} scans
                  </span>
                  <span className="text-xs text-slate-400">ID: {qr.id}</span>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => downloadImage(qr.qrImageUrl, qr.id)}
                    className="text-xs font-bold text-slate-600 hover:text-blue-600 transition"
                  >
                    📥 Télécharger
                  </button>
                  <button 
                    onClick={() => window.open(`http://localhost:5000/r/${qr.id}`, '_blank')}
                    className="text-xs font-bold text-slate-600 hover:text-blue-600 transition"
                  >
                    🔗 Tester le lien
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {history.length === 0 && (
          <div className="text-center py-20 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 text-slate-400">
            Aucun QR code généré pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;