/*
  AppSidebar — Premium AI SaaS Edition
  Changes:
  - Upgraded typography hierarchy and spacing (Linear/Cursor style)
  - Refined active states with subtle inset shadows and glowing accents
  - Modernized icon containers for a cleaner, high-contrast look
  - Fixed overflow-hidden clipping on the desktop collapse toggle button
  - Implemented ultra-smooth cubic-bezier CSS transitions for the sidebar
  - Upgraded the AI Productivity card to a premium startup aesthetic
  - Optimized spacing for the icon-only compact mode
  - Preserved performance (no expensive layoutId or excessive blur calculations)
*/
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Brain,
  BrainCircuit,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Subjects", path: "/subjects", icon: BookOpen },
  { name: "Tasks", path: "/tasks", icon: CheckSquare },
  { name: "Focus", path: "/focus", icon: Brain },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Schedule", path: "/schedule", icon: CalendarDays },

  {
    name: "AI Planner",
    path: "/ai-planner",
    icon: BrainCircuit,
  },
  { name: "Settings", path: "/settings", icon: Settings },
];

function SidebarInner({ collapsed, onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-64 w-64 rounded-full bg-violet-600/[0.04] blur-[80px]"
      />

      {/* Brand */}
      <div
        className={`
        relative z-10 flex items-center border-b border-white/[0.04]
        ${collapsed ? "justify-center px-0 py-5" : "gap-3 px-6 py-5"}
      `}
      >
        <div
          className="
          relative flex-shrink-0 h-8 w-8 rounded-xl
          bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500
          flex items-center justify-center
          shadow-[0_0_20px_rgba(139,92,246,0.35)]
        "
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent" />
          <Sparkles size={15} className="relative text-white drop-shadow-md" />
        </div>

        <div
          className={`
          overflow-hidden whitespace-nowrap
          transition-[width,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
        `}
        >
          <h2 className="text-[14px] font-bold tracking-wide text-white leading-none">
            StudyAI
          </h2>
          <p className="text-[10px] text-zinc-500 mt-1 tracking-[0.15em] uppercase font-medium">
            AI Productivity OS
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto h-8 w-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-colors duration-200"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Section label */}
      <div
        className={`overflow-hidden transition-[height,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${collapsed ? "h-0 opacity-0" : "h-9 opacity-100"}`}
      >
        <p className="px-6 pt-5 text-[10.5px] uppercase tracking-[0.18em] text-zinc-600 font-semibold">
          Overview
        </p>
      </div>

      {/* Nav */}
      <nav
        className={`relative z-10 flex-1 overflow-y-auto overflow-x-hidden pt-2 pb-4 space-y-1`}
        style={{ scrollbarWidth: "none" }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) => `
                group relative flex items-center
                ${collapsed ? "justify-center px-0 py-[10px] mx-3" : "gap-3 px-3 py-[9px] mx-3"}
                rounded-xl transition-all duration-200 overflow-hidden
                ${
                  isActive
                    ? "bg-violet-500/[0.08] text-white border border-violet-500/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03] border border-transparent"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Active left accent */}
                  <div
                    className={`
                    absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-[3px] rounded-r-full
                    bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]
                    transition-opacity duration-200
                    ${isActive && !collapsed ? "opacity-100" : "opacity-0"}
                  `}
                  />

                  {/* Icon */}
                  <div
                    className={`
                    flex-shrink-0 h-8 w-8 rounded-lg
                    flex items-center justify-center
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-violet-500/20 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                        : "text-zinc-500 group-hover:text-zinc-300 group-hover:bg-white/[0.05]"
                    }
                  `}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                  </div>

                  {/* Label */}
                  <span
                    className={`
                    text-[13.5px] font-semibold tracking-wide whitespace-nowrap
                    overflow-hidden transition-[width,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                    ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
                    ${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}
                  `}
                  >
                    {item.name}
                  </span>

                  {!collapsed && (
                    <ChevronRight
                      size={14}
                      className={`
                      ml-auto transition-all duration-200
                      ${isActive ? "text-violet-400 opacity-100" : "text-zinc-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}
                    `}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* AI Panel */}
      <div
        className={`
        px-4 pb-4 overflow-hidden
        transition-[height,opacity,padding] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        ${collapsed ? "h-0 opacity-0 pb-0" : "h-auto opacity-100"}
      `}
      >
        <div
          className="
          relative overflow-hidden rounded-2xl
          border border-violet-500/20
          bg-gradient-to-b from-violet-500/[0.05] to-transparent
          p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
        "
        >
          <div
            aria-hidden
            className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-violet-500/15 blur-3xl pointer-events-none"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl flex-shrink-0 bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                <Sparkles size={15} className="text-white" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-white leading-none">
                  AI Productivity
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1">System Active</p>
              </div>
            </div>
            <p className="text-[12px] text-zinc-400 mt-4 leading-relaxed">
              Focus consistency improved{" "}
              <span className="text-violet-300 font-bold">+18%</span> this week.
            </p>
            <button
              className="
              mt-4 w-full rounded-xl
              bg-white/[0.04] border border-white/10
              py-2 text-[12px] font-semibold text-white
              hover:bg-white/[0.08] hover:border-violet-500/30
              hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]
              transition-all duration-200
            "
            >
              View Insights
            </button>
          </div>
        </div>
      </div>

      {collapsed && (
        <div className="flex justify-center pb-4">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Sparkles size={16} className="text-violet-400" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="
          lg:hidden fixed top-[14px] left-4 z-50
          h-9 w-9 rounded-xl flex items-center justify-center
          bg-[#0a0e24]/95 border border-white/10 backdrop-blur-md
          text-zinc-500 hover:text-white
          transition-colors duration-200
        "
      >
        <Menu size={16} />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="bd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 40,
                mass: 0.85,
              }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[270px] bg-[#050816] border-r border-white/[0.05] shadow-[4px_0_28px_rgba(0,0,0,0.5)]"
            >
              <SidebarInner
                collapsed={false}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className="
          hidden lg:flex flex-col flex-shrink-0
          min-h-screen relative
          border-r border-white/[0.05]
          bg-[#060816]/95
          transition-[width] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        "
        style={{ width: collapsed ? 76 : 270 }}
      >
        <div className="flex flex-col h-full overflow-hidden w-full">
          <SidebarInner collapsed={collapsed} />
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="
            absolute -right-[13px] top-[72px] z-50
            h-[26px] w-[26px] rounded-full
            bg-[#0B0F19] border border-white/10
            flex items-center justify-center
            text-zinc-500 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10
            shadow-[0_0_12px_rgba(0,0,0,0.6)]
            transition-all duration-200
          "
          title={collapsed ? "Expand" : "Collapse"}
        >
          <ChevronRight
            size={14}
            strokeWidth={2}
            className={`transition-transform duration-300 ${collapsed ? "rotate-0" : "rotate-180"}`}
          />
        </button>
      </aside>
    </>
  );
}
