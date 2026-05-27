/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import {
  createSubjectApi,
  deleteSubjectApi,
  fetchSubjects,
  updateSubjectApi,
} from "../api/subjectApi";
import {
  createTaskApi,
  deleteTaskApi,
  fetchTasks,
  updateTaskApi,
} from "../api/taskApi";

const mapBackendTaskToFrontend = (backendTask) => {
  if (!backendTask) return null;
  return {
    ...backendTask,
    id: backendTask._id || backendTask.id,
    title: backendTask.title,
    due: backendTask.dueDate || backendTask.due,
    color: PRIORITY_COLOR[backendTask.priority] || "bg-zinc-500",
  };
};

const mapBackendSubjectToFrontend = (s) => {
  if (!s) return null;
  return {
    ...s,
    id: s._id || s.id,
    title: s.name || s.title,
    name: s.name || s.title,
    color: s.color || "bg-indigo-500",
    progress: s.progress || 0,
    hoursStudied: s.studyHours || s.hoursStudied || 0,
    targetHours: s.targetHours || 30,
    lastStudied: s.updatedAt || s.createdAt || nowISO(),
  };
};

/* ═══════════════════════════════════════════════════════════════
   ACTION CONSTANTS
═══════════════════════════════════════════════════════════════ */
export const A = {
  TASKS_SET: "TASKS_SET",
  TASK_ADD: "TASK_ADD",
  TASK_DELETE: "TASK_DELETE",
  TASK_TOGGLE: "TASK_TOGGLE",
  TASK_EDIT: "TASK_EDIT",
  TASK_REORDER: "TASK_REORDER",

  SUBJECTS_SET: "SUBJECTS_SET",
  SUBJECT_ADD: "SUBJECT_ADD",
  SUBJECT_DELETE: "SUBJECT_DELETE",
  SUBJECT_UPDATE: "SUBJECT_UPDATE",
  SUBJECT_UPDATE_PROGRESS: "SUBJECT_UPDATE_PROGRESS",
  SUBJECT_LOG_HOURS: "SUBJECT_LOG_HOURS",

  FOCUS_START: "FOCUS_START",
  FOCUS_PAUSE: "FOCUS_PAUSE",
  FOCUS_RESET: "FOCUS_RESET",
  FOCUS_RECORD_SESSION: "FOCUS_RECORD_SESSION",
  FOCUS_SET_MODE: "FOCUS_SET_MODE",

  SCHEDULE_ADD: "SCHEDULE_ADD",
  SCHEDULE_DELETE: "SCHEDULE_DELETE",
  SCHEDULE_UPDATE: "SCHEDULE_UPDATE",

  SETTINGS_UPDATE: "SETTINGS_UPDATE",
  PROFILE_UPDATE: "PROFILE_UPDATE",

  NOTIFICATION_ADD: "NOTIFICATION_ADD",
  NOTIFICATION_READ: "NOTIFICATION_READ",
  NOTIFICATIONS_MARK_READ: "NOTIFICATIONS_MARK_READ",
  NOTIFICATION_DELETE: "NOTIFICATION_DELETE",
  NOTIFICATION_CLEAR: "NOTIFICATION_CLEAR",

  SEARCH_SET: "SEARCH_SET",

  STATE_RESET: "STATE_RESET",
};

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const STORAGE_KEY = "studyai_v3";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PRIORITY_COLOR = {
  High: "bg-rose-500",
  Medium: "bg-amber-500",
  Low: "bg-sky-500",
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
const toDateStr = (d) => new Date(d).toISOString().split("T")[0];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const todayStr = () => toDateStr(new Date());
const nowISO = () => new Date().toISOString();

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function recalcStreak(analytics, timestamp) {
  const today = todayStr();
  const lastDate = analytics.lastActiveDate
    ? toDateStr(analytics.lastActiveDate)
    : null;
  if (lastDate === today) return analytics; // already active today

  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const newStreak = lastDate === toDateStr(yest) ? analytics.streakDays + 1 : 1;
  return { streakDays: newStreak, lastActiveDate: timestamp };
}

/* ═══════════════════════════════════════════════════════════════
   INITIAL STATE
═══════════════════════════════════════════════════════════════ */
function buildInitialState() {
  const t = nowISO();
  return {
    /* ── profile ── */
    profile: {
      name: "Student",
      email: "student@studyai.app",
      avatar: null, // base64 or URL
      plan: "Pro",
      joinedAt: t,
    },

    /* ── settings ── */
    settings: {
      theme: "dark",
      reducedMotion: false,
      aiInsightsEnabled: true,
      smartRecommendations: true,
      aiStrictness: "balanced",
      notificationsEnabled: true,
      emailNotifications: false,
      motivationalAlerts: true,
      soundEnabled: true,
      pomodoroWorkTime: 25,
      pomodoroBreakTime: 5,
      pomodoroLongBreak: 15,
      autoStartBreaks: false,
      dailyGoalHours: 4,
      weekStartsOn: "Mon",
    },

    /* ── tasks ── */
    tasks: [],

    /* ── subjects ── */
    subjects: [
      {
        id: "s1",
        title: "Computer Science 101",
        progress: 75,
        color: "bg-indigo-500",
        hoursStudied: 24,
        targetHours: 40,
        lastStudied: daysAgo(0),
      },
      {
        id: "s2",
        title: "Advanced Mathematics",
        progress: 40,
        color: "bg-emerald-500",
        hoursStudied: 18,
        targetHours: 40,
        lastStudied: daysAgo(1),
      },
      {
        id: "s3",
        title: "Physics",
        progress: 58,
        color: "bg-amber-500",
        hoursStudied: 14,
        targetHours: 30,
        lastStudied: daysAgo(2),
      },
      {
        id: "s4",
        title: "Database Systems",
        progress: 30,
        color: "bg-pink-500",
        hoursStudied: 10,
        targetHours: 30,
        lastStudied: daysAgo(3),
      },
    ],

    /* ── focus ── */
    focus: {
      isRunning: false,
      mode: "work", // "work" | "break" | "longBreak"
      secondsLeft: 25 * 60,
      currentSubjectId: null,
      totalCompleted: 14,
      totalFocusMinutes: 128 * 60,
      history: [
        {
          id: uuidv4(),
          date: daysAgo(0),
          durationMinutes: 25,
          subjectId: "s1",
          mode: "work",
        },
        {
          id: uuidv4(),
          date: daysAgo(1),
          durationMinutes: 50,
          subjectId: "s2",
          mode: "work",
        },
        {
          id: uuidv4(),
          date: daysAgo(1),
          durationMinutes: 25,
          subjectId: "s2",
          mode: "work",
        },
        {
          id: uuidv4(),
          date: daysAgo(2),
          durationMinutes: 25,
          subjectId: "s1",
          mode: "work",
        },
        {
          id: uuidv4(),
          date: daysAgo(3),
          durationMinutes: 25,
          subjectId: "s3",
          mode: "work",
        },
        {
          id: uuidv4(),
          date: daysAgo(4),
          durationMinutes: 50,
          subjectId: "s2",
          mode: "work",
        },
        {
          id: uuidv4(),
          date: daysAgo(5),
          durationMinutes: 25,
          subjectId: "s4",
          mode: "work",
        },
        {
          id: uuidv4(),
          date: daysAgo(6),
          durationMinutes: 25,
          subjectId: "s1",
          mode: "work",
        },
      ],
    },

    /* ── analytics ── */
    analytics: {
      streakDays: 7,
      lastActiveDate: t,
      longestStreak: 7,
    },

    /* ── schedule ── */
    schedule: [
      {
        id: "sc1",
        subject: "Data Structures",
        time: "7:00 PM - 8:30 PM",
        type: "Deep Focus",
        color: "from-violet-500 to-indigo-500",
        date: t,
      },
      {
        id: "sc2",
        subject: "DBMS Revision",
        time: "9:00 PM - 10:00 PM",
        type: "Revision",
        color: "from-pink-500 to-rose-500",
        date: t,
      },
      {
        id: "sc3",
        subject: "AI Research",
        time: "10:30 PM - 11:30 PM",
        type: "Research",
        color: "from-cyan-500 to-blue-500",
        date: t,
      },
    ],

    /* ── notifications ── */
    notifications: [
      {
        id: "n1",
        title: "Focus session complete",
        message: "25 min deep work done",
        time: t,
        read: false,
        type: "success",
      },
      {
        id: "n2",
        title: "AI insight ready",
        message: "New productivity report",
        time: daysAgo(0),
        read: false,
        type: "info",
      },
      {
        id: "n3",
        title: "Task deadline soon",
        message: "Physics Lab Report due tonight",
        time: daysAgo(0),
        read: false,
        type: "warning",
      },
    ],

    /* ── search ── */
    searchQuery: "",
  };
}

const INITIAL_STATE = buildInitialState();

/* ═══════════════════════════════════════════════════════════════
   REDUCER
═══════════════════════════════════════════════════════════════ */
function reducer(state, { type, payload }) {
  switch (type) {
    /* ── TASKS ── */
    case A.TASKS_SET:
      return { ...state, tasks: payload };

    case A.TASK_ADD:
      return {
        ...state,
        tasks: [payload, ...state.tasks],
      };

    case A.TASK_DELETE:
      return { ...state, tasks: state.tasks.filter((t) => t.id !== payload) };

    case A.TASK_TOGGLE: {
      const toggled = state.tasks.map((t) =>
        t.id === payload
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? nowISO() : null,
            }
          : t,
      );
      return { ...state, tasks: toggled };
    }

    case A.TASK_EDIT:
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === payload.id
            ? {
                ...t,
                ...payload.updates,
                color: PRIORITY_COLOR[payload.updates.priority] ?? t.color,
              }
            : t,
        ),
      };

    case A.TASK_REORDER:
      return { ...state, tasks: payload };

    /* ── SUBJECTS ── */
    case A.SUBJECTS_SET:
      return { ...state, subjects: payload };

    case A.SUBJECT_ADD:
      return {
        ...state,
        subjects: [...state.subjects, payload],
      };

    case A.SUBJECT_DELETE:
      return {
        ...state,
        subjects: state.subjects.filter((s) => s.id !== payload),
      };

    case A.SUBJECT_UPDATE:
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === payload.id ? { ...s, ...payload.updates } : s,
        ),
      };

    case A.SUBJECT_UPDATE_PROGRESS:
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === payload.id
            ? { ...s, progress: clamp(payload.progress, 0, 100) }
            : s,
        ),
      };

    case A.SUBJECT_LOG_HOURS:
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === payload.id
            ? {
                ...s,
                hoursStudied: s.hoursStudied + payload.hours,
                lastStudied: nowISO(),
              }
            : s,
        ),
      };

    /* ── FOCUS ── */
    case A.FOCUS_START:
      return {
        ...state,
        focus: {
          ...state.focus,
          isRunning: true,
          currentSubjectId: payload?.subjectId ?? state.focus.currentSubjectId,
        },
      };

    case A.FOCUS_PAUSE:
      return { ...state, focus: { ...state.focus, isRunning: false } };

    case A.FOCUS_RESET:
      return {
        ...state,
        focus: {
          ...state.focus,
          isRunning: false,
          secondsLeft:
            (payload?.workTime ?? state.settings.pomodoroWorkTime) * 60,
          mode: "work",
        },
      };

    case A.FOCUS_SET_MODE: {
      const modeSeconds = {
        work: state.settings.pomodoroWorkTime * 60,
        break: state.settings.pomodoroBreakTime * 60,
        longBreak: state.settings.pomodoroLongBreak * 60,
      };
      return {
        ...state,
        focus: {
          ...state.focus,
          mode: payload,
          isRunning: false,
          secondsLeft: modeSeconds[payload],
        },
      };
    }

    case A.FOCUS_RECORD_SESSION: {
      const { durationMinutes = 25, subjectId = null, mode = "work" } = payload;
      const ts = nowISO();
      const newAnalytics = recalcStreak(state.analytics, ts);
      return {
        ...state,
        focus: {
          ...state.focus,
          isRunning: false,
          totalCompleted: state.focus.totalCompleted + 1,
          totalFocusMinutes: state.focus.totalFocusMinutes + durationMinutes,
          secondsLeft: state.settings.pomodoroWorkTime * 60,
          mode: "work",
          history: [
            ...state.focus.history,
            { id: uuidv4(), date: ts, durationMinutes, subjectId, mode },
          ],
        },
        analytics: {
          ...newAnalytics,
          longestStreak: Math.max(
            state.analytics.longestStreak,
            newAnalytics.streakDays,
          ),
        },
      };
    }

    /* ── SCHEDULE ── */
    case A.SCHEDULE_ADD:
      return {
        ...state,
        schedule: [...state.schedule, { id: uuidv4(), ...payload }],
      };

    case A.SCHEDULE_DELETE:
      return {
        ...state,
        schedule: state.schedule.filter((s) => s.id !== payload),
      };

    case A.SCHEDULE_UPDATE:
      return {
        ...state,
        schedule: state.schedule.map((s) =>
          s.id === payload.id ? { ...s, ...payload.updates } : s,
        ),
      };

    /* ── SETTINGS & PROFILE ── */
    case A.SETTINGS_UPDATE:
      return { ...state, settings: { ...state.settings, ...payload } };

    case A.PROFILE_UPDATE:
      return { ...state, profile: { ...state.profile, ...payload } };

    /* ── NOTIFICATIONS ── */
    case A.NOTIFICATION_ADD:
      return {
        ...state,
        notifications: [
          {
            id: uuidv4(),
            time: nowISO(),
            read: false,
            ...payload,
          },
          ...state.notifications,
        ].slice(0, 50), // cap at 50
      };

    case A.NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === payload ? { ...n, read: true } : n,
        ),
      };

    case A.NOTIFICATIONS_MARK_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case A.NOTIFICATION_DELETE:
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== payload),
      };

    case A.NOTIFICATION_CLEAR:
      return {
        ...state,
        notifications: [],
      };

    /* ── SEARCH ── */
    case A.SEARCH_SET:
      return { ...state, searchQuery: payload };

    /* ── RESET ── */
    case A.STATE_RESET:
      return buildInitialState();

    default:
      return state;
  }
}

