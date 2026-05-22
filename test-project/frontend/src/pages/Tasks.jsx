import { motion } from "framer-motion";

import {
  CheckCircle2,
  Clock3,
  Flame,
  Plus,
} from "lucide-react";

const tasks = [
  {
    title: "Complete DSA Revision",
    priority: "High",
    time: "2 Hours",
    completed: false,
    color: "from-red-500 to-orange-500",
  },
  {
    title: "Study Operating Systems",
    priority: "Medium",
    time: "1.5 Hours",
    completed: true,
    color: "from-emerald-500 to-green-500",
  },
  {
    title: "AI Research Notes",
    priority: "Low",
    time: "45 Minutes",
    completed: false,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "DBMS Practice Questions",
    priority: "High",
    time: "3 Hours",
    completed: false,
    color: "from-violet-500 to-indigo-500",
  },
];

export default function Tasks() {
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
          <h1
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
            Tasks
          </h1>

          <p className="text-zinc-400 mt-3 text-lg">
            Manage your daily productivity workflow.
          </p>
        </div>

        {/* ADD BUTTON */}
        <button
          className="
            flex items-center gap-3
            rounded-2xl
            bg-gradient-to-r
            from-violet-500
            to-blue-500
            px-5 py-3
            text-white
            font-semibold
            shadow-[0_0_35px_rgba(99,102,241,0.35)]
            transition-all
            hover:scale-105
          "
        >
          <Plus size={18} />

          Add Task
        </button>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Tasks Completed",
            value: "18",
            icon: CheckCircle2,
          },
          {
            label: "Pending Tasks",
            value: "7",
            icon: Clock3,
          },
          {
            label: "Focus Streak",
            value: "12 Days",
            icon: Flame,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="
                rounded-3xl
                border border-white/10
                bg-white/[0.04]
                p-6
                backdrop-blur-2xl
                relative
                overflow-hidden
              "
            >
              <div
                className="
                  absolute
                  top-0
                  right-0
                  h-28
                  w-28
                  rounded-full
                  bg-violet-500/10
                  blur-3xl
                "
              />

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">
                    {item.label}
                  </p>

                  <h2 className="text-4xl font-black mt-3 text-white">
                    {item.value}
                  </h2>
                </div>

                <div
                  className="
                    h-14
                    w-14
                    rounded-2xl
                    bg-gradient-to-br
                    from-violet-500/20
                    to-blue-500/20
                    border border-white/10
                    flex items-center justify-center
                  "
                >
                  <Icon
                    size={24}
                    className="text-violet-300"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TASKS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {tasks.map((task, index) => (
          <motion.div
            key={task.title}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
            }}
            whileHover={{
              y: -6,
            }}
            className="
              group
              relative
              overflow-hidden
              rounded-[32px]
              border border-white/10
              bg-white/[0.04]
              p-7
              backdrop-blur-2xl
              transition-all
              duration-500
              hover:border-violet-500/20
              hover:bg-white/[0.05]
            "
          >
            {/* glow */}
            <div
              className={`
                absolute
                top-0
                right-0
                h-40
                w-40
                rounded-full
                blur-3xl
                opacity-20
                bg-gradient-to-br
                ${task.color}
              `}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {task.title}
                  </h3>

                  <div className="flex items-center gap-3 mt-4">
                    <div
                      className={`
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-semibold
                        bg-gradient-to-r
                        ${task.color}
                      `}
                    >
                      {task.priority}
                    </div>

                    <div
                      className="
                        text-sm
                        text-zinc-400
                      "
                    >
                      {task.time}
                    </div>
                  </div>
                </div>

                {/* STATUS */}
                <div
                  className={`
                    h-14
                    w-14
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    border border-white/10
                    ${
                      task.completed
                        ? "bg-emerald-500/20"
                        : "bg-white/[0.05]"
                    }
                  `}
                >
                  <CheckCircle2
                    size={24}
                    className={
                      task.completed
                        ? "text-emerald-400"
                        : "text-zinc-500"
                    }
                  />
                </div>
              </div>

              {/* PROGRESS */}
              <div className="mt-8">
                <div className="flex justify-between mb-3">
                  <p className="text-sm text-zinc-400">
                    Progress
                  </p>

                  <p className="text-sm text-white font-semibold">
                    {task.completed ? "100%" : "65%"}
                  </p>
                </div>

                <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      ${task.color}
                    `}
                    style={{
                      width: task.completed
                        ? "100%"
                        : "65%",
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
