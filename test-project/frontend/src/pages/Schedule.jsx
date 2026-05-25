import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  Clock3,
  Edit,
  Lightbulb,
  Plus,
  Trash2,
  Wand2,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import PremiumCard from "../components/ui/premium-card";
import { useData } from "../store/DataContext";

function formatTime(timeStr, to24Hour = false) {
  if (!timeStr) return "";
  if (to24Hour) {
    // Basic conversion from "1:00 PM" to "13:00"
    const d = new Date(`1/1/2000 ${timeStr}`);
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const [h, m] = timeStr.split(":");
  const d = new Date();
  d.setHours(parseInt(h, 10), parseInt(m, 10));
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function parseTimeToMins(timeStr) {
  if (!timeStr) return 0;
  const start = timeStr.split("-")[0].trim();
  const match = start.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const isPM = match[3].toUpperCase() === "PM";
  if (isPM && h !== 12) h += 12;
  if (!isPM && h === 12) h = 0;
  return h * 60 + m;
}

const typeColors = {
  "Deep Focus": "from-violet-500 to-indigo-500",
  Revision: "from-pink-500 to-rose-500",
  Research: "from-cyan-500 to-blue-500",
  Break: "from-emerald-500 to-teal-500",
};

export default function Schedule() {
  const {
    data,
    stats,
    addScheduleSession,
    deleteScheduleSession,
    updateScheduleSession,
  } = useData();

  /* ── STATE ── */
  const plannedSessions = data?.schedule || [];

  const sortedSessions = useMemo(() => {
    return [...plannedSessions].sort(
      (a, b) => parseTimeToMins(a.time) - parseTimeToMins(b.time),
    );
  }, [plannedSessions]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sessionInput, setSessionInput] = useState({
    subject: "",
    startTime: "19:00",
    endTime: "20:00",
    type: "Deep Focus",
  });

  /* ── HANDLERS ── */
  const handleOpenAdd = () => {
    setEditingId(null);
    setSessionInput({
      subject: "",
      startTime: "19:00",
      endTime: "20:00",
      type: "Deep Focus",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (session) => {
    setEditingId(session.id);
    const [startStr, endStr] = (session.time || "7:00 PM - 8:00 PM").split(
      " - ",
    );
    setSessionInput({
      subject: session.subject,
      startTime: formatTime(startStr, true),
      endTime: formatTime(endStr, true),
      type: session.type,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteScheduleSession(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sessionInput.subject.trim()) return;

    const sessionData = {
      subject: sessionInput.subject.trim(),
      time: `${formatTime(sessionInput.startTime)} - ${formatTime(
        sessionInput.endTime,
      )}`,
      type: sessionInput.type,
      color: typeColors[sessionInput.type] || typeColors["Deep Focus"],
    };

    if (editingId) {
      updateScheduleSession(editingId, sessionData);
    } else {
      addScheduleSession({ ...sessionData, date: new Date().toISOString() });
    }
    setIsModalOpen(false);
  };

  /* ── AI PLANNER LOGIC ── */
  const aiTips = useMemo(() => {
    const tips = [];
    const score = stats?.productivityScore || 0;
    const strictness = data?.settings?.aiStrictness || "balanced";
    const deepFocusCount = plannedSessions.filter(
      (s) => s.type === "Deep Focus",
    ).length;
    const weakSubject = [...(data?.subjects || [])].sort(
      (a, b) => (a.progress || 0) - (b.progress || 0),
    )[0];

    if (plannedSessions.length === 0) {
      tips.push("Your schedule is empty. Add sessions to build a routine.");
      return tips;
    }

    if (score < 60) {
      tips.push(
        strictness === "strict"
          ? "Low productivity detected. Eliminate non-essential tasks and strictly focus on high-priority subjects today."
          : "Take it easy today. Break your sessions into smaller chunks to rebuild momentum.",
      );
    } else if (score > 85) {
      tips.push(
        "Peak productivity detected. You're primed for extended Deep Focus blocks today.",
      );
    }

    if (deepFocusCount === 0) {
      tips.push(
        "No Deep Focus sessions planned. AI recommends at least one uninterrupted 90-minute block.",
      );
    } else if (deepFocusCount > 3) {
      tips.push("Dense schedule detected. Ensure you take adequate breaks.");
    }

    if (
      weakSubject &&
      !plannedSessions.some((s) => s.subject === weakSubject.title)
    ) {
      tips.push(
        `AI noticed you haven't scheduled time for ${weakSubject.title}, your weakest subject.`,
      );
    } else if (weakSubject) {
      tips.push(
        `Great job prioritizing ${weakSubject.title} today to boost your overall progress.`,
      );
    }

    if (tips.length < 3)
      tips.push("Your session distribution looks well-balanced today.");
    return tips.slice(0, 3);
  }, [
    plannedSessions,
    stats?.productivityScore,
    data?.settings?.aiStrictness,
    data?.subjects,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="
              text-4xl md:text-5xl
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

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(99,102,241,0.35)] shadow-lg"
        >
          <Plus size={18} />
          New Session
        </button>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Today's Sessions</p>

              <h2 className="text-4xl font-bold mt-2">
                {plannedSessions.length}
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
              <p className="text-zinc-400 text-sm">Focus Hours</p>

              <h2 className="text-4xl font-bold mt-2">
                {stats?.totalFocusHours || 0}h
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
              <p className="text-zinc-400 text-sm">Productivity Score</p>

              <h2 className="text-4xl font-bold mt-2">
                {stats?.productivityScore || 0}%
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
              <h3 className="text-2xl font-semibold">Today's Timeline</h3>

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
            <AnimatePresence mode="popLayout">
              {sortedSessions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center text-zinc-500 bg-white/[0.02] border border-white/[0.05] rounded-3xl"
                >
                  No sessions planned. Add one to get started!
                </motion.div>
              ) : (
                sortedSessions.map((session) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={session.id}
                    className="
                      group
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
                    {/* TIME ICON */}
                    <div
                      className={`
                        h-16
                        w-16
                        shrink-0
                        rounded-2xl
                        bg-gradient-to-br
                        ${session.color}
                        flex items-center justify-center
                        shadow-[0_0_30px_rgba(99,102,241,0.25)]
                      `}
                    >
                      <Clock3 size={24} className="text-white" />
                    </div>

                    {/* INFO */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl font-semibold text-white truncate">
                        {session.subject}
                      </h4>
                      <p className="text-zinc-400 mt-1">{session.time}</p>
                    </div>

                    {/* TYPE */}
                    <div
                      className={`
                        hidden sm:block
                        px-4 py-2
                        rounded-xl
                        bg-gradient-to-r
                        ${session.color}
                        text-sm
                        font-medium
                        text-white
                      `}
                    >
                      {session.type}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleOpenEdit(session)}
                        className="h-9 w-9 rounded-lg flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="h-9 w-9 rounded-lg flex items-center justify-center bg-red-500/[0.08] hover:bg-red-500/20 text-red-400 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </PremiumCard>

        {/* AI PLANNER */}
        <PremiumCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold">AI Planner</h3>

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
            {aiTips.map((tip, idx) => (
              <div
                key={idx}
                className="
                  rounded-2xl
                  bg-white/[0.04]
                  border border-white/10
                  p-4
                "
              >
                <p className="text-sm text-zinc-300">{tip}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsOptimizing(true)}
            disabled={plannedSessions.length === 0}
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
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:hover:scale-100
            "
          >
            <span className="flex items-center justify-center gap-2">
              <Wand2 size={18} /> Optimize Schedule
            </span>
          </button>
        </PremiumCard>
      </div>

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0A0E1A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {editingId ? "Edit Session" : "Schedule Session"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    Subject / Topic
                  </label>
                  <input
                    autoFocus
                    value={sessionInput.subject}
                    onChange={(e) =>
                      setSessionInput({
                        ...sessionInput,
                        subject: e.target.value,
                      })
                    }
                    placeholder="e.g. Data Structures"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={sessionInput.startTime}
                      onChange={(e) =>
                        setSessionInput({
                          ...sessionInput,
                          startTime: e.target.value,
                        })
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={sessionInput.endTime}
                      onChange={(e) =>
                        setSessionInput({
                          ...sessionInput,
                          endTime: e.target.value,
                        })
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    Session Type
                  </label>
                  <select
                    value={sessionInput.type}
                    onChange={(e) =>
                      setSessionInput({ ...sessionInput, type: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Deep Focus" className="bg-[#0A0E1A]">
                      Deep Focus
                    </option>
                    <option value="Revision" className="bg-[#0A0E1A]">
                      Revision
                    </option>
                    <option value="Research" className="bg-[#0A0E1A]">
                      Research
                    </option>
                    <option value="Break" className="bg-[#0A0E1A]">
                      Break
                    </option>
                  </select>
                </div>

                <div className="pt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!sessionInput.subject.trim()}
                    className="px-6 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingId ? "Save Changes" : "Add Session"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI OPTIMIZATION MODAL */}
      <AnimatePresence>
        {isOptimizing && (
          <AIOptimizationModal
            sessions={plannedSessions}
            subjects={data?.subjects || []}
            onClose={() => setIsOptimizing(false)}
            updateScheduleSession={updateScheduleSession}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AIOptimizationModal({
  sessions,
  subjects,
  onClose,
  updateScheduleSession,
}) {
  const optimizedSessions = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];

    // Extract and sort all existing timeslots
    const sortedTimes = [...sessions]
      .map((s) => s.time)
      .sort((a, b) => parseTimeToMins(a) - parseTimeToMins(b));

    // Score sessions by cognitive load
    const scoredSessions = [...sessions]
      .map((s) => {
        let score = 0;
        if (s.type === "Deep Focus") score += 100;
        const sub = subjects.find((x) => x.title === s.subject);
        score += 100 - (sub?.progress || 50); // Lower progress = higher priority
        return { ...s, _score: score };
      })
      .sort((a, b) => b._score - a._score);

    // Assign highest cognitive load sessions to earliest timeslots
    return scoredSessions.map((s, i) => ({
      ...s,
      originalTime: s.time,
      time: sortedTimes[i],
    }));
  }, [sessions, subjects]);

  const handleApply = () => {
    optimizedSessions.forEach((session) => {
      if (session.time !== session.originalTime) {
        updateScheduleSession(session.id, { time: session.time });
      }
    });
    toast.success("Schedule optimally reorganized!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[#0A0E1A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
      >
        <div className="px-8 py-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01] shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-white/10">
              <Wand2 size={22} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Smart Reorganization
              </h2>
              <p className="text-sm text-zinc-400 font-medium mt-0.5">
                High cognitive tasks shifted to optimal timeslots
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="p-5 rounded-2xl bg-violet-500/[0.05] border border-violet-500/10 flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 border border-violet-500/20">
              <Lightbulb className="text-violet-400" size={20} />
            </div>
            <div>
              <div className="text-base font-bold text-white mb-1.5 tracking-wide">
                AI Rationale
              </div>
              <div className="text-sm text-zinc-400 leading-relaxed">
                Your weakest subjects and deepest focus sessions have been
                automatically assigned to the earliest available blocks to
                maximize your cognitive energy.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 pl-1">
              Proposed Adjustments
            </h4>
            {optimizedSessions.map((session) => {
              const changed = session.time !== session.originalTime;
              return (
                <div
                  key={session.id}
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    changed
                      ? "bg-violet-500/[0.04] border-violet-500/20"
                      : "bg-white/[0.02] border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-3 w-3 rounded-full bg-gradient-to-r ${session.color}`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {session.subject}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {session.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    {changed ? (
                      <>
                        <span className="text-zinc-500 line-through">
                          {session.originalTime}
                        </span>
                        <ArrowRight size={14} className="text-violet-400" />
                        <span className="text-emerald-400 font-bold px-2 py-1 bg-emerald-500/10 rounded-md">
                          {session.time}
                        </span>
                      </>
                    ) : (
                      <span className="text-zinc-400">
                        {session.time} (Unchanged)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-8 py-6 border-t border-white/[0.06] flex items-center justify-end gap-4 bg-white/[0.01] shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2"
          >
            <Wand2 size={16} /> Apply Schedule
          </button>
        </div>
      </motion.div>
    </div>
  );
}
