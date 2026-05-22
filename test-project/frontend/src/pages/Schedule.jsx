import { motion } from "framer-motion";

import {
  BrainCircuit,
  CalendarDays,
  Clock3,
  Sparkles,
} from "lucide-react";

import PremiumCard from "../components/ui/premium-card";

const sessions = [
  {
    subject: "Data Structures",
    time: "7:00 PM - 8:30 PM",
    type: "Deep Focus",
    color: "from-violet-500 to-indigo-500",
  },
  {
    subject: "DBMS Revision",
    time: "9:00 PM - 10:00 PM",
    type: "Revision",
    color: "from-pink-500 to-rose-500",
  },
  {
    subject: "AI Research",
    time: "10:30 PM - 11:30 PM",
    type: "Research",
    color: "from-cyan-500 to-blue-500",
  },
];

export default function Schedule() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="
              text-5xl
              font-bold
              tracking-tight
              bg-gradient-to-r
              from-white
              via-violet-200
              to-blue-200
              bg-clip-text
              text-transparent
            "
          >
            Schedule
          </h1>

          <p className="text-zinc-400 mt-3 text-lg">
            Organize your AI-powered productivity sessions.
          </p>
        </div>

        {/* AI BADGE */}
        <div
          className="
            flex items-center gap-3
            rounded-2xl
            border border-white/10
            bg-white/[0.04]
            px-5 py-3
            backdrop-blur-xl
          "
        >
          <div
            className="
              h-10 w-10
              rounded-xl
              bg-gradient-to-br
              from-violet-500
              to-blue-500
              flex items-center justify-center
              shadow-[0_0_35px_rgba(99,102,241,0.35)]
            "
          >
            <Sparkles size={18} />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              AI Schedule
            </p>

            <p className="text-xs text-zinc-400">
              Smart planning enabled
            </p>
          </div>
        </div>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">
                Today's Sessions
              </p>

              <h2 className="text-4xl font-bold mt-2">
                5
              </h2>
            </div>

            <div
              className="
                h-14 w-14
                rounded-2xl
                bg-gradient-to-br
                from-violet-500/20
                to-blue-500/20
                border border-white/10
                flex items-center justify-center
              "
            >
              <CalendarDays className="text-violet-300" />
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">
                Focus Hours
              </p>

              <h2 className="text-4xl font-bold mt-2">
                6.5h
              </h2>
            </div>

            <div
              className="
                h-14 w-14
                rounded-2xl
                bg-gradient-to-br
                from-cyan-500/20
                to-blue-500/20
                border border-white/10
                flex items-center justify-center
              "
            >
              <Clock3 className="text-cyan-300" />
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">
                Productivity Score
              </p>

              <h2 className="text-4xl font-bold mt-2">
                91%
              </h2>
            </div>

            <div
              className="
                h-14 w-14
                rounded-2xl
                bg-gradient-to-br
                from-emerald-500/20
                to-green-500/20
                border border-white/10
                flex items-center justify-center
              "
            >
              <BrainCircuit className="text-emerald-300" />
            </div>
          </div>
        </PremiumCard>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* TIMELINE */}
        <PremiumCard
          className="
            xl:col-span-2
            p-6
          "
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-semibold">
                Today's Timeline
              </h3>

              <p className="text-zinc-400 mt-1">
                Your scheduled productivity sessions
              </p>
            </div>

            <div
              className="
                px-4 py-2
                rounded-xl
                bg-violet-500/10
                border border-violet-500/20
                text-sm text-violet-300
              "
            >
              Live Schedule
            </div>
          </div>

          <div className="space-y-5">
            {sessions.map((session) => (
              <div
                key={session.subject}
                className="
                  flex items-center gap-5
                  rounded-3xl
                  border border-white/10
                  bg-white/[0.03]
                  p-5
                  transition-all
                  duration-300
                  hover:bg-white/[0.05]
                  hover:border-white/20
                "
              >
                {/* TIME */}
                <div
                  className={`
                    h-16
                    w-16
                    rounded-2xl
                    bg-gradient-to-br
                    ${session.color}
                    flex items-center justify-center
                    shadow-[0_0_30px_rgba(99,102,241,0.25)]
                  `}
                >
                  <Clock3 size={24} />
                </div>

                {/* INFO */}
                <div className="flex-1">
                  <h4 className="text-xl font-semibold">
                    {session.subject}
                  </h4>

                  <p className="text-zinc-400 mt-1">
                    {session.time}
                  </p>
                </div>

                {/* TYPE */}
                <div
                  className={`
                    px-4 py-2
                    rounded-xl
                    bg-gradient-to-r
                    ${session.color}
                    text-sm
                    font-medium
                  `}
                >
                  {session.type}
                </div>
              </div>
            ))}
          </div>
        </PremiumCard>

        {/* AI PLANNER */}
        <PremiumCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold">
                AI Planner
              </h3>

              <p className="text-zinc-400 mt-1">
                Smart scheduling recommendations
              </p>
            </div>

            <div
              className="
                h-12 w-12
                rounded-2xl
                bg-gradient-to-br
                from-cyan-500
                to-blue-500
                shadow-[0_0_35px_rgba(59,130,246,0.35)]
              "
            />
          </div>

          <div className="space-y-4">
            {[
              "Best focus time detected at 7PM.",
              "AI suggests adding one break session.",
              "Deep work productivity increased by 14%.",
            ].map((tip) => (
              <div
                key={tip}
                className="
                  rounded-2xl
                  bg-white/[0.04]
                  border border-white/10
                  p-4
                "
              >
                <p className="text-sm text-zinc-300">
                  {tip}
                </p>
              </div>
            ))}
          </div>

          <button
            className="
              mt-6
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-violet-500
              to-blue-500
              py-4
              font-semibold
              transition-all
              hover:scale-[1.02]
              hover:shadow-[0_0_35px_rgba(99,102,241,0.35)]
            "
          >
            Optimize Schedule
          </button>
        </PremiumCard>
      </div>
    </motion.div>
  );
}
