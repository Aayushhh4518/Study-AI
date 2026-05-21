import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Settings,
  TimerReset,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Subjects",
    path: "/subjects",
    icon: BookOpen,
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Focus",
    path: "/focus",
    icon: TimerReset,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Schedule",
    path: "/schedule",
    icon: CalendarDays,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
