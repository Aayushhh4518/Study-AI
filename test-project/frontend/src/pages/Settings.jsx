import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Paintbrush } from 'lucide-react';

export default function Settings() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto flex flex-col gap-8 pb-12"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account preferences and application settings.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 flex flex-col gap-2">
          {[
            { label: 'Profile', icon: User, active: true },
            { label: 'Notifications', icon: Bell },
            { label: 'Appearance', icon: Paintbrush },
            { label: 'Security', icon: Shield },
          ].map((item, i) => (
            <button key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="md:col-span-3 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-xl flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-4">Profile Information</h2>
          
          <div className="flex items-center gap-6">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User profile" 
              className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700"
            />
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
              Change Avatar
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Display Name</label>
              <input type="text" defaultValue="Alex Chen" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input type="email" defaultValue="alex@studyai.app" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-500 focus:outline-none cursor-not-allowed" disabled />
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-700 flex justify-end">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/25 text-sm">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
