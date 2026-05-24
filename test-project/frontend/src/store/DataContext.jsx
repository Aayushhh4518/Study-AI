/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

/* ─────────────────────────────────────────────────────────────
   ACTION CONSTANTS
───────────────────────────────────────────────────────────── */
export const A = {
  // Tasks
  TASK_ADD: "TASK_ADD",
  TASK_DELETE: "TASK_DELETE",
  TASK_TOGGLE: "TASK_TOGGLE",
  TASK_EDIT: "TASK_EDIT",

  // Subjects
  SUBJECT_ADD: "SUBJECT_ADD",
  SUBJECT_DELETE: "SUBJECT_DELETE",
  SUBJECT_UPDATE: "SUBJECT_UPDATE",
  SUBJECT_UPDATE_PROGRESS: "SUBJECT_UPDATE_PROGRESS",

  // Focus
  FOCUS_RECORD_SESSION: "FOCUS_RECORD_SESSION",

  // Schedule
  SCHEDULE_ADD: "SCHEDULE_ADD",
  SCHEDULE_DELETE: "SCHEDULE_DELETE",
  SCHEDULE_UPDATE: "SCHEDULE_UPDATE",

  // Settings
  SETTINGS_UPDATE: "SETTINGS_UPDATE",

  // Notifications
  NOTIFICATIONS_MARK_READ: "NOTIFICATIONS_MARK_READ",
  NOTIFICATION_ADD: "NOTIFICATION_ADD",

  // Search
  SEARCH_SET: "SEARCH_SET",
};

/* ─────────────────────────────────────────────────────────────
   INITIAL STATE
───────────────────────────────────────────────────────────── */
const now = new Date();
const todayISO = now.toISOString();

const INITIAL_STATE = {
  tasks: [
    {
      id: "t1",
      title: "Complete Physics Lab Report",
      due: "Today, 11:59 PM",
      priority: "High",
      color: "bg-rose-500",
      completed: false,
      subject: "Physics",
      createdAt: todayISO,
    },
    {
      id: "t2",
      title: "Read Chapter 4: Data Structures",
      due: "Tomorrow, 9:00 AM",
      priority: "Medium",
      color: "bg-amber-500",
      completed: false,
      subject: "Computer Science",
      createdAt: todayISO,
    },
    {
      id: "t3",
      title: "Solve 10 Calculus Problems",
      due: "Today, 6:00 PM",
      priority: "High",
      color: "bg-rose-500",
      completed: true,
      subject: "Mathematics",
      createdAt: todayISO,
    },
    {
      id: "t4",
      title: "Review DBMS Normalization Notes",
      due: "In 2 days",
      priority: "Low",
      color: "bg-sky-500",
      completed: false,
      subject: "Database Systems",
      createdAt: todayISO,
    },
  ],

  subjects: [
    {
      id: "s1",
      title: "Computer Science 101",
      progress: 75,
      color: "bg-indigo-500",
      hoursStudied: 24,
    },
    {
      id: "s2",
      title: "Advanced Mathematics",
      progress: 40,
      color: "bg-emerald-500",
      hoursStudied: 18,
    },
    {
      id: "s3",
      title: "Physics",
      progress: 58,
      color: "bg-amber-500",
      hoursStudied: 14,
    },
    {
      id: "s4",
      title: "Database Systems",
      progress: 30,
      color: "bg-pink-500",
      hoursStudied: 10,
    },
  ],

  focusSessions: {
    totalCompleted: 14,
    totalFocusMinutes: 128 * 60,
    history: [
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 0).toISOString(),
        durationMinutes: 25,
        subjectId: "s1",
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 1).toISOString(),
        durationMinutes: 50,
        subjectId: "s2",
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        durationMinutes: 25,
        subjectId: "s1",
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        durationMinutes: 25,
        subjectId: "s3",
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 4).toISOString(),
        durationMinutes: 50,
        subjectId: "s2",
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        durationMinutes: 25,
        subjectId: "s4",
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 86400000 * 6).toISOString(),
        durationMinutes: 25,
        subjectId: "s1",
      },
    ],
  },

  analytics: {
    streakDays: 7,
    lastActiveDate: todayISO,
  },

  schedule: [
    {
      id: "sc1",
      subject: "Data Structures",
      time: "7:00 PM - 8:30 PM",
      type: "Deep Focus",
      color: "from-violet-500 to-indigo-500",
      date: todayISO,
    },
    {
      id: "sc2",
      subject: "DBMS Revision",
      time: "9:00 PM - 10:00 PM",
      type: "Revision",
      color: "from-pink-500 to-rose-500",
      date: todayISO,
    },
    {
      id: "sc3",
      subject: "AI Research",
      time: "10:30 PM - 11:30 PM",
      type: "Research",
      color: "from-cyan-500 to-blue-500",
      date: todayISO,
    },
  ],

  settings: {
    theme: "dark",
    name: "Student",
    email: "student@studyai.app",
    plan: "Pro",
    notificationsEnabled: true,
    aiInsightsEnabled: true,
    pomodoroWorkTime: 25,
    pomodoroBreakTime: 5,
    appearance: "system",
  },

  notifications: [
    {
      id: "n1",
      title: "Focus session complete",
      message: "25 min deep work done",
      time: todayISO,
      read: false,
      type: "success",
    },
    {
      id: "n2",
      title: "AI insight ready",
      message: "New productivity report available",
      time: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      type: "info",
    },
    {
      id: "n3",
      title: "Task deadline soon",
      message: "Physics Lab Report due tonight",
      time: new Date(Date.now() - 10800000).toISOString(),
      read: false,
      type: "warning",
    },
  ],

  searchQuery: "",
};

