import React from 'react';
import { ArrowLeft } from 'lucide-react';

const ExpertHeader = ({ onBack }) => {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            AXON Protocol
          </div>
        </div>
      </div>
    </header>
  );
};

export default ExpertHeader;