/* ═══════════════════════════════════════════════════════════════
   PERSISTENCE
═══════════════════════════════════════════════════════════════ */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const saved = JSON.parse(raw);
    return {
      ...INITIAL_STATE,
      ...saved,
      profile: { ...INITIAL_STATE.profile, ...(saved.profile || {}) },
      settings: { ...INITIAL_STATE.settings, ...(saved.settings || {}) },
      analytics: { ...INITIAL_STATE.analytics, ...(saved.analytics || {}) },
      focus: {
        ...INITIAL_STATE.focus,
        ...(saved.focus || {}),
        isRunning: false, // never restore a running timer
      },
      notifications: saved.notifications ?? INITIAL_STATE.notifications,
      tasks: [], // Tasks are now fetched from backend, not localStorage
      subjects: [], // Subjects are now fetched from backend, not localStorage
      schedule: saved.schedule ?? INITIAL_STATE.schedule,
      searchQuery: "", // transient — never restore
    };
  } catch {
    return INITIAL_STATE;
  }
}

function saveState(state) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { searchQuery, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    /* quota / private mode */
  }
}

/* ═══════════════════════════════════════════════════════════════
   SELECTORS  — pure functions, memoized in provider
═══════════════════════════════════════════════════════════════ */

function sel_taskStats(tasks = []) {
  const safeTasks = tasks || [];
  const completed = safeTasks.filter((t) => t.completed).length;
  const highPending = safeTasks.filter(
    (t) => t.priority === "High" && !t.completed,
  ).length;
  return {
    total: safeTasks.length,
    completed,
    pending: safeTasks.length - completed,
    highPending,
  };
}

