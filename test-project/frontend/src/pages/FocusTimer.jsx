import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Brain, Coffee, Flame, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PageContainer } from '../components/layout/PageContainer';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const WORK_QUOTES = [
  "Deep work is your superpower.",
  "Focus on the process, not the outcome.",
  "Distractions are the enemy of greatness.",
  "One task at a time.",
  "Stay disciplined. Build the future."
];

const BREAK_QUOTES = [
  "Breathe. Relax. Reconnect.",
  "You've earned this breather.",
  "Step away to gain perspective.",
  "Rest is productive too.",
  "Hydrate and stretch."
];

export default function FocusTimer() {
  // --- State Management ---
  const [mode, setMode] = useState('work'); // 'work' | 'break'
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [stats, setStats] = useState({
    sessions: 0,
    streak: 0,
    totalMinutes: 0,
    lastSessionDate: null
  });

  // --- Persistence & Initialization ---
  useEffect(() => {
    const savedStats = localStorage.getItem('studyai_focus_stats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        // Simple streak reset logic if more than a day has passed
        const now = new Date();
        const last = parsed.lastSessionDate ? new Date(parsed.lastSessionDate) : null;
        if (last && (now - last) > 1000 * 60 * 60 * 24 * 2) {
          parsed.streak = 0; // Reset streak if missed more than 48 hours
        }
        setStats(parsed);
      } catch (e) {
        console.error("Failed to parse focus stats", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studyai_focus_stats', JSON.stringify(stats));
  }, [stats]);

  // --- Quotes Rotation ---
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % 5);
      }, 15000); // Change quote every 15s during active sessions
      return () => clearInterval(interval);
    }
  }, [isActive, mode]);

  // --- Core Timer Logic ---
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      
      if (mode === 'work') {
        setStats(prev => ({
          ...prev,
          sessions: prev.sessions + 1,
          streak: prev.streak + 1,
          totalMinutes: prev.totalMinutes + 25,
          lastSessionDate: new Date().toISOString()
        }));
        setMode('break');
        setTimeLeft(BREAK_TIME);
        try { new Audio('/notification.mp3').play(); } catch (e) {} // Fails silently if no audio file
      } else {
        setMode('work');
        setTimeLeft(WORK_TIME);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  // --- Keyboard Shortcuts & Callbacks ---
  const handleReset = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  }, [mode]);

  const switchMode = useCallback((newMode) => {
    if (mode === newMode) return;
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);
    setQuoteIndex(0);
  }, [mode]);

  const toggleTimer = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          toggleTimer();
          break;
        case 'KeyR':
          e.preventDefault();
          handleReset();
          break;
        case 'KeyW':
          e.preventDefault();
          switchMode('work');
          break;
        case 'KeyB':
          e.preventDefault();
          switchMode('break');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTimer, handleReset, switchMode]);

  // --- Computations ---
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'work' ? WORK_TIME : BREAK_TIME;
  const progress = 1 - (timeLeft / totalTime);
  
  // Ring metrics
  const radius = 140; // slightly larger for premium feel
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);

  const isWork = mode === 'work';
  const themeColor = isWork ? 'indigo' : 'emerald';
  
  const currentQuote = isWork ? WORK_QUOTES[quoteIndex] : BREAK_QUOTES[quoteIndex];
  const quoteMessage = (!isActive && timeLeft === totalTime) 
    ? (isWork ? "Ready to achieve deep focus?" : "Ready for a quick breather?")
    : (!isActive && timeLeft < totalTime) 
      ? "Paused. Take a deep breath." 
      : currentQuote;

  // Stagger animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <PageContainer>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-7xl mx-auto min-h-[85vh] flex flex-col lg:flex-row gap-8 items-center justify-center pt-2 pb-12"
      >
        
        {/* Main Timer Display */}
        <motion.div variants={itemVariants} className="flex-1 w-full max-w-3xl">
          <Card className={`flex flex-col items-center justify-center p-8 lg:p-14 relative overflow-hidden transition-all duration-700 border-${themeColor}-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]`}>
            
            {/* Dynamic Ambient Background Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full blur-[120px] -z-10 transition-all duration-1000 ${isWork ? 'bg-indigo-500/10' : 'bg-emerald-500/10'} ${isActive ? 'scale-110 opacity-70' : 'scale-100 opacity-30'}`} />

            {/* Premium Pill Mode Switcher */}
            <div className="flex p-1.5 bg-black/50 border border-white/5 rounded-full mb-12 backdrop-blur-xl shadow-inner">
              <button
                onClick={() => switchMode('work')}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${isWork ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <Brain className="w-4 h-4" /> Deep Work
                {!isWork && <kbd className="hidden sm:inline-block ml-2 px-1.5 py-0.5 rounded text-[10px] bg-white/10 font-mono">W</kbd>}
              </button>
              <button
                onClick={() => switchMode('break')}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${!isWork ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <Coffee className="w-4 h-4" /> Rest Break
                {isWork && <kbd className="hidden sm:inline-block ml-2 px-1.5 py-0.5 rounded text-[10px] bg-white/10 font-mono">B</kbd>}
              </button>
            </div>

            {/* Circular Timer Ring */}
            <div className="relative flex items-center justify-center mb-8">
              <svg className="w-[340px] h-[340px] lg:w-[420px] lg:h-[420px] transform -rotate-90 filter drop-shadow-2xl">
                {/* Background Track */}
                <circle
                  cx="50%" cy="50%" r={radius}
                  stroke="currentColor" strokeWidth="4" fill="transparent"
                  className="text-white/[0.02]"
                />
                {/* Animated Progress Ring */}
                <motion.circle
                  cx="50%" cy="50%" r={radius}
                  stroke={`url(#${themeColor}-gradient)`}
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "linear" }}
                  style={{ strokeDasharray: circumference }}
                  className="drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                />
                <defs>
                  <linearGradient id="indigo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Timer Text & Motivational Quote */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <motion.span 
                  key={timeLeft}
                  initial={{ opacity: 0.8, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-7xl lg:text-8xl font-black text-white tracking-tighter font-sans filter drop-shadow-md"
                >
                  {formatTime(timeLeft)}
                </motion.span>
                
                <div className="h-12 mt-4 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={quoteMessage}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.4 }}
                      className="text-sm lg:text-base text-slate-400 font-medium tracking-wide max-w-[240px] leading-relaxed text-center"
                    >
                      {quoteMessage}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-6">
              <motion.button
                whileHover={{ scale: 1.1, rotate: -15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleReset}
                className="p-4 rounded-full bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white transition-colors group relative"
                aria-label="Reset Timer"
              >
                <RotateCcw className="w-6 h-6" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">R to Reset</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTimer}
                className={`relative flex items-center justify-center w-20 h-20 rounded-full text-white shadow-2xl transition-all group ${
                  isWork ? 'bg-indigo-600 shadow-indigo-500/40 hover:bg-indigo-500' : 'bg-emerald-600 shadow-emerald-500/40 hover:bg-emerald-500'
                }`}
                aria-label={isActive ? "Pause Timer" : "Start Timer"}
              >
                {isActive ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 text-white/70 px-2 py-1 rounded">Space to Toggle</span>
              </motion.button>

              <div className="w-14" /> {/* Spacer for optical alignment against reset button */}
            </div>
          </Card>
        </motion.div>

        {/* Right Sidebar Stats Panel */}
        <motion.div variants={itemVariants} className="w-full lg:w-80 flex flex-col gap-5">
          <Card hover className="p-6 bg-gradient-to-br from-white/[0.05] to-transparent border-white/[0.05]">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <Flame className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">
                Active
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-1 tracking-tight">{stats.streak} <span className="text-xl text-slate-500 font-medium">Days</span></h3>
            <p className="text-sm font-medium text-slate-400">Current Focus Streak</p>
          </Card>

          <Card hover className="p-6 bg-gradient-to-br from-white/[0.05] to-transparent border-white/[0.05]">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-1 tracking-tight">{stats.sessions}</h3>
            <p className="text-sm font-medium text-slate-400">Total Sessions Completed</p>
          </Card>

          <Card hover className="p-6 bg-gradient-to-br from-white/[0.05] to-transparent border-white/[0.05]">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-1 tracking-tight flex items-baseline gap-1">
              {Math.floor(stats.totalMinutes / 60)}<span className="text-xl text-slate-500 font-medium mr-1">h</span>
              {stats.totalMinutes % 60}<span className="text-xl text-slate-500 font-medium">m</span>
            </h3>
            <p className="text-sm font-medium text-slate-400">Total Deep Focus Time</p>
          </Card>

          {/* Quick Stats Summary */}
          <div className="px-4 py-3 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Data synced locally</span>
            <span>v2.0.1</span>
          </div>
        </motion.div>

      </motion.div>
    </PageContainer>
  );
}
