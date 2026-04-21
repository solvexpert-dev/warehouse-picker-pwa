import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { 
  ChevronRight, 
  Package, 
  MapPin, 
  Scan, 
  Flag, 
  CheckCircle2, 
  ArrowLeft,
  Timer,
  BarChart3,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Views
import LoginView from './views/LoginView';
import RoleSelectView from './views/RoleSelectView';
import ModeSelectView from './views/ModeSelectView';
import PickingView from './views/PickingView';
import PackingView from './views/PackingView';
import StatsView from './views/StatsView';

// New Demo Views
import DepartmentSelectView from './views/DepartmentSelectView';
import LegacyChannelSelectView from './views/LegacyChannelSelectView';
import LegacyAisleSelectView from './views/LegacyAisleSelectView';
import LegacyPickingView from './views/LegacyPickingView';
import LegacyPackingView from './views/LegacyPackingView';

function App() {
  const [demoMode, setDemoMode] = useState('solution'); // current | solution
  const [view, setView] = useState('login'); 
  const [user, setUser] = useState(null);
  const [pickingMode, setPickingMode] = useState(null); 
  const [department, setDepartment] = useState(null);
  const [legacyChannel, setLegacyChannel] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);

  const handleLogin = (staffMember, mode = 'solution') => {
    setUser(staffMember);
    setDemoMode(mode);
    setView('role_select');
  };

  const handleRoleSelect = (role) => {
    if (role === 'picking') {
      if (demoMode === 'solution') {
        setView('dept_select');
      } else {
        setView('legacy_channel_select');
      }
    } else {
      setView(role);
    }
  };

  const renderView = () => {
    const isSolution = demoMode === 'solution';

    switch (view) {
      case 'login':
        return <LoginView onLogin={handleLogin} />;
      case 'role_select':
        return <RoleSelectView onSelect={handleRoleSelect} onBack={() => setView('login')} />;
      
      // SOLUTION FLOW
      case 'dept_select':
        return <DepartmentSelectView onSelect={(dept) => { setDepartment(dept); setView('mode_select'); }} onBack={() => setView('role_select')} />;
      case 'mode_select':
        return <ModeSelectView onSelect={(mode) => { setPickingMode(mode); setView('picking'); }} onBack={() => setView('dept_select')} />;
      case 'picking':
        return <PickingView user={user} mode={pickingMode} department={department} onFinish={(s) => { setSessionStats(s); setView('stats'); }} onBack={() => setView('mode_select')} />;
      case 'packing':
        return <PackingView user={user} onFinish={(s) => { setSessionStats(s); setView('stats'); }} onBack={() => setView('role_select')} />;
      
      // LEGACY FLOW
      case 'legacy_channel_select':
        return <LegacyChannelSelectView onSelect={(channel) => { setLegacyChannel(channel); setView('legacy_aisle_select'); }} onBack={() => setView('role_select')} />;
      case 'legacy_aisle_select':
        return <LegacyAisleSelectView onSelect={() => setView('legacy_picking')} onBack={() => setView('legacy_channel_select')} />;
      case 'legacy_picking':
        return <LegacyPickingView onFinish={(s) => { setSessionStats(s); setView('stats'); }} onBack={() => setView('legacy_aisle_select')} />;
      case 'legacy_packing':
        return <LegacyPackingView onFinish={(s) => { setSessionStats(s); setView('stats'); }} onBack={() => setView('role_select')} />;
      
      case 'stats':
        return <StatsView stats={sessionStats} onFinish={() => setView('role_select')} />;
      default:
        return <LoginView onLogin={handleLogin} />;
    }
  };

  return (
    <div className={`app-container theme-${demoMode}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${demoMode}-${view}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          style={{ height: '100%', width: '100%' }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
