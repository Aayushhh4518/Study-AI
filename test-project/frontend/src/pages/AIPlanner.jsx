import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Brain,
  ChevronRight,
  Clock,
  Cpu,
  Crosshair,
  Flame,
  LineChart,
  Milestone,
  Network,
  Play,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PremiumCard from "../components/ui/premium-card";
import { useData } from "../store/DataContext";

/* ── ANIMATION VARIANTS ──────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

/* ── HELPER COMPONENTS ───────────────────────────────────── */
function AnimatedCircularProgress({ value, color = "text-violet-500", size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90 transform" width={size} height={size}>
        <circle
          className="text-white/[0.05]"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black text-white tracking-tighter">{value}%</span>
      </div>
    </div>
  );
}

/* ── MAIN COMPONENT ──────────────────────────────────────── */
export default function AIPlanner() {
  const { data, stats, aiInsights } = useData();
  const [activeTab, setActiveTab] = useState("command"); // 'command', 'roadmap', 'predictions'
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse radial glow
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Particles for cinematic background
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen space-y-6 overflow-hidden pb-12"
    >
      {/* ── IMMERSIVE BACKGROUND SYSTEM ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-violet-600/10 mix-blend-screen blur-[150px] transition-transform duration-[10s] ease-in-out"
          style={{ transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)` }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] h-[60%] w-[60%] rounded-full bg-cyan-600/10 mix-blend-screen blur-[150px] transition-transform duration-[10s] ease-in-out"
          style={{ transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)` }}
        />
        <div
          className="absolute top-[40%] left-[40%] h-[40%] w-[40%] rounded-full bg-indigo-600/10 mix-blend-screen blur-[150px] animate-pulse"
          style={{ animationDuration: "12s" }}
        />
        {/* Neural Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 mix-blend-overlay" />

        {/* Floating Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: 0 }}
            animate={{ y: [0, -200], opacity: [0, 0.5, 0], scale: [1, 1.5, 1] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {/* ── HEADER ── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <div className="mb-3 flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">Neural Core Active</span>
          </div>
          <h1 className="bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-4xl md:text-5xl font-black tracking-tighter text-transparent drop-shadow-sm">
            AI Planner
          </h1>
          <p className="mt-2 text-[14px] font-medium text-zinc-400">
            Adaptive intelligence optimizing your learning trajectory.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 rounded-2xl border border-white/[0.05] bg-[#0A0E1A]/80 p-1.5 backdrop-blur-xl shadow-lg relative z-10"
        >
          {["command", "roadmap", "predictions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                activeTab === tab ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="plannerTab"
                  className="absolute inset-0 rounded-xl bg-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 capitalize">
                {tab === "command" ? "Command Center" : tab === "roadmap" ? "Roadmap Engine" : "Predictive AI"}
              </span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "command" && <CommandCenterView key="command" data={data} aiInsights={aiInsights} />}
          {activeTab === "roadmap" && <RoadmapEngineView key="roadmap" data={data} />}
          {activeTab === "predictions" && <PredictiveAnalyticsView key="predictions" stats={stats} />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 1: COMMAND CENTER VIEW
═══════════════════════════════════════════════════════════════ */
function CommandCenterView({ data, aiInsights }) {
  const [insightIdx, setInsightIdx] = useState(0);

  useEffect(() => {
    if (!aiInsights || aiInsights.length === 0) return;
    const interval = setInterval(() => {
      setInsightIdx((prev) => (prev + 1) % aiInsights.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [aiInsights]);

  const urgentTasks = (data?.tasks || []).filter((t) => t.priority === "High" && !t.completed);
  const weakSubject = [...(data?.subjects || [])].sort((a, b) => a.progress - b.progress)[0];

  const dailyMission = useMemo(() => {
    if (urgentTasks.length > 0) {
      return `Primary Objective: Neutralize ${urgentTasks.length} high-priority task${urgentTasks.length > 1 ? "s" : ""} to maintain optimal trajectory.`;
    } else if (weakSubject) {
      return `Primary Objective: Allocate immediate focus to [${weakSubject.title}] to repair knowledge gaps.`;
    }
    return "Primary Objective: Maintain current rhythm. Engage in deep focus to reinforce neural pathways.";
  }, [urgentTasks, weakSubject]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" exit="exit" className="space-y-6">
      {/* Top Banner: Mission Briefing */}
      <motion.div variants={fadeUp}>
        <PremiumCard className="relative overflow-hidden border border-white/[0.08] bg-[#0A0E1A]/80 p-8 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-600/20 blur-[100px]" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-3 text-violet-400">
                <Cpu size={20} className="animate-pulse" />
                <span className="text-[12px] font-bold uppercase tracking-[0.25em]">AI Mission Briefing</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-snug text-white tracking-tight">
                {dailyMission}
              </h2>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button className="group flex items-center gap-2 rounded-xl bg-white/[0.05] border border-white/[0.1] px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-white/[0.1] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <Play size={14} className="text-violet-400 group-hover:text-white transition-colors" />
                  Initialize Focus Protocol
                </button>
                <button className="group flex items-center gap-2 rounded-xl bg-transparent border border-white/[0.05] px-4 py-2 text-[13px] font-semibold text-zinc-400 transition-all hover:text-white hover:bg-white/[0.02]">
                  <Network size={14} />
                  View Dependencies
                </button>
              </div>
            </div>

            {/* Live Intelligence Feed */}
            <div className="w-full md:w-[320px] shrink-0 rounded-2xl border border-white/[0.05] bg-black/40 p-5 shadow-inner">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Live Intelligence</span>
                <Activity size={14} className="text-cyan-500" />
              </div>
              <div className="h-[80px] relative">
                <AnimatePresence mode="wait">
                  {aiInsights && aiInsights.length > 0 ? (
                    <motion.div
                      key={insightIdx}
                      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex flex-col justify-center"
                    >
                      <h4 className="text-[13px] font-bold text-zinc-200 mb-1">{aiInsights[insightIdx].title}</h4>
                      <p className="text-[12px] text-zinc-500 leading-relaxed line-clamp-2">{aiInsights[insightIdx].desc}</p>
                    </motion.div>
                  ) : (
                    <div className="text-[12px] text-zinc-500 flex items-center h-full">Processing cognitive data...</div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-3 flex gap-1">
                {aiInsights?.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i === insightIdx ? "bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" : "bg-white/[0.05]"}`} />
                ))}
              </div>
            </div>
          </div>
        </PremiumCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Matrix */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <PremiumCard className="h-full border border-white/[0.05] bg-[#0A0E1A]/60 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Crosshair size={18} className="text-rose-400" />
                  AI Priority Matrix
                </h3>
                <p className="text-[13px] text-zinc-500 mt-1">Smart categorization of pending objectives</p>
              </div>
              <button className="text-[12px] font-semibold text-violet-400 hover:text-violet-300">Re-evaluate</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quadrant 1: Urgent & Important */}
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.02] p-4 relative overflow-hidden group hover:bg-rose-500/[0.04] transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Flame size={40} className="text-rose-500" /></div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-3 flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"/> Critical Path</div>
                <div className="space-y-2 relative z-10">
                  {urgentTasks.slice(0,2).map(t => (
                    <div key={t.id} className="text-[13px] font-medium text-white bg-white/[0.03] border border-white/[0.05] p-2.5 rounded-xl truncate">{t.title}</div>
                  ))}
                  {urgentTasks.length === 0 && <div className="text-[13px] text-zinc-500 italic">No critical tasks detected.</div>}
                </div>
              </div>

              {/* Quadrant 2: Deep Focus Required */}
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.02] p-4 relative overflow-hidden group hover:bg-violet-500/[0.04] transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Brain size={40} className="text-violet-500" /></div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3 flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-violet-500"/> Deep Focus Queue</div>
                <div className="space-y-2 relative z-10">
                  {weakSubject ? (
                    <div className="text-[13px] font-medium text-white bg-white/[0.03] border border-white/[0.05] p-2.5 rounded-xl truncate">{weakSubject.title} Mastery</div>
                  ) : (
                    <div className="text-[13px] text-zinc-500 italic">Subjects optimized.</div>
                  )}
                </div>
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Adaptive Timeline */}
        <motion.div variants={fadeUp}>
          <PremiumCard className="h-full border border-white/[0.05] bg-[#0A0E1A]/60 p-6 backdrop-blur-xl flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock size={18} className="text-cyan-400" />
                Adaptive Timeline
              </h3>
              <p className="text-[13px] text-zinc-500 mt-1">AI-generated schedule flow</p>
            </div>

            <div className="flex-1 relative border-l-2 border-white/10 ml-3 space-y-6 py-2">
              {[
                { time: "09:00", title: "Cognitive Prime Window", desc: "Focus on hardest tasks.", color: "bg-rose-500", glow: "shadow-[0_0_15px_rgba(244,63,94,0.5)]" },
                { time: "14:00", title: "Revision Cycle", desc: "Spaced repetition for weak subjects.", color: "bg-violet-500", glow: "shadow-[0_0_15px_rgba(139,92,246,0.5)]" },
                { time: "19:00", title: "Light Processing", desc: "Organize notes, plan tomorrow.", color: "bg-cyan-500", glow: "shadow-[0_0_15px_rgba(6,182,212,0.5)]" },
              ].map((node, i) => (
                <div key={i} className="relative pl-6 group">
                  <div className={`absolute -left-[5px] top-1 h-2 w-2 rounded-full ${node.color} ${node.glow} ring-4 ring-[#0A0E1A] transition-transform duration-300 group-hover:scale-150`} />
                  <div className="text-[10px] font-bold text-zinc-500 mb-1">{node.time}</div>
                  <div className="text-[13.5px] font-semibold text-zinc-200 group-hover:text-white transition-colors">{node.title}</div>
                  <div className="text-[12px] text-zinc-500 mt-0.5">{node.desc}</div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 2: ROADMAP ENGINE VIEW
═══════════════════════════════════════════════════════════════ */
function RoadmapEngineView({ data }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [genPhase, setGenPhase] = useState(0);
  const [roadmap, setRoadmap] = useState(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenPhase(0);

    // Fake AI processing sequence
    const phases = [
      "Analyzing syllabus complexity...",
      "Evaluating historical retention rates...",
      "Balancing cognitive load distribution...",
      "Constructing optimal mastery timeline...",
    ];

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setGenPhase(current);
      if (current >= phases.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setRoadmap(generateFakeRoadmap());
        }, 800);
      }
    }, 1200);
  };

  const generateFakeRoadmap = () => {
    return [
      { week: 1, focus: "Foundational Concepts", intensity: 80, status: "active" },
      { week: 2, focus: "Advanced Application", intensity: 95, status: "pending" },
      { week: 3, focus: "Spaced Repetition & Weaknesses", intensity: 70, status: "pending" },
      { week: 4, focus: "Mock Testing & Final Polish", intensity: 100, status: "pending" },
    ];
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" exit="exit" className="space-y-6">
      {!roadmap && !isGenerating && (
        <motion.div variants={fadeUp} className="max-w-3xl mx-auto">
          <PremiumCard className="p-8 border border-white/[0.08] bg-[#0A0E1A]/80 backdrop-blur-2xl">
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.4)] mb-5">
                <Milestone size={30} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Configure Target Parameters</h2>
              <p className="text-sm text-zinc-400">Feed the AI engine your constraints to generate a hyper-optimized study path.</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Target Subject</label>
                  <select className="w-full bg-[#050816]/50 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none appearance-none">
                    {data?.subjects?.map(s => <option key={s.id}>{s.title}</option>)}
                    <option>New Subject (Custom)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Target Date / Exam</label>
                  <input type="date" className="w-full bg-[#050816]/50 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none [color-scheme:dark]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex justify-between">
                  <span>Daily Availability</span>
                  <span className="text-violet-400">4 Hours</span>
                </label>
                <input type="range" min="1" max="12" defaultValue="4" className="w-full accent-violet-500" />
              </div>

              <button
                onClick={handleGenerate}
                className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[14px] shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-[1.01] transition-all"
              >
                Generate AI Roadmap
              </button>
            </div>
          </PremiumCard>
        </motion.div>
      )}

      {isGenerating && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20">
          <div className="relative flex items-center justify-center h-32 w-32 mb-8">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-r-2 border-violet-500 opacity-50" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-2 rounded-full border-b-2 border-l-2 border-cyan-500 opacity-50" />
            <Brain size={40} className="text-white animate-pulse" />
          </div>
          <div className="h-6 overflow-hidden text-center">
            <AnimatePresence mode="wait">
              <motion.p key={genPhase} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="text-lg font-bold text-zinc-200 tracking-wide">
                {["Analyzing syllabus complexity...", "Evaluating historical retention rates...", "Balancing cognitive load distribution...", "Constructing optimal mastery timeline..."][genPhase] || "Finalizing..."}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="w-64 h-1 bg-white/[0.05] rounded-full mt-6 overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500" animate={{ width: `${(genPhase / 3) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>
        </motion.div>
      )}

      {roadmap && !isGenerating && (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Generated Path to Mastery</h2>
              <p className="text-sm text-zinc-400 mt-1">AI has charted the optimal route to your target.</p>
            </div>
            <button onClick={() => setRoadmap(null)} className="text-sm font-semibold text-zinc-400 hover:text-white bg-white/[0.05] px-4 py-2 rounded-lg transition-colors border border-white/10">
              Reconfigure
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {roadmap.map((block, i) => (
              <motion.div key={i} variants={fadeUp}>
                <PremiumCard className="p-6 border border-white/[0.05] bg-[#0A0E1A]/60 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-violet-500 to-cyan-500 opacity-50" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-4">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-lg font-black text-zinc-300">
                        W{block.week}
                      </div>
                      <div>
                        <h4 className="text-[16px] font-bold text-white tracking-wide">{block.focus}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${block.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                            {block.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 max-w-xs w-full">
                      <div className="flex justify-between text-[11px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
                        <span>Intensity</span>
                        <span className={block.intensity > 80 ? "text-rose-400" : "text-violet-400"}>{block.intensity}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${block.intensity}%` }}
                          transition={{ duration: 1.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                          className={`h-full rounded-full ${block.intensity > 80 ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'}`}
                        />
                      </div>
                    </div>

                    <button className="h-10 w-10 shrink-0 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 3: PREDICTIVE ANALYTICS VIEW
═══════════════════════════════════════════════════════════════ */
function PredictiveAnalyticsView({ stats }) {
  // Mock calculations based on stats to generate "predictive" feel
  const readiness = Math.min(100, Math.max(10, Math.round((stats.productivityScore * 0.8) + (stats.streak * 2))));
  const burnoutRisk = Math.min(100, Math.max(5, Math.round((stats.totalFocusHours / 50) * 100)));
  const trendData = [40, 50, 45, 60, 75, 80, 85, 90, 88, 95];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" exit="exit" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exam Readiness Gauge */}
        <motion.div variants={fadeUp}>
          <PremiumCard className="h-full border border-white/[0.05] bg-[#0A0E1A]/60 p-8 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h3 className="text-[14px] font-bold uppercase tracking-widest text-zinc-500 mb-8 w-full text-center flex items-center justify-center gap-2">
              <Target size={16} className="text-emerald-400" /> Estimated Readiness
            </h3>
            <AnimatedCircularProgress value={readiness} color="text-emerald-500" size={160} strokeWidth={10} />
            <p className="mt-8 text-center text-[13px] text-zinc-400 max-w-[250px] leading-relaxed">
              Based on your current retention rate and focus consistency, you are tracking well for upcoming milestones.
            </p>
          </PremiumCard>
        </motion.div>

        {/* Burnout Predictor */}
        <motion.div variants={fadeUp}>
          <PremiumCard className="h-full border border-white/[0.05] bg-[#0A0E1A]/60 p-8 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h3 className="text-[14px] font-bold uppercase tracking-widest text-zinc-500 mb-8 w-full text-center flex items-center justify-center gap-2">
              <AlertTriangle size={16} className="text-rose-400" /> Burnout Probability
            </h3>
            <AnimatedCircularProgress value={burnoutRisk} color={burnoutRisk > 70 ? "text-rose-500" : burnoutRisk > 40 ? "text-amber-500" : "text-cyan-500"} size={160} strokeWidth={10} />
            <p className="mt-8 text-center text-[13px] text-zinc-400 max-w-[250px] leading-relaxed">
              {burnoutRisk > 70
                ? "High cognitive load detected. AI strictly recommends implementing a 24-hour rest cycle."
                : "Cognitive load is within optimal parameters. Sustainable pace maintained."}
            </p>
          </PremiumCard>
        </motion.div>
      </div>

      {/* Cognitive Performance Trend */}
      <motion.div variants={fadeUp}>
        <PremiumCard className="border border-white/[0.05] bg-[#0A0E1A]/60 p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 blur-[80px] pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <LineChart size={18} className="text-indigo-400" />
                Cognitive Performance Forecast
              </h3>
              <p className="text-[13px] text-zinc-500 mt-1">AI extrapolation of your focus efficiency over the next 10 days</p>
            </div>
            <div className="px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-widest">
              Up 12%
            </div>
          </div>

          {/* Custom Animated Sparkline Chart */}
          <div className="h-48 w-full relative z-10 flex items-end justify-between gap-2 pt-10">
            {trendData.map((val, i) => (
              <div key={i} className="relative flex-1 flex flex-col items-center justify-end h-full group">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#050816] border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-white shadow-lg pointer-events-none z-20">
                  {val}%
                </div>
                {/* Bar */}
                <div className="w-full bg-white/[0.02] rounded-t-lg relative overflow-hidden h-full border-b border-white/5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ duration: 1.5, delay: i * 0.05, ease: "easeOut" }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600/80 to-cyan-400/80 rounded-t-md"
                  />
                </div>
                <span className="text-[9px] font-bold text-zinc-600 mt-2 uppercase tracking-widest">D{i+1}</span>
              </div>
            ))}
          </div>
        </PremiumCard>
      </motion.div>
    </motion.div>
  );
}
