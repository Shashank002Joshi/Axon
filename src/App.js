import React, { useState, useEffect } from 'react';
import { Plus, Wallet, Clock, Users, FileText, Diamond, TrendingUp } from 'lucide-react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "./output.css";
import AliceExpertPage from './expdash';
import SearchAndDiscoveryPage from './bounty';
import CuratorDashboard from './curatordash';
// Particle Background Component
const ParticleBackground = () => {
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.width = Math.random() * 6 + 2 + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
      
      return particle;
    };

    const container = document.getElementById('particles-container');
    if (container) {
      for (let i = 0; i < 50; i++) {
        container.appendChild(createParticle());
      }
    }
  }, []);

  return (
    <div 
      id="particles-container" 
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    />
  );
};

// Header Component
const Header = ({ onConnectWallet, isWalletConnected }) => {
  return (
    <Router>
    <header className="fixed top-0 w-full z-50 flex justify-between items-center p-6 backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
        AXON
      </div>
      <nav className="flex items-center gap-8">
      <a href="/" className="text-white/80 hover:text-emerald-400 transition-colors px-4 py-2 rounded-lg hover:bg-emerald-400/10">
          Home
        </a>
        <a href="/bounty_page" className="text-white/80 hover:text-emerald-400 transition-colors px-4 py-2 rounded-lg hover:bg-emerald-400/10">
          Bounties
        </a>
        <a href="/analytics" className="text-white/80 hover:text-emerald-400 transition-colors px-4 py-2 rounded-lg hover:bg-emerald-400/10">
          Experts
        </a>
        <a href="/curanalytics" className="text-white/80 hover:text-emerald-400 transition-colors px-4 py-2 rounded-lg hover:bg-emerald-400/10">
          Analytics
        </a>
        <a href="#" className="text-white/80 hover:text-emerald-400 transition-colors px-4 py-2 rounded-lg hover:bg-emerald-400/10">
          Docs
        </a>
        <button 
          onClick={onConnectWallet}
          className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Wallet size={18} />
          {isWalletConnected ? 'Connected' : 'Connect Wallet'}
        </button>
      </nav>
    </header>
    <Routes>
          
          <Route path="/analytics" element={<AliceExpertPage/>} />
          <Route path="/bounty_page" element={<SearchAndDiscoveryPage/>} />
          <Route path="/curanalytics" element={<CuratorDashboard/>} />
        
        </Routes>
    </Router>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="text-center py-16 mb-12">
      <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent leading-tight">
        Knowledge Economy
      </h1>
      <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
        Where expertise meets liquidity. Post bounties, stake on answers, and invest in expert reputation tokens on XRPL.
      </p>
      <div className="flex justify-center gap-12 mt-12">
        <div className="text-center">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            $2.4M
          </div>
          <div className="text-white/60 text-sm">Total Bounties</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            1,247
          </div>
          <div className="text-white/60 text-sm">Active Experts</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            98.3%
          </div>
          <div className="text-white/60 text-sm">Success Rate</div>
        </div>
      </div>
    </section>
  );
};

