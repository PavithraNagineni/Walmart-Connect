import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { USERS } from '../utils/data';

const Team: React.FC = () => {
  const { state } = useTaskContext();

  return (
    <div className="main">
      <header className="topbar">
        <div className="topbar-title">👥 Team</div>
      </header>
      <div className="content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {USERS.map(u => {
            const assigned = state.tasks.filter(t => t.assigneeId === u.id);
            const done = assigned.filter(t => t.status === 'done').length;
            const inProgress = assigned.filter(t => t.status === 'inprogress').length;
            const todo = assigned.filter(t => t.status === 'todo').length;
            const pct = assigned.length ? Math.round((done / assigned.length) * 100) : 0;

            return (
              <div key={u.id} className="panel-card">
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff' }}>
                      {u.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{u.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{u.role}</div>
                      <div style={{ marginTop: 4 }}>
                        <span className={`member-status status-${u.status}`}>
                          {u.status === 'active' ? '🟢 Active' : u.status === 'break' ? '🟡 On Break' : '⚫ Offline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                    {[
                      { label: 'To Do', value: todo, color: '#6B7280' },
                      { label: 'In Progress', value: inProgress, color: 'var(--walmart-blue)' },
                      { label: 'Done', value: done, color: 'var(--success)' },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px', textAlign: 'center', border: '1.5px solid var(--border)' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Completion */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                      <span>Completion Rate</span>
                      <span style={{ color: 'var(--walmart-blue)' }}>{pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: u.color }} />
                    </div>
                  </div>

                  {/* Tasks list */}
                  {assigned.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Tasks</div>
                      {assigned.map(t => (
                        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                          <span style={{ color: t.priority === 'high' ? 'var(--danger)' : t.priority === 'medium' ? 'var(--warning)' : 'var(--success)', fontSize: 10 }}>●</span>
                          <span style={{ flex: 1, color: t.status === 'done' ? 'var(--text-muted)' : 'var(--text)', textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>{t.title}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: t.status === 'done' ? 'var(--success)' : 'var(--text-muted)' }}>
                            {t.status === 'done' ? '✓' : t.status === 'inprogress' ? '▶' : '○'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Team;