function sel_focusStats(focus, analytics) {
  return {
    totalCompleted: focus.totalCompleted,
    totalHours: Math.round((focus.totalFocusMinutes / 60) * 10) / 10,
    streak: analytics.streakDays,
    longestStreak: analytics.longestStreak,
  };
}

function sel_productivityScore(tasks = []) {
  const safeTasks = tasks || [];
  if (safeTasks.length === 0) return 0;
  const done = safeTasks.filter((t) => t.completed).length;
  return clamp(Math.round((done / safeTasks.length) * 100), 0, 100);
}

function sel_weeklyChartData(focus, tasks) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const ds = toDateStr(d);
    const focusH =
      focus.history
        .filter((s) => toDateStr(s.date) === ds && s.mode === "work")
        .reduce((a, s) => a + s.durationMinutes, 0) / 60;
    const tasksDone = tasks.filter(
      (t) => t.completed && toDateStr(t.createdAt) === ds,
    ).length;
    return {
      day: DAYS[d.getDay()],
      focus: Math.round(focusH * 10) / 10,
      tasks: tasksDone,
    };
  });
}

function sel_weeklyTrend(focus, tasks) {
  const today = new Date();
  return Array.from({ length: 4 }, (_, i) => {
    const start = new Date(today);
    start.setDate(today.getDate() - (3 - i) * 7 - 6);
    const end = new Date(today);
    end.setDate(today.getDate() - (3 - i) * 7);
    const mins = focus.history
      .filter((s) => {
        const d = new Date(s.date);
        return d >= start && d <= end;
      })
      .reduce((a, s) => a + s.durationMinutes, 0);
    const done = tasks.filter((t) => {
      const d = new Date(t.createdAt);
      return t.completed && d >= start && d <= end;
    }).length;
    return {
      week: `W${i + 1}`,
      score: clamp(Math.round((mins / 60) * 5 + done * 3), 0, 100),
    };
  });
}

