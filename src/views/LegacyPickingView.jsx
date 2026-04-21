import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, ChevronLeft, MapPin, Package, List } from 'lucide-react';

export default function LegacyPickingView({ onFinish, onBack }) {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchPicks();
  }, []);

  const fetchPicks = async () => {
    const { data } = await supabase
      .from('pick_items')
      .select('*, locations(location_code), order_items(products(name))')
      .eq('picked', false)
      .limit(10);
    setPicks(data || []);
    setLoading(false);
  };

  const handlePick = () => {
    if (currentIndex < picks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish({ totalPicks: picks.length, timeTaken: 500000, picksPerHour: 12 });
    }
  };

  if (loading) return <div className="view-container">Loading...</div>;

  const current = picks[currentIndex];

  return (
    <div className="view-container" style={{ background: '#111' }}>
      <div className="flex items-center gap-2 mb-4 p-2 bg-error-red/20 border-b border-error-red/30">
        <AlertCircle size={16} className="text-error-red" />
        <span className="text-[10px] font-bold text-error-red uppercase">LEGACY SYSTEM v1.0.4 • MANUAL OVERRIDE ACTIVE</span>
      </div>

      <div className="flex flex-col gap-1 mb-6">
        <div className="flex justify-between items-center bg-zinc-800 p-4">
           <span className="text-xs text-gray-400">ORDER_ID_REF</span>
           <span className="text-sm font-mono text-white">#992-AX-8821</span>
        </div>
        <div className="flex justify-between items-center bg-zinc-800 p-4">
           <span className="text-xs text-gray-400">PICKLIST_POS</span>
           <span className="text-sm font-mono text-white">{currentIndex + 1} / {picks.length}</span>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 p-6 mb-4">
        <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Retrieval Coordinates</p>
        <p className="text-4xl font-mono tracking-tighter text-error-red">{current?.locations?.location_code}</p>
        
        <div className="h-px bg-zinc-800 my-4"></div>

        <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Product Description</p>
        <p className="text-lg font-bold text-white leading-tight">{current?.order_items?.products?.name}</p>
        
        <div className="mt-4 flex gap-2">
           <div className="bg-zinc-800 border border-zinc-700 p-2 flex-1">
              <p className="text-[8px] text-gray-500 uppercase">Weight</p>
              <p className="text-xs">0.45 KG</p>
           </div>
           <div className="bg-zinc-800 border border-zinc-700 p-2 flex-1">
              <p className="text-[8px] text-gray-500 uppercase">UOM</p>
              <p className="text-xs">PCS</p>
           </div>
        </div>
      </div>

      <div className="mt-auto space-y-2">
         <button className="w-full bg-zinc-800 text-gray-400 py-3 text-xs font-bold border border-zinc-700">PRINT PICK SLIP</button>
         <button onClick={handlePick} className="w-full bg-error-red text-white py-6 font-black text-xl shadow-lg active:bg-red-700">SUBMIT SCAN</button>
         <button className="w-full bg-transparent text-gray-600 py-3 text-[10px] font-bold uppercase">Report System Error</button>
      </div>

      <div className="mt-4 overflow-x-auto whitespace-nowrap py-2 border-t border-zinc-800">
        {picks.map((p, i) => (
          <div key={i} className={`inline-block w-3 h-3 rounded-full mr-2 ${i <= currentIndex ? 'bg-error-red' : 'bg-gray-800'}`}></div>
        ))}
      </div>
    </div>
  );
}
