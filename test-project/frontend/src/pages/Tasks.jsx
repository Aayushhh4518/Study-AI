import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  BrainCircuit,
  Calendar,
  Check,
  CheckCircle2,
  Clock3,
  Flag,
  ListTodo,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PremiumCard from "../components/ui/premium-card";
import { useData } from "../store/DataContext";

export default function Tasks() {
  const { data, addTask, toggleTask, deleteTask, editTask, stats } = useData();
  const tasks = data?.tasks || [];
  const subjects = data?.subjects || [];

  /* ── STATE ─────────────────────────────────────────────── */
  const [modalState, setModalState] = useState(null); // { mode: 'add' | 'edit', task: Task | null }
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // All, Active, Completed

  /* ── HANDLERS ──────────────────────────────────────────── */
  const handleOpenAddModal = () => {
    setModalState({ mode: "add", task: null });
  };

  const handleOpenEditModal = (task) => {
    setModalState({ mode: "edit", task });
  };

  const handleCloseModal = () => {
    setModalState(null);
  };

  const handleSubmit = (formData) => {
    const colors = {
      High: "bg-rose-500",
      Medium: "bg-amber-500",
      Low: "bg-emerald-500",
      None: "bg-zinc-500",
    };
    const taskData = {
      title: formData.title.trim(),
      name: formData.title.trim(),
      due: formData.due || "No Due Date",
      priority: formData.priority,
      subject: formData.subject,
      color: colors[formData.priority] || colors.None,
    };

    if (modalState.mode === "edit") {
      editTask(modalState.task.id, taskData);
    } else {
      addTask(taskData);
    }
    handleCloseModal();
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId);
    }
  };

  /* ── FILTERING (Optimized) ─────────────────────────────── */
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Active"
            ? !task.completed
            : task.completed;
      return matchSearch && matchStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  /* ── AI INSIGHTS (Memoized) ────────────────────────────── */
  const aiInsights = useMemo(() => {
    const highPriority = tasks.filter(
      (t) => !t.completed && t.priority === "High",
    ).length;
    const pending = stats.pendingTasks;
    const insights = [];

    if (highPriority > 0) {
      insights.push({
        icon: Flag,
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        title: `${highPriority} High-Priority Task${highPriority > 1 ? "s" : ""}`,
        desc: "Focus on these first to make significant progress.",
      });
    }

    if (pending > 10) {
      insights.push({
        icon: ListTodo,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        title: "High Workload",
        desc: "You have a lot of pending tasks. Prioritize and tackle them one by one.",
      });
    }

    if (insights.length < 2) {
      insights.push({
        icon: BrainCircuit,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
        title: "AI Suggestion",
        desc: "Group similar tasks together and complete them in a single focus session.",
      });
    }

    return insights.slice(0, 2);
  }, [tasks, stats.pendingTasks]);

  const completionPercentage = useMemo(() => {
    if (!stats.totalTasks || stats.totalTasks === 0) {
      return 0;
    }
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  }, [stats.completedTasks, stats.totalTasks]);

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
            className=" //prettier-ignore
              text-4xl md:text-5xl
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
            Tasks
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">
            Manage your productivity workflow.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(99,102,241,0.35)] shadow-lg"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* PROGRESS BAR */}
      <PremiumCard className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-zinc-300">
            Overall Progress
          </p>
          <p className="text-sm font-bold text-white">
            {completionPercentage}%
          </p>
        </div>
        <div className="h-2.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
          <TrendingUp size={14} className="text-emerald-500" />
          <span>
            {stats.completedTasks} tasks completed, {stats.pendingTasks} to go.
          </span>
        </div>
      </PremiumCard>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Tasks",
            value: stats.totalTasks,
            icon: ListTodo,
            color: "text-blue-400",
            bg: "bg-blue-500/10 border-blue-500/20",
          },
          {
            label: "Completed",
            value: stats.completedTasks,
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/20",
          },
          {
            label: "Pending",
            value: stats.pendingTasks,
            icon: Clock3,
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
          },
          {
            label: "Productivity",
            value: `${stats.productivityScore}%`,
            icon: Zap,
            color: "text-violet-400",
            bg: "bg-violet-500/10 border-violet-500/20",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <PremiumCard key={item.label} className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">
                    {item.label}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold mt-1 text-white">
                    {item.value}
                  </h2>
                </div>
                <div
                  className={`h-10 w-10 md:h-12 md:w-12 rounded-xl ${item.bg} border flex items-center justify-center`}
                >
                  <Icon className={item.color} size={20} />
                </div>
              </div>
            </PremiumCard>
          );
        })}
      </div>

      {/* AI INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiInsights.map((insight) => {
          const Icon = insight.icon;
          return (
            <PremiumCard
              key={insight.title}
              className={`p-4 flex items-start gap-4 ${insight.bg} border-none`}
            >
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${insight.color.replace("text", "border")}`}
              >
                <Icon className={insight.color} size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-[15px]">
                  {insight.title}
                </h4>
                <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                  {insight.desc}
                </p>
              </div>
            </PremiumCard>
          );
        })}
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="relative flex items-center gap-2 p-1 bg-[#0A0E1A] border border-white/10 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar shadow-sm">
          {["All", "Active", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`relative z-10 flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-300 ${
                statusFilter === tab
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab}
              {statusFilter === tab && (
                <motion.div
                  layoutId="taskFilterPill"
                  className="absolute inset-0 bg-white/[0.06] border border-white/10 rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TASK LIST */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center flex flex-col items-center border border-dashed border-white/[0.08] rounded-3xl bg-white/[0.01]"
            >
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="h-16 w-16 bg-white/[0.03] rounded-full flex items-center justify-center mb-4"
              >
                <Brain className="text-zinc-600" size={28} />
              </motion.div>
              <h3 className="text-lg font-semibold text-white">All Clear!</h3>
              <p className="text-zinc-500 mt-2 text-sm max-w-sm">
                You're all caught up! Enjoy your free time or create a new task.
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              >
                <div
                  className={`
                    group relative p-4 sm:p-5 rounded-2xl border bg-white/[0.02]
                    transition-all duration-300 ease-in-out
                    hover:-translate-y-1 hover:bg-white/[0.04]
                    ${
                      task.completed
                        ? "border-emerald-500/10"
                        : task.priority === "High"
                          ? "hover:border-rose-500/30"
                          : "border-white/10 hover:border-violet-500/30"
                    }
                  `}
                >
                  <div className="flex items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Checkbox (Linear Style) */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`relative mt-0.5 sm:mt-0 h-[22px] w-[22px] shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          task.completed
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-zinc-600 hover:border-violet-500"
                        }`}
                      >
                        <AnimatePresence>
                          {task.completed && (
                            <>
                              <motion.div // Line 409
                                key="glow"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]" // Line 410
                              />
                              <motion.div // Line 411
                                key="check"
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }} // Line 412
                                exit={{ scale: 0, rotate: 45 }}
                              >
                                <Check
                                  size={12}
                                  className="text-white"
                                  strokeWidth={4}
                                />
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </button>

                      {/* Task Info */}
                      <div>
                        <h3
                          className={`text-[15px] font-semibold transition-colors duration-200 ${task.completed ? "text-zinc-500 line-through" : "text-zinc-100 group-hover:text-violet-200"}`}
                        >
                          {task.title}
                        </h3>

                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          {/* Priority Badge */}
                          {task.priority && (
                            <div
                              className={`flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                task.priority === "High"
                                  ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                                  : task.priority === "Medium"
                                    ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                    : task.priority === "Low"
                                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                      : "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"
                              }`}
                            >
                              <Flag size={10} />
                              {task.priority}
                            </div>
                          )}

                          {/* Subject */}
                          {task.subject && (
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                              <BookOpen size={12} />
                              {task.subject}
                            </div>
                          )}
                          {/* Due Date */}
                          {task.due && task.due !== "No Due Date" && (
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                              <Calendar size={12} />
                              {task.due}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* DELETE */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleOpenEditModal(task)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-all"
                      >
                        <Zap size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ── ADD TASK MODAL ── */}
      <AnimatePresence>
        {modalState && (
          <TaskModal
            mode={modalState.mode}
            task={modalState.task}
            subjects={subjects}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TaskModal({ mode, task, subjects, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    due: "",
    priority: "Medium",
    subject: "",
  });

  useEffect(() => {
    if (mode === "edit" && task) {
      setFormData({
        title: task.title || "",
        due: task.due === "No Due Date" ? "" : task.due || "",
        priority: task.priority || "Medium",
        subject: task.subject || "",
      });
    } else {
      setFormData({
        title: "",
        due: "",
        priority: "Medium",
        subject: subjects.length > 0 ? subjects[0].name : "",
      });
    }
  }, [mode, task, subjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
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
        className="relative w-full max-w-lg bg-[#0A0E1A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <h3 className="text-lg font-bold text-white tracking-wide">
            {mode === "add" ? "Create New Task" : "Edit Task"}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Task Title
            </label>
            <input
              autoFocus
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="What needs to be done?"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all appearance-none cursor-pointer"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
                <option value="None">No Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Due Date
              </label>
              <input
                type="text"
                value={formData.due}
                onChange={(e) =>
                  setFormData({ ...formData, due: e.target.value })
                }
                placeholder="e.g. Tomorrow, 5:00 PM"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Subject
            </label>
            <select
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">No Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className="px-6 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === "add" ? "Save Task" : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
