import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AllTasks from './pages/AllTasks';
import Team from './pages/Team';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import './index.css';

const App: React.FC = () => {
  return (
    <TaskProvider>
      <BrowserRouter>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<AllTasks />} />
            <Route path="/team" element={<Team />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TaskProvider>
  );
};

export default App;
