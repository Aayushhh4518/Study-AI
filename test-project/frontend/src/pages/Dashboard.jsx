import { motion } from "framer-motion";

import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import ProductivityChart from "../components/dashboard/productivity-chart";
import PremiumCard from "../components/ui/premium-card";

const stats = [
  {
    title: "Study Hours",
    value: "128h",
    icon: Clock3,
    subtitle: "+12% from last week",
    glow: "from-violet-500 to-indigo-500",
  },
  {
    title: "Tasks Completed",
    value: "42",
    icon: CheckCircle2,
    subtitle: "8 tasks pending",
    glow: "from-cyan-500 to-blue-500",
  },
  {
    title: "Subjects",
    value: "8",
    icon: BookOpen,
    subtitle: "2 active today",
    glow: "from-pink-500 to-rose-500",
  },
  {
    title: "AI Sessions",
    value: "19",
    icon: BrainCircuit,
    subtitle: "AI productivity insights",
    glow: "from-emerald-500 to-green-500",
  },
];

const aiInsights = [
  {
    title: "Focus Increased",
    desc: "Your productivity improved by 18% this week.",
    icon: TrendingUp,
  },
  {
    title: "Best Study Time",
    desc: "Peak performance detected between 7PM - 9PM.",
    icon: Zap,
  },
  {
    title: "AI Recommendation",
    desc: "Revise Data Structures tomorrow for retention.",
    icon: Sparkles,
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
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
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
            Dashboard
          </motion.h1>

          <p className="text-zinc-400 mt-3 text-lg">
            Welcome back to your AI-powered productivity workspace.
          </p>
        </div>

        {/* AI MODE BADGE */}
        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          className="
            relative
            overflow-hidden
            flex
            items-center
            gap-4
            rounded-3xl
            border border-white/10
            bg-white/[0.04]
            px-6 py-4
            backdrop-blur-2xl
            shadow-[0_0_40px_rgba(99,102,241,0.15)]
          "
        >
          {/* glow */}
          <div
            className="
              absolute
              -top-10
              -right-10
              h-32
              w-32
              rounded-full
              bg-violet-500/20
              blur-3xl
            "
          />

          <div
            className="
              relative
              h-12
              w-12
              rounded-2xl
              bg-gradient-to-br
              from-violet-500
              to-blue-500
              flex
              items-center
              justify-center
              shadow-[0_0_35px_rgba(99,102,241,0.35)]
            "
          >
            <Sparkles size={20} />
          </div>

          <div className="relative">
            <p className="text-sm font-semibold text-white">
              AI Productivity Mode
            </p>

            <p className="text-xs text-zinc-400 mt-1">Smart insights enabled</p>
          </div>
        </motion.div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
            >
              <PremiumCard
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[32px]
                  p-7
                "
              >
                {/* animated glow */}
                <div
                  className={`
                    absolute
                    -top-10
                    -right-10
                    h-40
                    w-40
                    rounded-full
                    blur-3xl
                    opacity-20
                    transition-all
                    duration-500
                    group-hover:scale-125
                    bg-gradient-to-br
                    ${stat.glow}
                  `}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-[0.2em]
                        text-zinc-500
                      "
                    >
                      {stat.title}
                    </p>

                    <h2
                      className="
                        mt-5
                        text-5xl
                        font-black
                        tracking-tight
                        text-white
                      "
                    >
                      {stat.value}
                    </h2>

                    <p className="text-sm text-zinc-400 mt-3">
                      {stat.subtitle}
                    </p>
                  </div>

                  {/* ICON */}
                  <div
                    className={`
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-3xl
                      border
                      border-white/10
                      bg-gradient-to-br
                      ${stat.glow}
                      bg-opacity-20
                      backdrop-blur-xl
                      transition-all
                      duration-500
                      group-hover:scale-110
                      group-hover:rotate-6
                    `}
                  >
                    <Icon size={28} className="text-white" />
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ANALYTICS */}
        <PremiumCard
          className="
            xl:col-span-2
            p-7
            min-h-[520px]
            relative
            overflow-hidden
          "
        >
          {/* glow */}
          <div
            className="
              absolute
              top-0
              right-0
              h-72
              w-72
              rounded-full
              bg-violet-500/10
              blur-3xl
            "
          />

          <div className="relative z-10">
            {/* TOP */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-white">
                  Productivity Overview
                </h3>

                <p className="text-zinc-400 mt-2">
                  Weekly study performance analytics
                </p>
              </div>

              <div
                className="
                  px-5 py-2.5
                  rounded-2xl
                  bg-violet-500/10
                  border border-violet-500/20
                  text-sm text-violet-300
                  backdrop-blur-xl
                "
              >
                Live Analytics
              </div>
            </div>

            {/* MINI STATS */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                {
                  label: "Focus Score",
                  value: "92%",
                },
                {
                  label: "Weekly Growth",
                  value: "+18%",
                },
                {
                  label: "Consistency",
                  value: "7 Days",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="
                    rounded-2xl
                    border border-white/10
                    bg-white/[0.03]
                    p-4
                    backdrop-blur-xl
                  "
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {item.label}
                  </p>

                  <h4 className="text-2xl font-bold text-white mt-3">
                    {item.value}
                  </h4>
                </div>
              ))}
            </div>

            {/* CHART */}
            <div
              className="
                h-[320px]
                rounded-[28px]
                border border-white/10
                bg-gradient-to-br
                from-white/[0.04]
                to-white/[0.01]
                p-5
                backdrop-blur-2xl
                relative
                overflow-hidden
              "
            >
              {/* chart glow */}
              <div
                className="
                  absolute
                  bottom-0
                  left-1/2
                  -translate-x-1/2
                  h-40
                  w-96
                  bg-violet-500/10
                  blur-3xl
                "
              />

              <ProductivityChart />
            </div>

            {/* BOTTOM INSIGHTS */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div
                className="
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.03]
                  p-5
                "
              >
                <p className="text-zinc-500 text-sm">Peak Productivity</p>

                <h4 className="text-white text-xl font-bold mt-2">
                  Thursday Evening
                </h4>
              </div>

              <div
                className="
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.03]
                  p-5
                "
              >
                <p className="text-zinc-500 text-sm">AI Suggestion</p>

                <h4 className="text-white text-xl font-bold mt-2">
                  Schedule more focus sessions
                </h4>
              </div>
            </div>
          </div>
        </PremiumCard>

        {/* AI ASSISTANT */}
        <PremiumCard className="p-7">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-white">AI Assistant</h3>

              <p className="text-zinc-400 mt-2">Smart productivity insights</p>
            </div>

            <div
              className="
                h-14
                w-14
                rounded-3xl
                bg-gradient-to-br
                from-cyan-500
                to-blue-500
                flex
                items-center
                justify-center
                shadow-[0_0_35px_rgba(59,130,246,0.35)]
              "
            >
              <Sparkles size={22} />
            </div>
          </div>

          <div className="space-y-4">
            {aiInsights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    x: 4,
                  }}
                  className="
                    group
                    rounded-3xl
                    bg-white/[0.04]
                    border border-white/10
                    p-5
                    transition-all
                    duration-300
                    hover:bg-white/[0.06]
                    hover:border-violet-500/20
                  "
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="
                        h-11
                        w-11
                        rounded-2xl
                        bg-gradient-to-br
                        from-violet-500/20
                        to-blue-500/20
                        flex
                        items-center
                        justify-center
                        border border-white/10
                      "
                    >
                      <Icon size={18} className="text-violet-300" />
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>

                      <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </PremiumCard>
      </div>
    </motion.div>
  );
}
