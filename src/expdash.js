import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Users, Award, Zap, LineChart, DollarSign, Shield, Star, MessageSquare, Eye, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

// Header Component for Expert Page
// const ExpertHeader = ({ onBack }) => {
//   return (
//     <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         <div className="flex items-center gap-4">
//           <button 
//             onClick={onBack}
//             className="flex items-center gap-2 text-white/80 hover:text-emerald-400 transition-colors"
//           >
//             <ArrowLeft size={20} />
//             <span>Back to Dashboard</span>
//           </button>
//           <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
//             AXON Protocol
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// Token Price Widget
const TokenPriceWidget = ({ token, price, change, marketCap, volume }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-gradient-to-br from-emerald-900/20 to-blue-900/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white">${token} Token</h3>
          <p className="text-white/60">Expert Reputation Token</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{price} XRP</div>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span className="font-semibold">{change}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-white/60 text-sm">Market Cap</p>
          <p className="text-white font-semibold">{marketCap}</p>
        </div>
        <div>
          <p className="text-white/60 text-sm">24h Volume</p>
          <p className="text-white font-semibold">{volume}</p>
        </div>
      </div>
    </div>
  );
};

// Bonding Curve Chart Component
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

// Holdings Distribution
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

// Current Activity Feed
const CurrentActivity = ({ activities }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Current Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="border-l-2 border-emerald-400/30 pl-4 pb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {activity.type === 'answer' && <MessageSquare size={16} className="text-emerald-400" />}
                {activity.type === 'bounty' && <Award size={16} className="text-blue-400" />}
                {activity.type === 'token' && <TrendingUp size={16} className="text-purple-400" />}
                <span className="font-semibold text-white">{activity.action}</span>
              </div>
              <span className="text-white/60 text-sm">{activity.time}</span>
            </div>
            <p className="text-white/80 text-sm mb-2">{activity.description}</p>
            {activity.amount && (
              <div className="text-emerald-400 font-semibold text-sm">
                +{activity.amount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Answer in Progress Card
const AnswerInProgress = ({ bounty }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-emerald-400 font-semibold">Currently Answering</span>
        </div>
        <div className="text-white/60 text-sm flex items-center gap-1">
          <Clock size={14} />
          {bounty.timeLeft}
        </div>
      </div>
      
      <h4 className="text-lg font-semibold text-white mb-2">{bounty.title}</h4>
      <p className="text-white/70 text-sm mb-4">{bounty.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          {bounty.reward}
        </div>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {bounty.views}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {bounty.competitors}
          </span>
        </div>
      </div>
      
      <div className="mt-4 bg-white/10 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm">Answer Progress</span>
          <span className="text-emerald-400 text-sm font-semibold">Draft Saved</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
        </div>
      </div>
    </div>
  );
};

// Performance Metrics
const PerformanceMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            {metric.icon}
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
          <div className="text-white/60 text-sm">{metric.label}</div>
          {metric.change && (
            <div className={`text-xs mt-1 flex items-center justify-center gap-1 ${
              metric.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {metric.change.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {metric.change}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Recent Answers Section
const RecentAnswers = ({ answers }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Recent Answers</h3>
      
      <div className="space-y-4">
        {answers.map((answer, index) => (
          <div key={index} className="border border-white/10 rounded-lg p-4 hover:border-emerald-400/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-white">{answer.bountyTitle}</h4>
              <div className="flex items-center gap-2">
                {answer.status === 'won' && <Award size={16} className="text-yellow-400" />}
                {answer.status === 'pending' && <Clock size={16} className="text-blue-400" />}
                <span className={`text-sm px-2 py-1 rounded-full ${
                  answer.status === 'won' ? 'bg-yellow-400/20 text-yellow-400' :
                  answer.status === 'pending' ? 'bg-blue-400/20 text-blue-400' :
                  'bg-gray-400/20 text-gray-400'
                }`}>
                  {answer.status}
                </span>
              </div>
            </div>
            
            <p className="text-white/70 text-sm mb-3">{answer.preview}</p>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-4 text-white/60">
                <span className="flex items-center gap-1">
                  <Star size={14} />
                  {answer.upvotes}
                </span>
                <span>{answer.submittedAt}</span>
              </div>
              {answer.reward && (
                <div className="text-emerald-400 font-semibold">
                  +{answer.reward}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Alice Expert Page Component
const AliceExpertPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for Alice
  const aliceData = {
    name: 'Alice Chen',
    specialty: 'AI/ML Engineer',
    avatar: 'AC',
    verified: true,
    joinDate: 'March 2023',
    bio: 'Senior AI researcher with 8+ years in machine learning, specializing in NLP and computer vision. Former Google AI, published 40+ papers.',
    token: {
      symbol: 'ALICE',
      price: '2.34',
      change: '+12.5%',
      marketCap: '234.5K XRP',
      volume: '45.2K XRP',
      supply: 85000,
      crr: 0.45
    },
    currentBounty: {
      title: 'Best AI model for real-time sentiment analysis?',
      description: 'Working on comprehensive comparison of transformer models for low-latency sentiment analysis...',
      reward: '5,000 XRP',
      timeLeft: '18h left',
      views: '2.1k',
      competitors: '11 others'
    }
  };

  const performanceMetrics = [
    {
      icon: <Award className="text-emerald-400" size={24} />,
      value: '892',
      label: 'Reputation Score',
      change: '+15'
    },
    {
      icon: <TrendingUp className="text-blue-400" size={24} />,
      value: '94%',
      label: 'Win Rate',
      change: '+2%'
    },
    {
      icon: <DollarSign className="text-purple-400" size={24} />,
      value: '47',
      label: 'Bounties Won',
      change: '+3'
    },
    {
      icon: <Zap className="text-yellow-400" size={24} />,
      value: '156K',
      label: 'Total Earned',
      change: '+12K'
    }
  ];

  const activities = [
    {
      type: 'answer',
      action: 'Started answering',
      description: 'Best AI model for real-time sentiment analysis?',
      time: '2h ago',
      amount: null
    },
    {
      type: 'bounty',
      action: 'Won bounty',
      description: 'Optimal neural architecture for edge computing',
      time: '1d ago',
      amount: '3,200 XRP'
    },
    {
      type: 'token',
      action: 'Token price increased',
      description: 'ALICE token reached new 30-day high',
      time: '2d ago',
      amount: null
    }
  ];

  const recentAnswers = [
    {
      bountyTitle: 'Optimal neural architecture for edge computing',
      preview: 'Based on my analysis of MobileNet, EfficientNet, and custom architectures...',
      status: 'won',
      upvotes: 23,
      submittedAt: '3 days ago',
      reward: '3,200 XRP'
    },
    {
      bountyTitle: 'Transfer learning best practices for small datasets',
      preview: 'When dealing with limited training data, I recommend a progressive approach...',
      status: 'pending',
      upvotes: 15,
      submittedAt: '1 week ago',
      reward: null
    },
    {
      bountyTitle: 'Computer vision pipeline for autonomous vehicles',
      preview: 'Multi-modal sensor fusion using LIDAR and camera data requires...',
      status: 'won',
      upvotes: 31,
      submittedAt: '2 weeks ago',
      reward: '8,500 XRP'
    }
  ];

  const tokenHoldings = [
    { address: 'r3Kd...9xF2', tokens: '12,450', percentage: '14.6' },
    { address: 'rN8P...4mL9', tokens: '8,200', percentage: '9.6' },
    { address: 'rGH5...7nQ1', tokens: '6,100', percentage: '7.2' },
    { address: 'rM9X...2bR8', tokens: '4,800', percentage: '5.6' },
    { address: 'Others', tokens: '53,450', percentage: '62.9' }
  ];

  return (
    <div className="min-h-screen text-white" style={{
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      {/* <ExpertHeader onBack={() => console.log('Navigate back')} /> */}
      
      <div className="mt-20 px-6 max-w-7xl mx-auto py-8">
        {/* Expert Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex-1">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {aliceData.avatar}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{aliceData.name}</h1>
                  {aliceData.verified && (
                    <Shield className="text-emerald-400" size={24} />
                  )}
                </div>
                <p className="text-emerald-400 font-semibold mb-2">{aliceData.specialty}</p>
                <p className="text-white/70 mb-4">{aliceData.bio}</p>
                <p className="text-white/60 text-sm">Joined {aliceData.joinDate}</p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-80">
            <TokenPriceWidget
              token={aliceData.token.symbol}
              price={aliceData.token.price}
              change={aliceData.token.change}
              marketCap={aliceData.token.marketCap}
              volume={aliceData.token.volume}
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <PerformanceMetrics metrics={performanceMetrics} />
        </div>

        {/* Currently Answering Section */}
        <div className="mb-8">
          <AnswerInProgress bounty={aliceData.currentBounty} />
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <BondingCurveChart
            currentSupply={aliceData.token.supply}
            currentPrice={parseFloat(aliceData.token.price)}
            crr={aliceData.token.crr}
          />
          
          <HoldingsDistribution holdings={tokenHoldings} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CurrentActivity activities={activities} />
          <RecentAnswers answers={recentAnswers} />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AliceExpertPage;