import React, { useState } from 'react';
import { CURRENT_USER } from '../utils/data';

const Settings: React.FC = () => {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [wsEnabled, setWsEnabled] = useState(false);
  const [theme, setTheme] = useState('light');

  const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? 'var(--walmart-blue)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </div>
  );

  return (
    <div className="main">
      <header className="topbar">
        <div className="topbar-title">⚙️ Settings</div>
      </header>
      <div className="content">
        <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Profile */}
          <div className="panel-card">
            <div className="panel-header"><div className="panel-title">👤 Profile</div></div>
            <div className="panel-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: CURRENT_USER.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff' }}>{CURRENT_USER.initials}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{CURRENT_USER.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{CURRENT_USER.role} · Store #4821</div>
                </div>
              </div>
              {[{ label: 'Full Name', value: CURRENT_USER.name }, { label: 'Role', value: CURRENT_USER.role }, { label: 'Store', value: 'Store #4821, Hyderabad' }].map(f => (
                <div key={f.label} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input className="form-input" defaultValue={f.value} />
                </div>
              ))}
              <button className="btn btn-primary">Save Profile</button>
            </div>
          </div>

          {/* Preferences */}
          <div className="panel-card">
            <div className="panel-header"><div className="panel-title">🎛️ Preferences</div></div>
            <div className="panel-body">
              {[
                { label: 'Push Notifications', sub: 'Receive alerts for new task assignments', value: notifEnabled, onChange: setNotifEnabled },
                { label: 'WebSocket Live Updates', sub: 'Real-time sync with backend (requires server)', value: wsEnabled, onChange: setWsEnabled },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
                  </div>
                  <Toggle value={s.value} onChange={s.onChange} />
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Theme</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Interface appearance</div>
                </div>
                <select className="form-input" style={{ width: 'auto' }} value={theme} onChange={e => setTheme(e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark (coming soon)</option>
                </select>
              </div>
            </div>
          </div>

          {/* API Info */}
          <div className="panel-card">
            <div className="panel-header"><div className="panel-title">🔌 Backend Connection</div></div>
            <div className="panel-body">
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>FastAPI backend URL for real-time sync</div>
              <div className="form-group">
                <label className="form-label">API Base URL</label>
                <input className="form-input" defaultValue="http://localhost:8000" />
              </div>
              <div className="form-group">
                <label className="form-label">WebSocket URL</label>
                <input className="form-input" defaultValue="ws://localhost:8000/ws" />
              </div>
              <button className="btn btn-ghost">Test Connection</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
