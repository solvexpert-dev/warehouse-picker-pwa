import React from 'react';
import { 
  BarChart3, 
  Timer, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export default function StatsView({ stats, onFinish }) {
  if (!stats) return null;

  const formatTime = (ms) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="view-container">
      <div className="text-center mb-12 mt-8">
        <div className="w-24 h-24 bg-electric-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-electric-blue/20">
          <Award className="text-electric-blue" size={48} />
        </div>
        <h1 className="text-4xl font-black mb-2">Session Complete</h1>
        <p className="text-gray-400 font-medium">Exceptional performance metrics detected</p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-12">
        <div className="bg-navy-lighter p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6">
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Items Processed</p>
            <p className="text-4xl font-black text-white">{stats.totalPicks}</p>
          </div>
        </div>

        <div className="bg-navy-lighter p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6">
          <div className="p-4 bg-electric-blue/10 rounded-2xl text-electric-blue">
            <Timer size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Active Time</p>
            <p className="text-4xl font-black text-white">{formatTime(stats.timeTaken)}</p>
          </div>
        </div>

        <div className="bg-navy-lighter p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6">
          <div className="p-4 bg-warning-amber/10 rounded-2xl text-warning-amber">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Throughput</p>
            <p className="text-4xl font-black text-white">{stats.picksPerHour} <span className="text-xl font-bold text-gray-600">PPH</span></p>
          </div>
        </div>
      </div>

      <div className="bg-bg-deep-navy border-2 border-dashed border-navy-lighter rounded-[2.5rem] p-8 text-center mb-12">
         <p className="text-gray-500 italic font-medium">"Top 5% performance for today's shift. Warehouse efficiency target exceeded."</p>
      </div>

      <button onClick={onFinish} className="btn-massive btn-primary shadow-emerald-500/20">
        Start New Session
        <ArrowRight size={24} />
      </button>
      
      <p className="text-center mt-8 text-gray-600 text-xs font-bold uppercase tracking-widest">
        Logged as Authorized Personnel
      </p>
    </div>
  );
}
