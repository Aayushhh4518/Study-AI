import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart2,
  Brain,
  CloudRain,
  Coffee,
  Disc,
  Lightbulb,
  Maximize2,
  Minimize2,
  Music,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Sparkles,
  Target,
  Volume2,
  VolumeX,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import PremiumCard from "../components/ui/premium-card";
import { useData } from "../store/DataContext";

const SOUNDSCAPES = [
  {
    id: "deep_focus",
    name: "Deep Focus",
    icon: Disc,
    color: "text-violet-400",
    src: "/audio/deep-focus.mp3",
  },
  {
    id: "rain",
    name: "Rain",
    icon: CloudRain,
    color: "text-blue-400",
    src: "/audio/rain.mp3",
  },
  {
    id: "white_noise",
    name: "White Noise",
    icon: Waves,
    color: "text-zinc-400",
    src: "/audio/white-noise.mp3",
  },
  {
    id: "lofi",
    name: "Lo-fi",
    icon: Music,
    color: "text-rose-400",
    src: "/audio/lofi.mp3",
  },
];

export default function FocusTimer() {
  const {
    data,
    stats,
    recordFocusSession,
    updateSettings,
    updateProductivitySettings,
  } = useData();
  const {
    pomodoroWorkTime,
    pomodoroBreakTime,
    pomodoroLongBreak,
    autoStartBreaks,
    soundEnabled,
    reducedMotion,
  } = data.settings;

  // --- All useState and useRef declarations moved to the top ---
  const audioRef = useRef(null); // For chime sound
  const ambientAudioRef = useRef(
    typeof Audio !== "undefined" ? new Audio() : null,
  ); // For ambient soundscapes
  const fadeInterval = useRef(null);
  const loadedTrackRef = useRef(null);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [distractionFree, setDistractionFree] = useState(false);
  const [activeSoundscape, setActiveSoundscape] = useState(SOUNDSCAPES[0].id);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [ambientVolume, setAmbientVolume] = useState(0.5);

  const [focusState, setFocusState] = useState(() => {
    const saved = localStorage.getItem("studyai-focus-state");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.mode === "work") {
        parsed.secondsLeft = pomodoroWorkTime * 60;
      } else if (parsed.mode === "break") {
        parsed.secondsLeft = pomodoroBreakTime * 60;
      } else if (parsed.mode === "longBreak") {
        parsed.secondsLeft = pomodoroLongBreak * 60;
      }
      return parsed;
    }
    return { mode: "work", secondsLeft: pomodoroWorkTime * 60 };
  });

  const [isRunning, setIsRunning] = useState(false);
  const { mode, secondsLeft } = focusState;

  // --- useMemo declarations can follow after states they depend on ---
  const TOTAL_TIME = useMemo(() => {
    if (mode === "work") return pomodoroWorkTime * 60;
    if (mode === "break") return pomodoroBreakTime * 60;
    if (mode === "longBreak") return pomodoroLongBreak * 60;
    return pomodoroWorkTime * 60;
  }, [mode, pomodoroWorkTime, pomodoroBreakTime, pomodoroLongBreak]);

  const motivations = useMemo(
    () => [
      "Deep work compounds exponentially.",
      "Your consistency is increasing.",
      "Entering peak concentration state.",
      "This session improves long-term retention.",
      "Distractions fade, focus remains.",
    ],
    [],
  );

  const aiInsightList = useMemo(
    () => [
      {
        title: "Peak Performance",
        desc: "Your consistency is increasing. Maintaining this pace will boost retention by 32%.",
        icon: Target,
        color: "text-violet-400",
      },
      {
        title: "Cognitive Flow",
        desc: "Optimal beta-wave state detected. Deep work efficiency at 94%.",
        icon: Brain,
        color: "text-cyan-400",
      },
      {
        title: "Distraction Resistance",
        desc: "You have ignored potential interruptions. Immersion is nominal.",
        icon: Shield,
        color: "text-emerald-400",
      },
    ],
    [],
  );
  const [activeInsightIdx, setActiveInsightIdx] = useState(0);
  const [motivationIdx, setMotivationIdx] = useState(0);
  // --- End of state/ref/memo declarations ---

  // Mouse radial glow effect
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleVolumeChange = useCallback(
    (e) => {
      const newVol = parseFloat(e.target.value);
      setAmbientVolume(newVol);
      if (!soundEnabled && newVol > 0) {
        updateSettings({ soundEnabled: true });
      }
    },
    [soundEnabled, updateSettings],
  );

  const fadeTo = useCallback((targetVol, duration = 1000) => {
    if (!ambientAudioRef.current) return Promise.resolve();
    return new Promise((resolve) => {
      clearInterval(fadeInterval.current);
      const startVol = ambientAudioRef.current.volume;
      const diff = targetVol - startVol;
      if (diff === 0) return resolve();

      const steps = 20;
      const stepTime = duration / steps;
      let currentStep = 0;

      fadeInterval.current = setInterval(() => {
        currentStep++;
        let newVol = startVol + diff * (currentStep / steps);
        newVol = Math.max(0, Math.min(1, newVol));
        ambientAudioRef.current.volume = newVol;

        if (currentStep >= steps) {
          clearInterval(fadeInterval.current);
          ambientAudioRef.current.volume = targetVol;
          resolve();
        }
      }, stepTime);
    });
  }, []);

  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.loop = true;
    }
    return () => {
      clearInterval(fadeInterval.current);
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    const audio = ambientAudioRef.current;
    const currentSound = SOUNDSCAPES.find((s) => s.id === activeSoundscape);
    if (!currentSound || !audio) return;

    const targetVolume = soundEnabled ? ambientVolume : 0;

    const syncAudio = async () => {
      if (loadedTrackRef.current !== currentSound.src) {
        if (!audio.paused) {
          await fadeTo(0, 500);
          audio.pause();
        }
        audio.src = currentSound.src;
        audio.load();
        loadedTrackRef.current = currentSound.src;
      }

      if (isRunning) {
        if (audio.paused) {
          audio.volume = 0;
          audio
            .play()
            .catch((e) => console.warn("Ambient audio play blocked:", e));
        }
        fadeTo(targetVolume, 1000);
      } else {
        if (!audio.paused) {
          await fadeTo(0, 500);
          audio.pause();
        }
      }
    };

    syncAudio();
  }, [activeSoundscape, isRunning, soundEnabled, ambientVolume, fadeTo]);

  // Generate cinematic background particles once
  useEffect(() => {
    if (reducedMotion) return;
    setParticles(
      [...Array(24)].map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
      })),
    );
  }, [reducedMotion]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setMotivationIdx((i) => (i + 1) % motivations.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isRunning, motivations.length]);
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(
      () => setActiveInsightIdx((i) => (i + 1) % aiInsightList.length),
      8000,
    );
    return () => clearInterval(interval);
  }, [aiInsightList.length, isRunning]);

  useEffect(() => {
    if (!isRunning) {
      let newDuration;
      if (mode === "work") {
        newDuration = pomodoroWorkTime * 60;
      } else if (mode === "break") {
        newDuration = pomodoroBreakTime * 60;
      } else if (mode === "longBreak") {
        newDuration = pomodoroLongBreak * 60;
      }

      if (secondsLeft !== newDuration) {
        setFocusState((fs) => ({ ...fs, secondsLeft: newDuration }));
      }
    }
  }, [
    pomodoroWorkTime,
    pomodoroBreakTime,
    pomodoroLongBreak,
    mode,
    isRunning,
    secondsLeft,
  ]);

  useEffect(() => {
    localStorage.setItem("studyai-focus-state", JSON.stringify(focusState));
  }, [focusState]);

  useEffect(() => {
    let interval;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setFocusState((prev) => ({
          ...prev,
          secondsLeft: prev.secondsLeft - 1,
        }));
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(autoStartBreaks);

      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }

      if (mode === "work") {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 4000);

        recordFocusSession(pomodoroWorkTime, selectedSubjectId, mode);
        const nextCompleted = data.focus.totalCompleted + 1;
        const isLongBreakTime = nextCompleted > 0 && nextCompleted % 4 === 0;

        if (isLongBreakTime) {
          toast.success(`Focus session done! Time for a long break.`, {
            icon: "🎉",
          });
          setFocusState({
            mode: "longBreak",
            secondsLeft: pomodoroLongBreak * 60,
          });
        } else {
          toast.success("Focus session done! Time for a short break.", {
            icon: "🎉",
          });
          setFocusState({ mode: "break", secondsLeft: pomodoroBreakTime * 60 });
        }
      } else {
        toast.success("Break is over! Ready to focus?", { icon: "🧠" });
        setFocusState({ mode: "work", secondsLeft: pomodoroWorkTime * 60 });
      }
    }

    return () => clearInterval(interval);
  }, [
    isRunning,
    secondsLeft,
    mode,
    recordFocusSession,
    pomodoroWorkTime,
    pomodoroBreakTime,
    pomodoroLongBreak,
    autoStartBreaks,
    soundEnabled,
    data.focus.totalCompleted,
    selectedSubjectId,
  ]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setDistractionFree(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setDistractionFree(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setDistractionFree(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const progress = useMemo(() => {
    if (TOTAL_TIME === 0) return 0;
    return ((TOTAL_TIME - secondsLeft) / TOTAL_TIME) * 100;
  }, [secondsLeft, TOTAL_TIME]);

  const handleReset = () => {
    setFocusState({ mode: "work", secondsLeft: pomodoroWorkTime * 60 });
    setIsRunning(false);
    toast.info("Timer reset");
  };

  const toggleSound = useCallback(() => {
    updateSettings({ soundEnabled: !soundEnabled });
    toast.success(`Sound ${!soundEnabled ? "enabled" : "disabled"}`);
  }, [soundEnabled, updateSettings]);

  const handlePreset = (mins) => {
    updateProductivitySettings({ pomodoroWorkTime: mins });
    setFocusState({ mode: "work", secondsLeft: mins * 60 });
    setIsRunning(false);
  };

  // Advanced Equalizer for Active Soundscape
  const Equalizer = ({ color }) => (
    <div className="flex gap-[3px] items-end h-[14px] shrink-0 ml-auto">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ height: ["30%", "100%", "30%"] }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`w-[3px] rounded-full ${color.replace("text-", "bg-")}`}
        />
      ))}
    </div>
  );

  const renderTimerContent = () => (
    <div className="flex flex-col items-center relative z-10 w-full max-w-md mx-auto">
      {/* Ambient Pulse */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[120%] rounded-full blur-[100px] transition-all duration-1000 pointer-events-none ${
          mode === "work" ? "bg-violet-600/20" : "bg-emerald-600/20"
        }`}
        style={{
          opacity: isRunning ? 1 : 0.2,
          transform: isRunning ? "scale(1.1)" : "scale(0.9)",
        }}
      />

      {/* TITLE */}
      <div className="text-center mb-10 sm:mb-14 relative z-10">
        <motion.h2
          animate={{
            textShadow: isRunning
              ? "0px 0px 20px rgba(139,92,246,0.5)"
              : "0px 0px 0px rgba(0,0,0,0)",
          }}
          className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent"
        >
          {mode === "work"
            ? isRunning
              ? "Deep Focus Session"
              : "Ready to Focus"
            : mode === "break"
              ? "Short Break"
              : "Long Break"}
        </motion.h2>
        <div className="text-zinc-500 mt-2 text-[13px] sm:text-[14px] font-medium flex items-center justify-center gap-2">
          {isRunning && (
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  mode === "work" ? "bg-violet-400" : "bg-teal-400"
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  mode === "work" ? "bg-violet-500" : "bg-teal-500"
                }`}
              ></span>
            </span>
          )}
          {mode === "work"
            ? isRunning
              ? "Minimize distractions and maintain flow"
              : "Start the timer when you're ready"
            : mode === "break"
              ? "Relax, stretch, and grab some water"
              : "Recharge for the next big push"}
        </div>
      </div>

      {/* RING */}
      <div className="relative h-[300px] w-[300px] sm:h-[380px] sm:w-[380px] flex items-center justify-center z-10">
        {/* Futuristic Glass Background */}
        <div className="absolute inset-4 rounded-full bg-[#0A0E1A]/40 backdrop-blur-2xl border border-white/[0.03] shadow-[inset_0_0_60px_rgba(139,92,246,0.1)] transition-all duration-1000" />

        {/* Floating AI Status Indicators */}
        <AnimatePresence>
          {isRunning && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1, y: [0, -6, 0] }}
                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                transition={{
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  default: { duration: 0.4 },
                }}
                className="absolute -left-6 sm:-left-12 top-1/4 px-3 py-1.5 rounded-full bg-[#0A0E1A]/80 border border-cyan-500/30 backdrop-blur-xl flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.2)] z-20"
              >
                <Activity size={12} className="text-cyan-400" />
                <span className="text-[10px] font-bold text-cyan-100 tracking-wider">
                  SYNC 98%
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1, y: [0, 6, 0] }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{
                  y: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  },
                  default: { duration: 0.4 },
                }}
                className="absolute -right-6 sm:-right-12 bottom-1/4 px-3 py-1.5 rounded-full bg-[#0A0E1A]/80 border border-violet-500/30 backdrop-blur-xl flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.2)] z-20"
              >
                <Brain size={12} className="text-violet-400" />
                <span className="text-[10px] font-bold text-violet-100 tracking-wider">
                  FLOW
                </span>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Rotating dash ring */}
        <motion.svg
          viewBox="0 0 420 420"
          className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] opacity-60"
          animate={{ rotate: isRunning ? 360 : 0, scale: isRunning ? 1.02 : 1 }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, ease: "easeInOut" },
          }}
        >
          <defs>
            <linearGradient
              id="rotating-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop
                offset="50%"
                stopColor={
                  mode === "work"
                    ? "rgba(139,92,246,0.8)"
                    : "rgba(16,185,129,0.8)"
                }
              />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <circle
            cx="210"
            cy="210"
            r="200"
            stroke="url(#rotating-grad)"
            strokeWidth="1.5"
            fill="transparent"
            strokeDasharray="4 12"
            strokeLinecap="round"
          />
        </motion.svg>

        <svg
          viewBox="0 0 400 400"
          className={`absolute inset-0 w-full h-full -rotate-90 transition-all duration-700 ${isRunning ? "drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]" : "drop-shadow-[0_0_10px_rgba(139,92,246,0.2)]"}`}
        >
          <defs>
            <linearGradient
              id="timer-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={mode === "work" ? "#a78bfa" : "#34d399"}
              />
              <stop
                offset="50%"
                stopColor={mode === "work" ? "#8b5cf6" : "#10b981"}
              />
              <stop
                offset="100%"
                stopColor={mode === "work" ? "#c084fc" : "#059669"}
              />
            </linearGradient>
          </defs>
          <circle
            cx="200"
            cy="200"
            r="180"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="6"
            fill="transparent"
          />
          <motion.circle
            cx="200"
            cy="200"
            r="180"
            stroke="url(#timer-gradient)"
            strokeWidth="10"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={1130.97}
            initial={{ strokeDashoffset: 1130.97 }}
            animate={{ strokeDashoffset: 1130.97 - (1130.97 * progress) / 100 }}
            transition={{ duration: reducedMotion ? 0 : 1, ease: "linear" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.h1
            className="text-[4.5rem] sm:text-[6.5rem] font-black tracking-tighter bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent drop-shadow-2xl leading-none"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {minutes}:{seconds}
          </motion.h1>
          <div className="h-6 overflow-hidden mt-2 sm:mt-4 w-4/5">
            <AnimatePresence mode="wait">
              <motion.p
                key={motivationIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-zinc-400 font-medium text-[10px] sm:text-xs tracking-wide text-center uppercase"
              >
                {isRunning
                  ? motivations[motivationIdx]
                  : mode === "work"
                    ? "Ready to Focus"
                    : "Time for a Break"}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col items-center gap-8 mt-12 z-10 w-full">
        <div className="flex items-center gap-6">
          {isRunning ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRunning(false)}
              className="h-16 w-16 sm:h-18 sm:w-18 rounded-[20px] border border-white/10 bg-[#0A0E1A]/80 backdrop-blur-xl flex items-center justify-center transition-all hover:bg-white/[0.08] hover:border-white/20 text-zinc-300 hover:text-white shadow-lg"
            >
              <Pause size={22} className="fill-current" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSound}
              className="h-16 w-16 sm:h-18 sm:w-18 rounded-[20px] border border-white/10 bg-[#0A0E1A]/80 backdrop-blur-xl flex items-center justify-center transition-all hover:bg-white/[0.08] hover:border-white/20 text-zinc-400 hover:text-white shadow-lg"
            >
              {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
            </motion.button>
          )}

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 40px rgba(139,92,246,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRunning(true)}
            className={`h-20 w-20 sm:h-24 sm:w-24 rounded-[28px] sm:rounded-[32px] bg-gradient-to-b ${
              mode === "work"
                ? "from-violet-500 to-indigo-600 shadow-[0_0_30px_rgba(139,92,246,0.5)] border-t border-violet-400/50"
                : "from-emerald-500 to-teal-600 shadow-[0_0_30px_rgba(16,185,129,0.5)] border-t border-emerald-400/50"
            } flex items-center justify-center transition-all text-white`}
          >
            <Play
              size={32}
              className="fill-current ml-2 sm:ml-3 sm:w-10 sm:h-10"
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="h-16 w-16 sm:h-18 sm:w-18 rounded-[20px] border border-white/10 bg-[#0A0E1A]/80 backdrop-blur-xl flex items-center justify-center transition-all hover:bg-white/[0.08] hover:border-white/20 text-zinc-300 hover:text-white shadow-lg"
          >
            <RotateCcw size={22} />
          </motion.button>
        </div>

        {!isRunning && mode === "work" && (
          <div className="flex flex-col items-center gap-4 w-full mt-2">
            <div className="flex gap-2 w-full justify-center">
              {[25, 50, 90].map((mins) => (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  key={mins}
                  onClick={() => handlePreset(mins)}
                  className={`flex-1 max-w-[80px] py-2.5 rounded-[14px] text-xs font-bold transition-all duration-300 ${
                    TOTAL_TIME / 60 === mins
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                      : "bg-[#0A0E1A]/60 backdrop-blur-md text-zinc-500 border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] hover:text-zinc-300 shadow-sm"
                  }`}
                >
                  {mins}m
                </motion.button>
              ))}
            </div>

            <div className="relative w-full max-w-[256px]">
              <select
                value={selectedSubjectId || ""}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full bg-[#0A0E1A]/80 backdrop-blur-xl border border-white/[0.05] rounded-[14px] pl-10 pr-4 py-3 text-xs font-medium text-zinc-400 focus:outline-none focus:border-violet-500/50 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer appearance-none shadow-sm"
              >
                <option value="">No Subject Linked</option>
                {data?.subjects?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                <Brain size={16} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCelebration = () => (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 bg-violet-600/10 mix-blend-screen animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <motion.div
              initial={{ scale: 0.5, opacity: 1, borderWidth: "8px" }}
              animate={{ scale: 4, opacity: 0, borderWidth: "0px" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-64 h-64 rounded-full border-violet-500"
            />
          </div>
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-[#0A0E1A]/90 backdrop-blur-3xl border border-violet-500/30 p-8 sm:p-12 rounded-[2rem] shadow-[0_0_100px_rgba(139,92,246,0.4)] flex flex-col items-center z-10"
          >
            <div className="relative">
              <Sparkles
                size={64}
                className="text-violet-400 mb-6 animate-bounce relative z-10"
              />
              <div className="absolute inset-0 bg-violet-500/40 blur-2xl rounded-full" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight text-center drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              Session Complete!
            </h2>
            <p className="text-violet-300 font-bold text-lg bg-violet-500/10 px-4 py-1.5 rounded-full border border-violet-500/20">
              +25 Productivity XP
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (distractionFree) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto overflow-x-hidden"
      >
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-violet-600/10 blur-[200px] rounded-full mix-blend-screen opacity-50" />
          {/* Letterbox effect */}
          <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />
        </div>

        <button
          onClick={toggleFullscreen}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors z-50"
        >
          <Minimize2 size={20} />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-2xl flex flex-col items-center justify-center min-h-screen py-12"
        >
          {renderTimerContent()}
        </motion.div>

        {renderCelebration()}
        <audio
          ref={audioRef}
          src="/chime.mp3"
          preload="auto"
          className="hidden"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.6,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className="space-y-6 relative min-h-screen"
    >
      {/* Mouse Radial Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-500"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.03), transparent 40%)`,
          opacity: isRunning ? 0 : 1,
        }}
      />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[150px] rounded-full mix-blend-screen transition-all duration-1000 ${isRunning ? "scale-110 opacity-70" : "animate-pulse"}`}
          style={{ animationDuration: "10s" }}
        />
        <div
          className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[150px] rounded-full mix-blend-screen transition-all duration-1000 ${isRunning ? "scale-110 opacity-70" : "animate-pulse"}`}
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        />
        {/* Floating Particles */}
        {!reducedMotion &&
          particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
                top: `${p.y}%`,
                opacity: 0,
              }}
              animate={{ y: [0, -100], opacity: [0, 0.4, 0] }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-indigo-100 to-zinc-400 bg-clip-text text-transparent drop-shadow-sm">
            Focus Mode
          </h1>
          <p className="text-zinc-500 mt-2 text-[13px] font-medium">
            Immersive deep work sessions powered by AI
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.08] text-violet-300 text-[12px] font-semibold tracking-wide shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            {mode === "work" ? (
              <>
                <Brain size={14} className="text-violet-400" /> Deep Focus
              </>
            ) : (
              <>
                <Coffee size={14} className="text-emerald-400" /> Rest & Recover
              </>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-zinc-400 hover:text-white hover:bg-white/[0.1] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all"
            title="Enter Distraction Free Mode"
          >
            <Maximize2 size={16} />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        {/* TIMER */}
        <PremiumCard className="xl:col-span-2 p-6 sm:p-10 min-h-[600px] flex items-center justify-center relative overflow-hidden group border border-white/[0.08] shadow-2xl bg-[#0A0E1A]/60 backdrop-blur-3xl">
          {renderTimerContent()}
        </PremiumCard>

        {/* SIDE PANELS (Fade when running) */}
        <div
          className={`space-y-6 transition-opacity duration-700 ${isRunning ? "opacity-30 hover:opacity-100" : "opacity-100"}`}
        >
          {/* ANALYTICS */}
          <PremiumCard className="p-6 relative overflow-hidden group border border-white/[0.05] shadow-xl bg-[#0A0E1A]/60 backdrop-blur-2xl">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-6 flex items-center gap-2">
              <BarChart2 size={16} className="text-cyan-400" /> Live Session
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-zinc-400">Completion</span>
                  <span className="text-cyan-400">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                  />
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay" />
                </div>
              </div>
              <div className="flex justify-between items-end pt-2">
                <div>
                  <div className="text-xs font-medium text-zinc-500 mb-1">
                    Productivity
                  </div>
                  <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                    {stats.productivityScore}{" "}
                    <span className="text-sm text-zinc-500">/100</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-zinc-500 mb-1">
                    Deep Work
                  </div>
                  <div className="text-lg font-bold text-white">
                    {stats.totalFocusHours}h
                  </div>
                </div>
              </div>
            </div>
          </PremiumCard>

          {/* AI INSIGHTS */}
          <PremiumCard className="p-6 relative overflow-hidden group border border-white/[0.05] shadow-xl bg-[#0A0E1A]/60 backdrop-blur-2xl">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-violet-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-violet-500/20 transition-all duration-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-violet-400" /> AI Insights
            </h3>
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeInsightIdx}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.4 }}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-md flex gap-3 shadow-lg"
                >
                  {(() => {
                    const InsightIcon = aiInsightList[activeInsightIdx].icon;
                    return (
                      <InsightIcon
                        size={18}
                        className={`${aiInsightList[activeInsightIdx].color} shrink-0 mt-0.5`}
                      />
                    );
                  })()}
                  <div>
                    <div className="text-xs font-bold text-white mb-1.5">
                      {aiInsightList[activeInsightIdx].title}
                    </div>
                    <div className="text-xs text-zinc-400 leading-relaxed">
                      {aiInsightList[activeInsightIdx].desc}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOptimizing(true)}
              className="mt-4 w-full rounded-xl bg-white/[0.03] border border-white/[0.08] py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/[0.08] hover:border-violet-500/40 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 group"
            >
              <Zap
                size={14}
                className="text-violet-400 group-hover:animate-pulse"
              />
              Optimize Focus Cycle
            </motion.button>
          </PremiumCard>

          {/* SOUNDSCAPES */}
          <PremiumCard className="p-6 relative overflow-hidden border border-white/[0.05] shadow-xl bg-[#0A0E1A]/60 backdrop-blur-2xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
              <Volume2 size={16} className="text-zinc-400" /> Neural Soundscapes
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {SOUNDSCAPES.map((s) => {
                const isSelected = activeSoundscape === s.id;
                const Icon = s.icon;
                return (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    key={s.id}
                    onClick={() => setActiveSoundscape(s.id)}
                    className={`flex items-center gap-2.5 p-3.5 rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? "bg-white/[0.08] border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? s.color
                              .replace("text-", "bg-")
                              .replace("400", "500") + "/20"
                          : "bg-white/5"
                      }`}
                    >
                      <Icon
                        size={14}
                        className={isSelected ? s.color : "text-zinc-500"}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-semibold truncate ${
                        isSelected ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      {s.name}
                    </span>
                    {isSelected && isRunning && <Equalizer color={s.color} />}
                  </motion.button>
                );
              })}
            </div>

            {/* PREMIUM VOLUME SLIDER */}
            <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center gap-3 px-1">
              <VolumeX size={14} className="text-zinc-500 shrink-0" />
              <div className="relative flex-1 flex items-center group">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={ambientVolume}
                  onChange={handleVolumeChange}
                  className="
                    w-full h-1.5 bg-white/[0.05] rounded-full appearance-none cursor-pointer outline-none relative z-10
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                    [&::-webkit-slider-thumb]:bg-violet-400 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(139,92,246,0.8)]
                    [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none
                    [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:bg-violet-400
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(139,92,246,0.8)]
                  "
                />
                <div
                  className="absolute left-0 h-1.5 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full pointer-events-none"
                  style={{ width: `${ambientVolume * 100}%` }}
                />
              </div>
              <Volume2
                size={14}
                className={
                  ambientVolume > 0.5 ? "text-zinc-300" : "text-zinc-500"
                }
                shrink-0
              />
            </div>
          </PremiumCard>
        </div>
      </div>

      <AnimatePresence>
        {isOptimizing && (
          <AIOptimizationModal
            onClose={() => setIsOptimizing(false)}
            stats={stats}
            settings={data?.settings || {}}
            updateProductivitySettings={updateProductivitySettings}
          />
        )}
      </AnimatePresence>
      {renderCelebration()}
      <audio
        ref={audioRef}
        src="/chime.mp3"
        preload="auto"
        className="hidden"
      />
    </motion.div>
  );
}

function PlanCard({ title, work, breakTime, isRecommended }) {
  return (
    <div
      className={`p-6 rounded-2xl border ${isRecommended ? "bg-violet-500/10 border-violet-500/20" : "bg-white/[0.03] border-white/10"}`}
    >
      <h4
        className={`text-sm font-bold uppercase tracking-wider ${isRecommended ? "text-violet-300" : "text-zinc-400"}`}
      >
        {title}
      </h4>
      <div className="flex items-baseline gap-4 mt-3">
        <div>
          <div className="text-4xl font-bold text-white">{work}</div>
          <div className="text-xs text-zinc-500 font-medium mt-1">
            Focus (min)
          </div>
        </div>
        <div>
          <div className="text-4xl font-bold text-white">{breakTime}</div>
          <div className="text-xs text-zinc-500 font-medium mt-1">
            Break (min)
          </div>
        </div>
      </div>
    </div>
  );
}

function AIOptimizationModal({
  onClose,
  stats,
  settings,
  updateProductivitySettings,
}) {
  const aiPlan = useMemo(() => {
    const productivityScore = stats?.productivityScore || 0;
    const streak = stats?.streak || 0;
    const totalFocusHours = stats?.totalFocusHours || 0;
    const pomodoroWorkTime = settings?.pomodoroWorkTime || 25;
    const pomodoroBreakTime = settings?.pomodoroBreakTime || 5;
    const aiStrictness = settings?.aiStrictness || "balanced";

    let analysisReason = "";
    let newSettings;

    if (productivityScore < 65) {
      if (aiStrictness === "strict") {
        analysisReason =
          "Your efficiency score is low. AI is switching to shorter, more intense 20-minute cycles to rebuild momentum and provide quick wins.";
        newSettings = { pomodoroWorkTime: 20, pomodoroBreakTime: 4 };
      } else {
        analysisReason =
          "To boost your productivity score, AI recommends returning to the classic, proven 25/5 Pomodoro technique to build a consistent rhythm.";
        newSettings = { pomodoroWorkTime: 25, pomodoroBreakTime: 5 };
      }
    } else if (totalFocusHours > 25 && streak > 4) {
      analysisReason =
        "You're demonstrating elite consistency, but burnout is a risk. AI is increasing break times to ensure your high performance is sustainable.";
      newSettings = {
        pomodoroWorkTime,
        pomodoroBreakTime: Math.min(10, Math.round(pomodoroBreakTime * 1.4)),
      };
    } else if (productivityScore > 85) {
      analysisReason =
        "You're in a peak performance state. To leverage this flow, AI suggests extending focus sessions for deeper work and greater output.";
      newSettings = { pomodoroWorkTime: 45, pomodoroBreakTime: 10 };
    } else {
      analysisReason =
        "Your current rhythm is effective. AI suggests maintaining your current settings to reinforce this positive habit.";
      newSettings = { pomodoroWorkTime, pomodoroBreakTime };
    }

    return { reason: analysisReason, newSettings: newSettings };
  }, [stats, settings]);

  const handleApply = () => {
    updateProductivitySettings?.(aiPlan.newSettings);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[#0A0E1A]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden z-10"
      >
        <div className="px-8 py-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-white/10">
              <Sparkles size={22} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                AI Focus Plan
              </h2>
              <p className="text-sm text-zinc-400 font-medium mt-0.5">
                Optimized Pomodoro settings based on your performance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="p-5 rounded-2xl bg-amber-500/[0.05] border border-amber-500/10 flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Lightbulb className="text-amber-400" size={20} />
            </div>
            <div>
              <div className="text-base font-bold text-white mb-1.5 tracking-wide">
                AI Analysis
              </div>
              <div className="text-sm text-zinc-400 leading-relaxed">
                {aiPlan.reason}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PlanCard
              title="Current Plan"
              work={settings.pomodoroWorkTime}
              breakTime={settings.pomodoroBreakTime}
              isRecommended={false}
            />
            <PlanCard
              title="AI Optimized Plan"
              work={aiPlan.newSettings.pomodoroWorkTime}
              breakTime={aiPlan.newSettings.pomodoroBreakTime}
              isRecommended={true}
            />
          </div>
        </div>

        <div className="px-8 py-6 border-t border-white/[0.06] flex items-center justify-end gap-4 bg-white/[0.01]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApply}
            className="px-6 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all flex items-center gap-2"
          >
            <Sparkles size={16} />
            Apply & Close
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
