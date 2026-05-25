import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart2,
  BookOpen,
  CheckCircle,
  History,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../store/DataContext";

const fadeUp = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};
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
  if (!highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span
            key={i}
            className="text-indigo-500 font-semibold bg-indigo-500/10 rounded px-0.5"
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
];

export default function TopNavbar() {
  const { data } = useData();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const profileRef = useRef(null);

  // Load recent searches from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("studyai_recent_searches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

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

  // Highly optimized filtering using useMemo referencing Context API Data
  const filteredResults = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return [];

    const actionResults = staticActions.filter((a) =>
      a.title.toLowerCase().includes(q),
    );

    return [
      {
        category: "Actions",
        items: actionResults,
      },
      {
        category: "Tasks",
        items: data.tasks
          .filter((t) => t.title.toLowerCase().includes(q))
          .map((t) => ({ ...t, type: "task", icon: CheckCircle })),
      },
      {
        category: "Subjects",
        items: data.subjects
          .filter((s) => s.title.toLowerCase().includes(q))
          .map((s) => ({ ...s, type: "subject", icon: BookOpen })),
      },
      {
        category: "Focus Sessions",
        items: data.focus.history
          .filter(
            (s) =>
              (s.subjectId &&
                data.subjects
                  .find((sub) => sub.id === s.subjectId)
                  ?.title.toLowerCase()
                  .includes(q)) ||
              s.date.toLowerCase().includes(q),
          )
          .map((s) => ({
            ...s,
            title: `Focus Session - ${new Date(s.date).toLocaleDateString()}`,
            type: "session",
            icon: History,
          })),
      },
    ].filter((group) => group.items.length > 0);
  }, [debouncedQuery, data]);

  // Flattened items for easy keyboard Up/Down navigation
  const flattenedItems = useMemo(() => {
    return filteredResults.flatMap((group) => group.items);
  }, [filteredResults]);

  // Handle Keyboard Navigation (Arrow keys, Enter, Escape)
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

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (isOpen && resultsRef.current) {
      const activeElement = resultsRef.current.querySelector(
        '[data-active="true"]',
      );
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeIndex, isOpen]);

  const handleSelect = (item) => {
    // Add to recent searches
    const newRecents = [
      item,
      ...recentSearches.filter((i) => i.id !== item.id),
    ].slice(0, 5);
    setRecentSearches(newRecents);
    localStorage.setItem(
      "studyai_recent_searches",
      JSON.stringify(newRecents.map(({ icon, ...rest }) => rest)), // Don't store icon components
    );

    if (item.type === "action") {
      navigate(item.path);
    } else if (item.type === "task") {
      navigate("/tasks");
    } else if (item.type === "subject") {
      navigate("/subjects");
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

  const iconMap = {
    action: Zap,
    task: CheckCircle,
    subject: BookOpen,
    session: History,
  };

  const handleLogout = () => {
    // Placeholder for actual logout logic
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between w-full p-4 bg-white dark:bg-[#09090b] border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex-1 max-w-2xl relative" ref={searchRef}>
        {/* Search Input */}
        <div
          className={`flex items-center w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg transition-all duration-200 ${
            isOpen
              ? "border-indigo-500 ring-4 ring-indigo-500/10 bg-white dark:bg-gray-900"
              : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
          }`}
        >
          <svg
            className="w-5 h-5 ml-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="w-full py-2.5 pl-3 pr-10 text-sm bg-transparent outline-none placeholder-gray-400 text-gray-800 dark:text-gray-100"
            placeholder="Search tasks, subjects, sessions... (Cmd+K)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
          {!isOpen && (
            <div className="absolute right-3 flex items-center space-x-1 text-xs text-gray-400 font-medium border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 bg-white dark:bg-gray-800 shadow-sm">
              <span className="text-[10px]">⌘</span>
              <span>K</span>
            </div>
          )}
        </div>

        {/* Floating Dropdown Results (Command Palette Experience) */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transform opacity-100 scale-100 transition-all origin-top">
            <div
              ref={resultsRef}
              className="max-h-[60vh] overflow-y-auto overscroll-contain py-2"
            >
              {/* State: Empty Query (Show Recents & Recommendations) */}
              {!query && (
                <>
                  {recentSearches.length > 0 && (
                    <div className="px-3 py-1">
                      <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
                        Recent Searches
                      </div>
                      {recentSearches.map((item) => (
                        <ResultItem
                          key={`recent-${item.id}`}
                          item={item}
                          onSelect={handleSelect}
                          Icon={iconMap[item.type] || History}
                          query={""}
                        />
                      ))}
                    </div>
                  )}
                  <div className="px-3 py-1 mt-2">
                    <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
                      Suggestions
                    </div>
                    {recommendations.map((rec, idx) => (
                      <div
                        key={`rec-${idx}`}
                        onClick={() => {
                          setQuery(rec);
                          inputRef.current?.focus();
                        }}
                        className="flex items-center px-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* State: Has Query but No Results */}
              {query && flattenedItems.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800/50 mb-3 text-gray-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    No results found
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    We couldn't find anything matching "{query}"
                  </p>
                </div>
              )}

              {/* State: Showing Filtered Results */}
              {query &&
                filteredResults.map((group) => (
                  <div key={group.category} className="px-2 py-1">
                    <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 mt-2 px-3">
                      {group.category}
                    </div>
                    {group.items.map((item) => {
                      const globalIndex = flattenedItems.findIndex(
                        (i) => i.id === item.id,
                      );
                      const isActive = globalIndex === activeIndex;
                      return (
                        <div
                          key={item.id}
                          data-active={isActive}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                          onClick={() => handleSelect(item)}
                          className={`flex items-center px-3 py-2.5 mx-1 rounded-lg cursor-pointer transition-colors ${
                            isActive
                              ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-200"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <item.icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span className="truncate text-sm font-medium">
                              <Highlight
                                text={item.title}
                                highlight={debouncedQuery}
                              />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 px-4 py-2.5 flex items-center justify-between text-xs text-gray-500 font-medium">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 mr-1 text-[10px] shadow-sm">
                    ↑
                  </kbd>
                  <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 mr-1.5 text-[10px] shadow-sm">
                    ↓
                  </kbd>{" "}
                  navigate
                </span>
                <span className="flex items-center">
                  <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 mr-1.5 text-[10px] shadow-sm">
                    ↵
                  </kbd>{" "}
                  select
                </span>
                <span className="flex items-center">
                  <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 mr-1.5 text-[10px] shadow-sm">
                    esc
                  </kbd>{" "}
                  close
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Dropdown */}
      <div className="flex items-center space-x-4" ref={profileRef}>
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((p) => !p)}
            className="transition-transform duration-200 hover:scale-105"
          >
            <Avatar profile={data.profile} />
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
    </div>
  );
}

function ResultItem({ item, onSelect, Icon, query }) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="flex items-center px-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
    >
      <Icon className="w-4 h-4 mr-3 text-gray-400" />
      <span className="flex-1 truncate">
        {query ? (
          <Highlight text={item.title} highlight={query} />
        ) : (
          item.title
        )}
      </span>
      {item.type && (
        <span
          className="
            ml-auto text-[10px] font-semibold uppercase tracking-wider
            px-1.5 py-0.5 rounded
            bg-gray-100 dark:bg-gray-800
            text-gray-500 dark:text-gray-400
          "
        >
          {item.type}
        </span>
      )}
    </div>
  );
}
