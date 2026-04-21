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
import PickingView from './views/PickingView';
import PackingView from './views/PackingView';
import StatsView from './views/StatsView';

function App() {
  const [view, setView] = useState('login'); // login, role_select, picking, packing, stats
  const [user, setUser] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);

  const handleLogin = (staffMember) => {
    setUser(staffMember);
    setView('role_select');
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };

  const finishSession = (stats) => {
    setSessionStats(stats);
    setView('stats');
  };

  const renderView = () => {
    switch (view) {
      case 'login':
        return <LoginView onLogin={handleLogin} />;
      case 'role_select':
        return <RoleSelectView onSelect={(role) => setView(role)} onBack={handleLogout} />;
      case 'picking':
        return <PickingView user={user} onFinish={finishSession} onBack={() => setView('role_select')} />;
      case 'packing':
        return <PackingView user={user} onFinish={finishSession} onBack={() => setView('role_select')} />;
      case 'stats':
        return <StatsView stats={sessionStats} onFinish={() => setView('role_select')} />;
      default:
        return <LoginView onLogin={handleLogin} />;
    }
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
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
