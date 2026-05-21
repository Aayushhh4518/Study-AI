import { NavLink } from "react-router-dom";

import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Settings,
} from "lucide-react";

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
        w-[280px]
        border-r
        border-white/10
        bg-[#070B14]/80
        backdrop-blur-2xl
      "
    >
      {/* LOGO */}
      <div
        className="
          flex
          items-center
          gap-4
          px-6
          py-7
          border-b
          border-white/10
        "
      >
        <div
          className="
            h-14
            w-14
            rounded-2xl
            bg-gradient-to-br
            from-violet-500
            to-blue-500
            flex
            items-center
            justify-center
            shadow-[0_0_40px_rgba(99,102,241,0.35)]
          "
        >
          <span className="text-xl font-bold">S</span>
        </div>

        <div>
          <h2 className="text-xl font-bold">StudyAI</h2>

          <p className="text-sm text-zinc-500">Productivity OS</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-2">
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
                        shadow-[0_0_30px_rgba(99,102,241,0.15)]
                      `
                      : `
                        text-zinc-400
                        hover:text-white
                        hover:bg-white/[0.04]
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {/* ACTIVE GLOW */}
                  {isActive && (
                    <div
                      className="
                        absolute
                        inset-y-0
                        left-0
                        w-1
                        rounded-full
                        bg-gradient-to-b
                        from-violet-400
                        to-blue-400
                      "
                    />
                  )}

                  <div
                    className="
                      h-11
                      w-11
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      border
                      transition-all
                      duration-300
                    "
                  >
                    <Icon size={20} />
                  </div>

                  <span className="font-medium text-[15px]">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* BOTTOM CARD */}
      <div className="p-4">
        <div
          className="
            rounded-3xl
            border
            border-white/10
            bg-gradient-to-br
            from-violet-500/10
            to-blue-500/10
            p-5
          "
        >
          <h3 className="font-semibold text-lg">AI Productivity</h3>

          <p className="text-sm text-zinc-400 mt-2">
            Your study performance increased by 18% this week.
          </p>

          <button
            className="
              mt-4
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-violet-500
              to-blue-500
              py-3
              font-medium
              transition-all
              hover:scale-[1.02]
            "
          >
            View Insights
          </button>
        </div>
      </div>
    </aside>
  );
}
