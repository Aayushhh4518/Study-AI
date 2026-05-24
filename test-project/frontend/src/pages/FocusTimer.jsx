import { motion } from "framer-motion";
import {
  Brain,
  Coffee,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  TimerReset,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import PremiumCard from "../components/ui/premium-card";
import { useData } from "../store/DataContext";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function FocusTimer() {
  const { data, stats, recordFocusSession } = useData();

  const [focusState, setFocusState] = useState(() => {
    const saved = localStorage.getItem("studyai-focus-state");
    return saved ? JSON.parse(saved) : { mode: "work", secondsLeft: WORK_TIME };
  });

  const [isRunning, setIsRunning] = useState(false);
  const { mode, secondsLeft } = focusState;
  const TOTAL_TIME = mode === "work" ? WORK_TIME : BREAK_TIME;

  /* SAVE */
  useEffect(() => {
    localStorage.setItem("studyai-focus-state", JSON.stringify(focusState));
  }, [focusState]);

  /* TIMER */
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
      setIsRunning(false);

      if (mode === "work") {
        recordFocusSession(25);
        toast.success("Focus session completed! Time for a break.", {
          icon: "🎉",
        });
        setFocusState({ mode: "break", secondsLeft: BREAK_TIME });
      } else {
        toast.success("Break is over! Ready to focus?", { icon: "🧠" });
        setFocusState({ mode: "work", secondsLeft: WORK_TIME });
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, mode, recordFocusSession]);

  /* FORMAT */
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  /* PROGRESS */
  const progress = useMemo(() => {
    return ((TOTAL_TIME - secondsLeft) / TOTAL_TIME) * 100;
  }, [secondsLeft, TOTAL_TIME]);

  /* CONTROLS */
  const handleReset = () => {
    setFocusState({ mode: "work", secondsLeft: WORK_TIME });
    setIsRunning(false);
    toast.info("Timer reset");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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
              <Brain size={14} className="text-violet-400" /> AI Focus Active
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
                    ? "Deep Work Session"
                    : "Ready to Focus"
                  : isRunning
                    ? "Recovery Break"
                    : "Take a Breather"}
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
                  : isRunning
                    ? "Relax, stretch, and grab some water"
                    : "Enjoy your well-earned break"}
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
                  transition={{ duration: 1, ease: "linear" }}
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
                  {mode === "work"
                    ? "Focus Time Remaining"
                    : "Break Time Remaining"}
                </p>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-5 mt-14">
              {/* PAUSE */}
              <button
                onClick={() => setIsRunning(false)}
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
                <Pause size={24} />
              </button>

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
                  value: data.focusSessions.totalCompleted,
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
    </motion.div>
  );
}
