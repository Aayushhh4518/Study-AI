/*
  TopNavbar — Premium AI SaaS Edition
  Changes:
  - Implemented a real global search engine (command palette)
  - Searches across actions, tasks, subjects, schedule, AI insights, and history
  - Added keyboard navigation, debouncing, and recent searches
  - Implemented a dynamic profile dropdown connected to global state
  - Replaced all static data with live data from DataContext
*/
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart2,
  Bell,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Clock,
  Command,
  CornerDownLeft,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Search,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../store/DataContext";

// --- Utility: Custom Hook for Debouncing ---
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- Utility: Text Highlighter ---
const Highlight = ({ text, highlight }) => {
  if (!highlight?.trim() || !text) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span
            key={i}
            className="text-violet-300 font-semibold bg-violet-500/20 rounded px-0.5"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

// --- Utility: Avatar Component ---
const Avatar = ({ profile }) => {
  const initials =
    profile.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2) || "U";

  if (profile.avatar) {
    return (
      <img
        src={profile.avatar}
        alt={profile.name}
        className="w-8 h-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-300">
      {initials.toUpperCase()}
    </div>
  );
};

// --- Helper: Result Item Component ---
function ResultItem({ item, onSelect, Icon, query, isActive }) {
  return (
    <div
      data-active={isActive}
      onClick={() => onSelect(item)}
      className={`flex items-center px-3 py-2.5 mx-1 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? "bg-violet-500/10 text-violet-200 border border-violet-500/20"
          : "text-zinc-300 border border-transparent hover:bg-white/[0.04]"
      }`}
    >
      <Icon size={14} className={`mr-3 ${item.color || "text-zinc-500"}`} />
      <div className="flex-1 min-w-0">
        <span className="truncate text-[13px] font-medium">
          <Highlight text={item.title} highlight={query} />
        </span>
      </div>
      {isActive && (
        <CornerDownLeft
          size={12}
          className="ml-3 text-violet-500 flex-shrink-0"
        />
      )}
    </div>
  );
}

// Static actions for command palette
const staticActions = [
  {
    id: "action-dashboard",
    title: "Go to Dashboard",
    type: "action",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "action-tasks",
    title: "Go to Tasks",
    type: "action",
    path: "/tasks",
    icon: ListTodo,
  },
  {
    id: "action-analytics",
    title: "Go to Analytics",
    type: "action",
    path: "/analytics",
    icon: BarChart2,
  },
  {
    id: "action-settings",
    title: "Go to Settings",
    type: "action",
    path: "/settings",
    icon: Settings,
  },
  {
    id: "action-focus",
    title: "Start Focus Session",
    type: "action",
    path: "/focus",
    icon: Zap,
  },
  {
    id: "action-schedule",
    title: "View Schedule",
    type: "action",
    path: "/schedule",
    icon: CalendarDays,
  },
  {
    id: "action-subjects",
    title: "View Subjects",
    type: "action",
    path: "/subjects",
    icon: BookOpen,
  },
];

// Icon map for recent searches and dynamic results
const iconMap = {
  action: Zap,
  task: CheckSquare,
  subject: BookOpen,
  session: Clock,
  schedule: CalendarDays,
  aiInsight: Sparkles,
};

const fadeUp = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

export default function TopNavbar() {
  const {
    data,
    aiInsights: contextAiInsights,
    unreadNotifications,
  } = useData();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);

  // Command Palette State
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("studyai_recent_searches");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse recent searches:", e);
      return [];
    }
  });

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const profileRef = useRef(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Highly optimized filtering using Context API Data
  const filteredResults = useMemo(() => {
    const lowerQuery = debouncedQuery.toLowerCase();
    if (!lowerQuery) return [];

    const actionResults = staticActions.filter((a) =>
      a.title.toLowerCase().includes(lowerQuery),
    );

    const aiInsightResults = (contextAiInsights || [])
      .filter(
        (insight) =>
          insight.title.toLowerCase().includes(lowerQuery) ||
          insight.desc.toLowerCase().includes(lowerQuery),
      )
      .map((insight) => ({
        ...insight,
        type: "aiInsight",
        icon: Sparkles,
        path: "/analytics",
      }));

    return [
      {
        category: "Actions",
        items: actionResults,
      },
      {
        category: "Tasks",
        items: (data?.tasks || [])
          .filter((t) => t.title.toLowerCase().includes(lowerQuery))
          .map((t) => ({
            ...t,
            type: "task",
            icon: iconMap.task,
            path: "/tasks",
          })),
      },
      {
        category: "Subjects",
        items: (data?.subjects || [])
          .filter((s) => s.title.toLowerCase().includes(lowerQuery))
          .map((s) => ({
            ...s,
            type: "subject",
            icon: iconMap.subject,
            path: "/subjects",
          })),
      },
      {
        category: "Focus Sessions",
        items: (data?.focus?.history || [])
          .filter(
            (s) =>
              (s.subjectId &&
                data.subjects
                  ?.find((sub) => sub.id === s.subjectId)
                  ?.title.toLowerCase()
                  .includes(lowerQuery)) ||
              s.date.toLowerCase().includes(lowerQuery),
          )
          .map((s) => ({
            ...s,
            title: `Focus Session - ${new Date(s.date).toLocaleDateString()}`,
            type: "session",
            icon: iconMap.session,
            path: "/focus",
          })),
      },
      {
        category: "Schedule",
        items: (data?.schedule || [])
          .filter((s) => s.subject.toLowerCase().includes(lowerQuery))
          .map((s) => ({
            ...s,
            title: s.subject,
            type: "schedule",
            icon: iconMap.schedule,
            path: "/schedule",
          })),
      },
      { category: "AI Insights", items: aiInsightResults },
    ].filter((group) => group.items.length > 0);
  }, [debouncedQuery, data, contextAiInsights]);

  const flattenedItems = useMemo(() => {
    return filteredResults.flatMap((group) => group.items);
  }, [filteredResults]);

  // Handle Keyboard Navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % (flattenedItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (prev) =>
          (prev - 1 + (flattenedItems.length || 1)) %
          (flattenedItems.length || 1),
      );
    } else if (e.key === "Enter" && flattenedItems.length > 0) {
      e.preventDefault();
      handleSelect(flattenedItems[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Reset active index after query changes. Use RAF to avoid synchronous setState in effect
  useEffect(() => {
    const raf = requestAnimationFrame(() => setActiveIndex(0));
    return () => cancelAnimationFrame(raf);
  }, [debouncedQuery]);

  // Auto-scroll active item into view
  useEffect(() => {
    if (isOpen && resultsRef.current) {
      const activeEl = resultsRef.current.querySelector('[data-active="true"]');
      if (activeEl)
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex, isOpen]);

  const handleSelect = (item) => {
    const newRecents = [
      item,
      ...recentSearches.filter((i) => i.id !== item.id),
    ].slice(0, 5);
    setRecentSearches(newRecents);
    localStorage.setItem(
      "studyai_recent_searches",
      JSON.stringify(newRecents.map(({ icon, ...rest }) => rest)), // Don't store icon components
    );

    if (item.path) {
      navigate(item.path);
    } else if (item.type === "task") {
      navigate("/tasks");
    } else if (item.type === "subject") {
      navigate("/subjects");
    } else if (item.type === "session") {
      navigate("/focus");
    } else if (item.type === "schedule") {
      navigate("/schedule");
    }

    setIsOpen(false);
    setQuery("");
  };

  const recommendations = [
    "Computer Science 101",
    "Start Pomodoro",
    "Check Analytics",
    "Theme Settings",
  ];

  const handleLogout = () => {
    // Placeholder for actual logout logic
    navigate("/login");
  };

  const profile = data?.profile || {};
  const initials =
    profile.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  return (
    <header
      className="
        sticky top-0 z-40
        h-[64px]
        border-b border-white/[0.04]
        bg-[#050816]/80 backdrop-blur-xl
        flex items-center justify-between
        px-4 lg:px-8 gap-4
      "
    >
      {/* LEFT — Streak */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          className="
            hidden sm:flex items-center gap-2
            px-3 py-1.5 rounded-lg
            bg-white/[0.03] border border-white/[0.05]
            hover:bg-white/[0.05] transition-colors cursor-default
          "
        >
          <Zap
            size={13}
            className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
            fill="currentColor"
          />
          <span className="text-[12px] font-semibold text-amber-400/90 tracking-wide">
            {data.analytics.streakDays} day streak
          </span>
        </div>
      </div>

      {/* CENTER — Search / Command Palette Trigger */}
      <div
        className="flex-1 flex justify-center px-2 lg:px-6 max-w-xl mx-auto w-full relative"
        ref={searchRef}
      >
        <div
          className={`
            group w-full h-[38px] rounded-xl
            border flex items-center px-3 gap-3
            transition-all duration-200 shadow-sm
            ${
              isOpen
                ? "border-violet-500/40 bg-violet-500/[0.02] ring-2 ring-violet-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                : "border-white/[0.06] bg-[#0A0E1A] hover:border-white/[0.12] hover:bg-[#0E1324]"
            }
          `}
        >
          <Search
            size={14}
            className={`flex-shrink-0 transition-colors duration-200 ${isOpen ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-400"}`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            placeholder="Search tasks, subjects, insights..."
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-[13px] text-zinc-200 placeholder:text-zinc-500 min-w-0 font-medium"
          />
          {!isOpen && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md border border-white/[0.08] bg-white/[0.02] text-[10px] text-zinc-500 flex-shrink-0 font-medium tracking-widest">
              <Command size={10} />
              <span>K</span>
            </div>
          )}
        </div>

        {/* Floating Dropdown Results */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute top-[calc(100%+8px)] left-2 lg:left-6 right-2 lg:right-6 z-50 bg-[#0B0F19]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div
                ref={resultsRef}
                className="max-h-[60vh] overflow-y-auto overscroll-contain py-2"
                style={{ scrollbarWidth: "none" }}
              >
                {/* State: Empty Query */}
                {!query && (
                  <>
                    {recentSearches.length > 0 && (
                      <div className="px-3 py-1">
                        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2 px-2">
                          Recent Searches
                        </div>
                        {recentSearches.map((item) => (
                          <ResultItem
                            key={`recent-${item.id}`}
                            item={item}
                            onSelect={handleSelect}
                            Icon={iconMap[item.type] || Clock}
                            query={""}
                            isActive={false}
                          />
                        ))}
                      </div>
                    )}
                    <div className="px-3 py-1 mt-2">
                      <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2 px-2">
                        Suggestions
                      </div>
                      {recommendations.map((rec, idx) => (
                        <div
                          key={`rec-${idx}`}
                          onClick={() => {
                            setQuery(rec);
                            inputRef.current?.focus();
                          }}
                          className="flex items-center px-3 py-2 text-[13px] text-zinc-300 hover:bg-white/[0.04] rounded-lg cursor-pointer transition-colors"
                        >
                          <Sparkles
                            size={14}
                            className="mr-3 text-violet-400"
                          />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* State: Has Query but No Results */}
                {query && flattenedItems.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.05] mb-3 text-zinc-500">
                      <Search size={16} />
                    </div>
                    <p className="text-[13px] font-medium text-zinc-200">
                      No results found
                    </p>
                    <p className="text-[12px] text-zinc-500 mt-1">
                      We couldn't find anything matching "{query}"
                    </p>
                  </div>
                )}

                {/* State: Showing Filtered Results */}
                {query &&
                  filteredResults.map((group) => (
                    <div key={group.category} className="px-2 py-1">
                      <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1 mt-2 px-3">
                        {group.category}
                      </div>
                      {group.items.map((item) => {
                        const globalIndex = flattenedItems.findIndex(
                          (i) => i.id === item.id,
                        );
                        const isActive = globalIndex === activeIndex;
                        const Icon = item.icon || CheckSquare;
                        return (
                          <ResultItem
                            key={item.id}
                            item={item}
                            onSelect={handleSelect}
                            Icon={Icon}
                            query={debouncedQuery}
                            isActive={isActive}
                          />
                        );
                      })}
                    </div>
                  ))}
              </div>

              {/* Footer Hints */}
              <div className="bg-[#050816]/50 border-t border-white/[0.04] px-4 py-2 flex items-center justify-start text-[10px] text-zinc-500 font-medium tracking-wide">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <kbd className="bg-white/[0.05] border border-white/[0.1] rounded px-1.5 py-0.5 text-[9px] font-sans">
                      ↑↓
                    </kbd>{" "}
                    navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="bg-white/[0.05] border border-white/[0.1] rounded px-1.5 py-0.5 text-[9px] font-sans">
                      ↵
                    </kbd>{" "}
                    select
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="bg-white/[0.05] border border-white/[0.1] rounded px-1.5 py-0.5 text-[9px] font-sans">
                      esc
                    </kbd>{" "}
                    close
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT — Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* AI Action Button */}
        <button
          className="
            hidden md:flex items-center gap-2
            px-3.5 py-1.5 rounded-lg
            border border-violet-500/20
            bg-violet-500/10 text-[12px] font-semibold text-violet-300
            hover:bg-violet-500/20 hover:border-violet-500/40
            hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]
            transition-all duration-200
          "
        >
          <Sparkles size={14} className="text-violet-400" />
          <span>AI Actions</span>
        </button>

        {/* Notification */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setNotifOpen((o) => !o);
              // setHasNotif(false); // This would be handled by a context action
            }}
            className="
              h-9 w-9 rounded-lg
              border border-white/[0.05] bg-white/[0.02]
              flex items-center justify-center relative
              text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1]
              transition-colors duration-200
            "
          >
            <Bell size={15} />
            {unreadNotifications > 0 && (
              <span className="absolute top-[9px] right-[9px] flex h-[7px] w-[7px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-violet-500 ring-2 ring-[#050816]" />
              </span>
            )}
          </motion.button>

          {/* Notification Dropdown - Restored lightweight Framer Motion for premium feel */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                className="
                  absolute right-0 top-[calc(100%+8px)] z-50
                  w-[280px] rounded-xl
                  border border-white/[0.08]
                  bg-[#0B0F19]/95 backdrop-blur-xl
                  shadow-[0_16px_40px_rgba(0,0,0,0.5)]
                  overflow-hidden origin-top-right
                "
              >
                <div className="px-4 py-3 border-b border-white/[0.04]">
                  <p className="text-[12px] font-bold text-white tracking-wide">
                    Notifications
                  </p>
                </div>
                <div className="py-1">
                  {(data.notifications || []).slice(0, 5).map((n) => (
                    <div
                      key={n.title}
                      className="flex items-start gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer"
                    >
                      <div
                        className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${n.type === "success" ? "bg-emerald-400" : n.type === "warning" ? "bg-amber-400" : "bg-violet-400"} shadow-[0_0_8px_currentColor]`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-zinc-100 truncate">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                          {n.message}
                        </p>
                      </div>
                      <span className="text-[10px] text-zinc-600 font-medium flex-shrink-0 mt-0.5">
                        {new Date(n.time).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-white/[0.04] bg-white/[0.01]">
                  <button className="w-full text-[11px] text-violet-400 hover:text-violet-300 transition-colors duration-150 font-semibold tracking-wide">
                    View all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden sm:block w-px h-5 bg-white/[0.08] mx-1.5" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((p) => !p)}
            className="flex items-center gap-3 group rounded-lg hover:bg-white/[0.02] p-1 transition-colors"
          >
            <div
              className="
              h-[34px] w-[34px] rounded-lg
              bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500
              flex items-center justify-center overflow-hidden
              text-[12px] font-black text-white
              shadow-[0_0_12px_rgba(99,102,241,0.4)]
              ring-1 ring-white/20
              group-hover:ring-violet-400/50
              transition-all duration-200
            "
            >
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="drop-shadow-md">{initials}</span>
              )}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-[12px] font-bold text-zinc-100 leading-none">
                {profile.name || "User"}
              </p>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium">
                StudyAI {profile.plan || "Pro"}
              </p>
            </div>
          </button>
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {data.profile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {data.profile.email}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <Settings size={16} className="text-gray-400" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
