import { animate, motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";
import ProductivityChart from "../components/dashboard/productivity-chart";
import PremiumCard from "../components/ui/premium-card";

/* ── Animated Counter Helper ──────────────────────────── */

function AnimatedCounter({ value }) {
  const nodeRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.2, 0.8, 0.2, 1], // Premium spring-like ease
      onUpdate(v) {
        node.textContent = Math.round(v);
      },
    });
    return () => controls.stop();
  }, [value]);

  return <span ref={nodeRef} />;
}

/* ── Data ─────────────────────────────────────────────── */

const stats = [
  {
    title: "Study Hours",
    value: 128,
    suffix: "h",
    delta: "+12%",
    deltaLabel: "vs last week",
    icon: Clock3,
    from: "from-violet-500",
    to: "to-indigo-500",
    glowColor: "rgba(139,92,246,0.18)",
  },
  {
    title: "Tasks Done",
    value: 42,
    suffix: "",
    delta: "8 left",
    deltaLabel: "remaining",
    icon: CheckCircle2,
    from: "from-cyan-500",
    to: "to-blue-500",
    glowColor: "rgba(6,182,212,0.18)",
  },
  {
    title: "Subjects",
    value: 8,
    suffix: "",
    delta: "2 active",
    deltaLabel: "today",
    icon: BookOpen,
    from: "from-pink-500",
    to: "to-rose-500",
    glowColor: "rgba(236,72,153,0.18)",
  },
  {
    title: "AI Sessions",
    value: 19,
    suffix: "",
    delta: "+4",
    deltaLabel: "this week",
    icon: BrainCircuit,
    from: "from-emerald-500",
    to: "to-teal-500",
    glowColor: "rgba(16,185,129,0.18)",
  },
];

const miniStats = [
  { label: "Focus Score", value: "92%", sub: "Excellent" },
  { label: "Weekly Growth", value: "+18%", sub: "Trending up" },
  { label: "Streak", value: "7 days", sub: "Keep going" },
];

const aiInsights = [
  {
    title: "Focus Increased",
    desc: "Productivity improved 18% vs last week.",
    icon: TrendingUp,
    accent: "violet",
    tag: "+18%",
  },
  {
    title: "Best Study Time",
    desc: "Peak performance: 7 PM – 9 PM nightly.",
    icon: Zap,
    accent: "cyan",
    tag: "7–9 PM",
  },
  {
    title: "AI Recommendation",
    desc: "Revise Data Structures tomorrow for retention.",
    icon: Sparkles,
    accent: "indigo",
    tag: "Due soon",
  },
];

const accentMap = {
  violet: {
    icon: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    tag: "bg-violet-500/[0.08] text-violet-300 border-violet-500/15",
    bar: "bg-violet-500",
  },
  cyan: {
    icon: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    tag: "bg-cyan-500/[0.08] text-cyan-300 border-cyan-500/15",
    bar: "bg-cyan-500",
  },
  indigo: {
    icon: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    tag: "bg-indigo-500/[0.08] text-indigo-300 border-indigo-500/15",
    bar: "bg-indigo-400",
  },
};

/* ── Animation variants — defined once outside component ── */
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

const staggerGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

/* ── Component ─────────────────────────────────────────── */

