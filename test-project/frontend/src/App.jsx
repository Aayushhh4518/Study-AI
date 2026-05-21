import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import DashboardShell from "./components/layout/dashboard-shell";
import PageContainer from "./components/layout/PageContainer";
import Dashboard from "./pages/Dashboard";

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

          <Route path="dashboard" element={<Dashboard />} />

          <Route
            path="subjects"
            element={<PlaceholderPage title="Subjects" />}
          />

          <Route path="tasks" element={<PlaceholderPage title="Tasks" />} />

          <Route
            path="focus"
            element={<PlaceholderPage title="Focus Timer" />}
          />

          <Route
            path="analytics"
            element={<PlaceholderPage title="Analytics" />}
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
