import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden selection:bg-white/30">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 relative min-h-screen">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}