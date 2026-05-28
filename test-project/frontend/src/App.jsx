import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import DashboardShell from "./components/layout/dashboard-shell";
import GlobalSearch from "./components/search/global-search";
import AIAssistant from "./components/ui/AIAssistant";

import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import FocusTimer from "./pages/FocusTimer";
import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";
import Subjects from "./pages/Subjects";
import AIPlanner from "./pages/AIPlanner";


import Tasks from "./pages/Tasks";
import { DataProvider } from "./store/DataContext";

function App() {
  return (
    <DataProvider>
      <Router>
        <GlobalSearch />
        <AIAssistant />
        <Routes>
          <Route path="/" element={<DashboardShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="focus" element={<FocusTimer />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ai-planner" element={<AIPlanner />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
