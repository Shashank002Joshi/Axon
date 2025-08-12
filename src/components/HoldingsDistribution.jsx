import React from 'react';

const HoldingsDistribution = ({ holdings }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Token Holders</h3>
      
      <div className="space-y-4">
        {holdings.map((holder, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                {holder.address.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-white/80">{holder.address}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{holder.tokens}</div>
              <div className="text-white/60 text-sm">{holder.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoldingsDistribution;
