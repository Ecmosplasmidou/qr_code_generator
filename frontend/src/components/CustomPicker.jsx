import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from "react-colorful";
import { ChevronDown, Pipette } from 'lucide-react';

const CustomPicker = ({ label, color, onChange }) => {
  const [show, setShow] = useState(false);
  const popover = useRef();

  useEffect(() => {
    const close = (e) => { 
      if (popover.current && !popover.current.contains(e.target)) setShow(false); 
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative flex-1" ref={popover}>
      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">
        <Pipette size={12} /> {label}
      </label>
      
      <button 
        type="button" 
        onClick={() => setShow(!show)} 
        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 shadow-sm outline-none ${
          show 
            ? 'bg-white border-blue-600 ring-2 ring-blue-600/20' 
            : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-md'
        }`}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded-full shadow-inner ring-2 ring-white" 
            style={{ backgroundColor: color }} 
          />
          <span className="text-[11px] font-mono font-bold uppercase text-slate-700 tracking-wider">
            {color}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-300 ${show ? 'rotate-180 text-blue-600' : 'group-hover:text-blue-500'}`} 
        />
      </button>

      {show && (
        <div className="absolute z-[100] top-[calc(100%+12px)] left-0 p-5 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(37,99,235,0.15)] border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Palette</span>
            <div className="w-4 h-4 rounded-full border border-slate-200 shadow-inner" style={{ backgroundColor: color }} />
          </div>
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default CustomPicker;