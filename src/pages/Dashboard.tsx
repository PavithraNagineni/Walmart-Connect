import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useToast } from '../hooks/useToast';
import { Task } from '../types';
import KanbanColumn from '../components/KanbanColumn';
import NewTaskModal from '../components/NewTaskModal';
import ToastContainer from '../components/ToastContainer';
import { USERS } from '../utils/data';

const COLS: { status: Task['status']; title: string; color: string }[] = [
  { status: 'todo', title: 'To Do', color: '#6B7280' },
  { status: 'inprogress', title: 'In Progress', color: '#0071CE' },
  { status: 'done', title: 'Done', color: '#22C55E' },
];

const Dashboard: React.FC = () => {
  const { state, dispatch, stats, filteredTasks } = useTaskContext();
  const { toasts, showToast, removeToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleMove = (id: string, status: Task['status']) => {
    dispatch({ type: 'MOVE_TASK', payload: { id, status } });
    const labels: Record<string, string> = { inprogress: '▶ Task started!', done: '✅ Task completed!', todo: '↩ Task reopened' };
    showToast(labels[status], status === 'done' ? 'success' : 'info');
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
    showToast('🗑 Task removed', 'info');
  };

  const handleCreate = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = { ...taskData, id: 't' + Date.now(), createdAt: new Date().toISOString() };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    showToast('✅ Task created!', 'success');
  };

  const handleDrop = (status: Task['status'], taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task && task.status !== status) { handleMove(taskId, status); }
  };

  const setFilter = (f: string) => {
    setActiveFilter(f);
    dispatch({ type: 'SET_FILTER', payload: f });
  };

  return (
    <div className="main">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="topbar-title">Task Dashboard</div>
        <div className="topbar-actions">
          <div className="search-box">
            <span>🔍</span>
            <input
              placeholder="Search tasks..."
              value={state.searchQuery}
              onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            />
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => showToast('🔔 3 unread notifications', 'info')}>
            🔔 {state.notifications.filter(n => !n.read).length}
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Task</button>
        </div>
      </header>

      <div className="content">
        {/* STATS */}
        <div className="stats-grid">
          {[
            { icon: '📋', value: stats.total, label: 'Total Tasks', change: '↑ 3 from yesterday', up: true },
            { icon: '⏳', value: stats.inProgress, label: 'In Progress', change: '↑ 1 new', up: true },
            { icon: '✅', value: stats.completed, label: 'Completed', change: '↑ 2 today', up: true },
            { icon: '🚨', value: stats.overdue, label: 'Overdue', change: '↓ needs attention', up: false },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-change ${s.up ? 'up' : 'down'}`}>{s.change}</div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="main-grid">
          {/* KANBAN */}
          <div>
            <div className="board-header">
              <div className="board-title">Task Board</div>
              <div className="filter-tabs">
                {['all', 'high', 'medium', 'low'].map(f => (
                  <button
                    key={f}
                    className={`filter-tab${activeFilter === f ? ' active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'All' : f === 'high' ? '🔴 High' : f === 'medium' ? '🟡 Medium' : '🟢 Low'}
                  </button>
                ))}
              </div>
            </div>
            <div className="kanban">
              {COLS.map(col => (
                <KanbanColumn
                  key={col.status}
                  {...col}
                  tasks={filteredTasks(col.status)}
                  onMove={handleMove}
                  onDelete={handleDelete}
                  onDrop={handleDrop}
                />
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            {/* TEAM */}
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">👥 Team Status</div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Today</span>
              </div>
              <div className="panel-body" style={{ padding: '8px 18px' }}>
                {USERS.map(u => (
                  <div key={u.id} className="team-member">
                    <div className="member-avatar" style={{ background: u.color }}>{u.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div className="member-name">{u.name}</div>
                      <div className="member-tasks">
                        {state.tasks.filter(t => t.assigneeId === u.id).length} tasks assigned
                      </div>
                    </div>
                    <div className={`member-status status-${u.status}`}>
                      {u.status === 'active' ? 'Active' : u.status === 'break' ? 'On Break' : 'Offline'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROGRESS */}
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">📊 Today's Progress</div>
              </div>
              <div className="panel-body">
                {[
                  { label: 'Restocking', pct: 80, color: 'var(--walmart-blue)' },
                  { label: 'Customer Assist', pct: 60, color: 'var(--success)' },
                  { label: 'Cleaning', pct: 40, color: 'var(--warning)' },
                  { label: 'Price Checks', pct: 20, color: 'var(--danger)' },
                ].map(p => (
                  <div key={p.label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600 }}>
                      <span>{p.label}</span>
                      <span style={{ color: p.color }}>{p.pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${p.pct}%`, background: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NOTIFICATIONS */}
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">🔔 Recent Activity</div>
              </div>
              <div className="panel-body" style={{ padding: '8px 18px' }}>
                {state.notifications.slice(0, 3).map(n => (
                  <div key={n.id} className="notif-item">
                    <div className="notif-icon">
                      {n.type === 'success' ? '✅' : n.type === 'warning' ? '🔴' : '👤'}
                    </div>
                    <div>
                      <div className="notif-text">{n.message}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && <NewTaskModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Dashboard;
