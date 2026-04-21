import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Scan, 
  Printer, 
  CheckCircle2, 
  ChevronLeft,
  Package,
  Loader2,
  Zap,
  Box
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PackingView({ user, onFinish, onBack }) {
  const [step, setStep] = useState('SCAN_PRODUCT'); // SCAN_PRODUCT, SCAN_LABEL, SCAN_BOX, COMPLETE
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [startTime] = useState(Date.now());
  const [picksCount, setPicksCount] = useState(0);

  useEffect(() => {
    fetchNextOrder();
  }, []);

  const fetchNextOrder = async () => {
    setLoading(true);
    const { data: orders } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('status', 'pending')
      .limit(1);

    if (orders && orders.length > 0) {
      setOrder(orders[0]);
    } else {
      setOrder(null);
    }
    setLoading(false);
    setStep('SCAN_PRODUCT');
  };

  const simulateAutomation = () => {
    // Step 1 -> Step 2
    setTimeout(() => {
      setStep('SCAN_LABEL');
      // Step 2 -> Step 3
      setTimeout(() => {
        setStep('SCAN_BOX');
        // Step 3 -> Complete
        setTimeout(() => {
          setStep('COMPLETE');
          // Load next after completion
          setTimeout(() => {
            setPicksCount(p => p + 1);
            fetchNextOrder();
          }, 800);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleStartPack = () => {
    simulateAutomation();
  };

  const handleFinish = () => {
    onFinish({
      totalPicks: picksCount,
      timeTaken: Date.now() - startTime,
      picksPerHour: 240
    });
  };

  if (loading) return (
    <div className="view-container justify-center items-center">
      <Loader2 className="animate-spin text-electric-blue mb-4" size={64} />
      <p className="text-xl font-bold">Smart Queue Optimization...</p>
    </div>
  );

  if (!order) return (
    <div className="view-container justify-center items-center text-center">
      <h2 className="text-3xl font-black mb-4">Batch Complete</h2>
      <button onClick={handleFinish} className="btn-massive btn-primary">Session Stats</button>
    </div>
  );

  return (
    <div className="view-container">
      <div className="flex justify-between items-center mb-8 mt-4">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-500"><ChevronLeft size={32} /></button>
        <div className="flex items-center gap-2 bg-electric-blue/10 px-4 py-2 rounded-full border border-electric-blue/20">
           <Zap size={14} className="text-electric-blue" />
           <span className="text-[10px] font-black text-electric-blue uppercase">Zero-Click Pack Active</span>
        </div>
      </div>

      <div className="text-center mb-12">
        <p className="text-gray-500 font-black uppercase text-xs mb-2">Channel: {order.channels?.name || 'Shopify'}</p>
        <h1 className="text-4xl font-black text-white">{order.order_items[0]?.products?.name}</h1>
      </div>

      <div className="space-y-4">
        {/* Step 1: Scan Product */}
        <div className={`traffic-light ${step !== 'SCAN_PRODUCT' ? 'complete' : 'active'}`}>
           <div className={`indicator-circle ${step !== 'SCAN_PRODUCT' ? 'on-green' : 'on-yellow'}`}>
              <Scan size={24} />
           </div>
           <p className="text-xl font-bold">1. Verify Product</p>
        </div>

        {/* Step 2: Scan Label */}
        <div className={`traffic-light ${['SCAN_BOX', 'COMPLETE'].includes(step) ? 'complete' : step === 'SCAN_LABEL' ? 'active' : ''}`}>
           <div className={`indicator-circle ${['SCAN_BOX', 'COMPLETE'].includes(step) ? 'on-green' : step === 'SCAN_LABEL' ? 'on-yellow' : ''}`}>
              <Printer size={24} />
           </div>
           <p className="text-xl font-bold">2. Auto-Print Label</p>
        </div>

        {/* Step 3: Scan Box */}
        <div className={`traffic-light ${step === 'COMPLETE' ? 'complete' : step === 'SCAN_BOX' ? 'active' : ''}`}>
           <div className={`indicator-circle ${step === 'COMPLETE' ? 'on-green' : step === 'SCAN_BOX' ? 'on-yellow' : ''}`}>
              <Box size={24} />
           </div>
           <p className="text-xl font-bold">3. Final Dispatch</p>
        </div>
      </div>

      {step === 'SCAN_PRODUCT' ? (
        <button onClick={handleStartPack} className="btn-massive btn-primary py-12 mt-12">
           <Scan size={40} /> START AUTOMATION
        </button>
      ) : (
        <div className="mt-12 p-8 bg-success-green/10 rounded-[2.5rem] border border-success-green/20 text-center">
           <p className="text-success-green font-black text-2xl animate-pulse">PROCESSING...</p>
        </div>
      )}

      <div className="mt-auto pb-4">
         <div className="flex justify-between items-center bg-navy-lighter p-6 rounded-3xl border border-white/5">
            <p className="text-lg font-black">{picksCount} <span className="text-xs text-gray-500 uppercase">Processed</span></p>
            <button onClick={handleFinish} className="text-xs font-black uppercase text-gray-500">End Shift</button>
         </div>
      </div>
    </div>
  );
}
