import React, { useState } from 'react';
import { AlertTriangle, Printer, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  "Are you sure you want to start packing this order?",
  "Confirm: Is the box size appropriate for these items?",
  "Warning: Have you checked for 24-hour shipping eligibility?",
  "Attention: Please verify the SKU quantity one more time.",
  "Almost there: Do you acknowledge that labels cannot be reprinted?",
  "Final Step: Confirm physical placement of packing slip?"
];

export default function LegacyPackingView({ onFinish, onBack }) {
  const [step, setStep] = useState(0);
  const [isPacking, setIsPacking] = useState(false);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setIsPacking(true);
    }
  };

  const handleComplete = () => {
    onFinish({ totalPicks: 1, timeTaken: 300000, picksPerHour: 15 });
  };

  return (
    <div className="view-container" style={{ background: '#FFD700' }}>
      <div className="bg-red-600 p-4 text-white font-black text-center animate-pulse">
         CAUTION: MANUAL PACKING FLOW ACTIVE
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {!isPacking ? (
            <motion.div 
              key="popup"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="bg-white p-8 rounded-[3rem] shadow-[0_20px_0_#bd9e00] border-8 border-navy-900 text-center w-full max-w-md"
            >
              <div className="w-20 h-20 bg-error-red/10 rounded-full flex items-center justify-center mx-auto mb-6 text-error-red">
                <AlertTriangle size={48} />
              </div>
              <h2 className="text-navy-900 text-2xl font-black mb-4 uppercase leading-tight">Confirmation Required</h2>
              <p className="text-navy-900 font-bold mb-8 text-lg">{STEPS[step]}</p>
              
              <div className="space-y-4">
                <button 
                  onClick={handleNext}
                  className="w-full bg-navy-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-navy-800 active:translate-y-1 transition-all"
                >
                  YES, I AGREE
                </button>
                <button 
                  onClick={onBack}
                  className="w-full bg-transparent text-navy-900 py-2 font-black text-sm uppercase underline"
                >
                  Cancel Selection
                </button>
              </div>
              
              <p className="mt-8 text-[10px] text-gray-400 font-bold">STEP {step + 1} OF 6</p>
            </motion.div>
          ) : (
            <motion.div 
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full space-y-6"
            >
               <div className="bg-white p-8 rounded-[3rem] border-8 border-navy-900 text-navy-900">
                  <h3 className="font-black text-3xl mb-4">ORDER STATUS: READY</h3>
                  <p className="font-bold mb-8 opacity-70">All 6 prerequisite checks passed successfully. Packaging materials assigned.</p>
                  
                  <button className="w-full bg-red-600 text-white py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-4 shadow-[0_10px_0_#9a1a1a]">
                    <Printer size={32} />
                    PRINT LABEL
                  </button>
               </div>

               <button 
                  onClick={handleComplete}
                  className="w-full bg-navy-900 text-white py-8 rounded-[2.5rem] font-black text-3xl flex items-center justify-center gap-4"
                >
                  <CheckCircle2 size={32} />
                  COMPLETE ORDER
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-navy-900 text-gray-500 text-[10px] font-black text-center uppercase tracking-widest">
         Legacy Packing Module • Rex Brown OS 1998
      </div>
    </div>
  );
}
