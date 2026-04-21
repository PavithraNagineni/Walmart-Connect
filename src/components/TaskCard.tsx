import React from 'react';
import { Task } from '../types';
import { USERS } from '../utils/data';
import { useTaskContext } from '../context/TaskContext';

interface Props {
  task: Task;
  onMove: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<Props> = ({ task, onMove, onDelete }) => {
  const today = new Date().toISOString().slice(0, 10);
  const overdue = task.dueDate < today && task.status !== 'done';
  const assignee = USERS.find(u => u.id === task.assigneeId);

  const formatDate = (d: string) => {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div
      className={`task-card priority-${task.priority}`}
      draggable
      onDragStart={e => e.dataTransfer.setData('taskId', task.id)}
    >
      <div className="task-category">{task.category}</div>
      <div className="task-title">{task.title}</div>
      {task.notes && (
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 8 }}>{task.notes}</div>
      )}
      <div className="task-meta">
        {assignee && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-muted)' }}>
            <div className="assignee-dot" style={{ background: assignee.color }}>{assignee.initials}</div>
            {assignee.name}
          </div>
        )}
        <div className={`task-due${overdue ? ' overdue' : ''}`}>
          📅 {formatDate(task.dueDate)}{overdue ? ' ⚠️' : ''}
        </div>
      </div>
      <div className="task-actions">
        {task.status === 'todo' && (
          <button className="task-btn" onClick={() => onMove(task.id, 'inprogress')}>▶ Start</button>
        )}
        {task.status === 'inprogress' && (
          <button className="task-btn complete" onClick={() => onMove(task.id, 'done')}>✓ Complete</button>
        )}
        {task.status === 'done' && (
          <button className="task-btn" onClick={() => onMove(task.id, 'todo')}>↩ Reopen</button>
        )}
        <button className="task-btn delete-btn" style={{ flex: 0, padding: '5px 8px' }} onClick={() => onDelete(task.id)}>🗑</button>
      </div>
    </div>
  );
};

export default TaskCard;
