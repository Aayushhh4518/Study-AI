import React from 'react';
import { motion } from 'framer-motion';

export function PageContainer({ children, title, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full max-w-7xl mx-auto p-4 md:p-8 ${className}`}
    >
      {title && <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">{title}</h1>}
      {children}
    </motion.div>
  );
}