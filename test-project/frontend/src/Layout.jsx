import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#050505] text-gray-100 overflow-hidden selection:bg-indigo-500/30">
      <Sidebar />
      
      <div className="flex flex-col flex-1 relative w-full overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />

        {/* Navbar could go here if extracted */}
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 z-10 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}