import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import {
  AlertTriangle,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Clock3,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

import {
  FocusAreaChart,
  SubjectPieChart,
  TaskBarChart,
} from "../components/analytics/analytics-chart";
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
  const [isReportOpen, setIsReportOpen] = useState(false);

  const {
    data,
    stats,
    aiInsights: contextAiInsights,
    weeklyChartData,
    weeklyTrend,
    subjectAnalytics,
  } = useData();

  /* ── Dynamic Chart Data Calculation ── */
  const focusData = useMemo(() => {
    return (weeklyChartData || []).map((d) => ({
      day: d.day,
      hours: d.focus,
    }));
  }, [weeklyChartData]);

  const taskData = useMemo(() => {
    const tasks = data?.tasks || [];
    return [
      {
        name: "High Priority",
        count: tasks.filter((t) => t.priority === "High" && !t.completed)
          .length,
        fill: "#f43f5e",
      },
      {
        name: "Medium Priority",
        count: tasks.filter((t) => t.priority === "Medium" && !t.completed)
          .length,
        fill: "#f59e0b",
      },
      {
        name: "Low Priority",
        count: tasks.filter((t) => t.priority === "Low" && !t.completed).length,
        fill: "#10b981",
      },
    ].filter((d) => d.count > 0);
  }, [data?.tasks]);

  const subjectData = useMemo(() => {
    const colors = [
      "#8b5cf6",
      "#06b6d4",
      "#ec4899",
      "#10b981",
      "#f59e0b",
      "#3b82f6",
      "#f43f5e",
    ];
    return (subjectAnalytics || []).map((s, i) => ({
      name: s.title,
      value: s.completionRate > 0 ? s.completionRate : 1, // Fallback tiny slice if 0 progress
      fill: colors[i % colors.length],
    }));
  }, [subjectAnalytics]);

  /* ── Weekly Growth ── */
  const weeklyGrowth = useMemo(() => {
    if (!weeklyTrend || weeklyTrend.length < 2) return "+0%";
    const last = weeklyTrend[weeklyTrend.length - 1]?.score || 0;
    const secondLast = weeklyTrend[weeklyTrend.length - 2]?.score || 0;
    if (secondLast === 0) return last > 0 ? "+100%" : "+0%";
    const diff = ((last - secondLast) / secondLast) * 100;
    return `${diff >= 0 ? "+" : ""}${Math.round(diff)}%`;
  }, [weeklyTrend]);

  /* ── Derived Top Stats ── */
  const topStats = useMemo(
    () => [
      {
        title: "Focus Score",
        value: `${stats.productivityScore}%`,
        icon: Target,
        subtitle:
          stats.productivityScore > 80
            ? "Excellent consistency"
            : "Building momentum",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        glow: "from-emerald-500",
      },
      {
        title: "Weekly Growth",
        value: weeklyGrowth,
        icon: TrendingUp,
        subtitle: "Compared to last week",
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        glow: "from-cyan-500",
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
        title: "Active Streak",
        value: `${stats.streak} Days`,
        icon: Zap,
        subtitle: "Current consistency",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        glow: "from-amber-500",
      },
    ],
    [stats, weeklyGrowth],
  );

  /* ── Map Context AI Insights ── */
  const aiInsights = useMemo(() => {
    const iconMap = {
      motivational: TrendingUp,
      warning: Zap,
      recommendation: Sparkles,
      insight: Brain,
      info: Brain,
    };
    const colorMap = {
      amber: { text: "text-amber-400", bg: "bg-amber-500" },
      emerald: { text: "text-emerald-400", bg: "bg-emerald-500" },
      violet: { text: "text-violet-400", bg: "bg-violet-500" },
      cyan: { text: "text-cyan-400", bg: "bg-cyan-500" },
      rose: { text: "text-rose-400", bg: "bg-rose-500" },
      indigo: { text: "text-indigo-400", bg: "bg-indigo-500" },
    };

    return (contextAiInsights || []).slice(0, 3).map((rec) => {
      const accent = colorMap[rec.accent] || colorMap.violet;
      return {
        text: rec.desc,
        highlight: rec.title,
        icon: iconMap[rec.type] || Sparkles,
        color: accent.text,
        bar: accent.bg,
      };
    });
  }, [contextAiInsights]);

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
              text-3xl sm:text-4xl font-bold tracking-tight leading-none
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {topStats.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title} variants={fadeUp}>
              <PremiumCard className="group relative overflow-hidden p-4 sm:p-5 hover:bg-white/[0.04] hover:border-white/[0.1] hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-300">
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
                    <h2 className="text-2xl sm:text-3xl font-bold mt-1.5 sm:mt-2 text-zinc-100 tracking-tight">
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
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
      >
        {/* CHART */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <PremiumCard className="h-full relative overflow-hidden p-4 sm:p-6 flex flex-col">
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

            <div className="flex-1 min-h-[250px] sm:min-h-[300px] rounded-xl border border-white/[0.04] bg-gradient-to-b from-[#0A0E1A] to-transparent p-4 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] z-10">
              <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-28 w-72 bg-violet-500/[0.05] blur-[80px]" />
              <FocusAreaChart data={focusData} />
            </div>
          </PremiumCard>
        </motion.div>

        {/* AI INSIGHTS */}
        <motion.div variants={fadeUp}>
          <PremiumCard className="h-full relative overflow-hidden p-4 sm:p-6 flex flex-col mt-5 lg:mt-0">
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
                          <span className={`font-semibold mr-1 ${item.color}`}>
                            {item.highlight}:
                          </span>{" "}
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsReportOpen(true)}
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
          <PremiumCard className="relative overflow-hidden p-4 sm:p-6 flex flex-col h-[280px] sm:h-[320px]">
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
                <div className="h-full flex items-center justify-center text-sm text-zinc-500">
                  No active tasks
                </div>
              )}
            </div>
          </PremiumCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <PremiumCard className="relative overflow-hidden p-4 sm:p-6 flex flex-col h-[280px] sm:h-[320px]">
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
                <div className="h-full flex items-center justify-center text-sm text-zinc-500">
                  No active subjects
                </div>
              )}
            </div>
          </PremiumCard>
        </motion.div>
      </motion.div>

      {/* BOTTOM ANALYTICS */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Peak Focus Day",
            value: peakFocusDay,
            sub: "Most productive 7d window",
          },
          {
            label: "Completed Tasks",
            value: stats.completedTasks,
            sub: "Lifetime tasks finalized",
          },
          {
            label: "Pending Tasks",
            value: stats.pendingTasks,
            sub: "Action items waiting",
          },
          {
            label: "Completed Sessions",
            value: stats.focusSessions,
            sub: "Lifetime Pomodoros",
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

      {/* DETAILED REPORT MODAL */}
      <AnimatePresence>
        {isReportOpen && (
          <DetailedReportModal
            onClose={() => setIsReportOpen(false)}
            stats={stats}
            subjectAnalytics={subjectAnalytics}
            peakFocusDay={peakFocusDay}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── DETAILED REPORT MODAL ────────────────────────────── */
function DetailedReportModal({
  onClose,
  stats,
  subjectAnalytics,
  peakFocusDay,
}) {
  const completedRatio =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  const sortedSubjects = [...(subjectAnalytics || [])].sort(
    (a, b) => b.completionRate - a.completionRate,
  );
  const strongestSubject = sortedSubjects.length > 0 ? sortedSubjects[0] : null;
  const weakestSubject =
    sortedSubjects.length > 0
      ? sortedSubjects[sortedSubjects.length - 1]
      : null;

  const burnoutRisk =
    stats.totalFocusHours > 40
      ? "High"
      : stats.totalFocusHours > 20
        ? "Medium"
        : "Low";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-[#0A0E1A] border border-white/10 rounded-3xl sm:rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] z-10 overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 bg-violet-500/20 blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01] shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-white/10">
              <Sparkles size={22} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                AI Productivity Report
              </h2>
              <p className="text-sm text-zinc-400 font-medium mt-0.5">
                Comprehensive analysis of your learning habits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 sm:space-y-10 relative z-10">
          {/* Executive Summary */}
          <section>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 pl-1">
              Executive Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Overall Efficiency
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stats.productivityScore}%
                </div>
                <div className="text-sm font-medium text-emerald-400">
                  {stats.productivityScore > 80
                    ? "Excellent standing"
                    : "Room for improvement"}
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Task Completion
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {completedRatio}%
                </div>
                <div className="text-sm font-medium text-blue-400">
                  {stats.completedTasks} of {stats.totalTasks} tasks done
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Burnout Risk
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {burnoutRisk}
                </div>
                <div
                  className={`text-sm font-medium ${burnoutRisk === "High" ? "text-rose-400" : burnoutRisk === "Medium" ? "text-amber-400" : "text-emerald-400"}`}
                >
                  {burnoutRisk === "High"
                    ? "Consider taking a break"
                    : "Sustainable pace"}
                </div>
              </div>
            </div>
          </section>

          {/* Visual Breakdown */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-5">
                Task Breakdown
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-zinc-300">Completed</span>
                    <span className="text-emerald-400">
                      {stats.completedTasks}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completedRatio}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-zinc-300">Pending</span>
                    <span className="text-amber-400">{stats.pendingTasks}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - completedRatio}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-amber-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-5">
                Session Efficiency
              </div>
              <div className="flex items-end gap-3 h-[72px]">
                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-violet-500/10 rounded-t-md relative group h-full"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="absolute bottom-0 left-0 right-0 bg-violet-500 rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-zinc-500 font-semibold uppercase mt-3">
                <span>Mon</span>
                <span>Sun</span>
              </div>
            </div>
          </section>

          {/* Subject Analysis */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] pointer-events-none" />
              <div className="flex items-center gap-2.5 mb-4 text-emerald-400 relative z-10">
                <TrendingUp size={18} strokeWidth={2.5} />
                <h4 className="text-xs font-bold uppercase tracking-[0.15em]">
                  Strongest Subject
                </h4>
              </div>
              <div className="relative z-10">
                {strongestSubject ? (
                  <>
                    <div className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {strongestSubject.title}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      You've completed {strongestSubject.completionRate}% of the
                      target with {strongestSubject.totalFocusHours} focus hours
                      logged. Excellent retention expected.
                    </p>
                  </>
                ) : (
                  <div className="text-sm text-zinc-500">
                    Not enough data available.
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-rose-500/[0.03] border border-rose-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[50px] pointer-events-none" />
              <div className="flex items-center gap-2.5 mb-4 text-rose-400 relative z-10">
                <AlertTriangle size={18} strokeWidth={2.5} />
                <h4 className="text-xs font-bold uppercase tracking-[0.15em]">
                  Attention Needed
                </h4>
              </div>
              <div className="relative z-10">
                {weakestSubject ? (
                  <>
                    <div className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {weakestSubject.title}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Progress is lagging at {weakestSubject.completionRate}%.
                      Allocate{" "}
                      {weakestSubject.targetHours > 0
                        ? Math.max(
                            1,
                            Math.round(
                              weakestSubject.targetHours -
                                weakestSubject.hoursStudied,
                            ),
                          )
                        : 2}{" "}
                      more hours this week to stay on track.
                    </p>
                  </>
                ) : (
                  <div className="text-sm text-zinc-500">
                    Not enough data available.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* AI Action Plan */}
          <section>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 pl-1">
              AI Action Plan
            </h4>
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex gap-4 hover:bg-white/[0.03] transition-colors">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Lightbulb className="text-amber-400" size={20} />
                </div>
                <div>
                  <div className="text-base font-bold text-white mb-1.5 tracking-wide">
                    Schedule Optimization
                  </div>
                  <div className="text-sm text-zinc-400 leading-relaxed">
                    Your peak focus day is{" "}
                    <span className="text-white font-medium">
                      {peakFocusDay}
                    </span>
                    . Move your hardest tasks to this day to maximize
                    efficiency.
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex gap-4 hover:bg-white/[0.03] transition-colors">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <CheckCircle2 className="text-blue-400" size={20} />
                </div>
                <div>
                  <div className="text-base font-bold text-white mb-1.5 tracking-wide">
                    Consistency Coaching
                  </div>
                  <div className="text-sm text-zinc-400 leading-relaxed">
                    You are on a{" "}
                    <span className="text-white font-medium">
                      {stats.streak} day streak
                    </span>
                    . To maintain it, consider setting a minimum 25-minute
                    Pomodoro daily goal even on rest days.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
