import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Users, Clock, DollarSign, Award, Star, Eye, MessageSquare, TrendingUp, Shield, Target, Zap, ChevronDown, SlidersHorizontal, ArrowUpRight, Crown, BookOpen, Globe, X, PlusCircle } from 'lucide-react';
import { ethers } from 'ethers';
// === HELPER DATA & ASSETS ===
// Sample data for bounties (Expert view)
const bountiesData = [
  {
    id: 1,
    title: 'Best AI model for real-time sentiment analysis?',
    description: 'Need recommendations for production-ready sentiment analysis with <100ms latency for financial trading applications...',
    amount: '5,000 XRP',
    timeLeft: '18h left',
    answers: 12,
    competitors: 8,
    views: '2.1k',
    difficulty: 'Hard',
    category: 'AI/ML',
    competitionLevel: 'High'
  },
  {
    id: 2,
    title: 'Optimal smart contract architecture for DEX',
    description: 'Looking for gas-efficient contract design patterns for high-frequency DEX operations on XRPL EVM sidechain...',
    amount: '1,200 XRP',
    timeLeft: '5h left',
    answers: 7,
    competitors: 5,
    views: '840',
    difficulty: 'Medium',
    category: 'Blockchain',
    competitionLevel: 'Medium'
  },
  {
    id: 3,
    title: 'Zero-knowledge proof implementation guide',
    description: 'Comprehensive tutorial on implementing zk-SNARKs for privacy-preserving transactions with code examples...',
    amount: '3,500 XRP',
    timeLeft: '4d left',
    answers: 4,
    competitors: 3,
    views: '1.5k',
    difficulty: 'Hard',
    category: 'Blockchain',
    competitionLevel: 'Low'
  },
  {
    id: 4,
    title: 'Mobile app security best practices 2024',
    description: 'Latest security patterns for React Native apps handling crypto wallets and sensitive user data...',
    amount: '800 XRP',
    timeLeft: '2d left',
    answers: 9,
    competitors: 6,
    views: '920',
    difficulty: 'Easy',
    category: 'Security',
    competitionLevel: 'Medium'
  }
];

