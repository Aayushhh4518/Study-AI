import { motion } from "framer-motion";

import {
  Brain,
  Clock3,
  Target,
  TrendingUp,
} from "lucide-react";

import PremiumCard from "../components/ui/premium-card";

export default function Analytics() {
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
          <h1 className="text-5xl font-bold tracking-tight">
            Analytics
          </h1>

          <p className="text-zinc-400 mt-3 text-lg">
            AI-powered productivity insights and performance tracking.
          </p>
        </div>

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
            "
          >
            <Brain size={18} />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              AI Analytics
            </p>

            <p className="text-xs text-zinc-400">
              Live performance tracking
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          {
            title: "Focus Score",
            value: "92%",
            icon: Target,
            subtitle: "Excellent consistency",
          },
          {
            title: "Study Hours",
            value: "128h",
            icon: Clock3,
            subtitle: "+18% this month",
          },
          {
            title: "Productivity",
            value: "+24%",
            icon: TrendingUp,
            subtitle: "Compared to last week",
          },
          {
            title: "AI Efficiency",
            value: "89%",
            icon: Brain,
            subtitle: "Smart learning score",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <PremiumCard
              key={item.title}
              className="p-6 relative overflow-hidden"
            >
              <div
                className="
                  absolute
                  top-0
                  right-0
                  h-24
                  w-24
                  rounded-full
                  bg-violet-500/10
                  blur-3xl
                "
              />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500 uppercase tracking-[0.2em]">
                    {item.title}
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    {item.value}
                  </h2>

                  <p className="text-zinc-400 text-sm mt-2">
                    {item.subtitle}
                  </p>
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
                  <Icon
                    size={28}
                    className="text-violet-300"
                  />
                </div>
              </div>
            </PremiumCard>
          );
        })}
      </div>

      {/* MAIN ANALYTICS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LARGE CHART CARD */}
        <PremiumCard
          className="
            xl:col-span-2
            p-6
            min-h-[420px]
          "
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold">
                Productivity Trends
              </h3>

              <p className="text-zinc-400 mt-1">
                Weekly focus and study analytics
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
              Live Data
            </div>
          </div>

          <div
            className="
              h-[300px]
              rounded-3xl
              border border-white/10
              bg-white/[0.03]
            "
          />
        </PremiumCard>

        {/* AI INSIGHTS */}
        <PremiumCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold">
                AI Insights
              </h3>

              <p className="text-zinc-400 mt-1">
                Personalized recommendations
              </p>
            </div>

            <div
              className="
                h-12 w-12
                rounded-2xl
                bg-gradient-to-br
                from-cyan-500
                to-blue-500
              "
            />
          </div>

          <div className="space-y-4">
            {[
              "Peak productivity detected on Thursday.",
              "Focus consistency improved by 18%.",
              "AI recommends longer deep work sessions.",
            ].map((item) => (
              <div
                key={item}
                className="
                  rounded-2xl
                  bg-white/[0.04]
                  border border-white/10
                  p-4
                "
              >
                <p className="text-zinc-300 text-sm">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>
    </motion.div>
  );
}
