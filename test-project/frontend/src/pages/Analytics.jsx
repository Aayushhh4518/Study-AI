import { motion } from "framer-motion";
import { useMemo } from "react";

import {
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Clock3,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";

import { FocusAreaChart, SubjectPieChart, TaskBarChart } from "../components/analytics/analytics-chart";
import PremiumCard from "../components/ui/premium-card";
import { useData } from "../store/DataContext";

/* ── Animation Variants ───────────────────────────────── */
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Analytics() {
  const { data, stats } = useData();

  /* ── Dynamic Chart Data Calculation ── */
  const focusData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

      const mins = (data?.focusSessions?.history || [])
        .filter((s) => s.date.startsWith(dateStr))
        .reduce((acc, s) => acc + s.durationMinutes, 0);

      days.push({ day: dayName, hours: Number((mins / 60).toFixed(1)) });
    }
    return days;
  }, [data?.focusSessions?.history]);

  const taskData = useMemo(() => {
    const tasks = data?.tasks || [];
    return [
      { name: "High Priority", count: tasks.filter(t => t.priority === "High").length, fill: "#f43f5e" },
      { name: "Medium Priority", count: tasks.filter(t => t.priority === "Medium").length, fill: "#f59e0b" },
      { name: "Low Priority", count: tasks.filter(t => t.priority === "Low").length, fill: "#10b981" },
    ].filter(d => d.count > 0);
  }, [data?.tasks]);

  const subjectData = useMemo(() => {
    const colors = ["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b"];
    return (data?.subjects || []).map((s, i) => ({
      name: s.title,
      value: s.progress > 0 ? s.progress : 1, // Fallback tiny slice if 0 progress
      fill: colors[i % colors.length]
    }));
  }, [data?.subjects]);

  /* ── Derived Top Stats ── */
  const topStats = useMemo(() => [
    {
      title: "Focus Score",
      value: `${stats.productivityScore}%`,
      icon: Target,
      subtitle: stats.productivityScore > 80 ? "Excellent consistency" : "Building momentum",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      glow: "from-emerald-500",
    },
    {
      title: "Focus Hours",
      value: `${stats.totalFocusHours}h`,
      icon: Clock3,
      subtitle: "Lifetime deep work",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      glow: "from-violet-500",
    },
    {
      title: "Task Completion",
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      icon: CheckCircle2,
      subtitle: "Tasks finalized",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      glow: "from-blue-500",
    },
    {
      title: "Active Streak",
      value: `${stats.streak} Days`,
      icon: TrendingUp,
      subtitle: "Current consistency",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      glow: "from-cyan-500",
    },
  ], [stats]);

  /* ── Map Context AI Insights ── */
  const aiInsights = useMemo(() => {
    const icons = [Zap, TrendingUp, Brain, Sparkles];
    const colors = [
      { text: "text-amber-400", bg: "bg-amber-500" },
      { text: "text-emerald-400", bg: "bg-emerald-500" },
      { text: "text-violet-400", bg: "bg-violet-500" },
    ];

    return (data?.aiRecommendations || []).slice(0, 3).map((rec, i) => ({
      text: rec.desc,
      highlight: rec.title,
      icon: icons[i % icons.length],
      color: colors[i % colors.length].text,
      bar: colors[i % colors.length].bg,
    }));
  }, [data?.aiRecommendations]);

  const peakFocusDay = useMemo(() => {
    if (!focusData.length) return "N/A";
    const max = [...focusData].sort((a, b) => b.hours - a.hours)[0];
    return max.hours > 0 ? max.day : "N/A";
  }, [focusData]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* HEADER */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1
            className="
              text-3xl font-bold tracking-tight leading-none
              bg-gradient-to-r from-white via-zinc-100 to-zinc-400
              bg-clip-text text-transparent
            "
          >
            Analytics
          </h1>
          <p className="text-zinc-500 mt-2 text-[13px] font-medium">
            AI-powered productivity insights and performance metrics
          </p>
        </div>

        {/* AI BADGE */}
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
          Live Tracking Active
        </div>
      </motion.div>

      {/* TOP STATS */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {topStats.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title} variants={fadeUp}>
              <PremiumCard className="group relative overflow-hidden p-5 hover:bg-white/[0.04] hover:border-white/[0.1] hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-300">
                {/* Subtle corner ambient glow */}
                <div
                  className={`absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${item.glow} to-transparent`}
                  style={{ opacity: 0.08 }}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 font-semibold">
                      {item.title}
                    </p>
                    <h2 className="text-3xl font-bold mt-2 text-zinc-100 tracking-tight">
                      {item.value}
                    </h2>
                    <p className="text-[11px] font-medium text-zinc-500 mt-1.5">
                      {item.subtitle}
                    </p>
                  </div>
                  <div
                    className={`
                      h-9 w-9 rounded-lg flex items-center justify-center
                      ${item.bg} ${item.border} border
                      transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6
                    `}
                  >
                    <Icon
                      size={16}
                      className={`${item.color} drop-shadow-md`}
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* MAIN GRID */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 xl:grid-cols-3 gap-5"
      >
        {/* CHART */}
        <motion.div variants={fadeUp} className="xl:col-span-2">
          <PremiumCard className="h-full relative overflow-hidden p-6 flex flex-col">
            <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-violet-500/[0.03] blur-[80px]" />

            <div className="flex items-start justify-between mb-5 relative z-10">
              <div>
                <h3 className="text-[16px] font-semibold text-zinc-100 tracking-wide">
                  Productivity Trends
                </h3>
                <p className="text-zinc-500 text-[12.5px] mt-1">
                  Weekly focus and study analytics
                </p>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] text-zinc-400 font-medium tracking-wide">
                Last 7 Days
              </div>
            </div>

            <div className="flex-1 min-h-[300px] rounded-xl border border-white/[0.04] bg-gradient-to-b from-[#0A0E1A] to-transparent p-4 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] z-10">
              <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-28 w-72 bg-violet-500/[0.05] blur-[80px]" />
              <FocusAreaChart data={focusData} />
            </div>
          </PremiumCard>
        </motion.div>

        {/* AI INSIGHTS */}
        <motion.div variants={fadeUp}>
          <PremiumCard className="h-full relative overflow-hidden p-6 flex flex-col">
            <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-cyan-500/[0.04] blur-[80px]" />

            <div className="flex items-center justify-between mb-5 relative z-10">
              <div>
                <h3 className="text-[16px] font-semibold text-zinc-100 tracking-wide">
                  AI Insights
                </h3>
                <p className="text-zinc-500 text-[12.5px] mt-1">
                  Personalized recommendations
                </p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
                <Sparkles size={14} className="text-white drop-shadow-md" />
              </div>
            </div>

            <div className="space-y-3 relative z-10 flex-1">
              {aiInsights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.highlight}
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
                      className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full opacity-60 shadow-[0_0_8px_currentColor] ${item.bar}`}
                    />
                    <div className="flex items-start gap-3 pl-2">
                      <div className={`mt-0.5 ${item.color}`}>
                        <Icon size={16} strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[12.5px] text-zinc-300 leading-relaxed font-medium">
                          <span className={`font-semibold mr-1 ${item.color}`}>{item.highlight}:</span> {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="
              mt-5 w-full rounded-xl relative z-10
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
        </motion.div>
      </motion.div>

      {/* SECONDARY CHARTS */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <motion.div variants={fadeUp}>
          <PremiumCard className="relative overflow-hidden p-6 flex flex-col h-[320px]">
            <div className="pointer-events-none absolute top-0 left-0 h-48 w-48 rounded-full bg-rose-500/[0.03] blur-[80px]" />
            <div className="relative z-10 mb-4">
              <h3 className="text-[16px] font-semibold text-zinc-100 tracking-wide">
                Task Priority Distribution
              </h3>
              <p className="text-zinc-500 text-[12.5px] mt-1">
                Active tasks sorted by urgency
              </p>
            </div>
            <div className="flex-1 relative z-10">
              {taskData.length > 0 ? (
                <TaskBarChart data={taskData} />
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-zinc-500">No active tasks</div>
              )}
            </div>
          </PremiumCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <PremiumCard className="relative overflow-hidden p-6 flex flex-col h-[320px]">
            <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-blue-500/[0.03] blur-[80px]" />
            <div className="relative z-10 mb-4">
              <h3 className="text-[16px] font-semibold text-zinc-100 tracking-wide">
                Subject Progress
              </h3>
              <p className="text-zinc-500 text-[12.5px] mt-1">
                Completion distribution across courses
              </p>
            </div>
            <div className="flex-1 relative z-10">
               {subjectData.length > 0 ? (
                <SubjectPieChart data={subjectData} />
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-zinc-500">No active subjects</div>
              )}
            </div>
          </PremiumCard>
        </motion.div>
      </motion.div>

      {/* BOTTOM ANALYTICS */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Peak Focus Day",
            value: peakFocusDay,
            sub: "Most productive 7d window",
          },
          {
            label: "Completed Sessions",
            value: data.focusSessions.totalCompleted,
            sub: "Lifetime Pomodoros",
          },
          {
            label: "Pending Tasks",
            value: stats.pendingTasks,
            sub: "Action items waiting",
          },
          {
            label: "Active Subjects",
            value: data.subjects.length,
            sub: "In current curriculum",
          },
        ].map((item) => (
          <motion.div key={item.label} variants={fadeUp}>
            <PremiumCard
              className="
                p-4 flex items-center justify-between
                hover:bg-white/[0.04] hover:border-white/[0.1]
                transition-all duration-300 group cursor-default
              "
            >
              <div>
                <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-[0.15em]">
                  {item.label}
                </p>
                <h3 className="text-[18px] font-bold mt-1 text-zinc-100 tracking-tight">
                  {item.value}
                </h3>
                <p className="text-zinc-500 text-[11px] mt-1 font-medium">
                  {item.sub}
                </p>
              </div>
              <ArrowUpRight
                size={16}
                className="text-zinc-700 group-hover:text-violet-400 transition-colors duration-200"
              />
            </PremiumCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
