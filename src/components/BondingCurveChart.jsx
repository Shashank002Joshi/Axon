import React from 'react';
import { Info } from 'lucide-react';

const BondingCurveChart = ({ currentSupply, currentPrice, crr }) => {
  const generateCurveData = () => {
    const points = [];
    for (let supply = 0; supply <= 200000; supply += 10000) {
      // Bancor formula: Price = Reserve / (Supply * CRR)
      // Simplified visualization curve
      const price = supply === 0 ? 0 : Math.pow(supply / 10000, 1 / crr) * 0.5;
      points.push({ supply, price });
    }
    return points;
  };

  const curveData = generateCurveData();
  const currentIndex = Math.floor(currentSupply / 10000);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Bonding Curve</h3>
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <Info size={16} />
          <span>45% CRR</span>
        </div>
      </div>
      
      <div className="relative h-64 mb-4">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Bonding curve */}
          <path
            d={`M 20 180 ${curveData.map((point, i) => 
              `L ${20 + (i * 360 / (curveData.length - 1))} ${180 - (point.price * 30)}`
            ).join(' ')}`}
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="3"
          />
          
          {/* Current position marker */}
          <circle
            cx={20 + (currentIndex * 360 / (curveData.length - 1))}
            cy={180 - (curveData[currentIndex]?.price * 30 || 0)}
            r="6"
            fill="#00ff88"
            className="animate-pulse"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="100%" stopColor="#0066ff" />
            </linearGradient>
          </defs>
          
          {/* Axes labels */}
          <text x="200" y="195" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="12">
            Token Supply
          </text>
          <text x="10" y="100" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="12" transform="rotate(-90 10 100)">
            Price (XRP)
          </text>
        </svg>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-white/60">Current Supply</p>
          <p className="text-white font-semibold">{currentSupply.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-white/60">Reserve Ratio</p>
          <p className="text-emerald-400 font-semibold">{crr * 100}%</p>
        </div>
        <div>
          <p className="text-white/60">Next Price</p>
          <p className="text-white font-semibold">2.41 XRP</p>
        </div>
      </div>
    </div>
  );
};

export default BondingCurveChart;
