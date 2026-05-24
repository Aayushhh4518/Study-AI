import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BrainCircuit,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useData } from "../../store/DataContext";
import PremiumCard from "../ui/premium-card";

const iconMap = {
  insight: Zap,
  warning: AlertTriangle,
  motivational: TrendingUp,
  recommendation: Sparkles,
};

const colorMap = {
  insight: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    bar: "bg-cyan-500",
  },
  warning: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    bar: "bg-amber-500",
  },
  motivational: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    bar: "bg-emerald-500",
  },
  recommendation: {
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    bar: "bg-violet-500",
  },
};

export default function AIInsightsWidget() {
  const { data } = useData();
  const insights = data.aiRecommendations || [];

  return (
    <PremiumCard className="relative overflow-hidden p-6 flex flex-col h-full border-indigo-500/20">
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex-shrink-0 bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-white tracking-wide flex items-center gap-2">
              Study.AI Coach <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-zinc-400 text-[12px] mt-0.5 font-medium">
              Live productivity analysis
            </p>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col gap-3 flex-1 relative z-10 overflow-y-auto pr-1"
        style={{ scrollbarWidth: "none" }}
      >
        <AnimatePresence mode="popLayout">
          {insights.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-zinc-500 text-center py-6 bg-white/[0.02] rounded-xl border border-white/[0.05]"
            >
              Generating insights... Keep working!
            </motion.div>
          ) : (
            insights.map((item, i) => {
              const Icon = iconMap[item.type] || Zap;
              const colors = colorMap[item.type] || colorMap.insight;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
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
                    className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full opacity-60 shadow-[0_0_8px_currentColor] ${colors.bar}`}
                  />

                  <div className="flex items-start gap-3 pl-2">
                    <div
                      className={`h-8 w-8 flex-shrink-0 rounded-lg flex items-center justify-center border transition-colors duration-200 ${colors.bg} ${colors.text} ${colors.border}`}
                    >
                      <Icon size={14} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h4 className="text-[13.5px] font-semibold text-zinc-100 leading-none">
                        {item.title}
                      </h4>
                      <p className="text-[12px] text-zinc-400 mt-1.5 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </PremiumCard>
  );
}
