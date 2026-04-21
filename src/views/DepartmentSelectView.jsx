import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  ChevronRight,
  Loader2,
  Box
} from 'lucide-react';

export default function DepartmentSelectView({ onSelect, onBack }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      // Fetch departments
      const { data: depts } = await supabase.from('departments').select('*');
      
      // For each department, count pending orders (mocking for now or joining)
      // Since pick_items are what we pick, we'll count pending pick_items linked to aisles in that dept
      const { data: picks } = await supabase
        .from('pick_items')
        .select(`
          id,
          locations (
            aisles (department_id)
          )
        `)
        .eq('picked', false);

      const deptData = depts?.map(d => ({
        ...d,
        orderCount: picks?.filter(p => p.locations?.aisles?.department_id === d.id).length || 0
      })) || [];

      setDepartments(deptData);
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
        <p className="text-xl font-bold">Syncing Intelligent Zones...</p>
      </div>
    );
  }

  return (
    <div className="view-container">
      <div className="flex items-center gap-4 mb-8 mt-4">
        <button onClick={onBack} className="p-3 bg-navy-lighter rounded-2xl text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black">Department</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {departments.map((dept) => (
          <button 
            key={dept.id}
            onClick={() => onSelect(dept)}
            style={{ '--dept-color': dept.color }}
            className="group relative bg-navy-lighter p-8 rounded-[2.5rem] border-2 border-transparent hover:border-[var(--dept-color)] transition-all flex items-center gap-6 text-left active:scale-[0.98]"
          >
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center transition-all bg-white/5 group-hover:scale-110" style={{ color: dept.color }}>
              <Package size={40} />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-black text-white mb-1">{dept.name}</h2>
              <div className="flex items-center gap-4 text-gray-500 font-bold text-xs uppercase tracking-widest">
                <span className="flex items-center gap-1"><MapPin size={12} /> Aisles {dept.aisle_start}-{dept.aisle_end}</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-4xl font-black text-white">{dept.orderCount}</p>
              <p className="text-[10px] font-black uppercase text-gray-500">Orders</p>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <ChevronRight size={32} style={{ color: dept.color }} />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto pb-8 text-center text-gray-600">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Automated Zone Assignment Active</p>
         <div className="w-2 h-2 bg-success-green rounded-full mx-auto animate-pulse"></div>
      </div>
    </div>
  );
}
