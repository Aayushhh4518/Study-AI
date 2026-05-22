import { motion } from "framer-motion";

import {
  Pause,
  Play,
  RotateCcw,
  TimerReset,
} from "lucide-react";

export default function Focus() {
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
        {/* TIMER SECTION */}
        <div
          className="
            xl:col-span-2
            relative
            overflow-hidden
            rounded-[36px]
            border border-white/10
            bg-white/[0.04]
            backdrop-blur-2xl
            p-10
            min-h-[580px]
          "
        >
          {/* glow */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-violet-500/10
              via-transparent
              to-cyan-500/10
            "
          />

          {/* floating glow */}
          <div
            className="
              absolute
              top-1/2
              left-1/2
              -translate-x-1/2
              -translate-y-1/2
              h-[420px]
              w-[420px]
              rounded-full
              bg-violet-500/20
              blur-3xl
            "
          />

          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            {/* TITLE */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">
                Pomodoro Session
              </h2>

              <p className="text-zinc-400 mt-3">
                Stay focused and maximize productivity
              </p>
            </div>

            {/* TIMER RING */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 40px rgba(139,92,246,0.25)",
                  "0 0 80px rgba(59,130,246,0.35)",
                  "0 0 40px rgba(139,92,246,0.25)",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
              }}
              className="
                relative
                h-[320px]
                w-[320px]
                rounded-full
                border-[14px]
                border-violet-500/30
                flex
                items-center
                justify-center
                bg-black/20
                backdrop-blur-3xl
              "
            >
              {/* INNER RING */}
              <div
                className="
                  absolute
                  inset-5
                  rounded-full
                  border border-white/10
                "
              />

              {/* TIMER */}
              <div className="text-center">
                <h1
                  className="
                    text-7xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  25:00
                </h1>

                <p className="text-zinc-400 mt-4 text-lg">
                  Focus Time Remaining
                </p>
              </div>
            </motion.div>

            {/* CONTROLS */}
            <div className="flex items-center gap-5 mt-14">
              <button
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

              <button
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

              <button
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
        </div>

        {/* SIDE PANEL */}
        <div className="space-y-6">
          {/* SESSION CARD */}
          <div
            className="
              rounded-[32px]
              border border-white/10
              bg-white/[0.04]
              p-7
              backdrop-blur-2xl
            "
          >
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
                  value: "8",
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
          </div>

          {/* AI RECOMMENDATION */}
          <div
            className="
              rounded-[32px]
              border border-white/10
              bg-gradient-to-br
              from-violet-500/10
              to-blue-500/10
              p-7
              backdrop-blur-2xl
            "
          >
            <h3 className="text-2xl font-bold text-white">
              AI Focus Tip
            </h3>

            <p className="text-zinc-300 mt-5 leading-relaxed">
              Your highest productivity is detected between
              7PM and 9PM. AI recommends a 5-minute break
              after every 25-minute session.
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