// Sample data for answers (Client view)
let initialAnswersData = [
  {
    id: 1,
    bountyTitle: 'Best AI model for real-time sentiment analysis?',
    expertName: 'Alice Chen',
    expertInitials: 'AC',
    expertSpecialty: 'AI/ML Engineer',
    reputation: '892',
    verified: true,
    preview: 'Based on my extensive analysis of transformer architectures, I recommend using DistilBERT fine-tuned with financial data. Here\'s why: 1) Latency optimization through knowledge distillation...',
    fullAnswer: 'Based on my extensive analysis of transformer architectures and their performance in high-frequency financial contexts, I recommend using a fine-tuned DistilBERT model. This choice is based on several key factors: 1) Latency Optimization: DistilBERT is a smaller, faster version of BERT, making it ideal for the sub-100ms latency requirement. Its architecture, which uses knowledge distillation, maintains 97% of BERT\'s performance with a 40% reduction in size. 2) Domain Specificity: The model should be fine-tuned on a large corpus of financial news, social media chatter, and market reports to understand the nuanced language of the financial sector. 3) Scalability: This model can be easily deployed in a microservices architecture, allowing for horizontal scaling to handle peak trading volumes. I have also included a code snippet for setting up the fine-tuning pipeline and an example inference script.',
    rating: 4.8,
    upvotes: 23,
    submittedAt: '2h ago',
    status: 'winning',
    category: 'AI/ML',
    bountyAmount: '5,000 XRP',
    stakeAmount: '15 XRP' // Example stake amount
  },
  {
    id: 2,
    bountyTitle: 'Optimal smart contract architecture for DEX',
    expertName: 'Bob Rodriguez',
    expertInitials: 'BR',
    expertSpecialty: 'Smart Contract Dev',
    reputation: '756',
    verified: true,
    preview: 'For high-frequency DEX operations, I suggest implementing a multi-tier architecture with proxy contracts and batch processing. Key components include: 1) Diamond pattern for upgradeability...',
    fullAnswer: 'For a high-frequency DEX operating on the XRPL EVM sidechain, implementing a multi-tier smart contract architecture is crucial for both gas efficiency and security. My proposed solution uses a "Diamond" pattern (EIP-2535) for upgradeability, which allows for different functions to be stored in separate contracts (facets) and accessed via a single proxy. This modular approach reduces gas costs for updates and makes the system more resilient. Key components include: 1) The Main Proxy Contract: Acts as the single entry point. 2) Facet Contracts: Separate contracts for trading logic, liquidity management, and governance. 3) Batch Processing Logic: A custom function that allows for multiple swaps to be processed in a single transaction, significantly reducing transaction fees for users. The code includes a detailed implementation of the Diamond pattern and an example of the batch processing logic in Solidity.',
    rating: 4.6,
    upvotes: 15,
    submittedAt: '4h ago',
    status: 'competing',
    category: 'Blockchain',
    bountyAmount: '1,200 XRP',
    stakeAmount: '5 XRP'
  },
  {
    id: 3,
    bountyTitle: 'Zero-knowledge proof implementation guide',
    expertName: 'Rahul Singh',
    expertInitials: 'AC',
    expertSpecialty: 'Blockchain',
    reputation: '812',
    verified: true,
    preview: 'This comprehensive guide covers zk-SNARK implementation from theory to practice. Starting with the mathematical foundations: 1) Quadratic Arithmetic Programs (QAPs)...',
    fullAnswer: 'This comprehensive guide covers zk-SNARK implementation from theory to practice, specifically focusing on the libsnark library. The guide is structured as follows: 1) Mathematical Foundations: An overview of Quadratic Arithmetic Programs (QAPs) and Elliptic Curve pairings. 2) Circuit Design: How to model a computation as an arithmetic circuit. 3) Prover and Verifier: Step-by-step code examples for creating a prover (to generate a proof) and a verifier (to check the proof). 4) Practical Applications: Use cases for zk-SNARKs, such as private transactions and verifiable computation. The code provided is fully runnable and includes a simple example of proving knowledge of a number without revealing the number itself.',
    rating: 4.9,
    upvotes: 31,
    submittedAt: '1d ago',
    status: 'winning',
    category: 'Blockchain',
    bountyAmount: '3,500 XRP',
    stakeAmount: '25 XRP'
  }
];

const featuredExpertsData = [
  { name: 'Alice Chen', initials: 'AC', specialty: 'AI/ML', winRate: '94%' },
  { name: 'Bob Rodriguez', initials: 'BR', specialty: 'Blockchain', winRate: '89%' },
  { name: 'Carol Wong', initials: 'CW', specialty: 'Security', winRate: '91%' }
];

// === COMPONENT DEFINITIONS ===

