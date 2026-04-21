import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Scan, 
  Flag, 
  MapPin, 
  Package, 
  Loader2, 
  ChevronLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PickingView({ user, onFinish, onBack }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [picks, setPicks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Find or create a session
    const { data: activeSession } = await supabase
      .from('pick_sessions')
      .select('*')
      .eq('status', 'in_progress')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (activeSession) {
      setSession(activeSession);
      const { data: rawItems } = await supabase
        .from('pick_items')
        .select(`
          *,
          locations (location_code),
          order_items (
            quantity,
            orders (
              id,
              order_reference,
              channels (name)
            ),
            products (id, name)
          )
        `)
        .eq('session_id', activeSession.id)
        .eq('picked', false);

      if (rawItems) {
        let processedPicks = [];

        if (mode === 'product_batch') {
          // Group by product_id and location_id
          const groups = {};
          rawItems.forEach(item => {
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
          processedPicks = Object.values(groups).sort((a, b) => 
            a.locations.location_code.localeCompare(b.locations.location_code)
          );
        } else {
          // Channel Priority
          processedPicks = [...rawItems].sort((a, b) => {
            const channelA = a.order_items?.orders?.channels?.name || '';
            const channelB = b.order_items?.orders?.channels?.name || '';
            if (channelA !== channelB) return channelA.localeCompare(channelB);
            return a.locations.location_code.localeCompare(b.locations.location_code);
          });
        }
        
        setPicks(processedPicks);
      }
    } else {
      setSession(null);
    }
    setLoading(false);
  };

  const handleConfirmScan = async () => {
    if (currentIndex >= picks.length) return;
    
    const currentPick = picks[currentIndex];
    
    // Update Supabase (Handle batch or single)
    const idsToUpdate = currentPick.isBatch ? currentPick.ids : [currentPick.id];
    
    await supabase
      .from('pick_items')
      .update({ picked: true, picked_at: new Date().toISOString() })
      .in('id', idsToUpdate);

    const nextIndex = currentIndex + 1;
    if (nextIndex < picks.length) {
      setCurrentIndex(nextIndex);
    } else {
      const durationHours = (Date.now() - startTime) / (1000 * 60 * 60);
      onFinish({
        totalPicks: picks.reduce((acc, p) => acc + (p.isBatch ? p.ids.length : 1), 0),
        timeTaken: Date.now() - startTime,
        picksPerHour: Math.round(picks.length / durationHours)
      });
    }
  };

  const handleFlagEmpty = async () => {
    const currentPick = picks[currentIndex];
    if (!currentPick.location_id) return;

    await supabase
      .from('location_flags')
      .insert({
        location_id: currentPick.location_id,
        product_id: currentPick.order_items?.products?.id,
        flagged_by: user.name,
        reason: 'Empty Location'
      });
    
    // Move to next item anyway
    if (currentIndex + 1 < picks.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish({
        totalPicks: currentIndex,
        timeTaken: Date.now() - startTime,
        picksPerHour: 0 // Will handle in stats
      });
    }
  };

  if (loading) {
    return (
      <div className="view-container justify-center items-center">
        <Loader2 className="animate-spin text-electric-blue mb-4" size={64} />
        <p className="text-xl font-bold">Initializing Logistics Flow...</p>
      </div>
    );
  }

  if (!session || picks.length === 0) {
    return (
      <div className="view-container justify-center items-center text-center">
        <div className="w-24 h-24 bg-navy-lighter rounded-full flex items-center justify-center mb-8">
          <AlertTriangle className="text-warning-amber" size={48} />
        </div>
        <h2 className="text-3xl font-black mb-4">No Active Batch</h2>
        <p className="text-gray-400 mb-10">You are not currently assigned to a picking session.</p>
        <button onClick={onBack} className="btn-massive btn-secondary">
          Return to Menu
        </button>
      </div>
    );
  }

  const currentPick = picks[currentIndex];
  const progress = (currentIndex / picks.length) * 100;

  return (
    <div className="app-container">
      {/* Top Progress Bar */}
      <div className="progress-container">
        <motion.div 
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="view-container">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-500">
            <ChevronLeft size={32} />
          </button>
          <div className="flex flex-col items-end">
            <div className="bg-navy-lighter px-4 py-2 rounded-full border border-white/5 font-black text-sm tabular-nums">
              {currentIndex + 1} / {picks.length} {currentPick.isBatch ? 'Batches' : 'Items'} Remaining
            </div>
            {mode === 'channel_priority' && (
              <span className="text-[10px] font-black text-electric-blue uppercase tracking-widest mt-2 mr-2">
                Channel: {currentPick.order_items?.orders?.channels?.name}
              </span>
            )}
          </div>
        </div>

        {/* Location Display */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-gray-500 uppercase tracking-widest font-black text-xs mb-2">
            <MapPin size={16} /> Target Retrieval Node
          </div>
          <h1 className="text-oversized text-white">
            {currentPick.locations?.location_code || '??.??.??'}
          </h1>
        </div>

        {/* Product Card */}
        <div className="bg-navy-lighter rounded-[2.5rem] p-8 border border-white/5 mb-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
             <Package size={120} />
           </div>
           
           <div className="flex justify-between items-start mb-2">
              <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Active SKU</p>
              {currentPick.isBatch && (
                <div className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-lg border border-orange-500/20 text-[10px] font-black uppercase tracking-widest">
                  Batch Pick
                </div>
              )}
           </div>

           <h2 className="text-product text-white mb-8 leading-tight">
             {currentPick.order_items?.products?.name || 'Unknown Product'}
           </h2>
           
           <div className="flex gap-4">
              <div className="bg-electric-blue text-white px-6 py-4 rounded-3xl flex flex-col justify-center min-w-[120px]">
                <p className="text-[10px] font-black uppercase opacity-70">Total Qty</p>
                <p className="text-5xl font-black">{currentPick.isBatch ? currentPick.batchQuantity : currentPick.order_items.quantity}</p>
              </div>
              <div className="flex-1 bg-bg-deep-navy/50 rounded-3xl p-4 flex flex-col justify-center border border-white/5">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                   {currentPick.isBatch ? `${currentPick.ids.length} Orders Combined` : 'Single Order Pick'}
                 </p>
                 <p className="text-sm font-bold text-gray-300 truncate">
                   {currentPick.isBatch ? currentPick.channels.join(', ') : currentPick.order_items.orders.order_reference}
                 </p>
              </div>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button 
            onClick={handleConfirmScan}
            className="btn-massive btn-primary flex-col py-8"
          >
            <Scan size={32} />
            CONFIRM SCAN
          </button>

          <button 
            onClick={handleFlagEmpty}
            className="btn-massive btn-secondary py-5 text-sm"
          >
            <Flag size={18} />
            FLAG EMPTY LOCATION
          </button>
        </div>
      </div>
    </div>
  );
}
