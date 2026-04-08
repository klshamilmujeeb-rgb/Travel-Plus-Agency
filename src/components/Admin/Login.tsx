import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plane, Lock, User, ArrowRight } from 'lucide-react';
import netlifyIdentity from 'netlify-identity-widget';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const openNetlifyModal = () => {
    netlifyIdentity.open('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-2xl border border-slate-200/50 p-10 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="text-center mb-10">
            <div className="inline-flex bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20 mb-6">
              <Plane className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Admin Portal</h1>
            <p className="text-slate-500 font-medium">Secure access for TravelPlus administrators.</p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={openNetlifyModal}
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group"
            >
              Admin Login
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-center text-slate-400 text-xs font-medium px-4">
              Authorized personnel only. Access is monitored and logged.
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          © 2026 TravelPlus Kozhikode. Powered by Netlify Identity.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
