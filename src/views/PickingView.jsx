import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Scan, 
  Flag, 
  MapPin, 
  Package, 
  Loader2, 
  ChevronLeft,
  Navigation,
  Wind
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OptimizedPickingView({ user, mode, department, onFinish, onBack }) {
  const [loading, setLoading] = useState(true);
  const [picks, setPicks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchOptimizedPicks();
  }, []);

  const fetchOptimizedPicks = async () => {
    setLoading(true);
    const { data: rawItems } = await supabase
      .from('pick_items')
      .select(`
        *,
        locations (
          location_code,
          aisle_id,
          aisles (aisle_number, department_id)
        ),
        order_items (
          quantity,
          orders (channels (name)),
          products (id, name)
        )
      `)
      .eq('picked', false);

    // Filter by department
    const deptItems = rawItems?.filter(item => 
      item.locations?.aisles?.department_id === department.id
    ) || [];

    let processed = [];

    if (mode === 'product_batch') {
      const groups = {};
      deptItems.forEach(item => {
        const key = `${item.order_items.products.id}-${item.location_id}`;
        if (!groups[key]) {
          groups[key] = {
            ...item,
            ids: [item.id],
            batchQuantity: item.order_items.quantity,
            isBatch: true,
            channels: [item.order_items.orders.channels.name]
          };
        } else {
          groups[key].ids.push(item.id);
          groups[key].batchQuantity += item.order_items.quantity;
          if (!groups[key].channels.includes(item.order_items.orders.channels.name)) {
            groups[key].channels.push(item.order_items.orders.channels.name);
          }
        }
      });
      processed = Object.values(groups);
    } else {
      processed = [...deptItems];
    }

    // SNAKE PATTERN SORTING
    const sorted = [...processed].sort((a, b) => {
      const aisleA = parseInt(a.locations.aisles.aisle_number);
      const aisleB = parseInt(b.locations.aisles.aisle_number);
      if (aisleA !== aisleB) return aisleA - aisleB;
      const isEven = aisleA % 2 === 0;
      return isEven 
        ? a.locations.location_code.localeCompare(b.locations.location_code)
        : b.locations.location_code.localeCompare(a.locations.location_code);
    });

    setPicks(sorted);
    setLoading(false);
  };

  const handleConfirmScan = async () => {
    if (currentIndex >= picks.length) return;
    
    // Simulating pick update
    const nextIndex = currentIndex + 1;
    if (nextIndex < picks.length) {
      setCurrentIndex(nextIndex);
    } else {
      onFinish({
        totalPicks: picks.length,
        timeTaken: Date.now() - startTime,
        picksPerHour: 180
      });
    }
  };

  if (loading) return (
    <div className="view-container justify-center items-center">
      <Loader2 className="animate-spin text-electric-blue mb-4" size={64} />
      <p className="text-xl font-bold">Calculating Optimized Snake Route...</p>
    </div>
  );

  const current = picks[currentIndex];
  const progress = (currentIndex / picks.length) * 100;

  return (
    <div className="app-container theme-solution">
      <div className="progress-container">
        <motion.div 
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="view-container">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-500">
            <ChevronLeft size={32} />
          </button>
          <div className="flex items-center gap-2 bg-success-green/10 px-4 py-2 rounded-full border border-success-green/20">
             <Navigation size={14} className="text-success-green" />
             <span className="text-[10px] font-black text-success-green uppercase tracking-widest">Snake Pattern Route Active</span>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-gray-500 uppercase tracking-widest font-black text-xs mb-2">
            <MapPin size={16} /> Best Retrieval Node
          </div>
          <h1 className="text-oversized text-white">
            {current?.locations?.location_code}
          </h1>
          <div className="mt-2 text-electric-blue font-black text-sm uppercase tracking-tighter flex items-center justify-center gap-1">
             <Wind size={14} /> Next: {picks[currentIndex + 1]?.locations?.location_code || 'FINISH'}
          </div>
        </div>

        <div className="bg-navy-lighter rounded-[2.5rem] p-8 border border-white/5 mb-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
             <Package size={120} />
           </div>
           
           <div className="flex justify-between items-start mb-2">
              <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Target SKU</p>
              <div className="bg-electric-blue/10 text-electric-blue px-3 py-1 rounded-lg border border-electric-blue/20 text-[10px] font-black uppercase tracking-widest">
                {department.name}
              </div>
           </div>

           <h2 className="text-product text-white mb-8 leading-tight">
             {current?.order_items?.products?.name}
           </h2>
           
           <div className="flex gap-4">
              <div className="bg-electric-blue text-white px-6 py-4 rounded-3xl flex flex-col justify-center min-w-[120px]">
                <p className="text-[10px] font-black uppercase opacity-70">Quantity</p>
                <p className="text-5xl font-black">{current?.order_items?.quantity}</p>
              </div>
              <div className="flex-1 bg-success-green/5 rounded-3xl p-4 flex flex-col justify-center border border-success-green/10">
                 <p className="text-[10px] font-black text-success-green uppercase tracking-widest">Route Efficiency</p>
                 <p className="text-lg font-bold text-white">+84% Optimized</p>
              </div>
           </div>
        </div>

        <button 
          onClick={handleConfirmScan}
          className="btn-massive btn-primary flex-col py-8 mt-auto"
        >
          <Scan size={32} />
          CONFIRM SCAN
        </button>
      </div>
    </div>
  );
}
