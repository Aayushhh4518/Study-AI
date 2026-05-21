import React from 'react';

export function Navbar() {
  return (
    <header className="h-20 w-full flex items-center justify-between px-8 bg-black/50 backdrop-blur-xl border-b border-white/[0.05] sticky top-0 z-30">
      <div className="flex items-center md:hidden">
        <span className="text-lg font-bold text-white">STUDY.AI</span>
      </div>
      <div className="flex-1 flex justify-end items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 border border-white/[0.1] shadow-lg cursor-pointer hover:scale-105 transition-transform" />
      </div>
    </header>
  );
}