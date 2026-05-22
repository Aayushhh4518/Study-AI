import {
  useEffect,
  useState,
} from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Search,
  Settings,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const pages = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Subjects",
    path: "/subjects",
    icon: BookOpen,
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Focus Mode",
    path: "/focus",
    icon: Brain,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Schedule",
    path: "/schedule",
    icon: CalendarDays,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function GlobalSearch() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [query, setQuery] = useState("");

  /* KEYBOARD SHORTCUT */

  useEffect(() => {
  const down = (e) => {
    if (
      (e.metaKey || e.ctrlKey) &&
      e.key.toLowerCase() === "k"
    ) {
      e.preventDefault();

      setOpen((prev) => !prev);
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  document.addEventListener("keydown", down);

  return () =>
    document.removeEventListener(
      "keydown",
      down,
    );
}, []);

  /* FILTER */

  const filteredPages = pages.filter((page) =>
    page.name
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="
              fixed
              inset-0
              z-[90]
              bg-black/60
              backdrop-blur-md
            "
          />

          {/* MODAL */}
          <motion.div
            initial={{
              opacity: 0,
              y: -40,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.98,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              fixed
              left-1/2
              top-[12%]
              z-[100]
              w-full
              max-w-2xl
              -translate-x-1/2
              px-5
            "
          >
            <div
              className="
                overflow-hidden
                rounded-[32px]
                border border-white/10
                bg-[#0b1120]/90
                backdrop-blur-2xl
                shadow-[0_0_60px_rgba(99,102,241,0.25)]
              "
            >
              {/* SEARCH */}
              <div
                className="
                  flex
                  items-center
                  gap-4
                  border-b border-white/10
                  px-6 py-5
                "
              >
                <Search
                  size={22}
                  className="text-zinc-500"
                />

                <input
                  autoFocus
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="Search pages..."
                  className="
                    w-full
                    bg-transparent
                    outline-none
                    text-lg
                    text-white
                    placeholder:text-zinc-500
                  "
                />
              </div>

              {/* RESULTS */}
              <div className="p-3">
                {filteredPages.map((page) => {
                  const Icon = page.icon;

                  return (
                    <button
                      key={page.name}
                      onClick={() => {
                        navigate(page.path);

                        setOpen(false);

                        setQuery("");
                      }}
                      className="
                        group
                        flex
                        w-full
                        items-center
                        gap-4
                        rounded-2xl
                        px-5 py-4
                        transition-all
                        hover:bg-white/[0.05]
                      "
                    >
                      <div
                        className="
                          h-12
                          w-12
                          rounded-2xl
                          border border-white/10
                          bg-white/[0.04]
                          flex items-center justify-center
                          transition-all
                          group-hover:border-violet-500/20
                          group-hover:bg-violet-500/10
                        "
                      >
                        <Icon
                          size={20}
                          className="text-violet-300"
                        />
                      </div>

                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-white">
                          {page.name}
                        </h3>

                        <p className="text-sm text-zinc-400">
                          Navigate instantly
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* FOOTER */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-t border-white/10
                  px-6 py-4
                "
              >
                <p className="text-sm text-zinc-500">
                  Press ESC to close
                </p>

                <div
                  className="
                    rounded-xl
                    border border-white/10
                    bg-white/[0.04]
                    px-3 py-2
                    text-xs
                    text-zinc-400
                  "
                >
                  CTRL + K
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