export default function Dashboard() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6 pb-4"
    >
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="
            text-3xl font-bold tracking-tight leading-none
            bg-gradient-to-r from-white via-zinc-100 to-zinc-400
            bg-clip-text text-transparent
          "
          >
            Overview
          </h1>
          <p className="text-zinc-500 mt-2 text-[13px] font-medium">
            Performance metrics and insights for today
          </p>
        </div>

        {/* AI status badge */}
        <div
          className="
          flex items-center gap-2
          px-3 py-1.5 rounded-full
          border border-violet-500/20
          bg-violet-500/[0.08] text-violet-300 text-[12px] font-semibold tracking-wide
          shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] self-start sm:self-auto
        "
        >
          <div className="relative flex h-1.5 w-1.5 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500"></span>
          </div>
          System Active
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <motion.div
        variants={staggerGrid}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              variants={fadeUp}
              transition={{ duration: 0.32 }}
            >
              <PremiumCard className="group relative overflow-hidden p-5 cursor-default hover:bg-white/[0.04] hover:border-white/[0.1] hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-300">
                {/* Subtle corner ambient glow */}
                <div
                  className={`absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${stat.from} ${stat.to}`}
                  style={{ opacity: 0.08 }}
                />

                <div className="relative z-10">
                  {/* top row */}
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 font-semibold">
                      {stat.title}
                    </p>
                    <div
                      className={`
                      h-8 w-8 rounded-lg flex items-center justify-center
                      bg-gradient-to-br ${stat.from} ${stat.to}
                      opacity-90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]
                      transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6
                    `}
                    >
                      <Icon
                        size={14}
                        className="text-white drop-shadow-md"
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* value */}
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-100 leading-none">
                    <AnimatedCounter value={stat.value} />
                    {stat.suffix}
                  </h2>

                  {/* delta */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <span className="text-[11px] font-semibold text-emerald-400">
                      {stat.delta}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {stat.deltaLabel}
                    </span>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* ── ANALYTICS PANEL ── */}
        <PremiumCard className="xl:col-span-2 relative overflow-hidden p-6">
          {/* ambient glow */}
          <div className="pointer-events-none absolute top-0 right-0 h-56 w-56 rounded-full bg-violet-500/[0.04] blur-[80px]" />

          <div className="relative z-10 flex flex-col h-full">
            {/* panel header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-[16px] font-semibold text-zinc-100 tracking-wide">
                  Activity & Focus Trends
                </h3>
                <p className="text-zinc-500 text-[12.5px] mt-1">
                  Weekly focus &amp; task analytics
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* legend */}
                <div className="hidden sm:flex items-center gap-4 mr-4">
                  {[
                    { color: "bg-violet-500", label: "Focus" },
                    { color: "bg-cyan-500", label: "Tasks" },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div
                        className={`h-[6px] w-[6px] rounded-full ${l.color} shadow-[0_0_8px_currentColor]`}
                      />
                      <span className="text-[12px] font-medium text-zinc-400">
                        {l.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="
                  px-2.5 py-1 rounded-md
                  bg-white/[0.03] border border-white/[0.08]
                  text-[11px] text-zinc-400 font-medium tracking-wide
                "
                >
                  This Week
                </div>
              </div>
            </div>

            {/* mini stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {miniStats.map((m) => (
                <div
                  key={m.label}
                  className="
                  rounded-xl border border-white/[0.04]
                  bg-[#0A0E1A] px-4 py-3 shadow-sm
                "
                >
                  <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-zinc-500">
                    {m.label}
                  </p>
                  <h4 className="text-xl font-bold text-zinc-100 mt-1 tracking-tight">
                    {m.value}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-1 font-medium">
                    {m.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* chart */}
            <div
              className="
              flex-1 min-h-[240px]
              rounded-xl border border-white/[0.04]
              bg-gradient-to-b from-[#0A0E1A] to-transparent
              p-4 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]
            "
            >
              <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-28 w-72 bg-violet-500/[0.05] blur-[80px]" />
              <ProductivityChart />
            </div>

            {/* bottom insight row */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { label: "Peak Productivity", value: "Thursday Evening" },
                { label: "AI Suggestion", value: "Add 2 more focus sessions" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="
                  flex items-center justify-between
                  rounded-xl border border-white/[0.04]
                  bg-[#0A0E1A] px-4 py-3
                  group cursor-default
                  hover:border-white/[0.1] hover:bg-white/[0.04]
                  transition-all duration-200
                "
                >
                  <div>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-[0.1em]">
                      {item.label}
                    </p>
                    <p className="text-[13px] font-medium text-zinc-200 mt-1">
                      {item.value}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-zinc-700 group-hover:text-violet-400 transition-colors duration-150 flex-shrink-0 ml-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </PremiumCard>

        {/* ── AI ASSISTANT PANEL ── */}
        <PremiumCard className="relative overflow-hidden p-6 flex flex-col">
          <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-cyan-500/[0.04] blur-[80px]" />

          {/* panel header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[16px] font-semibold text-zinc-100 tracking-wide">
                AI Assistant
              </h3>
              <p className="text-zinc-500 text-[12.5px] mt-1">
                Personalized recommendations
              </p>
            </div>
            <div
              className="
              h-8 w-8 rounded-lg
              bg-gradient-to-br from-cyan-500 to-blue-500
              flex items-center justify-center
              shadow-[0_0_15px_rgba(6,182,212,0.4)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]
            "
            >
              <Sparkles size={14} className="text-white drop-shadow-md" />
            </div>
          </div>

          {/* insight cards */}
          <div className="flex flex-col gap-3 flex-1">
            {aiInsights.map((item, i) => {
              const Icon = item.icon;
              const colors = accentMap[item.accent];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.28 }}
                  className="
                    group relative
                    rounded-xl border border-white/[0.04]
                    bg-[#0A0E1A] p-4
                    hover:bg-white/[0.04] hover:border-white/[0.1]
                    transition-all duration-200 cursor-default
                    overflow-hidden shadow-sm hover:shadow-md
                  "
                >
                  <div
                    className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full opacity-60 shadow-[0_0_8px_currentColor] ${colors.bar}`}
                  />

                  <div className="flex items-start gap-3 pl-2">
                    <div
                      className={`
                      h-8 w-8 flex-shrink-0 rounded-lg
                      flex items-center justify-center
                      border transition-colors duration-200
                      ${colors.icon}
                    `}
                    >
                      <Icon size={14} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-[13px] font-semibold text-zinc-100 leading-none">
                          {item.title}
                        </h4>
                        <span
                          className={`
                          px-1.5 py-0.5 rounded-[6px] text-[10px] font-medium border tracking-wide
                          ${colors.tag}
                        `}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-[12px] text-zinc-500 mt-2 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <button
            className="
            mt-5 w-full rounded-xl
            bg-white/[0.03] border border-white/[0.08]
            py-3 text-[12.5px] font-semibold text-zinc-200
            hover:bg-white/[0.06] hover:border-violet-500/30
            hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]
            transition-all duration-200
          "
          >
            View Detailed Report
          </button>
        </PremiumCard>
      </div>
    </motion.div>
  );
}
