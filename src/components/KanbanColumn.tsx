import React from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface Props {
  title: string;
  status: Task['status'];
  tasks: Task[];
  dotColor?: string;
  onMove: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  onDrop: (status: Task['status'], taskId: string) => void;
}

const KanbanColumn: React.FC<Props> = ({ title, status, tasks, dotColor, onMove, onDelete, onDrop }) => {
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) onDrop(status, taskId);
  };

  return (
    <div className="kanban-col" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="kanban-col-header">
        <div className="col-dot" style={{ background: dotColor }} />
        <div className="col-title">{title}</div>
        <div className="col-count">{tasks.length}</div>
      </div>
      {tasks.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: '20px 0' }}>
          Drop tasks here
        </div>
      )}
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onMove={onMove} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default KanbanColumn;