// Header Component
const SearchHeader = ({ onBack, viewMode, onViewModeChange }) => {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft size={20} />
              <span><a href='/'>Back to Dashboard</a></span>
            </button>
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Search & Discovery
            </div>
          </div>
          <div className="bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => onViewModeChange('expert')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'expert'
                  ? 'bg-gradient-to-r from-emerald-400 to-blue-500 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Crown size={16} />
                Expert View
              </div>
            </button>
            <button
              onClick={() => onViewModeChange('client')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'client'
                  ? 'bg-gradient-to-r from-emerald-400 to-blue-500 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Search size={16} />
                Client View
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Search Bar Component
const SearchBar = ({ searchQuery, onSearchChange, viewMode }) => {
  const placeholder = viewMode === 'expert'
    ? "Search bounties to answer..."
    : "Search for answers, experts, or topics...";
  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-16 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 backdrop-blur-sm"
        />
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-400 to-blue-500 text-white p-2 rounded-lg hover:scale-105 transition-transform">
          <Search size={16} />
        </button>
      </div>
    </div>
  );
};

// Filter Panel Component
const FilterPanel = ({ filters, onFilterChange, viewMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <SlidersHorizontal size={20} />
          Filters
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/60 hover:text-white transition-colors"
        >
          <ChevronDown size={20} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
            >
              <option value="">All Categories</option>
              <option value="ai-ml">AI/Machine Learning</option>
              <option value="blockchain">Blockchain</option>
              <option value="security">Security</option>
              <option value="mobile">Mobile Development</option>
              <option value="web3">Web3</option>
            </select>
          </div>

          {/* Bounty Amount / Price Range */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              {viewMode === 'expert' ? 'Bounty Amount' : 'Price Range'}
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) => onFilterChange('priceRange', e.target.value)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
            >
              <option value="">Any Amount</option>
              <option value="0-1000">0 - 1,000 XRP</option>
              <option value="1000-5000">1,000 - 5,000 XRP</option>
              <option value="5000-10000">5,000 - 10,000 XRP</option>
              <option value="10000+">10,000+ XRP</option>
            </select>
          </div>

          {/* Time Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              {viewMode === 'expert' ? 'Time Remaining' : 'Answer Date'}
            </label>
            <select
              value={filters.timeFilter}
              onChange={(e) => onFilterChange('timeFilter', e.target.value)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
            >
              <option value="">Any Time</option>
              <option value="24h">Next 24 hours</option>
              <option value="3d">Next 3 days</option>
              <option value="1w">Next week</option>
              <option value="1m">This month</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
            >
              {viewMode === 'expert' ? (
                <>
                  <option value="amount">Bounty Amount</option>
                  <option value="deadline">Deadline</option>
                  <option value="competition">Competition Level</option>
                  <option value="recent">Most Recent</option>
                </>
              ) : (
                <>
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rated</option>
                  <option value="recent">Most Recent</option>
                  <option value="expert-reputation">Expert Reputation</option>
                </>
              )}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

// Bounty Card for Expert View
const BountyCard = ({ bounty, onApply, onViewDetails }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-emerald-400/30 hover:transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          {bounty.amount}
        </div>
        <div className="text-white/60 text-sm flex items-center gap-1">
          <Clock size={14} />
          {bounty.timeLeft}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-3">{bounty.title}</h3>
      <p className="text-white/70 text-sm mb-4 leading-relaxed">{bounty.description}</p>

      <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
        <span className="flex items-center gap-1">
          <MessageSquare size={14} />
          {bounty.answers} answers
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} />
          {bounty.competitors} competing
        </span>
        <span className="flex items-center gap-1">
          <Eye size={14} />
          {bounty.views} views
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${
            bounty.difficulty === 'Easy' ? 'bg-green-400/20 text-green-400' :
            bounty.difficulty === 'Medium' ? 'bg-yellow-400/20 text-yellow-400' :
            'bg-red-400/20 text-red-400'
          }`}>
            {bounty.difficulty}
          </span>
          <span className="text-emerald-400 text-sm">{bounty.category}</span>
        </div>
        <div className="text-white/60 text-sm">
          Competition: {bounty.competitionLevel}
        </div>
      </div>

      <div className="flex gap-3">
        <button
         onClick={() => onApply(bounty.id)}
          className="flex-1 bg-gradient-to-r from-emerald-400 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:scale-105 transition-transform"
        >
          Apply to Answer
        </button>
        <button
          onClick={() => onViewDetails(bounty.id)}
          className="bg-white/10 border border-white/20 text-white/80 py-2 px-4 rounded-lg font-medium hover:bg-white/20 transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  );
};

// Answer Card for Client View
const AnswerCard = ({ answer, onViewFull, onStake, stakingStatus }) => {
  const stakeButtonText = () => {
    if (stakingStatus === 'pending') {
      return 'Staking...';
    } else if (stakingStatus === 'success') {
      return 'Staked!';
    } else if (stakingStatus === 'failed') {
      return 'Failed';
    }
    return `Stake ${answer.stakeAmount}`;
  };
  
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-emerald-400/30 hover:transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold">
            {answer.expertInitials}
          </div>
          <div>
            <h4 className="font-semibold text-white flex items-center gap-2">
              {answer.expertName}
              {answer.verified && <Shield className="text-emerald-400" size={16} />}
            </h4>
            <p className="text-white/60 text-sm">{answer.expertSpecialty}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-emerald-400 font-semibold">{answer.reputation}</div>
          <div className="text-white/60 text-xs">Reputation</div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-3">{answer.bountyTitle}</h3>
      <p className="text-white/70 text-sm mb-4 leading-relaxed">{answer.preview}</p>

      <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
        <span className="flex items-center gap-1">
          <Star size={14} />
          {answer.rating}/5.0
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare size={14} />
          {answer.upvotes} upvotes
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {answer.submittedAt}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${
            answer.status === 'winning' ? 'bg-emerald-400/20 text-emerald-400' :
            answer.status === 'competing' ? 'bg-yellow-400/20 text-yellow-400' :
            'bg-blue-400/20 text-blue-400'
          }`}>
            {answer.status}
          </span>
          <span className="text-emerald-400 text-sm">{answer.category}</span>
        </div>
        <div className="text-white font-semibold">
          {answer.bountyAmount}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onViewFull(answer.id)}
          className="flex-1 bg-gradient-to-r from-emerald-400 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:scale-105 transition-transform"
        >
          View Full Answer
        </button>
        <button
          onClick={() => onStake(answer.id)}
          className={`bg-white/10 border border-white/20 text-white/80 py-2 px-4 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center gap-1 ${stakingStatus === 'pending' ? 'animate-pulse' : ''}`}
          disabled={stakingStatus === 'pending' || stakingStatus === 'success'}
        >
          {stakingStatus === 'pending' ? <Zap size={14} /> : <Target size={14} />}
          {stakeButtonText()}
        </button>
      </div>
    </div>
  );
};

// Answer Modal Component
const AnswerModal = ({ answer, onClose }) => {
  if (!answer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-black/50 border border-white/10 shadow-xl p-8 text-white">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
          <X size={24} />
        </button>

        {/* Modal content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">
            {answer.bountyTitle}
          </h2>
          <div className="flex items-center gap-2 mb-4 text-sm text-white/60">
            <span>by</span>
            <span className="font-semibold text-white">{answer.expertName}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <Star size={14} />
              {answer.rating}/5.0
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={14} />
              {answer.upvotes} upvotes
            </span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-white/80">
          <p>{answer.fullAnswer}</p>
          {/* Mock additional content if needed */}
          <h4 className="mt-6 mb-2 text-white font-semibold">Summary of Key Points</h4>
          <ul className="list-disc list-inside">
            <li>Detailed technical explanation.</li>
            <li>Code example provided (hypothetically).</li>
            <li>Explanation of benefits and trade-offs.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Submission Modal Component for Experts
const SubmitAnswerModal = ({ bounties, onSubmit, onClose }) => {
  const [bountyId, setBountyId] = useState('');
  const [expertName, setExpertName] = useState('');
  const [fullAnswer, setFullAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bountyId && expertName && fullAnswer) {
      const selectedBounty = bounties.find(b => b.id === parseInt(bountyId));
      if (selectedBounty) {
        onSubmit({
          id: Math.random(), // Unique ID for new answer
          bountyTitle: selectedBounty.title,
          expertName,
          expertInitials: expertName.split(' ').map(n => n[0]).join('').toUpperCase(),
          expertSpecialty: 'Freelance Expert', // Example
          reputation: '100', // Example
          verified: false,
          preview: fullAnswer.substring(0, 100) + '...',
          fullAnswer,
          rating: 0,
          upvotes: 0,
          submittedAt: 'just now',
          status: 'competing',
          category: selectedBounty.category,
          bountyAmount: selectedBounty.amount,
          stakeAmount: '5 XRP'
          
        });
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-black/50 border border-white/10 shadow-xl p-8 text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-6">
          Submit Your Answer
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Bounty</label>
            <select
              value={bountyId}
              onChange={(e) => setBountyId(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-400"
              required
            >
              <option value="">Select a bounty...</option>
              {bounties.map(bounty => (
                <option key={bounty.id} value={bounty.id}>{bounty.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-2">Your Name</label>
            <input
              type="text"
              value={expertName}
              onChange={(e) => setExpertName(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-emerald-400"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-2">Your Answer</label>
            <textarea
              value={fullAnswer}
              onChange={(e) => setFullAnswer(e.target.value)}
              className="w-full p-3 h-40 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-emerald-400"
              placeholder="Provide a comprehensive and detailed answer..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:scale-105 transition-transform"
          >
            Submit Answer
          </button>
        </form>
      </div>
    </div>
  );
};


// Results Stats Component
const ResultsStats = ({ totalResults, viewMode, searchQuery }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-white/80">
        <span className="font-semibold text-white">{totalResults.toLocaleString()}</span>
        {' '}
        {viewMode === 'expert' ? 'bounties' : 'answers'} found
        {searchQuery && (
          <span> for "<span className="text-emerald-400">{searchQuery}</span>"</span>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm text-white/60">
        <span>Updated 2 minutes ago</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span>Live results</span>
        </div>
      </div>
    </div>
  );
};

// Expert Spotlight (for Client View)
const ExpertSpotlight = ({ experts }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Crown className="text-emerald-400" />
        Featured Experts
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {experts.map((expert, index) => (
          <div key={index} className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold">
                {expert.initials}
              </div>
              <div>
                <h4 className="font-semibold text-white">{expert.name}</h4>
                <p className="text-white/60 text-sm">{expert.specialty}</p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Win Rate:</span>
              <span className="text-emerald-400 font-semibold">{expert.winRate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Search Component
const SearchAndDiscoveryPage = () => {
  const [viewMode, setViewMode] = useState('expert'); // 'expert' or 'client'
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    timeFilter: '',
    sortBy: viewMode === 'expert' ? 'amount' : 'relevance'
  });
  const [bounties, setBounties] = useState(bountiesData);
  const [answers, setAnswers] = useState(initialAnswersData);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [stakingStatus, setStakingStatus] = useState({});

  const featuredExperts = featuredExpertsData;

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      sortBy: viewMode === 'expert' ? 'amount' : 'relevance'
    }));
  }, [viewMode]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleViewFullAnswer = (id) => {
    const answer = answers.find(ans => ans.id === id);
    if (answer) {
      setModalContent(answer);
      setShowAnswerModal(true);
    }
  };

  const handleCloseAnswerModal = () => {
    setShowAnswerModal(false);
    setModalContent(null);
  };

  const handleOpenSubmitModal = () => {
    setShowSubmitModal(true);
  };

  const handleCloseSubmitModal = () => {
    setShowSubmitModal(false);
  };

  const handleSubmitAnswer = async (newAnswer) => {
    try {
        if (!window.ethereum) {
            throw new Error("MetaMask is not installed.");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        // Check and switch network if needed
        if (network.chainId !== Number(xrpEvmTestnetDetails.chainId)) {
            console.log("Switching to XRPL EVM Sidechain Testnet...");
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: xrpEvmTestnetDetails.chainId }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [xrpEvmTestnetDetails],
                        });
                    } catch (addError) {
                        throw new Error(`Failed to add XRPL EVM sidechain: ${addError.message}`);
                    }
                } else {
                    throw new Error(`Failed to switch to XRPL EVM sidechain: ${switchError.message}`);
                }
            }
        }

        const accounts = await provider.send("eth_requestAccounts", []);
        const address = accounts[0];

        // This should be your smart contract address
        const recipient = "0xE3581A87be446994CF5ba94b892ff18f5038a815";

        // Parse the amount string (e.g., "10 XRP") and convert to Wei
        const valueInXRP = '10';
        const stakeValue = ethers.parseEther(valueInXRP);

        const signer = await provider.getSigner();

        const tx = await signer.sendTransaction({
            to: recipient,
            value: stakeValue,
        });

        console.log("Transaction sent with hash:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);

    } catch (err) {
        console.error("Transaction failed:", err);
    }
    const nnA = {
        id: 4,
        bountyTitle: newAnswer.bountyTitle,
        expertName: newAnswer.expertName,
        expertInitials: newAnswer.expertInitials,
        expertSpecialty: newAnswer.expertSpecialty,
        reputation: '200',
        verified: true,
        preview: newAnswer.fullAnswer.substring(0, 100) + '...',
        fullAnswer: newAnswer.fullAnswer,
        rating: 0,
        upvotes: 0,
        submittedAt: 'just now',
        status: 'competing',
        category: 'Blockchain',
        bountyAmount: newAnswer.bountyAmount,
        stakeAmount: '5 XRP'
      };
      initialAnswersData.push(nnA);
    
  };
  const xrpEvmTestnetDetails = {
    chainId: '0x161c28', // 1440001 in hex
    chainName: 'XRPL EVM Sidechain Testnet',
    nativeCurrency: {
      name: 'XRP',
      symbol: 'XRP',
      decimals: 18
    },
    rpcUrls: ['https://rpc.testnet.xrplevm.org'],
    blockExplorerUrls: ['https://explorer.evm-sidechain.xrpl.org']
  };
  

  const handleStakeClick = async (stakeAmount) => {
    
    try {
        if (!window.ethereum) {
            throw new Error("MetaMask is not installed.");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        // Check and switch network if needed
        if (network.chainId !== Number(xrpEvmTestnetDetails.chainId)) {
            console.log("Switching to XRPL EVM Sidechain Testnet...");
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: xrpEvmTestnetDetails.chainId }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [xrpEvmTestnetDetails],
                        });
                    } catch (addError) {
                        throw new Error(`Failed to add XRPL EVM sidechain: ${addError.message}`);
                    }
                } else {
                    throw new Error(`Failed to switch to XRPL EVM sidechain: ${switchError.message}`);
                }
            }
        }

        const accounts = await provider.send("eth_requestAccounts", []);
        const address = accounts[0];

        // This should be your smart contract address
        const recipient = "0xE3581A87be446994CF5ba94b892ff18f5038a815";

        // Parse the amount string (e.g., "10 XRP") and convert to Wei
        const valueInXRP = '10';
        const stakeValue = ethers.parseEther(valueInXRP);

        const signer = await provider.getSigner();

        const tx = await signer.sendTransaction({
            to: recipient,
            value: stakeValue,
        });

        console.log("Transaction sent with hash:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);

    } catch (err) {
        console.error("Transaction failed:", err);
    }
    const answerToUpdate = initialAnswersData.find(answer => answer.id === 1);
    
};

  const handleStake = async (id) => {
    // The original `handleStake` function was a simulation, not a real transaction.
    // I have renamed the corrected function to `handleStakeClick` as it's the one
    // called by the button. You can remove this function if you want to use the
    // real transaction logic.
    console.log(`Mimicking a stake transaction for answer ID: ${id}`);
    setStakingStatus(prev => ({ ...prev, [id]: 'pending' }));

    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate a successful transaction
    const success = Math.random() > 0.1; // 90% chance of success
    if (success) {
      console.log('Transaction successful!');
      setStakingStatus(prev => ({ ...prev, [id]: 'success' }));
      // Find the answer and increment its upvotes
      setAnswers(prevAnswers =>
        prevAnswers.map(answer =>
          answer.id === id
            ? { ...answer, upvotes: answer.upvotes + 1 }
            : answer
        )
      );
    } else {
      console.error('Transaction failed.');
      setStakingStatus(prev => ({ ...prev, [id]: 'failed' }));
    }

    // Reset status after a short period, except for success
    if (stakingStatus[id] !== 'success') {
      setTimeout(() => {
        setStakingStatus(prev => ({ ...prev, [id]: null }));
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen text-white" style={{
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <SearchHeader
        onBack={() => console.log('Navigate back')}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      <div className="mt-20 px-6 max-w-7xl mx-auto py-8">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
        />

        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
        />

        {viewMode === 'client' && (
          <ExpertSpotlight experts={featuredExperts} />
        )}

        <ResultsStats
          totalResults={viewMode === 'expert' ? bounties.length : answers.length}
          viewMode={viewMode}
          searchQuery={searchQuery}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {viewMode === 'expert' ? (
            bounties.map((bounty) => (
              <BountyCard
                key={bounty.id}
                bounty={bounty}
                onApply={handleOpenSubmitModal}
                onViewDetails={(id) => console.log('View bounty details', id)}
              />
            ))
          ) : (
            answers.map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                onViewFull={handleViewFullAnswer}
                onStake={handleStakeClick}
                stakingStatus={stakingStatus[answer.id]}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button for Experts */}
      {/* {viewMode === 'expert' && (
        <button
          onClick={handleOpenSubmitModal}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white shadow-lg hover:scale-110 transition-transform flex items-center gap-2"
        >
          <PlusCircle size={24} />
          <span className="hidden md:inline">Submit Answer</span>
        </button>
      )} */}

      {/* Modals are rendered here */}
      {showAnswerModal && <AnswerModal answer={modalContent} onClose={handleCloseAnswerModal} />}
      {showSubmitModal && <SubmitAnswerModal bounties={bounties} onSubmit={handleSubmitAnswer} onClose={handleCloseSubmitModal} />}
    </div>
  );
};


export default SearchAndDiscoveryPage;