// Tab Navigation Component
const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'bounties', label: 'Active Bounties' },
    { id: 'experts', label: 'Top Experts' },
    { id: 'portfolio', label: 'My Portfolio' }
  ];

  return (
    <div className="flex gap-4 mb-8 bg-white/5 p-2 rounded-2xl backdrop-blur-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-8 py-4 rounded-xl font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-emerald-400 to-blue-500 text-white transform -translate-y-1 shadow-lg shadow-emerald-400/30'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Bounty Card Component
const BountyCard = ({ bounty, onSubmitAnswer, onViewDetails }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:transform hover:-translate-y-2 hover:border-emerald-400/30 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 cursor-pointer group relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          {bounty.amount} XRP
        </div>
        <div className="text-white/60 text-sm flex items-center gap-1">
          <Clock size={14} />
          {bounty.deadline}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-3 text-white">{bounty.title}</h3>
      <p className="text-white/70 text-sm mb-4 leading-relaxed">{bounty.description}</p>
      
      <div className="flex gap-4 mb-4 text-sm text-white/60">
        <div className="flex items-center gap-2">
          <FileText size={14} />
          {bounty.answers} answers
        </div>
        <div className="flex items-center gap-2">
          <Diamond size={14} />
          {bounty.staked} XRP staked
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} />
          {bounty.curators} curators
        </div>
      </div>
      
      <div className="flex gap-3">
        <button 
          onClick={() => onSubmitAnswer(bounty.id)}
          className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:transform hover:-translate-y-0.5 transition-transform"
        >
          Submit Answer
        </button>
        <button 
          onClick={() => onViewDetails(bounty.id)}
          className="bg-white/10 border border-white/20 text-white/80 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Bounties Grid Component
const BountiesGrid = ({ bounties, onSubmitAnswer, onViewDetails }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {bounties.map((bounty) => (
        <BountyCard
          key={bounty.id}
          bounty={bounty}
          onSubmitAnswer={onSubmitAnswer}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

// Expert Card Component
const ExpertCard = ({ expert }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:transform hover:-translate-y-2 hover:border-emerald-400/30 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold">
          {expert.initials}
        </div>
        <div>
          <h3 className="font-semibold text-white">{expert.name}</h3>
          <p className="text-white/60 text-sm">{expert.specialty}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-400">{expert.reputation}</div>
          <div className="text-xs text-white/60">Reputation</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-400">{expert.bounties}</div>
          <div className="text-xs text-white/60">Bounties Won</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-400">{expert.winRate}</div>
          <div className="text-xs text-white/60">Win Rate</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-400">{expert.staked}</div>
          <div className="text-xs text-white/60">XRP Staked</div>
        </div>
      </div>
      
      <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <span className="text-white/80">${expert.token} Token</span>
          <div className="text-right">
            <span className="font-bold text-emerald-400">{expert.price} XRP</span>
            <span className="text-sm text-emerald-400 ml-2 flex items-center gap-1">
              <TrendingUp size={12} />
              {expert.change}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Experts Grid Component
const ExpertsGrid = ({ experts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experts.map((expert) => (
        <ExpertCard key={expert.id} expert={expert} />
      ))}
    </div>
  );
};

// Portfolio Component
const Portfolio = ({ isWalletConnected, onConnectWallet }) => {
  if (!isWalletConnected) {
    return (
      <div className="text-center py-12 text-white/60">
        <h2 className="text-2xl font-bold mb-4 text-white">Connect your wallet to view portfolio</h2>
        <p className="mb-6">Track your bounties, expert investments, and curation rewards</p>
        <button 
          onClick={onConnectWallet}
          className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
        >
          <Wallet size={18} />
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold mb-6 text-white">Your Portfolio</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-2">Active Bounties</h3>
          <div className="text-3xl font-bold text-emerald-400">3</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-2">Total Staked</h3>
          <div className="text-3xl font-bold text-emerald-400">1,250 XRP</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-2">Rewards Earned</h3>
          <div className="text-3xl font-bold text-emerald-400">450 XRP</div>
        </div>
      </div>
    </div>
  );
};

// Create Bounty Modal Component
const CreateBountyModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    question: '',
    amount: '',
    deadline: '',
    category: 'AI/Machine Learning'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ question: '', amount: '', deadline: '', category: 'AI/Machine Learning' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900/95 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create Bounty</h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-white/90 mb-2 font-medium">Question</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full p-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              placeholder="What knowledge are you seeking?"
              rows={3}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-white/90 mb-2 font-medium">Bounty Amount (XRP)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full p-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              placeholder="1000"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-white/90 mb-2 font-medium">Deadline</label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full p-3 rounded-lg border border-white/20 bg-white/5 text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-white/90 mb-2 font-medium">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 rounded-lg border border-white/20 bg-white/5 text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            >
              <option>AI/Machine Learning</option>
              <option>Blockchain Development</option>
              <option>Security</option>
              <option>Mobile Development</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Create Bounty
          </button>
        </form>
      </div>
    </div>
  );
};

// Floating Action Button Component
const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 text-white rounded-full text-2xl font-bold hover:scale-110 transition-transform shadow-lg shadow-emerald-400/30 z-40"
    >
      <Plus size={24} className="mx-auto" />
    </button>
  );
};

// Main App Component
const AxonProtocolApp = () => {
  const [activeTab, setActiveTab] = useState('bounties');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [account, setAccount] = useState(null);
  // Define XRP EVM Testnet details
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

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_accounts", []);
          if (accounts.length > 0) {
            const network = await provider.getNetwork();
            // Check if the connected network is the XRP EVM Testnet
            if (network.chainId === parseInt(xrpEvmTestnetDetails.chainId, 16)) {
              setIsWalletConnected(true);
              setAccount(accounts[0]);
            } else {
              console.log("Connected to a different network. Please switch to XRPL EVM Sidechain Testnet.");
            }
          }
        } catch (error) {
          console.error("Error checking for connected accounts:", error);
        }
      }
    };
    checkIfWalletIsConnected();
  }, []);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        // Check if the current network is the XRP EVM Testnet
        if (network.chainId !== parseInt(xrpEvmTestnetDetails.chainId, 16)) {
          console.log("Switching to XRPL EVM Sidechain Testnet...");
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: xrpEvmTestnetDetails.chainId }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [xrpEvmTestnetDetails],
                });
              } catch (addError) {
                console.error("Failed to add the XRPL EVM sidechain:", addError);
                return;
              }
            } else {
              console.error("Failed to switch to XRPL EVM sidechain:", switchError);
              return;
            }
          }
        }
        
        // Request accounts after ensuring the correct network is selected
        const accounts = await provider.send("eth_requestAccounts", []);
        const address = accounts[0];
        
        setIsWalletConnected(true);
        setAccount(address);
        console.log("Successfully connected to XRPL EVM Sidechain Testnet with address:", address);
        
      } catch (error) {
        if (error.code === 4001) {
          console.log("User rejected wallet connection.");
        } else {
          console.error("Error connecting wallet:", error);
        }
        setIsWalletConnected(false);
        setAccount(null);
      }
    } else {
      window.open("https://metamask.io/download/", "_blank");
    }
  };
  // Sample data
  const bounties = [
    {
      id: 1,
      amount: '5,000',
      deadline: '2 days left',
      title: 'Best AI model for real-time sentiment analysis?',
      description: 'Need recommendations for production-ready sentiment analysis with <100ms latency for financial trading...',
      answers: 12,
      staked: '8,200',
      curators: 34
    },
    {
      id: 2,
      amount: '1,200',
      deadline: '5 hours left',
      title: 'Optimal smart contract architecture for DEX',
      description: 'Looking for gas-efficient contract design patterns for high-frequency DEX operations on XRPL EVM...',
      answers: 7,
      staked: '2,150',
      curators: 18
    },
    {
      id: 3,
      amount: '3,500',
      deadline: '1 week left',
      title: 'Zero-knowledge proof implementation guide',
      description: 'Comprehensive tutorial on implementing zk-SNARKs for privacy-preserving transactions...',
      answers: 4,
      staked: '1,850',
      curators: 12
    },
    {
      id: 4,
      amount: '800',
      deadline: '3 days left',
      title: 'Mobile app security best practices 2024',
      description: 'Latest security patterns for React Native apps handling crypto wallets and sensitive data...',
      answers: 9,
      staked: '650',
      curators: 21
    }
  ];

  const experts = [
    {
      id: 1,
      name: 'Alice Chen',
      initials: 'AC',
      specialty: 'AI/ML Engineer',
      reputation: 892,
      bounties: 47,
      winRate: '94%',
      staked: '156k',
      token: 'ALICE',
      price: '2.34',
      change: '+12.5%'
    },
    {
      id: 2,
      name: 'Bob Rodriguez',
      initials: 'BR',
      specialty: 'Smart Contract Dev',
      reputation: 756,
      bounties: 32,
      winRate: '89%',
      staked: '98k',
      token: 'BOB',
      price: '1.87',
      change: '+8.3%'
    },
    {
      id: 3,
      name: 'Carol Wong',
      initials: 'CW',
      specialty: 'Crypto Security',
      reputation: 623,
      bounties: 29,
      winRate: '91%',
      staked: '71k',
      token: 'CAROL',
      price: '1.52',
      change: '+5.7%'
    }
  ];

  

  const handleSubmitAnswer = (bountyId) => {
    console.log('Submit answer for bounty:', bountyId);
  };

  const handleViewDetails = (bountyId) => {
    console.log('View details for bounty:', bountyId);
  };

  const handleCreateBounty = (formData) => {
    console.log('Create bounty:', formData);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'bounties':
        return (
          <BountiesGrid
            bounties={bounties}
            onSubmitAnswer={handleSubmitAnswer}
            onViewDetails={handleViewDetails}
          />
        );
      case 'experts':
        return <ExpertsGrid experts={experts} />;
      case 'portfolio':
        return (
          <Portfolio
            isWalletConnected={isWalletConnected}
            onConnectWallet={handleConnectWallet}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-white relative">
      <ParticleBackground />
      
      <Header 
        onConnectWallet={handleConnectWallet}
        isWalletConnected={isWalletConnected}
      />
      
      <div className="mt-24 px-6 max-w-7xl mx-auto">
        <HeroSection />
        
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="animate-fadeIn">
          {renderContent()}
        </div>
      </div>
      
      <FloatingActionButton onClick={() => setIsCreateModalOpen(true)} />
      
      <CreateBountyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBounty}
      />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .particle {
          position: absolute;
          background: radial-gradient(circle, #00ff88, #0066ff);
          border-radius: 50%;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(15px) rotate(240deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AxonProtocolApp;