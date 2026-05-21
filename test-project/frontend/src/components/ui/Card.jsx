import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '', noPadding = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl ${
        noPadding ? '' : 'p-6'
      } ${className}`}
      {...props}
    >
      {/* Subtle top glow effect for premium feel */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}