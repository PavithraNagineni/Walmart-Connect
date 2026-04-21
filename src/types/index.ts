export type Priority = 'high' | 'medium' | 'low';
export type Status = 'todo' | 'inprogress' | 'done';
export type Category =
  | 'Restocking'
  | 'Cleaning'
  | 'Customer Service'
  | 'Price Check'
  | 'Cart Retrieval'
  | 'Inventory';

export interface User {
  id: string;
  name: string;
  initials: string;
  role: string;
  color: string;
  status: 'active' | 'break' | 'offline';
}

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  status: Status;
  assigneeId: string;
  dueDate: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  time: string;
  read: boolean;
}

export interface Stats {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
}