function sel_subjectAnalytics(subjects, focus) {
  return subjects.map((s) => {
    const hours =
      focus.history
        .filter((h) => h.subjectId === s.id)
        .reduce((a, h) => a + h.durationMinutes, 0) / 60;
    return {
      ...s,
      totalFocusHours: Math.round(hours * 10) / 10,
      completionRate:
        s.targetHours > 0
          ? clamp(Math.round((s.hoursStudied / s.targetHours) * 100), 0, 100)
          : s.progress,
    };
  });
}

function sel_searchResults(searchQuery, tasks, subjects, schedule) {
  const q = searchQuery.toLowerCase().trim();
  if (!q) return { tasks: [], subjects: [], schedule: [] };
  return {
    tasks: tasks.filter((t) => t.title.toLowerCase().includes(q)),
    subjects: subjects.filter((s) => s.title.toLowerCase().includes(q)),
    schedule: schedule.filter((s) => s.subject.toLowerCase().includes(q)),
  };
}

/* ═══════════════════════════════════════════════════════════════
   AI INSIGHT ENGINE
═══════════════════════════════════════════════════════════════ */
function generateAIInsights(state, score) {
  const { tasks = [], focus, analytics, subjects = [], settings } = state;
  const insights = [];

  if (!settings.aiInsightsEnabled) {
    return [
      {
        id: "ai_disabled",
        title: "AI Insights Disabled",
        desc: "Enable AI Insights in your settings to receive personalized productivity recommendations.",
        tag: "Settings",
        accent: "amber",
        type: "info",
      },
    ];
  }

  const highPending = tasks.filter(
    (t) => t.priority === "High" && !t.completed,
  ).length;
  const completedAny = tasks.filter((t) => t.completed).length;
  const streak = analytics.streakDays;
  const weakSubject = [...subjects].sort((a, b) => a.progress - b.progress)[0];

  // Streak
  if (streak >= 7) {
    insights.push({
      id: "s7",
      title: "Elite Consistency",
      desc: `${streak}-day streak! Top-tier learner. Protect your rhythm.`,
      tag: `${streak}d streak`,
      accent: "violet",
      type: "motivational",
    });
  } else if (streak >= 3) {
    insights.push({
      id: "s3",
      title: "Momentum Building",
      desc: `${streak}-day streak active. Consistency compounds — keep going.`,
      tag: `${streak}d streak`,
      accent: "cyan",
      type: "motivational",
    });
  } else {
    insights.push({
      id: "s0",
      title: "Restart Today",
      desc: "Complete one focus session to rebuild your streak.",
      tag: "Action needed",
      accent: "amber",
      type: "warning",
    });
  }

  // High priority tasks
  if (highPending > 0) {
    insights.push({
      id: "hp",
      title: "High Priority Alert",
      desc: `${highPending} urgent task${highPending > 1 ? "s" : ""} pending. Tackle them first.`,
      tag: `${highPending} urgent`,
      accent: "rose",
      type: "warning",
    });
  }

  // Task completion
  if (completedAny >= 5) {
    insights.push({
      id: "tc5",
      title: "Task Crusher",
      desc: `${completedAny} tasks done. Peak efficiency mode activated.`,
      tag: `+${completedAny} done`,
      accent: "emerald",
      type: "motivational",
    });
  } else if (completedAny >= 2) {
    insights.push({
      id: "tc2",
      title: "Good Progress",
      desc: `${completedAny} tasks done. Consistency beats intensity.`,
      tag: `${completedAny} done`,
      accent: "cyan",
      type: "insight",
    });
  }

  // Pomodoro long break
  if (focus.totalCompleted > 0 && focus.totalCompleted % 4 === 0) {
    insights.push({
      id: "lb",
      title: "Long Break Due",
      desc: "4 Pomodoro cycles complete. Take 15–30 min to consolidate memory.",
      tag: "Rest cycle",
      accent: "indigo",
      type: "insight",
    });
  }

  // Weak subject
  if (weakSubject && weakSubject.progress < 50) {
    insights.push({
      id: "ws",
      title: "Focus Gap Detected",
      desc: `${weakSubject.title} is at ${weakSubject.progress}%. Prioritize it this week.`,
      tag: `${weakSubject.progress}% done`,
      accent: "amber",
      type: "recommendation",
    });
  }

  // Score
  if (score >= 85) {
    insights.push({
      id: "sh",
      title: "Peak Productivity",
      desc: `Score ${score}/100. Firing on all cylinders today.`,
      tag: `${score}/100`,
      accent: "violet",
      type: "motivational",
    });
  } else if (score < 60) {
    insights.push({
      id: "sl",
      title: "Boost Needed",
      desc: `Score ${score}/100. Complete 2 tasks + 1 focus session to improve.`,
      tag: `${score}/100`,
      accent: "amber",
      type: "recommendation",
    });
  }

  // Padders — always show ≥3 cards
  if (insights.length < 3) {
    insights.push({
      id: "sr",
      title: "Spaced Repetition",
      desc: "Review material from 2 days ago to maximise long-term retention.",
      tag: "Memory tip",
      accent: "cyan",
      type: "insight",
    });
  }
  if (insights.length < 3) {
    insights.push({
      id: "ot",
      title: "Optimal Study Window",
      desc: "AI detects your peak focus window: 7 PM – 9 PM. Reserve hard topics then.",
      tag: "7–9 PM",
      accent: "indigo",
      type: "recommendation",
    });
  }

  return insights.slice(0, 5);
}

