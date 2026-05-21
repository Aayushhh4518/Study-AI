import { motion } from "framer-motion";

import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

import PremiumCard from "../components/ui/premium-card";

const stats = [
  {
    title: "Study Hours",
    value: "128h",
    icon: Clock3,
    subtitle: "+12% from last week",
  },
  {
    title: "Tasks Completed",
    value: "42",
    icon: CheckCircle2,
    subtitle: "8 tasks pending",
  },
  {
    title: "Subjects",
    value: "8",
    icon: BookOpen,
    subtitle: "2 active today",
  },
  {
    title: "AI Sessions",
    value: "19",
    icon: BrainCircuit,
    subtitle: "AI productivity insights",
  },
];

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
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
            Dashboard
          </h1>

          <p className="text-zinc-400 mt-3 text-lg">
            Welcome back to your productivity command center.
          </p>
        </div>

        {/* AI Badge */}
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
              AI Productivity Mode
            </p>

            <p className="text-xs text-zinc-400">Smart insights enabled</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <PremiumCard
              key={stat.title}
              className="
                p-6
                relative
                overflow-hidden
              "
            >
              {/* Glow */}
              <div
                className="
                  absolute
                  top-0 right-0
                  h-28 w-28
                  rounded-full
                  bg-violet-500/10
                  blur-3xl
                "
              />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-400">{stat.title}</p>

                  <h2 className="text-4xl font-bold mt-3 text-white">
                    {stat.value}
                  </h2>

                  <p className="text-sm text-zinc-500 mt-2">{stat.subtitle}</p>
                </div>

                <div
                  className="
                    h-16 w-16
                    rounded-2xl
                    bg-gradient-to-br
                    from-violet-500/20
                    to-blue-500/20
                    border border-white/10
                    flex items-center justify-center
                  "
                >
                  <Icon size={30} className="text-violet-300" />
                </div>
              </div>
            </PremiumCard>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Analytics */}
        <PremiumCard
          className="
            xl:col-span-2
            p-6
            min-h-[420px]
          "
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-white">
                Productivity Overview
              </h3>

              <p className="text-zinc-400 mt-1">
                Weekly study performance analytics
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
              Live Analytics
            </div>
          </div>

          <div
            className="
              h-[320px]
              rounded-3xl
              border border-dashed border-white/10
              bg-gradient-to-br
              from-white/[0.03]
              to-white/[0.01]
              flex items-center justify-center
              text-zinc-500
            "
          >
            Recharts analytics will appear here.
          </div>
        </PremiumCard>

        {/* AI Assistant */}
        <PremiumCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-white">
                AI Assistant
              </h3>

              <p className="text-zinc-400 mt-1">Smart productivity insights</p>
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
              "You focused 18% more this week.",
              "Best study time detected: 7PM - 9PM",
              "AI recommends revising DSA tomorrow.",
            ].map((item) => (
              <div
                key={item}
                className="
                  rounded-2xl
                  bg-white/[0.04]
                  border border-white/10
                  p-4
                  transition-all
                  hover:bg-white/[0.06]
                "
              >
                <p className="text-zinc-300 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>
    </motion.div>
  );
}
