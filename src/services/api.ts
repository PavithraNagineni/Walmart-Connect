import axios from 'axios';
import { Task } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const taskService = {
  getAll: () => api.get<Task[]>('/tasks'),
  create: (task: Omit<Task, 'id' | 'createdAt'>) => api.post<Task>('/tasks', task),
  update: (id: string, data: Partial<Task>) => api.patch<Task>(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  updateStatus: (id: string, status: string) => api.patch<Task>(`/tasks/${id}/status`, { status }),
};

export const wsService = {
  connect: (onMessage: (data: any) => void) => {
    const ws = new WebSocket(`ws://localhost:8000/ws`);
    ws.onmessage = (e) => onMessage(JSON.parse(e.data));
    ws.onerror = (e) => console.error('WS error:', e);
    return ws;
  },
};
