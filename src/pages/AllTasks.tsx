import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { USERS } from '../utils/data';
import { Task } from '../types';
import NewTaskModal from '../components/NewTaskModal';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';

const AllTasks: React.FC = () => {
  const { state, dispatch } = useTaskContext();
  const { toasts, showToast, removeToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'status'>('dueDate');
  const [filterStatus, setFilterStatus] = useState('all');

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  const filtered = state.tasks
    .filter(t => filterStatus === 'all' || t.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === 'dueDate') return a.dueDate.localeCompare(b.dueDate);
      return a.status.localeCompare(b.status);
    });

  const handleCreate = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_TASK', payload: { ...taskData, id: 't' + Date.now(), createdAt: new Date().toISOString() } });
    showToast('✅ Task created!', 'success');
  };

  const handleMove = (id: string, status: Task['status']) => {
    dispatch({ type: 'MOVE_TASK', payload: { id, status } });
    showToast('Task updated', 'info');
  };

  const priorityColor: Record<string, string> = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)' };
  const statusColor: Record<string, string> = { todo: '#6B7280', inprogress: 'var(--walmart-blue)', done: 'var(--success)' };
  const statusLabel: Record<string, string> = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' };

  return (
    <div className="main">
      <header className="topbar">
        <div className="topbar-title">All Tasks</div>
        <div className="topbar-actions">
          <select className="form-input" style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }}
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select className="form-input" style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }}
            value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="status">Sort: Status</option>
          </select>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Task</button>
        </div>
      </header>

      <div className="content">
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title">📋 Tasks ({filtered.length})</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Task', 'Category', 'Priority', 'Status', 'Assignee', 'Due Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1.5px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => {
                  const assignee = USERS.find(u => u.id === task.assigneeId);
                  const today = new Date().toISOString().slice(0, 10);
                  const overdue = task.dueDate < today && task.status !== 'done';
                  return (
                    <tr key={task.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}>
                      <td style={{ padding: '12px 16px', fontSize: 13.5, fontWeight: 600, maxWidth: 280 }}>{task.title}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11, background: 'rgba(0,113,206,0.08)', color: 'var(--walmart-blue)', padding: '3px 8px', borderRadius: 20, fontWeight: 700 }}>{task.category}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: priorityColor[task.priority] }}>
                          {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: statusColor[task.status], background: `${statusColor[task.status]}18`, padding: '3px 10px', borderRadius: 20 }}>
                          {statusLabel[task.status]}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {assignee && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: assignee.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{assignee.initials}</div>
                            <span style={{ fontSize: 12.5 }}>{assignee.name}</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12.5, color: overdue ? 'var(--danger)' : 'var(--text-muted)', fontWeight: overdue ? 700 : 400 }}>
                        {task.dueDate}{overdue ? ' ⚠️' : ''}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {task.status !== 'done' && (
                            <button className="btn btn-primary btn-sm" onClick={() => handleMove(task.id, task.status === 'todo' ? 'inprogress' : 'done')}>
                              {task.status === 'todo' ? '▶' : '✓'}
                            </button>
                          )}
                          <button className="btn btn-ghost btn-sm" onClick={() => { dispatch({ type: 'DELETE_TASK', payload: task.id }); showToast('Deleted', 'info'); }}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No tasks found</div>
            )}
          </div>
        </div>
      </div>

      {showModal && <NewTaskModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default AllTasks;
