import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Subjects', path: '/subjects' },
  { name: 'Tasks', path: '/tasks' },
  { name: 'Focus Timer', path: '/timer' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Schedule', path: '/schedule' },
  { name: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 hidden md:flex flex-col bg-[#0B0F19]/80 backdrop-blur-2xl border-r border-white/5 h-screen sticky top-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
          <span className="text-white font-bold">S</span>
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          StudyAI
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              relative flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {({ isActive }) => (
              <>
                <span className="relative z-10 font-medium">{item.name}</span>
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute inset-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20 z-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}