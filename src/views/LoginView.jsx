import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginView({ onLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('solution'); // current | solution

  useEffect(() => {
    if (pin.length === 4) {
      handleVerifyPin();
    }
  }, [pin]);

  const handleVerifyPin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error: dbError } = await supabase
        .from('staff')
        .select('*')
        .eq('pin', pin)
        .limit(1)
        .single();

      if (dbError || !data) {
        setError('Invalid PIN. Please try again.');
        setPin('');
      } else {
        onLogin(data, mode);
      }
    } catch (err) {
      setError('Connection error. Try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  return (
    <div className="view-container login-view-container justify-center py-4">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setMode('current')}
          className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
            mode === 'current' ? 'border-error-red bg-error-red/10 text-error-red' : 'border-white/5 bg-navy-lighter/30 text-gray-500'
          }`}
        >
          Current System
        </button>
        <button 
          onClick={() => setMode('solution')}
          className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
            mode === 'solution' ? 'border-electric-blue bg-electric-blue/10 text-electric-blue' : 'border-white/5 bg-navy-lighter/30 text-gray-500'
          }`}
        >
          Our Solution
        </button>
      </div>

      <div className="login-grid">
        <div className="login-info-section text-center">
          <div className="w-16 h-16 bg-electric-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 login-header-icon">
            <ShieldCheck className="text-electric-blue" size={32} />
          </div>
          <h1 className="text-3xl font-black mb-1">Staff Login</h1>
          <p className="text-gray-400 text-sm mb-6">Enter 4-digit PIN</p>

          <div className="flex justify-center gap-3 mb-6 pin-display">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center ${
                  pin.length > i ? 'border-electric-blue bg-electric-blue/20' : 'border-navy-lighter bg-navy-lighter/30'
                }`}
              >
                {pin.length > i && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-error-red/10 text-error-red p-3 rounded-xl text-center mb-0 flex items-center justify-center gap-2 font-bold text-sm animate-pulse">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        <div className="login-numpad-section">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Loader2 className="animate-spin text-electric-blue mb-4" size={40} />
              <p className="font-bold text-xs uppercase tracking-widest text-electric-blue">Authenticating...</p>
            </div>
          ) : (
            <div className="numpad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button key={num} onClick={() => handleKeyPress(num)} className="numpad-btn">
                  {num}
                </button>
              ))}
              <button onClick={handleClear} className="numpad-btn text-sm text-gray-500 font-black">CLR</button>
              <button onClick={() => handleKeyPress(0)} className="numpad-btn">0</button>
              <div className="numpad-btn opacity-10"></div>
            </div>
          )}
        </div>
      </div>

      <p className="text-center mt-6 text-gray-600 font-black text-[9px] uppercase tracking-widest opacity-40">
        SolveXpert OS • v2.4.0 High-Impact Edition
      </p>
    </div>
  );
}