/* ─────────────────────────────────────────────────────────────
   HELPER UTILITIES
───────────────────────────────────────────────────────────── */

/** Returns a date string YYYY-MM-DD for a given Date object */
function toDateStr(date) {
  return date.toISOString().split("T")[0];
}

/** Clamp a number between min and max */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Recalculate streak given the current state's analytics and a new session timestamp.
 * Returns updated { streakDays, lastActiveDate }.
 */
function recalcStreak(analytics, nowISO) {
  const nowDate = new Date(nowISO);
  const todayStr = toDateStr(nowDate);
  const lastStr = analytics.lastActiveDate
    ? toDateStr(new Date(analytics.lastActiveDate))
    : null;

  if (lastStr === todayStr) {
    // Already active today — streak unchanged
    return analytics;
  }

  const yesterday = new Date(nowDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toDateStr(yesterday);

  const newStreak = lastStr === yesterdayStr ? analytics.streakDays + 1 : 1;

  return { streakDays: newStreak, lastActiveDate: nowISO };
}

/* ─────────────────────────────────────────────────────────────
   REDUCER
───────────────────────────────────────────────────────────── */
function reducer(state, action) {
  switch (action.type) {
    /* ── TASKS ── */
    case A.TASK_ADD:
      return {
        ...state,
        tasks: [
          {
            id: uuidv4(),
            completed: false,
            createdAt: new Date().toISOString(),
            ...action.payload,
          },
          ...state.tasks,
        ],
      };

    case A.TASK_DELETE:
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case A.TASK_TOGGLE:
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t,
        ),
      };

    case A.TASK_EDIT:
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t,
        ),
      };

    /* ── SUBJECTS ── */
    case A.SUBJECT_ADD:
      return {
        ...state,
        subjects: [
          ...state.subjects,
          { id: uuidv4(), progress: 0, hoursStudied: 0, ...action.payload },
        ],
      };

    case A.SUBJECT_DELETE:
      return {
        ...state,
        subjects: state.subjects.filter((s) => s.id !== action.payload),
      };

    case A.SUBJECT_UPDATE:
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s,
        ),
      };

    case A.SUBJECT_UPDATE_PROGRESS:
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === action.payload.id
            ? { ...s, progress: clamp(action.payload.progress, 0, 100) }
            : s,
        ),
      };

    /* ── FOCUS ── */
    case A.FOCUS_RECORD_SESSION: {
      const { durationMinutes = 25, subjectId = null } = action.payload;
      const nowISO = new Date().toISOString();
      return {
        ...state,
        focusSessions: {
          ...state.focusSessions,
          totalCompleted: state.focusSessions.totalCompleted + 1,
          totalFocusMinutes:
            state.focusSessions.totalFocusMinutes + durationMinutes,
          history: [
            ...state.focusSessions.history,
            { id: uuidv4(), date: nowISO, durationMinutes, subjectId },
          ],
        },
        analytics: recalcStreak(state.analytics, nowISO),
      };
    }

    /* ── SCHEDULE ── */
    case A.SCHEDULE_ADD:
      return {
        ...state,
        schedule: [...state.schedule, { id: uuidv4(), ...action.payload }],
      };

    case A.SCHEDULE_DELETE:
      return {
        ...state,
        schedule: state.schedule.filter((s) => s.id !== action.payload),
      };

    case A.SCHEDULE_UPDATE:
      return {
        ...state,
        schedule: state.schedule.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s,
        ),
      };

    /* ── SETTINGS ── */
    case A.SETTINGS_UPDATE:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    /* ── NOTIFICATIONS ── */
    case A.NOTIFICATIONS_MARK_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case A.NOTIFICATION_ADD:
      return {
        ...state,
        notifications: [
          {
            id: uuidv4(),
            time: new Date().toISOString(),
            read: false,
            ...action.payload,
          },
          ...state.notifications,
        ],
      };

    /* ── SEARCH ── */
    case A.SEARCH_SET:
      return { ...state, searchQuery: action.payload };

    default:
      return state;
  }
}

