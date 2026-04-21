import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Scan, 
  Printer, 
  CheckCircle2, 
  ArrowLeft,
  ChevronLeft,
  Package,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PackingView({ user, onFinish, onBack }) {
  const [step, setStep] = useState('SCAN_PRODUCT'); // SCAN_PRODUCT, PRINTING, COMPLETE
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [startTime] = useState(Date.now());
  const [picksCount, setPicksCount] = useState(0);

  useEffect(() => {
    fetchNextOrder();
  }, []);

  const fetchNextOrder = async () => {
    setLoading(true);
    // Fetch first pending order
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

  const handleScanProduct = async () => {
    // Transition to printing
    setStep('PRINTING');
    
    // Simulate printing delay
    setTimeout(() => {
      setStep('COMPLETE');
      
      // Update DB
      supabase
        .from('orders')
        .update({ status: 'shipped' })
        .eq('id', order.id)
        .then();

      // Finalize order after 1.5s and load next
      setTimeout(() => {
        setPicksCount(prev => prev + 1);
        if (false) { // Condition to finish shift
           handleFinish();
        } else {
           fetchNextOrder();
        }
      }, 1500);
    }, 1200);
  };

  const handleFinish = () => {
    const durationHours = (Date.now() - startTime) / (1000 * 60 * 60);
    onFinish({
      totalPicks: picksCount,
      timeTaken: Date.now() - startTime,
      picksPerHour: Math.round(picksCount / durationHours)
    });
  };

  if (loading) {
    return (
      <div className="view-container justify-center items-center">
        <Loader2 className="animate-spin text-electric-blue mb-4" size={64} />
        <p className="text-xl font-bold">Synchronizing Dispatch Queue...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="view-container justify-center items-center text-center">
        <div className="w-24 h-24 bg-electric-blue/10 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="text-success-green" size={48} />
        </div>
        <h2 className="text-3xl font-black mb-4">Queue Clear</h2>
        <p className="text-gray-400 mb-10">All pending orders have been processed.</p>
        <div className="space-y-4 w-full">
          <button onClick={handleFinish} className="btn-massive btn-primary">
            View Session Stats
          </button>
          <button onClick={onBack} className="btn-massive btn-secondary">
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-container">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-500">
          <ChevronLeft size={32} />
        </button>
        <div className="bg-navy-lighter px-4 py-2 rounded-full border border-white/5 font-black text-sm uppercase tracking-widest text-emerald-400">
          Packing Active
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-gray-500 font-black uppercase tracking-widest text-xs mb-2">Order {order.order_reference}</p>
        <h1 className="text-4xl font-black text-white px-4">
          {order.order_items[0]?.products?.name || 'Standard Package'}
        </h1>
      </div>

      <div className="traffic-light-container">
        {/* Step 1: Scan Product */}
        <div className={`traffic-light ${step !== 'SCAN_PRODUCT' ? 'complete' : 'active'}`}>
           <div className={`indicator-circle ${step !== 'SCAN_PRODUCT' ? 'on-green' : 'on-yellow'}`}>
              {step !== 'SCAN_PRODUCT' ? <CheckCircle2 size={24} /> : <Scan size={24} />}
           </div>
           <div>
             <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Step 1</p>
             <p className="text-xl font-bold">Scan Product</p>
           </div>
        </div>

        {/* Step 2: Label Prints */}
        <div className={`traffic-light ${step === 'COMPLETE' ? 'complete' : step === 'PRINTING' ? 'active' : ''}`}>
           <div className={`indicator-circle ${step === 'COMPLETE' ? 'on-green' : step === 'PRINTING' ? 'on-yellow' : ''}`}>
              {step === 'COMPLETE' ? <CheckCircle2 size={24} /> : <Printer size={24} />}
           </div>
           <div>
             <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Step 2</p>
             <p className="text-xl font-bold">Label Prints</p>
           </div>
        </div>

        {/* Step 3: Order Complete */}
        <div className={`traffic-light ${step === 'COMPLETE' ? 'complete' : ''}`}>
           <div className={`indicator-circle ${step === 'COMPLETE' ? 'on-green' : ''}`}>
              <CheckCircle2 size={24} />
           </div>
           <div>
             <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Step 3</p>
             <p className="text-xl font-bold">Order Complete</p>
           </div>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        {step === 'SCAN_PRODUCT' && (
          <button onClick={handleScanProduct} className="btn-massive btn-primary py-10 shadow-emerald-500/20">
            <Scan size={32} />
            CONFIRM SCAN
          </button>
        )}

        {step === 'COMPLETE' && (
          <div className="bg-success-green/10 text-success-green p-8 rounded-[2.5rem] border border-success-green/20 text-center font-black animate-bounce flex items-center justify-center gap-4">
            <CheckCircle2 size={32} />
            ORDER DISPATCHED
          </div>
        )}

        <div className="flex justify-end pr-2 pt-4">
           <button onClick={() => alert('Emergency Label Requested')} className="p-4 bg-navy-lighter rounded-2xl text-gray-600 border border-white/5 active:bg-error-red/10 overflow-hidden group">
              <Printer size={20} className="group-active:text-error-red" />
           </button>
        </div>
      </div>

      <div className="mt-auto pb-4">
         <div className="bg-navy-lighter rounded-3xl p-6 flex justify-between items-center border border-white/5">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase">Station Throughput</p>
              <p className="text-xl font-black">{picksCount} <span className="text-gray-600 text-xs uppercase">Orders</span></p>
            </div>
            <button onClick={handleFinish} className="bg-bg-deep-navy px-6 py-3 rounded-2xl font-black text-xs text-gray-400 border border-white/5 uppercase tracking-widest hover:text-white transition-colors">
              End Shift
            </button>
         </div>
      </div>
    </div>
  );
}
