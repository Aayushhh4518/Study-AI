import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Pause,
  Play,
  RotateCcw,
  TimerReset,
} from "lucide-react";

import PremiumCard from "../components/ui/premium-card";

const TOTAL_TIME = 25 * 60;

export default function FocusTimer() {
  const [secondsLeft, setSecondsLeft] =
    useState(TOTAL_TIME);

  const [isRunning, setIsRunning] =
    useState(false);

  const [sessionsCompleted, setSessionsCompleted] =
    useState(8);

  /* TIMER EFFECT */

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setSessionsCompleted((count) => count + 1);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  /* FORMAT TIME */

  const minutes = String(
    Math.floor(secondsLeft / 60),
  ).padStart(2, "0");

  const seconds = String(
    secondsLeft % 60,
  ).padStart(2, "0");

  /* PROGRESS */

  const progress = useMemo(() => {
    return (
      ((TOTAL_TIME - secondsLeft) /
        TOTAL_TIME) *
      100
    );
  }, [secondsLeft]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div>
        <h1
          className="
            text-5xl
            font-black
            tracking-tight
            bg-gradient-to-r
            from-white
            via-violet-200
            to-cyan-200
            bg-clip-text
            text-transparent
          "
        >
          Focus Mode
        </h1>

        <p className="text-zinc-400 mt-3 text-lg">
          Deep work sessions powered by AI productivity.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* TIMER */}
        <PremiumCard
          className="
            xl:col-span-2
            p-10
            min-h-[580px]
            flex
            items-center
            justify-center
          "
        >
          <div className="flex flex-col items-center">
            {/* TITLE */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">
                Pomodoro Session
              </h2>

              <p className="text-zinc-400 mt-3">
                Stay focused and maximize productivity
              </p>
            </div>

            {/* PROGRESS RING */}
            <div className="relative h-[320px] w-[320px]">
              {/* BACKGROUND */}
              <svg
                className="absolute inset-0"
                width="320"
                height="320"
              >
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="14"
                  fill="transparent"
                />

                {/* PROGRESS */}
                <motion.circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="url(#gradient)"
                  strokeWidth="14"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={879.6}
                  strokeDashoffset={
                    879.6 -
                    (879.6 * progress) / 100
                  }
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
                      stopColor="#8b5cf6"
                    />

                    <stop
                      offset="100%"
                      stopColor="#3b82f6"
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
                  Focus Time Remaining
                </p>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-5 mt-14">
              {/* PAUSE */}
              <button
                onClick={() =>
                  setIsRunning(false)
                }
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
                onClick={() =>
                  setIsRunning(true)
                }
                className="
                  h-20
                  w-20
                  rounded-3xl
                  bg-gradient-to-br
                  from-violet-500
                  to-blue-500
                  flex items-center justify-center
                  shadow-[0_0_50px_rgba(99,102,241,0.45)]
                  transition-all
                  hover:scale-105
                "
              >
                <Play size={30} />
              </button>

              {/* RESET */}
              <button
                onClick={() => {
                  setSecondsLeft(TOTAL_TIME);

                  setIsRunning(false);
                }}
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
          {/* STATS */}
          <PremiumCard className="p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">
                Session Stats
              </h3>

              <TimerReset
                size={22}
                className="text-violet-300"
              />
            </div>

            <div className="space-y-5 mt-8">
              {[
                {
                  label: "Today's Focus",
                  value: "4.2h",
                },
                {
                  label: "Completed Sessions",
                  value: sessionsCompleted,
                },
                {
                  label: "Productivity Score",
                  value: "92%",
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
                  <p className="text-zinc-400 text-sm">
                    {item.label}
                  </p>

                  <h4 className="text-2xl font-bold text-white mt-2">
                    {item.value}
                  </h4>
                </div>
              ))}
            </div>
          </PremiumCard>

          {/* AI PANEL */}
          <PremiumCard className="p-7">
            <h3 className="text-2xl font-bold text-white">
              AI Focus Tip
            </h3>

            <p className="text-zinc-300 mt-5 leading-relaxed">
              Your productivity increases significantly
              during uninterrupted 25-minute sessions.
              AI recommends a 5-minute recovery break
              after each cycle.
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
