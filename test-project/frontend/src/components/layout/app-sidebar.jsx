import { NavLink } from "react-router-dom";

import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

const navItems = [
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
    name: "Focus",
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

export default function AppSidebar() {
  return (
    <aside
      className="
        hidden
        lg:flex
        flex-col
        w-[290px]
        min-h-screen
        relative
        border-r
        border-white/10
        bg-[#060816]/90
        backdrop-blur-3xl
        overflow-hidden
      "
    >
      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute
          top-0
          left-0
          h-[300px]
          w-[300px]
          bg-violet-500/10
          blur-[120px]
          rounded-full
          pointer-events-none
        "
      />

      {/* LOGO */}
      <div
        className="
          relative
          z-10
          flex
          items-center
          gap-4
          px-6
          py-7
          border-b
          border-white/10
        "
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="
            h-14
            w-14
            rounded-2xl
            bg-gradient-to-br
            from-violet-500
            via-blue-500
            to-cyan-400
            flex
            items-center
            justify-center
            shadow-[0_0_45px_rgba(99,102,241,0.45)]
          "
        >
          <span className="text-xl font-bold text-white">S</span>
        </motion.div>

        <div>
          <h2 className="text-xl font-bold tracking-wide text-white">
            StudyAI
          </h2>

          <p className="text-sm text-zinc-500">AI Productivity OS</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative z-10 flex-1 px-4 py-6 space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `
                  group
                  relative
                  flex
                  items-center
                  gap-4
                  px-4
                  py-4
                  rounded-2xl
                  transition-all
                  duration-300
                  overflow-hidden
                  ${
                    isActive
                      ? `
                        bg-gradient-to-r
                        from-violet-500/20
                        to-blue-500/10
                        border
                        border-violet-500/20
                        text-white
                        shadow-[0_0_35px_rgba(99,102,241,0.18)]
                      `
                      : `
                        text-zinc-400
                        hover:text-white
                        hover:bg-white/[0.05]
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {/* ACTIVE SIDE LINE */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="
                        absolute
                        left-0
                        top-2
                        bottom-2
                        w-1
                        rounded-full
                        bg-gradient-to-b
                        from-violet-400
                        to-cyan-400
                      "
                    />
                  )}

                  {/* ICON */}
                  <div
                    className={`
                      h-11
                      w-11
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      border
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? `
                            border-violet-400/30
                            bg-violet-500/10
                            text-violet-300
                          `
                          : `
                            border-white/10
                            bg-white/[0.03]
                            group-hover:bg-white/[0.06]
                          `
                      }
                    `}
                  >
                    <Icon size={19} />
                  </div>

                  {/* TEXT */}
                  <span className="font-medium text-[15px] tracking-wide">
                    {item.name}
                  </span>

                  {/* ARROW */}
                  <ChevronRight
                    size={16}
                    className="
                      ml-auto
                      opacity-0
                      translate-x-2
                      transition-all
                      duration-300
                      group-hover:opacity-100
                      group-hover:translate-x-0
                    "
                  />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* BOTTOM AI CARD */}
      <div className="relative z-10 p-4">
        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-gradient-to-br
            from-violet-500/10
            via-blue-500/5
            to-cyan-500/10
            p-5
            backdrop-blur-xl
          "
        >
          {/* INNER GLOW */}
          <div
            className="
              absolute
              -top-10
              -right-10
              h-32
              w-32
              rounded-full
              bg-violet-500/20
              blur-3xl
            "
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div
                className="
                  h-12
                  w-12
                  rounded-2xl
                  bg-gradient-to-br
                  from-violet-500
                  to-cyan-500
                  flex
                  items-center
                  justify-center
                  shadow-[0_0_35px_rgba(99,102,241,0.35)]
                "
              >
                <Sparkles size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-white">AI Productivity</h3>

                <p className="text-xs text-zinc-400">Smart learning insights</p>
              </div>
            </div>

            <p className="text-sm text-zinc-300 mt-5 leading-relaxed">
              Your focus consistency improved by 18% this week.
            </p>

            <button
              className="
                mt-5
                w-full
                rounded-2xl
                bg-gradient-to-r
                from-violet-500
                to-blue-500
                py-3
                font-medium
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-[0_0_35px_rgba(99,102,241,0.35)]
              "
            >
              View Insights
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
