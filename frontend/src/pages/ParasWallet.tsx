import React from 'react';
import { motion } from 'framer-motion';
import { Gem, TrendingUp, Award, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ParasWallet: React.FC = () => {
  const { userData, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading your wallet...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show sign-in prompt if no user data
  if (!userData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center pt-24">
          <div className="text-center max-w-md px-4">
            <Gem className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
            <p className="text-slate-400 mb-6">Please sign in to view your Paras Wallet</p>
            <button
              onClick={() => navigate('/signin')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Safe getter with default values
  const parasStones = userData.parasStones ?? 0;
  const rupeeValue = (parasStones / 100).toFixed(2);
  const transactionHistory = userData.parasHistory ?? [];

  const earnOpportunities = [
    { icon: Award, title: 'Answer Blog Questions', reward: '10 stones', description: 'Correctly answer quiz questions in blogs' },
    { icon: Calendar, title: 'Attend Events', reward: '50 stones', description: 'Participate in workshops and talks' },
    { icon: TrendingUp, title: 'Contribute Content', reward: '100 stones', description: 'Write approved blog posts' },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Paras Wallet
            </h1>
            <p className="text-slate-400">Earn, track, and spend your Paras Stones</p>
          </motion.div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-2 border-amber-400/30 rounded-3xl p-8 md:p-12 mb-12 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="relative z-10 text-center">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Gem className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              </motion.div>
              <p className="text-sm text-amber-300 mb-2">Your Balance</p>
              <h2 className="text-6xl md:text-7xl font-bold text-amber-100 mb-4">
                {parasStones.toLocaleString()}
              </h2>
              <p className="text-amber-300/80 text-lg">
                Paras Stones ≈ <span className="font-semibold">₹{rupeeValue}</span>
              </p>
              <p className="text-xs text-amber-300/60 mt-2">100 Paras Stones = ₹1</p>
            </div>
          </motion.div>

          {/* Earn Opportunities */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Ways to Earn Paras Stones</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {earnOpportunities.map((opportunity, index) => {
                const Icon = opportunity.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:border-amber-400/40 transition-all"
                  >
                    <Icon className="w-10 h-10 text-amber-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">{opportunity.title}</h3>
                    <p className="text-amber-400 font-semibold mb-2">{opportunity.reward}</p>
                    <p className="text-sm text-slate-400">{opportunity.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
              {transactionHistory && transactionHistory.length > 0 ? (
                <div className="space-y-4">
                  {transactionHistory.slice().reverse().slice(0, 10).map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'earned' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          <Gem className={`w-5 h-5 ${
                            transaction.type === 'earned' ? 'text-green-400' : 'text-red-400'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{transaction.reason}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(transaction.timestamp).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <p className={`text-lg font-bold ${
                        transaction.type === 'earned' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Gem className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-2">No transactions yet</p>
                  <p className="text-sm text-slate-500">Start earning Paras Stones by participating in activities!</p>
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              How to Use Paras Stones
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Use Paras Stones to get discounts on paid events and workshops</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>100 Paras Stones = ₹1 discount on any registration</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Earn more by actively participating in blog quizzes and community activities</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Your Paras Stones never expire - keep earning and saving!</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ParasWallet;
