import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const PricingBadge = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== "null" && token !== "undefined") {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [location]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-bounce pointer-events-none">
      <div className="bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl border-2 border-blue-600 flex items-center gap-4 pointer-events-auto">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-sm font-black uppercase italic leading-none">QRLYZE PRO : 2€/MOIS</p>
        </div>
      </div>
    </div>
  );
};

export default PricingBadge;