import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, Send, Zap } from 'lucide-react';
import { Card } from '../ui/Card';

export default function AIWidget() {
  const prompts = [
    "Summarize my Physics notes...",
    "Generate a quiz for Math...",
    "Help me plan my week..."
  ];

  return (
    <Card className="h-full flex flex-col relative overflow-hidden group border-indigo-500/20">
      {/* Animated Glowing Background */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl group-hover:rotate-180 transition-transform duration-[10s] linear -z-10" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Study.AI <Sparkles className="w-4 h-4 text-amber-400" />
          </h2>
          <p className="text-xs text-indigo-200/60">Your personal learning assistant</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Prompts</p>
          {prompts.map((prompt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02, x: 4 }}
              className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-indigo-500/10 hover:border-indigo-500/30 text-sm text-slate-300 transition-colors flex items-center justify-between group/btn"
            >
              <span>{prompt}</span>
              <Zap className="w-4 h-4 text-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>

        <div className="relative mt-4">
          <input 
            type="text" 
            placeholder="Ask Study.AI anything..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}