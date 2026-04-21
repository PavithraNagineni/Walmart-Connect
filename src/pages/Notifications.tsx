import React from 'react';
import { useTaskContext } from '../context/TaskContext';

const Notifications: React.FC = () => {
  const { state, dispatch } = useTaskContext();

  return (
    <div className="main">
      <header className="topbar">
        <div className="topbar-title">🔔 Notifications</div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={() =>
            state.notifications.forEach(n => dispatch({ type: 'MARK_READ', payload: n.id }))
          }>Mark all read</button>
        </div>
      </header>
      <div className="content">
        <div className="panel-card">
          <div className="panel-body">
            {state.notifications.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No notifications</div>
            )}
            {state.notifications.map(n => (
              <div key={n.id} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'rgba(0,113,206,0.03)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: n.read ? 400 : 600 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
                </div>
                {!n.read && (
                  <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'MARK_READ', payload: n.id })}>
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
