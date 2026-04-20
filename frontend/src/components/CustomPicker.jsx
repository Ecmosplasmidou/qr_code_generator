import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from "react-colorful";
import { ChevronDown } from 'lucide-react';

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
        <ChevronDown size={12} className={`transition-transform ${show ? 'rotate-180' : ''}`} />
      </button>
      {show && (
        <div className="absolute z-[100] mt-2 p-4 bg-white rounded-3xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default CustomPicker;