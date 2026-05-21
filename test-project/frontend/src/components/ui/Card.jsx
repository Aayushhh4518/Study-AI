import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '', hover = false, ...props }) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover ? { whileHover: { y: -4, transition: { duration: 0.2 } } } : {};

  return (
    <Component
      className={`bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-6 ${className}`}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
}