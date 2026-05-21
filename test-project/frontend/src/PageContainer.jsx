import React from 'react';
import { motion } from 'framer-motion';

export default function PageContainer({ children, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto space-y-6"
    >
      {(title || description) && (
        <div className="mb-8">
          {title && <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>}
          {description && <p className="mt-2 text-gray-400">{description}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
}