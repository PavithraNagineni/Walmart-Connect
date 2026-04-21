import React from 'react';
import { NavLink } from 'react-router-dom';
import { CURRENT_USER } from '../utils/data';
import { useTaskContext } from '../context/TaskContext';

const Sidebar: React.FC = () => {
  const { state } = useTaskContext();
  const unread = state.notifications.filter(n => !n.read).length;

  return (
    <nav className="sidebar">
      <div className="brand-logo">
        <div className="brand-icon">🛒</div>
        <div>
          <div className="brand-name">WalmartConnect</div>
          <div className="brand-sub">Store #4821</div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{CURRENT_USER.initials}</div>
        <div>
          <div className="user-name">{CURRENT_USER.name}</div>
          <div className="user-role">{CURRENT_USER.role}</div>
        </div>
        <div className="user-status" />
      </div>

      <div className="sidebar-nav">
        <div className="nav-label">Menu</div>
        <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="icon">📋</span> Dashboard
          <span className="nav-badge">{state.tasks.filter(t => t.status !== 'done').length}</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="icon">🗂️</span> All Tasks
        </NavLink>
        <NavLink to="/team" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="icon">👥</span> Team
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="icon">📊</span> Reports
        </NavLink>

        <div className="nav-label" style={{ marginTop: 8 }}>Tools</div>
        <NavLink to="/notifications" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="icon">🔔</span> Notifications
          {unread > 0 && <span className="nav-badge">{unread}</span>}
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="icon">⚙️</span> Settings
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
