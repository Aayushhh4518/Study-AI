import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Coffee,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  TimerReset,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import PremiumCard from "../components/ui/premium-card";
import { useData } from "../store/DataContext";

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

  const audioRef = useRef(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const [focusState, setFocusState] = useState(() => {
    const saved = localStorage.getItem("studyai-focus-state");
    if (saved) {
      const parsed = JSON.parse(saved);
      // On initial load, prioritize current settings over any saved time.
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

  const TOTAL_TIME = useMemo(() => {
    if (mode === "work") return pomodoroWorkTime * 60;
    if (mode === "break") return pomodoroBreakTime * 60;
    if (mode === "longBreak") return pomodoroLongBreak * 60;
    return pomodoroWorkTime * 60;
  }, [mode, pomodoroWorkTime, pomodoroBreakTime, pomodoroLongBreak]);

  // This effect synchronizes the timer with external settings changes
  // when the timer is not running. This is the key to live updates.
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

  /* SAVE STATE TO LOCALSTORAGE */
  useEffect(() => {
    localStorage.setItem("studyai-focus-state", JSON.stringify(focusState));
  }, [focusState]);

  /* CORE TIMER LOGIC */
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
        recordFocusSession(pomodoroWorkTime);
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
  ]);

  /* FORMAT DISPLAY TIME */
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  /* CALCULATE PROGRESS FOR RING */
  const progress = useMemo(() => {
    if (TOTAL_TIME === 0) return 0;
    return ((TOTAL_TIME - secondsLeft) / TOTAL_TIME) * 100;
  }, [secondsLeft, TOTAL_TIME]);

  /* CONTROLS */
  const handleReset = () => {
    setFocusState({ mode: "work", secondsLeft: pomodoroWorkTime * 60 });
    setIsRunning(false);
    toast.info("Timer reset");
  };

  const toggleSound = useCallback(() => {
    updateSettings({ soundEnabled: !soundEnabled });
    toast.success(`Sound ${!soundEnabled ? "enabled" : "disabled"}`);
  }, [soundEnabled, updateSettings]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.4 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="
            text-3xl font-bold tracking-tight leading-none
            bg-gradient-to-r from-white via-zinc-100 to-zinc-400
            bg-clip-text text-transparent
          "
          >
            Focus Mode
          </h1>
          <p className="text-zinc-500 mt-2 text-[13px] font-medium">
            Immersive deep work sessions powered by AI
          </p>
        </div>

        {/* AI status badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.08] text-violet-300 text-[12px] font-semibold tracking-wide shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] self-start sm:self-auto">
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
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* TIMER */}
        <PremiumCard className="xl:col-span-2 p-10 min-h-[580px] flex items-center justify-center relative overflow-hidden group">
          <div
            className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full blur-[100px] transition-all duration-1000 ${
              mode === "work" ? "bg-violet-500/[0.04]" : "bg-emerald-500/[0.04]"
            }`}
            style={{ opacity: isRunning ? 1 : 0.4 }}
          />

          <div className="flex flex-col items-center relative z-10">
            {/* TITLE */}
            <div className="text-center mb-14">
              <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">
                {mode === "work"
                  ? isRunning
                    ? "Deep Focus Session"
                    : "Ready to Focus"
                  : mode === "break"
                    ? "Short Break"
                    : "Long Break"}
              </h2>
              <p className="text-zinc-500 mt-2 text-[14px] font-medium flex items-center justify-center gap-2">
                {isRunning && (
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mode === "work" ? "bg-emerald-400" : "bg-teal-400"}`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${mode === "work" ? "bg-emerald-500" : "bg-teal-500"}`}
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
              </p>
            </div>

            {/* RING */}
            <div className="relative h-[320px] w-[320px]">
              <svg
                className="absolute inset-0 drop-shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                width="320"
                height="320"
              >
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="6"
                  fill="transparent"
                />

                <motion.circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="url(#gradient)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={879.6}
                  initial={{ strokeDashoffset: 879.6 }}
                  animate={{
                    strokeDashoffset: 879.6 - (879.6 * progress) / 100,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 1,
                    ease: "linear",
                  }}
                  transform="rotate(-90 160 160)"
                />

                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={mode === "work" ? "#8b5cf6" : "#10b981"}
                    />

                    <stop
                      offset="100%"
                      stopColor={mode === "work" ? "#3b82f6" : "#14b8a6"}
                    />
                  </linearGradient>
                </defs>
              </svg>

              {/* TIMER */}
              <div
                className="
                  absolute
                  inset-0
                  flex
                  flex-col
                  items-center
                  justify-center
                "
              >
                <h1
                  className="
                    text-7xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  {minutes}:{seconds}
                </h1>

                <p className="text-zinc-400 mt-4 text-lg">
                  {mode === "work" ? "Focus Time Remaining" : "Break Remaining"}
                </p>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-5 mt-14">
              {/* PAUSE */}
              {isRunning ? (
                <button
                  onClick={() => setIsRunning(false)}
                  className="
                    h-16 w-16 rounded-2xl border border-white/10 bg-white/[0.05]
                    flex items-center justify-center transition-all hover:bg-white/[0.08]
                  "
                >
                  <Pause size={24} />
                </button>
              ) : (
                <button
                  onClick={toggleSound}
                  className="h-16 w-16 rounded-2xl border border-white/10 bg-white/[0.05] flex items-center justify-center transition-all hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                >
                  {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
              )}

              {/* PLAY */}
              <button
                onClick={() => setIsRunning(true)}
                className={`
                  h-20
                  w-20
                  rounded-3xl
                  bg-gradient-to-br
                  ${mode === "work" ? "from-violet-500 to-blue-500 shadow-[0_0_50px_rgba(99,102,241,0.45)]" : "from-emerald-500 to-teal-500 shadow-[0_0_50px_rgba(16,185,129,0.45)]"}
                  flex items-center justify-center
                  transition-all
                  hover:scale-105
                `}
              >
                <Play size={30} />
              </button>

              {/* RESET */}
              <button
                onClick={handleReset}
                className="
                  h-16
                  w-16
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.05]
                  flex items-center justify-center
                  transition-all
                  hover:bg-white/[0.08]
                "
              >
                <RotateCcw size={24} />
              </button>
            </div>
          </div>
          {/* Preload audio */}
          <audio
            ref={audioRef}
            src="/chime.mp3"
            preload="auto"
            className="hidden"
          />
        </PremiumCard>

        {/* SIDE PANEL */}
        <div className="space-y-6">
          <PremiumCard className="p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Session Stats</h3>

              <TimerReset size={22} className="text-violet-300" />
            </div>

            <div className="space-y-5 mt-8">
              {[
                {
                  label: "Total Focus Hours",
                  value: `${stats.totalFocusHours}h`,
                },
                {
                  label: "Completed Sessions",
                  value: data.focus.totalCompleted,
                },
                {
                  label: "Productivity Score",
                  value: `${stats.productivityScore}%`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="
                    rounded-2xl
                    border border-white/10
                    bg-white/[0.03]
                    p-4
                  "
                >
                  <p className="text-zinc-400 text-sm">{item.label}</p>

                  <h4 className="text-2xl font-bold text-white mt-2">
                    {item.value}
                  </h4>
                </div>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard className="p-7">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-amber-400" /> AI Focus Tip
            </h3>

            <p className="text-zinc-300 mt-5 leading-relaxed">
              {stats.streak > 3
                ? `You're on a ${stats.streak}-day streak! Consistency is key. AI suggests sticking to the 25-min interval to avoid burnout.`
                : "Your productivity increases significantly during uninterrupted 25-minute sessions. Try to complete at least one cycle."}
            </p>

            <button
              onClick={() => setIsOptimizing(true)}
              className="
                mt-7
                w-full
                rounded-2xl
                bg-gradient-to-r
                from-violet-500
                to-blue-500
                py-4
                font-semibold
                transition-all
                hover:scale-[1.02]
              "
            >
              Optimize Focus Plan
            </button>
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
    </motion.div>
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

    let reason = "";
    let newSettings = { pomodoroWorkTime, pomodoroBreakTime };

    if (productivityScore < 65) {
      if (aiStrictness === "strict") {
        reason =
          "Your efficiency score is low. AI is switching to shorter, more intense 20-minute cycles to rebuild momentum and provide quick wins.";
        newSettings = { pomodoroWorkTime: 20, pomodoroBreakTime: 4 };
      } else {
        reason =
          "To boost your productivity score, AI recommends returning to the classic, proven 25/5 Pomodoro technique to build a consistent rhythm.";
        newSettings = { pomodoroWorkTime: 25, pomodoroBreakTime: 5 };
      }
    } else if (totalFocusHours > 25 && streak > 4) {
      reason =
        "You're demonstrating elite consistency, but burnout is a risk. AI is increasing break times to ensure your high performance is sustainable.";
      newSettings = {
        pomodoroWorkTime,
        pomodoroBreakTime: Math.min(10, Math.round(pomodoroBreakTime * 1.4)),
      };
    } else if (productivityScore > 85) {
      reason =
        "You're in a peak performance state. To leverage this flow, AI suggests extending focus sessions for deeper work and greater output.";
      newSettings = { pomodoroWorkTime: 45, pomodoroBreakTime: 10 };
    } else {
      reason =
        "Your current rhythm is effective. AI suggests maintaining your current settings to reinforce this positive habit.";
      newSettings = { pomodoroWorkTime, pomodoroBreakTime };
    }

    return { reason, newSettings };
  }, [stats, settings]);

  const handleApply = () => {
    updateProductivitySettings?.(aiPlan.newSettings);
    onClose?.();
  };

  const PlanCard = ({ title, work, breakTime, isRecommended }) => (
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
        className="relative w-full max-w-2xl bg-[#0A0E1A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
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
          <button
            onClick={handleApply}
            className="px-6 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
          >
            Apply & Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
