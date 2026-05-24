import { useEffect, useMemo, useRef, useState } from "react";
import { useData } from "../store/DataContext";

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

export default function TopNavbar() {
  const { data } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Highly optimized filtering using useMemo referencing Context API Data
  const filteredResults = useMemo(() => {
    if (!debouncedQuery) return [];
    const lowerQuery = debouncedQuery.toLowerCase();

    return [
      {
        category: "Tasks",
        items: data.tasks
          .filter((t) => t.title.toLowerCase().includes(lowerQuery))
          .map((t) => ({ ...t, type: "task" })),
      },
      {
        category: "Subjects",
        items: data.subjects
          .filter((s) => s.title.toLowerCase().includes(lowerQuery))
          .map((s) => ({ ...s, type: "subject" })),
      },
      {
        category: "Focus Sessions",
        items: data.focusSessions.history
          .filter(
            (s) =>
              (s.subjectId &&
                data.subjects
                  .find((sub) => sub.id === s.subjectId)
                  ?.title.toLowerCase()
                  .includes(lowerQuery)) ||
              s.date.toLowerCase().includes(lowerQuery),
          )
          .map((s) => ({
            ...s,
            title: `Focus Session - ${new Date(s.date).toLocaleDateString()}`,
            type: "session",
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
    localStorage.setItem("studyai_recent_searches", JSON.stringify(newRecents));

    // Here you can integrate with your router navigation or action callbacks
    console.log(`Action selected: ${item.type}`, item.title);

    setIsOpen(false);
    setQuery("");
  };

  // Mock Recommendations for Empty State
  const recommendations = [
    "Computer Science 101",
    "Start Pomodoro",
    "Check Analytics",
    "Theme Settings",
  ];

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
                        <div
                          key={`recent-${item.id}`}
                          onClick={() => handleSelect(item)}
                          className="flex items-center px-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{item.title}</span>
                          <span className="ml-auto text-xs text-gray-400 capitalize">
                            {item.type}
                          </span>
                        </div>
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
                          {/* Icon Type Hint */}
                          {item.type === "task" && (
                            <div
                              className={`w-2 h-2 rounded-full mr-3 ${item.color || "bg-green-500"}`}
                            />
                          )}
                          {item.type === "subject" && (
                            <div
                              className={`w-2 h-2 rounded-full mr-3 ${item.color || "bg-blue-500"}`}
                            />
                          )}
                          {item.type === "session" && (
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-3" />
                          )}

                          <div className="flex-1 flex items-center justify-between min-w-0">
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

      {/* Navigation placeholder */}
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full border border-indigo-200 dark:border-indigo-800"></div>
      </div>
    </div>
  );
}