/* ─────────────────────────────────────────────────────────────
   PERSISTENCE HELPERS
───────────────────────────────────────────────────────────── */
const STORAGE_KEY = "studyai_data_v2";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const saved = JSON.parse(raw);
    // Deep merge: saved data wins, but new keys from INITIAL_STATE are added
    return {
      ...INITIAL_STATE,
      ...saved,
      settings: { ...INITIAL_STATE.settings, ...(saved.settings || {}) },
      analytics: { ...INITIAL_STATE.analytics, ...(saved.analytics || {}) },
      focusSessions: {
        ...INITIAL_STATE.focusSessions,
        ...(saved.focusSessions || {}),
      },
      notifications: saved.notifications ?? INITIAL_STATE.notifications,
      schedule: saved.schedule ?? INITIAL_STATE.schedule,
      searchQuery: "", // never persist search query
    };
  } catch {
    return INITIAL_STATE;
  }
}

function saveState(state) {
  try {
    // Don't persist transient search query
    // eslint-disable-next-line no-unused-vars
    const { searchQuery, ...persisted } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // Quota exceeded or private mode — fail silently
  }
}

/* ─────────────────────────────────────────────────────────────
   SELECTORS  (pure functions — memoized in context via useMemo)
───────────────────────────────────────────────────────────── */

/** Core task counters */
function selectTaskStats(tasks) {
  const completed = tasks.filter((t) => t.completed).length;
  return {
    total: tasks.length,
    completed,
    pending: tasks.length - completed,
    highPriority: tasks.filter((t) => t.priority === "High" && !t.completed)
      .length,
  };
}

/** Core focus / productivity stats */
function selectFocusStats(focusSessions, analytics) {
  const totalHours =
    Math.round((focusSessions.totalFocusMinutes / 60) * 10) / 10;
  return {
    totalCompleted: focusSessions.totalCompleted,
    totalHours,
    streak: analytics.streakDays,
  };
}

/** Dynamic productivity score (0–100) */
function selectProductivityScore(tasks, focusSessions) {
  const completed = tasks.filter((t) => t.completed).length;
  const score = clamp(
    Math.round(50 + completed * 2 + focusSessions.totalCompleted * 1.5),
    0,
    100,
  );
  return score;
}

/**
 * Build a 7-day chart dataset.
 * Returns array of { day, focus, tasks } for Recharts.
 */
function selectWeeklyChartData(focusSessions, tasks) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = toDateStr(d);
    const dayLabel = days[d.getDay()];

    const focusHours =
      focusSessions.history
        .filter((s) => toDateStr(new Date(s.date)) === dateStr)
        .reduce((acc, s) => acc + s.durationMinutes, 0) / 60;

    const tasksCompleted = tasks.filter(
      (t) => t.completed && toDateStr(new Date(t.createdAt)) === dateStr,
    ).length;

    return {
      day: dayLabel,
      focus: Math.round(focusHours * 10) / 10,
      tasks: tasksCompleted,
    };
  });
}

/**
 * Weekly productivity trend (last 4 weeks as % change).
 * Returns array of { week, score }.
 */
