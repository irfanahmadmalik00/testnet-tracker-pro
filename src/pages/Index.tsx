
import React from 'react';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold mb-6">Crypto Airdrop & Testnet Tracker</h1>
        <p className="text-xl mb-8 text-muted-foreground">
          Track your airdrops, testnets, and crypto tools in one place
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-card p-6 rounded-xl shadow-subtle"
          >
            <h2 className="text-2xl font-bold mb-4">Airdrops</h2>
            <p className="text-muted-foreground">Manage and track all your crypto airdrops</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-card p-6 rounded-xl shadow-subtle"
          >
            <h2 className="text-2xl font-bold mb-4">Testnets</h2>
            <p className="text-muted-foreground">Keep up with testnet opportunities and rewards</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-card p-6 rounded-xl shadow-subtle"
          >
            <h2 className="text-2xl font-bold mb-4">Tools</h2>
            <p className="text-muted-foreground">Access essential crypto tools and resources</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
