import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginView({ onLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        onLogin(data);
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
    <div className="view-container justify-center">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-electric-blue/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="text-electric-blue" size={40} />
        </div>
        <h1 className="text-4xl font-black mb-2">Staff Login</h1>
        <p className="text-gray-400">Enter your 4-digit PIN to begin</p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center ${
              pin.length > i ? 'border-electric-blue bg-electric-blue/20' : 'border-navy-lighter bg-navy-lighter/30'
            }`}
          >
            {pin.length > i && <div className="w-3 h-3 bg-white rounded-full"></div>}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-error-red/10 text-error-red p-4 rounded-2xl text-center mb-6 flex items-center justify-center gap-2 font-bold animate-pulse">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center py-10">
          <Loader2 className="animate-spin text-electric-blue mb-4" size={48} />
          <p className="font-bold text-electric-light">Verifying Credentials...</p>
        </div>
      ) : (
        <div className="numpad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handleKeyPress(num)} className="numpad-btn">
              {num}
            </button>
          ))}
          <button onClick={handleClear} className="numpad-btn text-lg text-gray-500">CLR</button>
          <button onClick={() => handleKeyPress(0)} className="numpad-btn">0</button>
          <div className="numpad-btn opacity-20"></div>
        </div>
      )}

      <p className="text-center mt-12 text-gray-600 font-medium text-xs">
        SolveXpert OS • v2.4.0 High-Impact Edition
      </p>
    </div>
  );
}