function selectWeeklyTrend(focusSessions, tasks) {
  const today = new Date();
  return Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (3 - i) * 7 - 6);
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() - (3 - i) * 7);

    const focusMins = focusSessions.history
      .filter((s) => {
        const d = new Date(s.date);
        return d >= weekStart && d <= weekEnd;
      })
      .reduce((acc, s) => acc + s.durationMinutes, 0);

    const completedTasks = tasks.filter((t) => {
      const d = new Date(t.createdAt);
      return t.completed && d >= weekStart && d <= weekEnd;
    }).length;

    return {
      week: `W${i + 1}`,
      score: clamp(
        Math.round((focusMins / 60) * 5 + completedTasks * 3),
        0,
        100,
      ),
    };
  });
}

/** Search filter across tasks, subjects, schedule */
function selectSearchResults(state) {
  const q = state.searchQuery.toLowerCase().trim();
  if (!q) return { tasks: [], subjects: [], schedule: [] };
  return {
    tasks: state.tasks.filter((t) => t.title.toLowerCase().includes(q)),
    subjects: state.subjects.filter((s) => s.title.toLowerCase().includes(q)),
    schedule: state.schedule.filter((s) => s.subject.toLowerCase().includes(q)),
  };
}

/* ─────────────────────────────────────────────────────────────
   AI INSIGHT ENGINE
───────────────────────────────────────────────────────────── */
function generateAIInsights(state, productivityScore) {
  const { tasks, focusSessions, analytics, subjects } = state;
  const insights = [];

  const pendingHigh = tasks.filter(
    (t) => t.priority === "High" && !t.completed,
  ).length;
  const completedAny = tasks.filter((t) => t.completed).length;
  const streak = analytics.streakDays;

  // 1. Streak insight
  if (streak >= 7) {
    insights.push({
      id: "ai-streak-7",
      title: "Elite Consistency",
      desc: `${streak}-day streak! You're in the top tier of learners. Protect your rhythm.`,
      tag: `${streak}d streak`,
      type: "motivational",
      accent: "violet",
    });
  } else if (streak >= 3) {
    insights.push({
      id: "ai-streak-3",
      title: "Momentum Building",
      desc: `${streak}-day streak active. Consistency is your compound interest — keep going.`,
      tag: `${streak}d streak`,
      type: "motivational",
      accent: "cyan",
    });
  } else if (streak === 0) {
    insights.push({
      id: "ai-streak-zero",
      title: "Restart Today",
      desc: "Complete one focus session to rebuild your streak and reactivate your momentum.",
      tag: "Action needed",
      type: "warning",
      accent: "amber",
    });
  }

  // 2. High priority task alert
  if (pendingHigh > 0) {
    insights.push({
      id: "ai-highpriority",
      title: "High Priority Alert",
      desc: `${pendingHigh} high-priority task${pendingHigh > 1 ? "s" : ""} pending. Address these first for maximum impact.`,
      tag: `${pendingHigh} urgent`,
      type: "warning",
      accent: "rose",
    });
  }

  // 3. Task completion praise
  if (completedAny >= 5) {
    insights.push({
      id: "ai-tasks-great",
      title: "Task Crusher",
      desc: `${completedAny} tasks completed. You're operating at peak efficiency.`,
      tag: `+${completedAny} done`,
      type: "motivational",
      accent: "emerald",
    });
  } else if (completedAny >= 2) {
    insights.push({
      id: "ai-tasks-good",
      title: "Good Progress",
      desc: `${completedAny} tasks done. Keep chipping away — consistency beats intensity.`,
      tag: `${completedAny} done`,
      type: "insight",
      accent: "cyan",
    });
  }

  // 4. Pomodoro long-break reminder
  const completed = focusSessions.totalCompleted;
  if (completed > 0 && completed % 4 === 0) {
    insights.push({
      id: "ai-longbreak",
      title: "Long Break Due",
      desc: "You've completed 4 Pomodoro cycles. Take a 15–30 min break to consolidate memory.",
      tag: "Rest cycle",
      type: "insight",
      accent: "indigo",
    });
  }

  // 5. Weak subject nudge
  const weakSubject = subjects
    .slice()
    .sort((a, b) => a.progress - b.progress)[0];
  if (weakSubject && weakSubject.progress < 50) {
    insights.push({
      id: "ai-weak-subject",
      title: "Focus Gap Detected",
      desc: `${weakSubject.title} is at ${weakSubject.progress}% progress. Prioritize it this week.`,
      tag: `${weakSubject.progress}% done`,
      type: "recommendation",
      accent: "amber",
    });
  }

  // 6. Productivity score insight
  if (productivityScore >= 85) {
    insights.push({
      id: "ai-score-high",
      title: "Peak Productivity",
      desc: `Productivity score: ${productivityScore}/100. You're firing on all cylinders today.`,
      tag: `Score ${productivityScore}`,
      type: "motivational",
      accent: "violet",
    });
  } else if (productivityScore < 60) {
    insights.push({
      id: "ai-score-low",
      title: "Boost Needed",
      desc: `Score ${productivityScore}/100. Complete 2 tasks and a focus session to lift your numbers.`,
      tag: `Score ${productivityScore}`,
      type: "recommendation",
      accent: "amber",
    });
  }

  // 7. Default padders (ensure minimum 3 cards always shown)
  if (insights.length < 3) {
    insights.push({
      id: "ai-spaced-rep",
      title: "Spaced Repetition",
      desc: "Review material from 2 days ago to significantly increase long-term retention.",
      tag: "Memory tip",
      type: "insight",
      accent: "cyan",
    });
  }
  if (insights.length < 3) {
    insights.push({
      id: "ai-optimal-time",
      title: "Optimal Study Window",
      desc: "AI detects your peak focus window is 7 PM – 9 PM. Schedule hard topics then.",
      tag: "7–9 PM",
      type: "recommendation",
      accent: "indigo",
    });
  }

  return insights.slice(0, 5);
}

