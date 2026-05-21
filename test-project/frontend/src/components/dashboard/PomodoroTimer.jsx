import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

export default function PomodoroTimer() {
  // --- 1. State Initialization ---
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  // timeLeft: Tracks remaining seconds.
  const [timeLeft, setTimeLeft] = useState(() => {
    return Number(localStorage.getItem('pomodoroTimeLeft')) || WORK_TIME;
  });
  // isActive: Determines if the countdown is currently running.
  const [isActive, setIsActive] = useState(false);
  // mode: Toggles between 'work' and 'break' sessions.
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('pomodoroMode') || 'work';
  });
  // sessions: Tracks completed work cycles.
  const [sessions, setSessions] = useState(() => {
    return Number(localStorage.getItem('pomodoroSessions')) || 0;
  });

  useEffect(() => {
    localStorage.setItem('pomodoroSessions', sessions);
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('pomodoroTimeLeft', timeLeft);
    localStorage.setItem('pomodoroMode', mode);
  }, [timeLeft, mode]);

  // --- 2. Side Effect (The Timer Logic) ---
  useEffect(() => {
    let interval = null;

    // Only run the interval if the timer is active and there's time left
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
      useEffect(() => {
        const handleKey = (e) => {
          if (e.code === 'Space') {
            e.preventDefault();
            toggleTimer();
          }
        };

        window.addEventListener('keydown', handleKey);

        return () => {
          window.removeEventListener('keydown', handleKey);
        };
      }, [isActive]);
    }
    // Handle timer completion
    else if (isActive && timeLeft === 0) {
      if (mode === 'work') {
        setSessions((s) => s + 1);
        setMode('break');
        setTimeLeft(BREAK_TIME);
      } else {
        setMode('work');
        setTimeLeft(WORK_TIME);
      }
      setIsActive(false); // Auto-pause when switching modes
      new Audio('/notification.mp3').play();
    }

    // Cleanup function to clear interval and prevent memory leaks
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  // --- 3. Action Handlers ---
  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(WORK_TIME);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  // --- 4. Presentation Formatting ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'work' ? WORK_TIME : BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // SVG Circle math for the animated ring
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center justify-center relative shadow-2xl h-full"
    >
      {/* Mode Switcher */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => switchMode('work')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${mode === 'work'
            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
        >
          <Brain className="w-4 h-4" /> Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${mode === 'break'
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
        >
          <Coffee className="w-4 h-4" /> Break
        </button>
      </div>

      {/* Timer Ring & Display */}
      <div className="relative flex items-center justify-center mb-8">
        <svg className="w-72 h-72 transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="144"
            cy="144"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-700/50"
          />
          {/* Animated Progress Ring */}
          <motion.circle
            cx="144"
            cy="144"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            strokeLinecap="round"
            className={mode === 'work' ? 'text-indigo-500' : 'text-emerald-500'}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-6xl font-bold tracking-tighter mb-2">{formatTime(timeLeft)}</span>
          <span className="text-slate-400 font-medium">
            {mode === 'work' ? 'Focus Session' : 'Take a Break'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-600 transition-all"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-colors ${mode === 'work' ? 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/30' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
            }`}
        >
          {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </motion.button>

        {/* Session Tracker */}
        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700/50 tooltip-trigger relative group">
          <span className="text-sm text-slate-300 font-bold">#{sessions}</span>
          <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-xs px-2 py-1 rounded-md text-nowrap pointer-events-none">
            Completed Sessions
          </div>
        </div>
      </div>
    </motion.div>
  );
}
