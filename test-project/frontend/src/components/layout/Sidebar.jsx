import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Subjects', path: '/subjects' },
  { name: 'Tasks', path: '/tasks' },
  { name: 'Focus Timer', path: '/focus' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Schedule', path: '/schedule' },
  { name: 'Settings', path: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-black border-r border-white/[0.08] z-40">
      <div className="flex items-center justify-center h-20 border-b border-white/[0.05]">
        <div className="text-xl font-extrabold tracking-widest bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          STUDY.AI
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-white bg-white/[0.1] shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative z-10 font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 rounded-xl bg-white/[0.05] border border-white/[0.1]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}