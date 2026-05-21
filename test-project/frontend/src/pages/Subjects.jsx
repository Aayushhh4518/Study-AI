import { motion } from "framer-motion";

console.log("NEW SUBJECTS PAGE LOADED");

const subjects = [
  {
    name: "Data Structures",
    progress: 78,
    hours: "24h studied",
    color: "from-violet-500 to-indigo-500",
  },
  {
    name: "AI & Machine Learning",
    progress: 64,
    hours: "18h studied",
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "DBMS",
    progress: 52,
    hours: "12h studied",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Operating Systems",
    progress: 83,
    hours: "31h studied",
    color: "from-emerald-500 to-green-500",
  },
];

export default function Subjects() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-bold tracking-tight">Subjects</h1>

        <p className="text-zinc-400 mt-3 text-lg">
          Track your study progress and learning consistency.
        </p>
      </div>

      {/* SUBJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.name}
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
                ${subject.color}
              `}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{subject.name}</h2>

                <div
                  className={`
                    h-12
                    w-12
                    rounded-2xl
                    bg-gradient-to-br
                    ${subject.color}
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
                      ${subject.color}
                    `}
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
