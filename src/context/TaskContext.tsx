import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, Stats, Notification } from '../types';
import { INITIAL_TASKS, INITIAL_NOTIFICATIONS } from '../utils/data';

interface TaskState {
  tasks: Task[];
  notifications: Notification[];
  filter: string;
  searchQuery: string;
}

type Action =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { id: string; status: Task['status'] } }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_READ'; payload: string };

function reducer(state: TaskState, action: Action): TaskState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id
            ? { ...t, status: action.payload.status, completedAt: action.payload.status === 'done' ? new Date().toISOString() : undefined }
            : t
        ),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_READ':
      return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
    default:
      return state;
  }
}

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<Action>;
  stats: Stats;
  filteredTasks: (status: Task['status']) => Task[];
}

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    tasks: INITIAL_TASKS,
    notifications: INITIAL_NOTIFICATIONS,
    filter: 'all',
    searchQuery: '',
  });

  const today = new Date().toISOString().slice(0, 10);

  const stats: Stats = {
    total: state.tasks.length,
    inProgress: state.tasks.filter(t => t.status === 'inprogress').length,
    completed: state.tasks.filter(t => t.status === 'done').length,
    overdue: state.tasks.filter(t => t.dueDate < today && t.status !== 'done').length,
  };

  const filteredTasks = (status: Task['status']) =>
    state.tasks.filter(t => {
      const matchStatus = t.status === status;
      const matchFilter = state.filter === 'all' || t.priority === state.filter;
      const matchSearch = !state.searchQuery ||
        t.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(state.searchQuery.toLowerCase());
      return matchStatus && matchFilter && matchSearch;
    });

  return (
    <TaskContext.Provider value={{ state, dispatch, stats, filteredTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
};
