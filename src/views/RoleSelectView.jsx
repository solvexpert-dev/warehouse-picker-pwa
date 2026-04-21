import React from 'react';
import { Package, Truck, ArrowLeft, LogOut } from 'lucide-react';

export default function RoleSelectView({ onSelect, onBack }) {
  return (
    <div className="view-container">
      <div className="flex justify-between items-center mb-12 mt-4">
        <button onClick={onBack} className="p-3 bg-navy-lighter rounded-2xl text-gray-500">
          <LogOut size={24} />
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-electric-blue bg-electric-blue/10 px-4 py-2 rounded-full border border-electric-blue/20">
          Connected
        </span>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-4xl font-black mb-2">Select Role</h1>
        <p className="text-gray-400">Choose your operational focus for this session</p>
      </div>

      <div className="space-y-6">
        <button 
          onClick={() => onSelect('picking')}
          className="btn-massive btn-primary flex-col items-center gap-4 py-12"
        >
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
            <Package size={48} />
          </div>
          <span>Start Picking</span>
        </button>

        <button 
          onClick={() => onSelect('packing')}
          className="btn-massive btn-secondary flex-col items-center gap-4 py-12"
        >
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
            <Truck size={48} />
          </div>
          <span>Start Packing</span>
        </button>
      </div>

      <div className="mt-auto text-center pb-8">
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
           Warehouse DC-01 • Sector 7
        </p>
      </div>
    </div>
  );
}
