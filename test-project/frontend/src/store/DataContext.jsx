import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const initialData = {
  tasks: [
    {
      id: "1",
      title: "Complete Physics Lab Report",
      due: "Today, 11:59 PM",
      priority: "High",
      color: "bg-rose-500",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Read Chapter 4: Data Structures",
      due: "Tomorrow, 9:00 AM",
      priority: "Medium",
      color: "bg-amber-500",
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ],
  subjects: [
    {
      id: "1",
      title: "Computer Science 101",
      progress: 75,
      color: "bg-indigo-500",
    },
    {
      id: "2",
      title: "Advanced Mathematics",
      progress: 40,
      color: "bg-emerald-500",
    },
  ],
  focusSessions: {
    totalCompleted: 14,
    totalFocusMinutes: 128 * 60, // Default mock data: 128 hours
    history: [], // { date, duration, subjectId }
  },
  analytics: {
    streakDays: 7,
    lastActiveDate: new Date().toISOString(),
  },
  settings: {
    theme: "dark",
    notificationsEnabled: true,
    aiInsightsEnabled: true,
    pomodoroWorkTime: 25,
    pomodoroBreakTime: 5,
  },
  notifications: [
    {
      id: "n1",
      title: "Focus session complete",
      message: "25 min deep work done",
      time: new Date().toISOString(),
      read: false,
      type: "success",
    },
  ],
  aiRecommendations: [
    {
      id: "ai1",
      title: "Peak Productivity",
      desc: "You work best during evening hours. Consider moving complex tasks to 7PM.",
      type: "insight",
    },
  ],
};

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem("studyai_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge to ensure backward compatibility if schema changes
        return {
          ...initialData,
          ...parsed,
          settings: { ...initialData.settings, ...(parsed.settings || {}) },
          analytics: { ...initialData.analytics, ...(parsed.analytics || {}) },
          focusSessions: {
            ...initialData.focusSessions,
            ...(parsed.focusSessions || {}),
          },
        };
      }
      return initialData;
    } catch (error) {
      console.error("Failed to parse stored data:", error);
      return initialData;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("studyai_data", JSON.stringify(data));
  }, [data]);

  // --- DERIVED ANALYTICS (Memoized to prevent unnecessary re-renders) ---
  const stats = useMemo(() => {
    const completedTasks = data.tasks.filter((t) => t.completed).length;
    const pendingTasks = data.tasks.length - completedTasks;
    const totalFocusHours =
      Math.round((data.focusSessions.totalFocusMinutes / 60) * 10) / 10;

    // Dynamic Productivity Score Calculation (0-100 scale)
    const baseScore = 50;
    const taskBonus = completedTasks * 2;
    const focusBonus = data.focusSessions.totalCompleted * 1.5;
    const productivityScore = Math.min(
      100,
      Math.round(baseScore + taskBonus + focusBonus),
    );

    return {
      completedTasks,
      pendingTasks,
      totalTasks: data.tasks.length,
      totalFocusHours,
      productivityScore,
      streak: data.analytics.streakDays,
    };
  }, [data.tasks, data.focusSessions, data.analytics.streakDays]);

  // --- LOCAL AI ENGINE (Dynamic Recommendation Generator) ---
  const aiRecommendations = useMemo(() => {
    const recs = [];
    const { streakDays } = data.analytics;
    const { tasks, focusSessions } = data;

    // 1. Streak Analysis
    if (streakDays >= 3) {
      recs.push({
        id: "ai-streak",
        title: "Momentum Maintained",
        desc: `You're on a ${streakDays}-day streak. Keep up the consistency to maximize retention.`,
        type: "motivational",
      });
    } else if (streakDays === 0) {
      recs.push({
        id: "ai-streak-warn",
        title: "Streak Lost",
        desc: "You missed yesterday. Complete one focus session today to restart your momentum.",
        type: "warning",
      });
    }

    // 2. Task Analysis
    const pendingHigh = tasks.filter(
      (t) => t.priority === "High" && !t.completed,
    ).length;
    if (pendingHigh > 0) {
      recs.push({
        id: "ai-tasks",
        title: "High Priority Alert",
        desc: `You have ${pendingHigh} high priority task(s) pending. Tackle them first.`,
        type: "warning",
      });
    }

    const completedToday = tasks.filter((t) => t.completed).length;
    if (completedToday >= 3) {
      recs.push({
        id: "ai-tasks-motivate",
        title: "Task Crusher",
        desc: `You've completed ${completedToday} tasks. Excellent productivity pace today!`,
        type: "motivational",
      });
    }

    // 3. Focus Session Analysis
    const completedSessions = focusSessions.totalCompleted;
    if (completedSessions > 0 && completedSessions % 4 === 0) {
      recs.push({
        id: "ai-focus-break",
        title: "Long Break Needed",
        desc: "You've completed 4 Pomodoro cycles. Take a 15-30 minute break to recharge.",
        type: "insight",
      });
    }

    // 4. Default / General Recommendations
    if (recs.length < 2) {
      recs.push({
        id: "ai-default-1",
        title: "Optimal Study Time",
        desc: "AI suggests scheduling your most difficult subject during your morning peak energy hours.",
        type: "recommendation",
      });
    }

    if (recs.length < 3) {
      recs.push({
        id: "ai-default-2",
        title: "Spaced Repetition",
        desc: "Review material from 2 days ago to increase your long-term memory retention.",
        type: "insight",
      });
    }

    return recs;
  }, [data.analytics.streakDays, data.tasks, data.focusSessions]);

  // Inject dynamic AI recommendations into the provided data object
  const enrichedData = useMemo(
    () => ({
      ...data,
      aiRecommendations,
    }),
    [data, aiRecommendations],
  );

  // --- TASKS ACTIONS ---
  const addTask = useCallback((task) => {
    setData((prev) => ({
      ...prev,
      tasks: [
        {
          ...task,
          id: uuidv4(),
          completed: false,
          createdAt: new Date().toISOString(),
        },
        ...prev.tasks,
      ],
    }));
    toast.success("Task added successfully!");
  }, []);

  const toggleTask = useCallback((id) => {
    setData((prev) => {
      const isCompleting = !prev.tasks.find((t) => t.id === id)?.completed;
      if (isCompleting) toast.success("Task completed! Great job 🎉");
      return {
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t,
        ),
      };
    });
  }, []);

  const deleteTask = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
    toast.success("Task deleted.");
  }, []);

  // --- SUBJECTS ACTIONS ---
  const addSubject = useCallback((subject) => {
    setData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { ...subject, id: uuidv4(), progress: 0 }],
    }));
    toast.success("Subject added!");
  }, []);

  const deleteSubject = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== id),
    }));
  }, []);

  const updateSubject = useCallback((id, updatedData) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === id ? { ...s, ...updatedData } : s,
      ),
    }));
    toast.success("Subject updated!");
  }, []);

  const updateSubjectProgress = useCallback((id, progress) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === id ? { ...s, progress } : s,
      ),
    }));
  }, []);

  // --- FOCUS & ANALYTICS ACTIONS ---
  const recordFocusSession = useCallback(
    (durationMinutes = 25, subjectId = null) => {
      setData((prev) => {
        const now = new Date();
        const todayString = now.toISOString().split("T")[0];

        // Streak tracking calculation
        let newStreak = prev.analytics.streakDays;
        const lastActiveStr = prev.analytics.lastActiveDate
          ? prev.analytics.lastActiveDate.split("T")[0]
          : null;

        if (lastActiveStr !== todayString) {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);

          if (lastActiveStr === yesterday.toISOString().split("T")[0]) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        }

        return {
          ...prev,
          focusSessions: {
            ...prev.focusSessions,
            totalCompleted: prev.focusSessions.totalCompleted + 1,
            totalFocusMinutes:
              prev.focusSessions.totalFocusMinutes + durationMinutes,
            history: [
              ...prev.focusSessions.history,
              {
                id: uuidv4(),
                date: now.toISOString(),
                durationMinutes,
                subjectId,
              },
            ],
          },
          analytics: {
            ...prev.analytics,
            streakDays: newStreak,
            lastActiveDate: now.toISOString(),
          },
        };
      });
      toast.success(`Logged ${durationMinutes} minutes of deep work!`);
    },
    [],
  );

  // --- SETTINGS ACTIONS ---
  const updateSettings = useCallback((newSettings) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
    toast.success("Settings updated");
  }, []);

  // --- NOTIFICATIONS ACTIONS ---
  const markNotificationsRead = useCallback(() => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  // Memoize context value strictly to prevent deep tree re-renders
  const contextValue = useMemo(
    () => ({
      data: enrichedData,
      stats,
      searchQuery,
      setSearchQuery,
      addTask,
      toggleTask,
      deleteTask,
      addSubject,
      deleteSubject,
      updateSubject,
      updateSubjectProgress,
      recordFocusSession,
      updateSettings,
      markNotificationsRead,
    }),
    [
      enrichedData,
      stats,
      searchQuery,
      addTask,
      toggleTask,
      deleteTask,
      addSubject,
      deleteSubject,
      updateSubject,
      updateSubjectProgress,
      recordFocusSession,
      updateSettings,
      markNotificationsRead,
    ],
  );

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