/* ─────────────────────────────────────────────────────────────
   CONTEXT
───────────────────────────────────────────────────────────── */
const DataContext = createContext(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
};

/* ─────────────────────────────────────────────────────────────
   PROVIDER
───────────────────────────────────────────────────────────── */
export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  /* Persist every state change (debounce not needed — localStorage is sync & fast) */
  useEffect(() => {
    saveState(state);
  }, [state]);

  /* Apply persisted theme class to <html> */
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(state.settings.theme);
  }, [state.settings.theme]);

  /* ── Memoized selectors ── */

  const taskStats = useMemo(() => selectTaskStats(state.tasks), [state.tasks]);

  const focusStats = useMemo(
    () => selectFocusStats(state.focusSessions, state.analytics),
    [state.focusSessions, state.analytics],
  );

  const productivityScore = useMemo(
    () => selectProductivityScore(state.tasks, state.focusSessions),
    [state.tasks, state.focusSessions],
  );

  const weeklyChartData = useMemo(
    () => selectWeeklyChartData(state.focusSessions, state.tasks),
    [state.focusSessions, state.tasks],
  );

  const weeklyTrend = useMemo(
    () => selectWeeklyTrend(state.focusSessions, state.tasks),
    [state.focusSessions, state.tasks],
  );

  const aiInsights = useMemo(
    () => generateAIInsights(state, productivityScore),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state.tasks,
      state.focusSessions,
      state.analytics,
      state.subjects,
      productivityScore,
    ],
  );

  const searchResults = useMemo(
    () => selectSearchResults(state),
    [state.searchQuery, state.tasks, state.subjects, state.schedule],
  );

  const unreadNotifications = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications],
  );

  /* ── Action dispatchers (stable references via useCallback) ── */

  const addTask = useCallback((task) => {
    dispatch({ type: A.TASK_ADD, payload: task });
    toast.success("Task added!");
  }, []);

  const deleteTask = useCallback((id) => {
    dispatch({ type: A.TASK_DELETE, payload: id });
    toast.success("Task removed.");
  }, []);

  const toggleTask = useCallback((id) => {
    dispatch({ type: A.TASK_TOGGLE, payload: id });
  }, []);

  const editTask = useCallback((id, updates) => {
    dispatch({ type: A.TASK_EDIT, payload: { id, updates } });
    toast.success("Task updated.");
  }, []);

  const addSubject = useCallback((subject) => {
    dispatch({ type: A.SUBJECT_ADD, payload: subject });
    toast.success("Subject added!");
  }, []);

  const deleteSubject = useCallback((id) => {
    dispatch({ type: A.SUBJECT_DELETE, payload: id });
  }, []);

  const updateSubject = useCallback((id, updates) => {
    dispatch({ type: A.SUBJECT_UPDATE, payload: { id, updates } });
    toast.success("Subject updated.");
  }, []);

  const updateSubjectProgress = useCallback((id, progress) => {
    dispatch({ type: A.SUBJECT_UPDATE_PROGRESS, payload: { id, progress } });
  }, []);

  const recordFocusSession = useCallback(
    (durationMinutes = 25, subjectId = null) => {
      dispatch({
        type: A.FOCUS_RECORD_SESSION,
        payload: { durationMinutes, subjectId },
      });
      dispatch({
        type: A.NOTIFICATION_ADD,
        payload: {
          title: "Focus session complete",
          message: `${durationMinutes} min deep work logged.`,
          type: "success",
        },
      });
      toast.success(`${durationMinutes} min session logged!`);
    },
    [],
  );

  const addScheduleSession = useCallback((session) => {
    dispatch({ type: A.SCHEDULE_ADD, payload: session });
    toast.success("Session scheduled.");
  }, []);

  const deleteScheduleSession = useCallback((id) => {
    dispatch({ type: A.SCHEDULE_DELETE, payload: id });
  }, []);

  const updateScheduleSession = useCallback((id, updates) => {
    dispatch({ type: A.SCHEDULE_UPDATE, payload: { id, updates } });
  }, []);

  const updateSettings = useCallback((newSettings) => {
    dispatch({ type: A.SETTINGS_UPDATE, payload: newSettings });
    toast.success("Settings saved.");
  }, []);

  const markNotificationsRead = useCallback(() => {
    dispatch({ type: A.NOTIFICATIONS_MARK_READ });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: A.SEARCH_SET, payload: query });
  }, []);

  /* ── Unified stats object consumed by Dashboard / Analytics ── */
  const stats = useMemo(
    () => ({
      // Tasks
      totalTasks: taskStats.total,
      completedTasks: taskStats.completed,
      pendingTasks: taskStats.pending,
      highPriorityTasks: taskStats.highPriority,
      // Focus
      totalFocusHours: focusStats.totalHours,
      focusSessions: focusStats.totalCompleted,
      streak: focusStats.streak,
      // Subjects
      totalSubjects: state.subjects.length,
      activeSubjects: state.subjects.filter(
        (s) => s.progress > 0 && s.progress < 100,
      ).length,
      // Score
      productivityScore,
    }),
    [taskStats, focusStats, productivityScore, state.subjects],
  );

  /* ── Final context value — stable shape ── */
  const value = useMemo(
    () => ({
      // Raw state slices (read-only)
      data: {
        tasks: state.tasks,
        subjects: state.subjects,
        focusSessions: state.focusSessions,
        analytics: state.analytics,
        schedule: state.schedule,
        settings: state.settings,
        notifications: state.notifications,
      },

      // Derived / computed
      stats,
      aiInsights,
      weeklyChartData,
      weeklyTrend,
      searchQuery: state.searchQuery,
      searchResults,
      unreadNotifications,
      productivityScore,

      // Task actions
      addTask,
      deleteTask,
      toggleTask,
      editTask,

      // Subject actions
      addSubject,
      deleteSubject,
      updateSubject,
      updateSubjectProgress,

      // Focus actions
      recordFocusSession,

      // Schedule actions
      addScheduleSession,
      deleteScheduleSession,
      updateScheduleSession,

      // Settings actions
      updateSettings,

      // Notification actions
      markNotificationsRead,

      // Search
      setSearchQuery,
    }),
    [
      state.tasks,
      state.subjects,
      state.focusSessions,
      state.analytics,
      state.schedule,
      state.settings,
      state.notifications,
      state.searchQuery,
      stats,
      aiInsights,
      weeklyChartData,
      weeklyTrend,
      searchResults,
      unreadNotifications,
      productivityScore,
      addTask,
      deleteTask,
      toggleTask,
      editTask,
      addSubject,
      deleteSubject,
      updateSubject,
      updateSubjectProgress,
      recordFocusSession,
      addScheduleSession,
      deleteScheduleSession,
      updateScheduleSession,
      updateSettings,
      markNotificationsRead,
      setSearchQuery,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
