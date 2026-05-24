import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Edit, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useData } from "../store/DataContext";

// A simple map to convert the single color from context to a gradient for the UI
const colorToGradientMap = {
  "bg-indigo-500": "from-violet-500 to-indigo-500",
  "bg-emerald-500": "from-emerald-500 to-green-500",
  "bg-rose-500": "from-pink-500 to-rose-500",
  "bg-cyan-500": "from-cyan-500 to-blue-500",
  "bg-amber-500": "from-amber-500 to-orange-500",
};

const availableColors = Object.keys(colorToGradientMap);

export default function Subjects() {
  const { data, addSubject, deleteSubject, updateSubject } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [currentSubject, setCurrentSubject] = useState(null);
  const [subjectInput, setSubjectInput] = useState({
    title: "",
    color: availableColors[0],
  });

  // Calculate study hours per subject from focus history
  const enrichedSubjects = useMemo(() => {
    return (data.subjects || []).map((subject) => {
      const totalMinutes = (data.focusSessions?.history || [])
        .filter((session) => session.subjectId === subject.id)
        .reduce((acc, session) => acc + session.durationMinutes, 0);
      const hours = (totalMinutes / 60).toFixed(1);
      return {
        ...subject,
        hours: `${hours}h studied`,
        gradient:
          colorToGradientMap[subject.color] ||
          colorToGradientMap[availableColors[0]],
      };
    });
  }, [data.subjects, data.focusSessions?.history]);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setCurrentSubject(null);
    setSubjectInput({ title: "", color: availableColors[0] });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (subject) => {
    setModalMode("edit");
    setCurrentSubject(subject);
    setSubjectInput({ title: subject.title, color: subject.color });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectInput.title.trim()) return;

    if (modalMode === "add") {
      addSubject({
        title: subjectInput.title.trim(),
        color: subjectInput.color,
      });
    } else if (currentSubject) {
      updateSubject(currentSubject.id, {
        title: subjectInput.title.trim(),
        color: subjectInput.color,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Subjects
          </h1>

          <p className="text-zinc-400 mt-3 text-lg">
            Track your study progress and learning consistency.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(99,102,241,0.35)] shadow-lg"
        >
          <Plus size={18} />
          New Subject
        </button>
      </div>

      {/* SUBJECT GRID */}
      {enrichedSubjects.length === 0 ? (
        <div className="py-24 text-center flex flex-col items-center border border-white/[0.05] rounded-3xl bg-white/[0.01]">
          <div className="h-16 w-16 bg-white/[0.03] rounded-full flex items-center justify-center mb-4">
            <BookOpen className="text-zinc-600" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-white">No subjects yet</h3>
          <p className="text-zinc-500 mt-2 text-sm max-w-sm">
            Create your first subject to start tracking your progress.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {enrichedSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className={`
              group
              relative
              overflow-hidden
              rounded-3xl
              border border-white/10
              bg-white/[0.03]
              p-6
              backdrop-blur-xl
              transition-all
              duration-500
              hover:-translate-y-2
              hover:border-white/20
              hover:bg-white/[0.05]
              hover:shadow-[0_0_40px_rgba(99,102,241,0.18)]
            `}
            >
              {/* glow */}
              <div
                className={`
                absolute
                top-0
                right-0
                h-32
                w-32
                rounded-full
                blur-3xl
                opacity-20
                bg-gradient-to-br
                ${subject.gradient}
              `}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">{subject.title}</h2>

                  <div
                    className={`
                    h-12
                    w-12
                    rounded-2xl
                    bg-gradient-to-br
                    ${subject.gradient}
                    opacity-90
                    shadow-lg
                  `}
                  />
                </div>

                <p className="text-zinc-400 mt-3">{subject.hours}</p>

                {/* progress */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">Progress</span>

                    <span className="text-white font-medium">
                      {subject.progress}%
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${subject.progress}%`,
                      }}
                      transition={{
                        duration: 1,
                        delay: index * 0.2,
                      }}
                      className={`
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      ${subject.gradient}
                    `}
                    />
                  </div>
                </div>
              </div>
              {/* Hover Actions */}
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleOpenEditModal(subject)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-all"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => deleteSubject(subject.id)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-red-500/[0.08] hover:bg-red-500/20 text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <SubjectModal
            mode={modalMode}
            input={subjectInput}
            setInput={setSubjectInput}
            onSubmit={handleSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SubjectModal({ mode, input, setInput, onSubmit, onClose }) {
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
            {mode === "add" ? "Create New Subject" : "Edit Subject"}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Subject Title
            </label>
            <input
              autoFocus
              value={input.title}
              onChange={(e) => setInput({ ...input, title: e.target.value })}
              placeholder="e.g. Computer Science 101"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Theme Color
            </label>
            <div className="flex items-center gap-3">
              {availableColors.map((colorClass) => (
                <button
                  key={colorClass}
                  type="button"
                  onClick={() => setInput({ ...input, color: colorClass })}
                  className={`h-8 w-8 rounded-full ${colorClass} transition-all duration-200 ${input.color === colorClass ? "ring-2 ring-offset-2 ring-offset-[#0A0E1A] ring-white" : "scale-90 hover:scale-100"}`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!input.title.trim()}
              className="px-6 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Subject
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
