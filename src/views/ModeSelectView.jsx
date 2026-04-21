import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Zap, 
  Layers, 
  ChevronRight, 
  ArrowLeft,
  Loader2,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModeSelectView({ onSelect, onBack }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ savedTrips: 0, channels: [] });

  useEffect(() => {
    fetchEfficiencyStats();
  }, []);

  const fetchEfficiencyStats = async () => {
    setLoading(true);
    try {
      // Fetch pending picks to calculate efficiency
      const { data: items } = await supabase
        .from('pick_items')
        .select('product_id, location_id, order_items(orders(channels(name)))')
        .eq('picked', false);

      if (items) {
        // Calculate trips saved: total items - unique combinations of (product, location)
        const uniqueTrips = new Set(items.map(i => `${i.product_id}-${i.location_id}`));
        const saved = items.length - uniqueTrips.size;

        // Get unique channel names
        const channels = [...new Set(items.map(i => i.order_items?.orders?.channels?.name).filter(Boolean))];
        
        setStats({ savedTrips: Math.max(0, saved), channels });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="view-container justify-center items-center">
        <Loader2 className="animate-spin text-electric-blue mb-4" size={64} />
        <p className="text-xl font-bold">Optimizing Routing Logic...</p>
      </div>
    );
  }

  return (
    <div className="view-container">
      <div className="flex items-center gap-4 mb-8 mt-4">
        <button onClick={onBack} className="p-3 bg-navy-lighter rounded-2xl text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black">Picking Mode</h1>
      </div>

      <div className="space-y-6">
        {/* Mode 1: Channel Priority */}
        <button 
          onClick={() => onSelect('channel_priority')}
          className="btn-massive btn-secondary flex-col items-start gap-4 p-8 border-2 border-transparent hover:border-electric-blue/30 text-left h-auto"
        >
          <div className="flex justify-between w-full items-start">
            <div className="w-16 h-16 bg-electric-blue/10 rounded-2xl flex items-center justify-center text-electric-blue">
              <Layers size={32} />
            </div>
            <div className="flex gap-1">
              {stats.channels.slice(0, 3).map((name, i) => (
                <span key={i} className="text-[10px] bg-navy-900 border border-white/5 px-2 py-1 rounded-md text-gray-500 font-black">
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-1">Channel Priority</h2>
            <p className="text-sm font-medium text-gray-500 normal-case leading-relaxed">
              Fulfill orders by sales channel. Best for priority shipping deadlines.
            </p>
          </div>
        </button>

        {/* Mode 2: Product Batch */}
        <button 
          onClick={() => onSelect('product_batch')}
          className="btn-massive btn-primary flex-col items-start gap-4 p-8 text-left h-auto relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4">
            <TrendingUp size={120} />
          </div>
          
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white">
            <Zap size={32} />
          </div>
          
          <div className="relative z-10 w-full">
            <div className="flex justify-between items-end mb-1">
               <h2 className="text-2xl font-black text-white">Product Batch</h2>
               {stats.savedTrips > 0 && (
                 <div className="bg-success-green px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-success-green/20">
                   {stats.savedTrips} Trips Saved
                 </div>
               )}
            </div>
            <p className="text-sm font-medium text-white/70 normal-case leading-relaxed">
              Consolidate multiples. One trip per shelf for maximum throughput.
            </p>
          </div>
        </button>
      </div>

      <div className="mt-auto pb-8 text-center">
        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
           SolveXpert Logistics Algorithm v3.1
        </p>
      </div>
    </div>
  );
}
