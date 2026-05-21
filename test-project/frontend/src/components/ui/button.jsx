import React from 'react';
import { motion } from 'framer-motion';

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F19]";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]",
    secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/5 focus:ring-white/20",
    ghost: "hover:bg-white/5 text-gray-400 hover:text-white focus:ring-white/10",
    danger: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 focus:ring-rose-500"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}