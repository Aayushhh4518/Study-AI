import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import DashboardShell from "./components/layout/dashboard-shell";
import PageContainer from "./components/layout/PageContainer";

import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import FocusTimer from "./pages/FocusTimer";
import Subjects from "./pages/Subjects";
import Tasks from "./pages/Tasks";

// Temporary placeholders for routing safety
function PlaceholderPage({ title }) {
  return (
    <PageContainer title={title}>
      <div className="text-gray-400">
        Content for {title} is currently under construction.
      </div>
    </PageContainer>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* DASHBOARD */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* SUBJECTS */}
          <Route path="subjects" element={<Subjects />} />

          {/* PLACEHOLDER ROUTES */}
          <Route path="tasks" element={<Tasks />} />

          <Route
            path="focus"
            element={<FocusTimer />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

          <Route
            path="schedule"
            element={<PlaceholderPage title="Schedule" />}
          />

          <Route
            path="settings"
            element={<PlaceholderPage title="Settings" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
