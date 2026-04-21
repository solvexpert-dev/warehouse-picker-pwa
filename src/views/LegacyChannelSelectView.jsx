import React, { useState } from 'react';
import { Search, ChevronRight, ArrowLeft } from 'lucide-react';

const MOCK_CHANNELS = [
  'Amazon UK', 'Amazon DE', 'Amazon FR', 'Amazon IT', 'Amazon ES',
  'eBay UK', 'eBay Motors', 'TikTok Shop UK', 'TikTok Shop US',
  'Shopify Main', 'Shopify Plus', 'Shopify B2B',
  'Wayfair UK', 'Wayfair DE', 'B&Q Marketplace',
  'SHEIN UK', 'SHEIN Global', 'Wilko Online',
  'Groupon EU', 'Groupon UK', 'ManoMano',
  'OnBuy', 'Not On The High Street', 'Etsy',
  // ... and hundreds more generated for the demo
  ...Array.from({ length: 250 }, (_, i) => `Retailer_${i + 100} B2C`)
];

export default function LegacyChannelSelectView({ onSelect, onBack }) {
  const [search, setSearch] = useState('');

  const filtered = MOCK_CHANNELS.filter(c => 
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-container">
      <div className="flex items-center gap-4 mb-8 mt-4">
        <button onClick={onBack} className="p-3 bg-navy-lighter rounded-2xl text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black text-error-red">Select Channel</h1>
      </div>

      <div className="bg-navy-lighter p-6 rounded-[2rem] border border-white/5 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search through 276 channels..." 
            className="w-full bg-bg-deep-navy border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-error-red outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto pr-2 space-y-3" style={{ maxHeight: '60vh' }}>
        {filtered.map((channel, i) => (
          <button 
            key={i} 
            onClick={() => onSelect(channel)}
            className="w-full bg-navy-lighter flex items-center justify-between p-6 rounded-2xl border border-white/5 hover:border-error-red/30 active:scale-[0.98] transition-all"
          >
            <span className="font-bold text-gray-300">{channel}</span>
            <ChevronRight className="text-gray-600" size={20} />
          </button>
        ))}
      </div>

      <p className="text-center mt-8 text-gray-600 text-[10px] font-black uppercase tracking-widest">
        Manual Entry Mode Restricted
      </p>
    </div>
  );
}
