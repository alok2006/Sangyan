import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Sparkles } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-slate-900 to-blue-900/20"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto">
        <motion.div 
          className="bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8 md:p-12 shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                Stay Updated
              </div>
            </motion.div>

            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Newsletter</span>
            </motion.h2>

            <motion.p 
              className="text-slate-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Get the latest research articles, event updates, and community highlights delivered to your inbox
            </motion.p>
          </div>

          <motion.form 
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {status === 'success' ? (
              <motion.div 
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Successfully subscribed!</span>
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status === 'loading' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            )}

            <motion.p 
              className="text-xs text-slate-500 mt-4 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              We respect your privacy. Unsubscribe at any time.
            </motion.p>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
