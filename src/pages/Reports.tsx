import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { useTaskContext } from '../context/TaskContext';
import { USERS } from '../utils/data';

const COLORS = ['#0071CE', '#22C55E', '#F59E0B', '#EF4444', '#7C3AED', '#059669'];

const Reports: React.FC = () => {
  const { state, stats } = useTaskContext();

  // Tasks by category
  const categoryData = ['Restocking', 'Cleaning', 'Customer Service', 'Price Check', 'Cart Retrieval', 'Inventory'].map(cat => ({
    name: cat.length > 12 ? cat.slice(0, 12) + '…' : cat,
    count: state.tasks.filter(t => t.category === cat).length,
  })).filter(d => d.count > 0);

  // Tasks by status
  const statusData = [
    { name: 'To Do', value: state.tasks.filter(t => t.status === 'todo').length },
    { name: 'In Progress', value: state.tasks.filter(t => t.status === 'inprogress').length },
    { name: 'Done', value: state.tasks.filter(t => t.status === 'done').length },
  ];

  // Tasks by priority
  const priorityData = [
    { name: 'High', value: state.tasks.filter(t => t.priority === 'high').length, color: '#EF4444' },
    { name: 'Medium', value: state.tasks.filter(t => t.priority === 'medium').length, color: '#F59E0B' },
    { name: 'Low', value: state.tasks.filter(t => t.priority === 'low').length, color: '#22C55E' },
  ];

  // Tasks per associate
  const teamData = USERS.map(u => ({
    name: u.initials,
    fullName: u.name,
    total: state.tasks.filter(t => t.assigneeId === u.id).length,
    done: state.tasks.filter(t => t.assigneeId === u.id && t.status === 'done').length,
  }));

  // Simulated week trend
  const trendData = [
    { day: 'Mon', created: 4, completed: 2 },
    { day: 'Tue', created: 6, completed: 5 },
    { day: 'Wed', created: 3, completed: 4 },
    { day: 'Thu', created: 7, completed: 3 },
    { day: 'Fri', created: 5, completed: 6 },
    { day: 'Sat', created: 2, completed: 4 },
    { day: 'Sun', created: state.tasks.length, completed: stats.completed },
  ];

  const card = { background: 'var(--card)', borderRadius: 14, border: '1.5px solid var(--border)', boxShadow: 'var(--shadow)', padding: 20 };

  return (
    <div className="main">
      <header className="topbar">
        <div className="topbar-title">📊 Reports & Analytics</div>
        <div className="topbar-actions">
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Store #4821 · Today</span>
        </div>
      </header>

      <div className="content">
        {/* SUMMARY STATS */}
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          {[
            { icon: '📋', value: stats.total, label: 'Total Tasks' },
            { icon: '⏳', value: stats.inProgress, label: 'In Progress' },
            { icon: '✅', value: stats.completed, label: 'Completed' },
            { icon: '🚨', value: stats.overdue, label: 'Overdue' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CHARTS ROW 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Task Trend */}
          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>📈 Weekly Task Trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="created" stroke="#0071CE" strokeWidth={2} dot={{ r: 4 }} name="Created" />
                <Line type="monotone" dataKey="completed" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tasks by Category */}
          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>🗂️ Tasks by Category</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0071CE" radius={[6, 6, 0, 0]} name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHARTS ROW 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          {/* Status Pie */}
          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>📊 Status Breakdown</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Pie */}
          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>🎯 Priority Split</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {priorityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Team Performance */}
          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>👥 Team Performance</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={teamData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val, name) => [val, name === 'total' ? 'Assigned' : 'Completed']} />
                <Legend formatter={val => val === 'total' ? 'Assigned' : 'Completed'} />
                <Bar dataKey="total" fill="#0071CE" radius={[4, 4, 0, 0]} name="total" />
                <Bar dataKey="done" fill="#22C55E" radius={[4, 4, 0, 0]} name="done" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
