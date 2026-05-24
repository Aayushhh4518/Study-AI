import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock3,
  Flag,
  ListTodo,
  Plus,
  Search,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import PremiumCard from "../components/ui/premium-card";
import { useData } from "../store/DataContext";

export default function Tasks() {
  const { data, addTask, toggleTask, deleteTask, stats } = useData();
  const tasks = data?.tasks || [];

  /* ── STATE ─────────────────────────────────────────────── */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // All, Active, Completed

  const [newTask, setNewTask] = useState({
    title: "",
    due: "",
    priority: "Medium",
  });

  /* ── HANDLERS ──────────────────────────────────────────── */
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const colors = {
      High: "bg-rose-500",
      Medium: "bg-amber-500",
      Low: "bg-emerald-500",
      None: "bg-zinc-500",
    };

    addTask({
      title: newTask.title.trim(),
      due: newTask.due || "No Due Date",
      priority: newTask.priority,
      color: colors[newTask.priority] || colors.None,
    });

    setNewTask({ title: "", due: "", priority: "Medium" });
    setIsModalOpen(false);
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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(99,102,241,0.35)] shadow-lg"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

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

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
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
        <div className="flex items-center gap-2 p-1 bg-[#0A0E1A] border border-white/10 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar shadow-sm">
          {["All", "Active", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === tab
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 border border-transparent"
              }`}
            >
              {tab}
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
              className="py-16 text-center flex flex-col items-center border border-white/[0.05] rounded-3xl bg-white/[0.01]"
            >
              <div className="h-16 w-16 bg-white/[0.03] rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="text-zinc-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-white">
                No tasks found
              </h3>
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
              >
                <PremiumCard className="p-4 sm:p-5 group">
                  <div className="flex items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Checkbox (Linear Style) */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 sm:mt-0 h-[22px] w-[22px] shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          task.completed
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-zinc-600 hover:border-violet-500"
                        }`}
                      >
                        <AnimatePresence>
                          {task.completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check
                                size={12}
                                className="text-white"
                                strokeWidth={4}
                              />
                            </motion.div>
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
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-zinc-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </PremiumCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ── ADD TASK MODAL ── */}
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
                  Create New Task
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    Task Title
                  </label>
                  <input
                    autoFocus
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
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
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="High" className="bg-[#0A0E1A]">
                        High Priority
                      </option>
                      <option value="Medium" className="bg-[#0A0E1A]">
                        Medium Priority
                      </option>
                      <option value="Low" className="bg-[#0A0E1A]">
                        Low Priority
                      </option>
                      <option value="None" className="bg-[#0A0E1A]">
                        No Priority
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                      Due Date
                    </label>
                    <input
                      type="text"
                      value={newTask.due}
                      onChange={(e) =>
                        setNewTask({ ...newTask, due: e.target.value })
                      }
                      placeholder="e.g. Tomorrow, 5:00 PM"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
                    />
                  </div>
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
                    disabled={!newTask.title.trim()}
                    className="px-6 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