/* ═══════════════════════════════════════════════════════════════
   CONTEXT
═══════════════════════════════════════════════════════════════ */
const DataContext = createContext(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within <DataProvider>");
  return ctx;
};

/* ═══════════════════════════════════════════════════════════════
   PROVIDER
═══════════════════════════════════════════════════════════════ */
export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  /* ── Debounced localStorage save ── */
  const saveTimer = useRef(null);
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveState(state), 400);
    return () => clearTimeout(saveTimer.current);
  }, [state]);

  /* ── Fetch initial tasks from backend ── */
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [tasksRes, subjectsRes] = await Promise.all([
          fetchTasks(),
          fetchSubjects(),
        ]);

        // Safely extract arrays from response variations
        const rawTasks = tasksRes.data?.data || tasksRes.data || [];
        const rawSubjects = subjectsRes.data?.data || subjectsRes.data || [];

        const normalizedTasks = rawTasks.map(mapBackendTaskToFrontend);
        const normalizedSubjects = rawSubjects.map(mapBackendSubjectToFrontend);

        dispatch({ type: A.TASKS_SET, payload: normalizedTasks });
        dispatch({ type: A.SUBJECTS_SET, payload: normalizedSubjects });
      } catch {
        toast.error("Failed to load application data.");
      }
    }
    loadInitialData();
  }, []);

  /* ── Theme sync ── */
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(state.settings.theme);
  }, [state.settings.theme]);

  /* ── Reduced motion sync ── */
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--motion-duration",
      state.settings.reducedMotion ? "0ms" : "200ms",
    );
  }, [state.settings.reducedMotion]);

  /* ════════════════════════════════════════
     MEMOIZED SELECTORS
  ════════════════════════════════════════ */
  const taskStats = useMemo(() => sel_taskStats(state.tasks), [state.tasks]);
  const focusStats = useMemo(
    () => sel_focusStats(state.focus, state.analytics),
    [state.focus, state.analytics],
  );
  const productivityScore = useMemo(
    () => sel_productivityScore(state.tasks || []),
    [state.tasks],
  );
  const weeklyChartData = useMemo(
    () => sel_weeklyChartData(state.focus, state.tasks),
    [state.focus, state.tasks],
  );
  const weeklyTrend = useMemo(
    () => sel_weeklyTrend(state.focus, state.tasks),
    [state.focus, state.tasks],
  );
  const subjectAnalytics = useMemo(
    () => sel_subjectAnalytics(state.subjects, state.focus),
    [state.subjects, state.focus],
  );
  const searchResults = useMemo(
    () =>
      sel_searchResults(
        state.searchQuery,
        state.tasks,
        state.subjects,
        state.schedule,
      ),
    [state.searchQuery, state.tasks, state.subjects, state.schedule],
  );
  const aiInsights = useMemo(
    () => generateAIInsights(state, productivityScore),
    [state, productivityScore],
  );
  const unreadCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications],
  );

  const stats = useMemo(
    () => ({
      totalTasks: taskStats.total,
      completedTasks: taskStats.completed,
      pendingTasks: taskStats.pending,
      highPriorityTasks: taskStats.highPending,
      totalFocusHours: focusStats.totalHours,
      focusSessions: focusStats.totalCompleted,
      streak: focusStats.streak,
      longestStreak: focusStats.longestStreak,
      totalSubjects: (state.subjects || []).length,
      activeSubjects: (state.subjects || []).filter(
        (s) => s.progress > 0 && s.progress < 100,
      ).length,
      productivityScore,
    }),
    [taskStats, focusStats, productivityScore, state.subjects],
  );

  /* ════════════════════════════════════════
     ACTIONS
  ════════════════════════════════════════ */

  /* ── Sound & Notification Engine ── */
  const playSound = useCallback(() => {
    if (state.settings.soundEnabled) {
      const audio = new Audio("/chime.mp3");
      audio.play().catch(() => {});
    }
  }, [state.settings.soundEnabled]);

  const notify = useCallback(
    (msg, type = "success", icon) => {
      if (!state.settings.notificationsEnabled) return;
      if (type === "success") toast.success(msg, { icon });
      else if (type === "error") toast.error(msg, { icon });
      else toast(msg, { icon });
    },
    [state.settings.notificationsEnabled],
  );

  /* Tasks */
  const addTask = useCallback(
    async (taskData) => {
      try {
        const response = await createTaskApi(taskData);
        const rawTask = response.data?.data || response.data;
        const newFrontendTask = mapBackendTaskToFrontend(rawTask);
        dispatch({ type: A.TASK_ADD, payload: newFrontendTask });
        notify("Task added!");
      } catch (error) {
        toast.error("Failed to add task.");
      }
    },
    [notify],
  );

  const deleteTask = useCallback(
    async (id) => {
      try {
        await deleteTaskApi(id);
        dispatch({ type: A.TASK_DELETE, payload: id });
        notify("Task removed.", "success");
      } catch (error) {
        toast.error("Failed to delete task.");
      }
    },
    [notify],
  );

  const toggleTask = useCallback(
    async (id) => {
      // Destructure directly from state for explicit dependencies
      const { tasks, settings } = state;
      const { motivationalAlerts } = settings;

      const safeTasks = tasks || [];
      const task = safeTasks.find((t) => t.id === id);
      if (!task) return;

      try {
        // Optimistic UI update
        dispatch({ type: A.TASK_TOGGLE, payload: id });
        await updateTaskApi(id, { completed: !task.completed });

        if (!task.completed) {
          playSound();
          notify("Task complete! 🎉", "success");

          dispatch({
            type: A.NOTIFICATION_ADD,
            payload: {
              title: "Task Completed",
              message: task.title,
              type: "success",
            },
          });

          const completedCount =
            safeTasks.filter((t) => t.completed).length + 1; // Use safeTasks
          if (completedCount % 5 === 0 && motivationalAlerts) { // Use destructured motivationalAlerts
            notify(
              `Amazing! ${completedCount} tasks completed! 🔥`,
              "custom",
              "🔥",
            );
            dispatch({
              type: A.NOTIFICATION_ADD,
              payload: {
                title: "Milestone Reached",
                message: `${completedCount} tasks completed. You're unstoppable!`,
                type: "info",
              },
            });
          }
        }
      } catch (_error) {
        // Revert optimistic update on failure
        dispatch({ type: A.TASK_TOGGLE, payload: id });
        toast.error("Failed to update task status.");
      }
    },
    [state.tasks, state.settings.motivationalAlerts, notify, playSound, dispatch], // Updated dependency array
  );

  const editTask = useCallback(
    async (id, updates) => {
      try {
        const response = await updateTaskApi(id, updates);
        const rawTask = response.data?.data || response.data;
        const updatedFrontendTask = mapBackendTaskToFrontend(rawTask);
        dispatch({
          type: A.TASK_EDIT,
          payload: { id, updates: updatedFrontendTask },
        });
        notify("Task updated.");
      } catch (error) {
        toast.error("Failed to edit task.");
      }
    },
    [notify],
  );

  const reorderTasks = useCallback((tasks) => {
    dispatch({ type: A.TASK_REORDER, payload: tasks });
  }, []);

  /* Subjects */
  const addSubject = useCallback(
    async (subjectData) => {
      try {
        const response = await createSubjectApi(subjectData);
        const rawSub = response.data?.data || response.data;
        const newSubject = mapBackendSubjectToFrontend(rawSub);
        dispatch({ type: A.SUBJECT_ADD, payload: newSubject });
        notify("Subject added!");
      } catch (error) {
        toast.error("Failed to add subject.");
      }
    },
    [notify],
  );

  const deleteSubject = useCallback(
    async (id) => {
      try {
        await deleteSubjectApi(id);
        dispatch({ type: A.SUBJECT_DELETE, payload: id });
        notify("Subject removed.", "success");
      } catch (error) {
        toast.error("Failed to delete subject.");
      }
    },
    [notify],
  );

  const updateSubject = useCallback(
    async (id, updates) => {
      try {
        const response = await updateSubjectApi(id, updates);
        const rawSub = response.data?.data || response.data;
        const updatedSubject = mapBackendSubjectToFrontend(rawSub);
        dispatch({
          type: A.SUBJECT_UPDATE,
          payload: { id, updates: updatedSubject },
        });
        notify("Subject updated.");
      } catch (error) {
        toast.error("Failed to update subject.");
      }
    },
    [notify],
  );
  const updateSubjectProgress = useCallback((id, progress) => {
    dispatch({ type: A.SUBJECT_UPDATE_PROGRESS, payload: { id, progress } });
  }, []);
  const logSubjectHours = useCallback((id, hours) => {
    dispatch({ type: A.SUBJECT_LOG_HOURS, payload: { id, hours } });
  }, []);

  /* Focus */
  const startFocus = useCallback((opts) => {
    dispatch({ type: A.FOCUS_START, payload: opts });
  }, []);
  const pauseFocus = useCallback(() => {
    dispatch({ type: A.FOCUS_PAUSE });
  }, []);
  const resetFocus = useCallback((opts) => {
    dispatch({ type: A.FOCUS_RESET, payload: opts });
  }, []);
  const setFocusMode = useCallback((mode) => {
    dispatch({ type: A.FOCUS_SET_MODE, payload: mode });
  }, []);
  const recordFocusSession = useCallback(
    (durationMinutes = 25, subjectId = null, mode = "work") => {
      dispatch({
        type: A.FOCUS_RECORD_SESSION,
        payload: { durationMinutes, subjectId, mode },
      });

      playSound();
      notify(`${durationMinutes} min session logged! 🔥`, "success");

      if (subjectId) {
        dispatch({
          type: A.SUBJECT_LOG_HOURS,
          payload: { id: subjectId, hours: durationMinutes / 60 },
        });
      }

      if (state.settings.motivationalAlerts) {
        const newTotal = state.focus.totalCompleted + 1;
        if (newTotal % 4 === 0) {
          dispatch({
            type: A.NOTIFICATION_ADD,
            payload: {
              title: "Deep Work Master",
              message: `Completed ${newTotal} sessions! Time for a long break.`,
              type: "info",
            },
          });
          notify(`Awesome! ${newTotal} sessions completed! 🧠`, "custom", "🧠");
        }
      }
    },
    [
      state.settings.motivationalAlerts,
      notify,
      playSound,
      state.focus.totalCompleted,
    ],
  );

  /* Schedule */
  const addScheduleSession = useCallback(
    (s) => {
      dispatch({ type: A.SCHEDULE_ADD, payload: s });
      notify("Session scheduled.");
    },
    [notify],
  );
  const deleteScheduleSession = useCallback((id) => {
    dispatch({ type: A.SCHEDULE_DELETE, payload: id });
  }, []);
  const updateScheduleSession = useCallback((id, updates) => {
    dispatch({ type: A.SCHEDULE_UPDATE, payload: { id, updates } });
  }, []);

  /* Settings & Profile */
  const updateSettings = useCallback((s) => {
    dispatch({ type: A.SETTINGS_UPDATE, payload: s });
    toast.success("Settings saved.");
  }, []);
  const updateProfile = useCallback((p) => {
    dispatch({ type: A.PROFILE_UPDATE, payload: p });
    toast.success("Profile updated.");
  }, []);

  const updateNotifications = useCallback((n) => {
    dispatch({ type: A.SETTINGS_UPDATE, payload: n });
    toast.success("Notification preferences updated.");
  }, []);

  const updateAISettings = useCallback((ai) => {
    dispatch({ type: A.SETTINGS_UPDATE, payload: ai });
    toast.success("AI preferences updated.");
  }, []);

  const updateProductivitySettings = useCallback((p) => {
    dispatch({ type: A.SETTINGS_UPDATE, payload: p });
    toast.success("Productivity settings updated.");
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({
      type: A.SETTINGS_UPDATE,
      payload: { theme: state.settings.theme === "dark" ? "light" : "dark" },
    });
  }, [state.settings.theme]);

  /* Notifications */
  const addNotification = useCallback((n) => {
    dispatch({ type: A.NOTIFICATION_ADD, payload: n });
  }, []);
  const readNotification = useCallback((id) => {
    dispatch({ type: A.NOTIFICATION_READ, payload: id });
  }, []);
  const markNotificationsRead = useCallback(() => {
    dispatch({ type: A.NOTIFICATIONS_MARK_READ });
  }, []);
  const removeNotification = useCallback((id) => {
    dispatch({ type: A.NOTIFICATION_DELETE, payload: id });
  }, []);
  const clearNotifications = useCallback(() => {
    dispatch({ type: A.NOTIFICATION_CLEAR });
  }, []);

  /* Search */
  const setSearchQuery = useCallback((q) => {
    dispatch({ type: A.SEARCH_SET, payload: q });
  }, []);

  /* Reset */
  const resetAll = useCallback(() => {
    dispatch({ type: A.STATE_RESET });
    toast.success("App data reset.");
  }, []);

  /* ════════════════════════════════════════
     CONTEXT VALUE
  ════════════════════════════════════════ */
  const value = useMemo(
    () => ({
      /* Raw state */
      data: {
        tasks: state.tasks,
        subjects: state.subjects,
        focus: state.focus,
        analytics: state.analytics,
        schedule: state.schedule,
        settings: state.settings,
        profile: state.profile,
        notifications: state.notifications,
      },

      /* Computed */
      stats,
      aiInsights,
      weeklyChartData,
      weeklyTrend,
      subjectAnalytics,
      productivityScore,
      searchQuery: state.searchQuery,
      searchResults,
      unreadNotifications: unreadCount,

      /* Task actions */
      addTask,
      deleteTask,
      toggleTask,
      editTask,
      reorderTasks,

      /* Subject actions */
      addSubject,
      deleteSubject,
      updateSubject,
      updateSubjectProgress,
      logSubjectHours,

      /* Focus actions */
      startFocus,
      pauseFocus,
      resetFocus,
      setFocusMode,
      recordFocusSession,

      /* Schedule actions */
      addScheduleSession,
      deleteScheduleSession,
      updateScheduleSession,

      /* Settings / Profile actions */
      updateSettings,
      updateProfile,
      updateNotifications,
      updateAISettings,
      updateProductivitySettings,
      toggleTheme,

      /* Notification actions */
      addNotification,
      readNotification,
      markNotificationsRead,
      removeNotification,
      clearNotifications,

      /* Search */
      setSearchQuery,

      /* Util */
      resetAll,
    }),
    [
      state.tasks,
      state.subjects,
      state.focus,
      state.analytics,
      state.schedule,
      state.settings,
      state.profile,
      state.notifications,
      state.searchQuery,
      stats,
      aiInsights,
      weeklyChartData,
      weeklyTrend,
      subjectAnalytics,
      productivityScore,
      searchResults,
      unreadCount,
      addTask,
      deleteTask,
      toggleTask,
      editTask,
      reorderTasks,
      addSubject,
      deleteSubject,
      updateSubject,
      updateSubjectProgress,
      logSubjectHours,
      startFocus,
      pauseFocus,
      resetFocus,
      setFocusMode,
      recordFocusSession,
      addScheduleSession,
      deleteScheduleSession,
      updateScheduleSession,
      updateSettings,
      updateProfile,
      updateNotifications,
      updateAISettings,
      updateProductivitySettings,
      toggleTheme,
      addNotification,
      readNotification,
      markNotificationsRead,
      removeNotification,
      clearNotifications,
      setSearchQuery,
      resetAll,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
