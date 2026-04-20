import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import StatsPage from './pages/StatsPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import UpgradePage from './pages/UpgradePage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PricingBadge from './components/PricingBadge';

const API_URL = "https://qr-code-generator-python3.onrender.com";

// --- LOGIQUE DE PROTECTION DES ROUTES ---
const PrivateRoute = ({ children, proOnly = false }) => {
  const token = localStorage.getItem('token');
  const isPro = localStorage.getItem('isPro') === 'true';
  if (!token) return <Navigate to="/auth" />;
  if (proOnly && !isPro) return <Navigate to="/upgrade" />; 

  return children;
};

function App() {
  const [history, setHistory] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsInitialLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/all-qrcodes`, {
        headers: { 'x-access-token': token }
      });
      
      if (res.status === 401) {
        localStorage.clear();
        setIsInitialLoading(false);
        return;
      }

      const data = await res.json();
      setHistory(Array.isArray(data) ? data.reverse() : []);
    } catch (e) {
      console.warn("Serveur en veille ou déconnecté");
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const safetyTimeout = setTimeout(() => setIsInitialLoading(false), 3500);
    return () => clearTimeout(safetyTimeout);
  }, []);

  const confirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/delete/${deleteId}`, { 
        method: 'DELETE',
        headers: { 'x-access-token': token }
      });
      if (res.ok) {
        fetchHistory();
        setDeleteId(null);
      }
    } catch (e) {
      console.error("Erreur suppression");
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          <p className="font-black text-slate-900 uppercase tracking-[0.3em] text-[10px]">QRLYZE PRO ENGINE</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased">
        <Navbar />

        <div className="flex-1">
          <Routes>
            {/* --- ROUTES PUBLIQUES --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* --- ROUTES PRIVÉES (Utilisateur connecté) --- */}
            <Route path="/account" element={
              <PrivateRoute>
                <AccountPage history={history} />
              </PrivateRoute>
            } />

            <Route path="/upgrade" element={
              <PrivateRoute>
                <UpgradePage />
              </PrivateRoute>
            } />

            {/* --- ROUTES PRO ONLY (Abonnement requis) --- */}
            <Route path="/app" element={
              <PrivateRoute proOnly>
                <DashboardPage history={history} fetchHistory={fetchHistory} openDeleteModal={setDeleteId} />
              </PrivateRoute>
            } />
            
            <Route path="/analytics" element={
              <PrivateRoute proOnly>
                <AnalyticsPage history={history} />
              </PrivateRoute>
            } />
            
            <Route path="/stats/:id" element={
              <PrivateRoute proOnly>
                <StatsPage history={history} />
              </PrivateRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <Footer />

        {/* --- MODALE DE SUPPRESSION --- */}
        {deleteId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
            <div className="bg-white p-10 md:p-12 rounded-[3rem] text-center max-w-sm shadow-2xl animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase mb-3 tracking-tighter text-slate-900">Supprimer ?</h3>
              <p className="text-slate-400 text-xs font-bold mb-10 leading-relaxed uppercase">
                Cette action supprimera définitivement le suivi et l'historique.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={confirmDelete} className="bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] shadow-lg hover:bg-red-700 transition-all">
                  Confirmer
                </button>
                <button onClick={() => setDeleteId(null)} className="text-slate-400 font-black uppercase text-[10px] py-4 hover:text-slate-900 transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Badge de prix flottant (Auto-masqué si connecté Pro) */}
        <PricingBadge />
      </div>
    </Router>
  );
}

export default App;