import React from 'react';
import { ArrowLeft, ChevronRight, LayoutList } from 'lucide-react';

export default function LegacyAisleSelectView({ onSelect, onBack }) {
  const AISLES = Array.from({ length: 20 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <div className="view-container">
      <div className="flex items-center gap-4 mb-8 mt-4">
        <button onClick={onBack} className="p-3 bg-navy-lighter rounded-2xl text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black text-error-red">Select Aisle</h1>
      </div>

      <p className="text-gray-500 mb-6 font-medium">Please manually select your assigned aisle from the system list below.</p>

      <div className="grid grid-cols-2 gap-4">
        {AISLES.map((aisle) => (
          <button 
            key={aisle}
            onClick={onSelect}
            className="bg-navy-lighter p-6 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:border-error-red/30 active:scale-95 transition-all"
          >
            <LayoutList size={20} className="text-gray-600" />
            <span className="text-2xl font-black text-white">AISLE {aisle}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-error-red/5 border border-error-red/10 rounded-2xl">
         <p className="text-error-red text-xs font-bold uppercase tracking-tight">Warning: No auto-path optimization. User must verify aisle range manually.</p>
      </div>
    </div>
  );
}
