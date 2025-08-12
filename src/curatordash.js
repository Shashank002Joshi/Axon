import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, Award, Target, PieChart, BarChart3, Eye, Clock, Star, Shield, Info, Plus, Minus, ArrowUpRight, ArrowDownRight, Zap, Crown } from 'lucide-react';

// Header Component
// const CuratorHeader = ({ onBack, walletAddress }) => {
//   return (
//     <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={onBack}
//               className="flex items-center gap-2 text-white/80 hover:text-emerald-400 transition-colors"
//             >
//               <ArrowLeft size={20} />
//               <span>Back to Dashboard</span>
//             </button>
//             <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
//               Curator Portfolio
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <Crown className="text-yellow-400" size={20} />
//             <span className="text-white/80">{walletAddress}</span>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// Portfolio Overview Cards
const PortfolioOverview = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-emerald-400/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-400/20 to-blue-500/20">
              {stat.icon}
            </div>
            {stat.change && (
              <div className={`flex items-center gap-1 text-sm ${
                stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {stat.change.startsWith('+') ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change}
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-white/60 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

// Expert Token Holdings
const ExpertTokenHoldings = ({ holdings, onBuyMore, onSell }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Expert Token Holdings</h3>
        <div className="text-emerald-400 font-semibold">Total: 45,250 XRP</div>
      </div>
      
      <div className="space-y-4">
        {holdings.map((holding, index) => (
          <div key={index} className="border border-white/10 rounded-xl p-4 hover:border-emerald-400/30 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {holding.expertInitials}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{holding.expertName}</h4>
                  <p className="text-white/60 text-sm">{holding.specialty}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">${holding.token}</div>
                <div className={`text-sm flex items-center gap-1 ${
                  holding.priceChange.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {holding.priceChange.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {holding.priceChange}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <p className="text-white/60">Holdings</p>
                <p className="text-white font-semibold">{holding.amount}</p>
              </div>
              <div>
                <p className="text-white/60">Current Price</p>
                <p className="text-white font-semibold">{holding.currentPrice}</p>
              </div>
              <div>
                <p className="text-white/60">Total Value</p>
                <p className="text-white font-semibold">{holding.totalValue}</p>
              </div>
              <div>
                <p className="text-white/60">P&L</p>
                <p className={`font-semibold ${
                  holding.pnl.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {holding.pnl}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => onBuyMore(holding.token)}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors"
              >
                <Plus size={14} />
                Buy More
              </button>
              <button 
                onClick={() => onSell(holding.token)}
                className="flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-400/30 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
              >
                <Minus size={14} />
                Sell
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Active Stakes on Answers
const ActiveStakes = ({ stakes }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Active Answer Stakes</h3>
        <div className="text-blue-400 font-semibold">12 Active Stakes</div>
      </div>
      
      <div className="space-y-4">
        {stakes.map((stake, index) => (
          <div key={index} className="border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{stake.bountyTitle}</h4>
                <p className="text-white/70 text-sm mb-2">{stake.answerPreview}</p>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    by {stake.expertName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {stake.timeLeft}
                  </span>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-lg font-bold text-white">{stake.stakeAmount}</div>
                <div className="text-white/60 text-sm">Your Stake</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
              <div>
                <p className="text-white/60">Potential Return</p>
                <p className="text-emerald-400 font-semibold">{stake.potentialReturn}</p>
              </div>
              <div>
                <p className="text-white/60">Current Odds</p>
                <p className="text-white font-semibold">{stake.odds}</p>
              </div>
              <div>
                <p className="text-white/60">Status</p>
                <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                  stake.status === 'leading' ? 'bg-emerald-400/20 text-emerald-400' :
                  stake.status === 'competing' ? 'bg-yellow-400/20 text-yellow-400' :
                  'bg-red-400/20 text-red-400'
                }`}>
                  {stake.status}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-white/60">
                Staked {stake.stakedAgo} • {stake.totalStakers} stakers
              </div>
              <button className="text-emerald-400 text-sm hover:underline">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Curation Rewards History
const CurationRewards = ({ rewards }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Curation Rewards</h3>
        <div className="text-purple-400 font-semibold">This Month: +2,340 XRP</div>
      </div>
      
      <div className="space-y-3">
        {rewards.map((reward, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b border-white/10 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                reward.type === 'win' ? 'bg-emerald-400/20' :
                reward.type === 'participation' ? 'bg-blue-400/20' :
                'bg-yellow-400/20'
              }`}>
                {reward.type === 'win' ? <Award className="text-emerald-400" size={16} /> :
                 reward.type === 'participation' ? <Target className="text-blue-400" size={16} /> :
                 <Star className="text-yellow-400" size={16} />}
              </div>
              <div>
                <p className="text-white font-medium">{reward.description}</p>
                <p className="text-white/60 text-sm">{reward.bountyTitle}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-semibold">+{reward.amount}</div>
              <div className="text-white/60 text-xs">{reward.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Portfolio Performance Chart
const PortfolioChart = ({ chartData }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Portfolio Performance</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-lg text-sm">30D</button>
          <button className="px-3 py-1 text-white/60 rounded-lg text-sm hover:bg-white/10">90D</button>
          <button className="px-3 py-1 text-white/60 rounded-lg text-sm hover:bg-white/10">1Y</button>
        </div>
      </div>
      
      <div className="relative h-64 mb-4">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00ff88" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Grid */}
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Performance line */}
          <path
            d="M 20 160 L 60 140 L 100 120 L 140 110 L 180 95 L 220 105 L 260 85 L 300 70 L 340 60 L 380 50"
            fill="none"
            stroke="#00ff88"
            strokeWidth="3"
          />
          
          {/* Fill area */}
          <path
            d="M 20 160 L 60 140 L 100 120 L 140 110 L 180 95 L 220 105 L 260 85 L 300 70 L 340 60 L 380 50 L 380 180 L 20 180 Z"
            fill="url(#portfolioGradient)"
          />
        </svg>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-emerald-400 font-bold text-lg">+34.2%</div>
          <div className="text-white/60 text-sm">Total Return</div>
        </div>
        <div>
          <div className="text-white font-bold text-lg">67.8K XRP</div>
          <div className="text-white/60 text-sm">Portfolio Value</div>
        </div>
        <div>
          <div className="text-blue-400 font-bold text-lg">8.5%</div>
          <div className="text-white/60 text-sm">Monthly Yield</div>
        </div>
      </div>
    </div>
  );
};

// Investment Opportunities
const InvestmentOpportunities = ({ opportunities }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Investment Opportunities</h3>
      
      <div className="space-y-4">
        {opportunities.map((opp, index) => (
          <div key={index} className="border border-white/10 rounded-xl p-4 hover:border-emerald-400/30 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-white">{opp.title}</h4>
                <p className="text-white/70 text-sm">{opp.description}</p>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-semibold">{opp.expectedReturn}</div>
                <div className="text-white/60 text-sm">Expected Return</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {opp.timeframe}
                </span>
                <span className="flex items-center gap-1">
                  <Shield size={14} />
                  {opp.riskLevel}
                </span>
              </div>
              <button className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform">
                Invest Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Curator Dashboard Component
const CuratorDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Sample data
  const portfolioStats = [
    {
      icon: <DollarSign className="text-emerald-400" size={24} />,
      value: '67,850 XRP',
      label: 'Total Portfolio Value',
      change: '+12.4%'
    },
    {
      icon: <TrendingUp className="text-blue-400" size={24} />,
      value: '+34.2%',
      label: 'Total Returns',
      change: '+5.8%'
    },
    {
      icon: <Award className="text-purple-400" size={24} />,
      value: '23,450 XRP',
      label: 'Curation Rewards',
      change: '+18.9%'
    },
    {
      icon: <Target className="text-yellow-400" size={24} />,
      value: '12',
      label: 'Active Stakes',
      change: '+3'
    }
  ];

  const expertHoldings = [
    {
      expertName: 'Alice Chen',
      expertInitials: 'AC',
      specialty: 'AI/ML Engineer',
      token: 'ALICE',
      amount: '8,200',
      currentPrice: '2.34 XRP',
      totalValue: '19,188 XRP',
      priceChange: '+12.5%',
      pnl: '+2,340 XRP'
    },
    {
      expertName: 'Bob Rodriguez',
      expertInitials: 'BR',
      specialty: 'Smart Contract Dev',
      token: 'BOB',
      amount: '12,100',
      currentPrice: '1.87 XRP',
      totalValue: '22,627 XRP',
      priceChange: '+8.3%',
      pnl: '+1,890 XRP'
    },
    {
      expertName: 'Carol Wong',
      expertInitials: 'CW',
      specialty: 'Crypto Security',
      token: 'CAROL',
      amount: '2,400',
      currentPrice: '1.52 XRP',
      totalValue: '3,648 XRP',
      priceChange: '+5.7%',
      pnl: '+248 XRP'
    }
  ];

  const activeStakes = [
    {
      bountyTitle: 'Best AI model for real-time sentiment analysis?',
      answerPreview: 'Based on my analysis of transformer architectures...',
      expertName: 'Alice Chen',
      stakeAmount: '15 XRP',
      potentialReturn: '22 XRP',
      odds: '1.46x',
      status: 'leading',
      timeLeft: '14h left',
      stakedAgo: 'Just Now',
      totalStakers: '34'
    },
    {
      bountyTitle: 'Optimal smart contract architecture for DEX',
      answerPreview: 'Gas-efficient design patterns using proxy contracts...',
      expertName: 'Bob Rodriguez',
      stakeAmount: '1,800 XRP',
      potentialReturn: '2,880 XRP',
      odds: '1.6x',
      status: 'competing',
      timeLeft: '3h left',
      stakedAgo: '5d ago',
      totalStakers: '18'
    },
    {
      bountyTitle: 'Zero-knowledge proof implementation guide',
      answerPreview: 'Comprehensive zk-SNARK tutorial with code examples...',
      expertName: 'Alice Chen',
      stakeAmount: '3,200 XRP',
      potentialReturn: '5,760 XRP',
      odds: '1.8x',
      status: 'leading',
      timeLeft: '4d left',
      stakedAgo: '1w ago',
      totalStakers: '12'
    }
  ];

  const curationRewards = [
    {
      type: 'win',
      description: 'Winning stake reward',
      bountyTitle: 'Neural architecture for edge computing',
      amount: '1,240 XRP',
      date: '2h ago'
    },
    {
      type: 'participation',
      description: 'Curation participation reward',
      bountyTitle: 'Transfer learning best practices',
      amount: '340 XRP',
      date: '1d ago'
    },
    {
      type: 'bonus',
      description: 'Early curator bonus',
      bountyTitle: 'Computer vision pipeline for autonomous vehicles',
      amount: '760 XRP',
      date: '3d ago'
    }
  ];

  const investmentOpportunities = [
    {
      title: 'Rising Expert: David Kim',
      description: 'Blockchain security expert with 96% win rate, token undervalued',
      expectedReturn: '+45-65%',
      timeframe: '3-6 months',
      riskLevel: 'Medium'
    },
    {
      title: 'High-Stakes Bounty',
      description: 'Large bounty with clear leading answer, good odds',
      expectedReturn: '+180%',
      timeframe: '2 days',
      riskLevel: 'High'
    }
  ];

  return (
    <div className="min-h-screen text-white" style={{
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      {/* <CuratorHeader 
        onBack={() => console.log('Navigate back')} 
        walletAddress="rN8P...4mL9"
      /> */}
      
      <div className="mt-20 px-6 max-w-7xl mx-auto py-8">
        {/* Portfolio Overview */}
        <PortfolioOverview stats={portfolioStats} />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PortfolioChart />
          <ExpertTokenHoldings 
            holdings={expertHoldings}
            onBuyMore={(token) => console.log('Buy more', token)}
            onSell={(token) => console.log('Sell', token)}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ActiveStakes stakes={activeStakes} />
          <CurationRewards rewards={curationRewards} />
        </div>
        
        <InvestmentOpportunities opportunities={investmentOpportunities} />
      </div>
    </div>
  );
};

export default CuratorDashboard;