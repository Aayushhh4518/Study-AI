import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { PageContainer } from './components/layout/PageContainer';
import Dashboard from './pages/Dashboard';

// Temporary placeholders for routing safety until the actual pages are fully refactored
const PlaceholderPage = ({ title }) => (
  <PageContainer title={title}>
    <div className="text-gray-400">Content for {title} is currently under construction.</div>
  </PageContainer>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          {/* TEMPORARY FIX: Use placeholder to see if the old Dashboard was crashing the app */}
          <Route path="dashboard" element={<PlaceholderPage title="Dashboard" />} />
          <Route path="subjects" element={<PlaceholderPage title="Subjects" />} />
          <Route path="tasks" element={<PlaceholderPage title="Tasks" />} />
          <Route path="focus" element={<PlaceholderPage title="Focus Timer" />} />
          <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
          <Route path="schedule" element={<PlaceholderPage title="Schedule" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;