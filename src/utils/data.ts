import { Task, User, Notification } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Pavithra N.', initials: 'PN', role: 'Floor Associate', color: '#0071CE', status: 'active' },
  { id: 'u2', name: 'Rahul Kumar', initials: 'RK', role: 'Stock Associate', color: '#7C3AED', status: 'break' },
  { id: 'u3', name: 'Anita Singh', initials: 'AS', role: 'Senior Associate', color: '#DC2626', status: 'active' },
  { id: 'u4', name: 'Mohan Verma', initials: 'MV', role: 'Cart Associate', color: '#D97706', status: 'offline' },
];

export const CURRENT_USER = USERS[0];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1', title: 'Restock Aisle 4 — Breakfast Cereals', category: 'Restocking',
    priority: 'high', status: 'todo', assigneeId: 'u1',
    dueDate: new Date().toISOString().slice(0, 10), notes: 'Fill bottom shelf too', createdAt: new Date().toISOString(),
  },
  {
    id: 't2', title: 'Price Check — Electronics Display', category: 'Price Check',
    priority: 'high', status: 'todo', assigneeId: 'u3',
    dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10), notes: '', createdAt: new Date().toISOString(),
  },
  {
    id: 't3', title: 'Clean Restroom — Zone B', category: 'Cleaning',
    priority: 'medium', status: 'todo', assigneeId: 'u4',
    dueDate: new Date().toISOString().slice(0, 10), notes: '', createdAt: new Date().toISOString(),
  },
  {
    id: 't4', title: 'Assist Self-Checkout Station 3', category: 'Customer Service',
    priority: 'medium', status: 'inprogress', assigneeId: 'u1',
    dueDate: new Date().toISOString().slice(0, 10), notes: '', createdAt: new Date().toISOString(),
  },
  {
    id: 't5', title: 'Cart Retrieval — Parking Zone C', category: 'Cart Retrieval',
    priority: 'low', status: 'inprogress', assigneeId: 'u2',
    dueDate: new Date().toISOString().slice(0, 10), notes: '', createdAt: new Date().toISOString(),
  },
  {
    id: 't6', title: 'Restock Beverages — Aisle 7', category: 'Restocking',
    priority: 'low', status: 'done', assigneeId: 'u2',
    dueDate: new Date().toISOString().slice(0, 10), notes: '', createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 't7', title: 'Update Shelf Labels — Dairy Section', category: 'Inventory',
    priority: 'medium', status: 'done', assigneeId: 'u1',
    dueDate: new Date().toISOString().slice(0, 10), notes: '', createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', message: 'Rahul Kumar completed Aisle 4 restock', type: 'success', time: '5 min ago', read: false },
  { id: 'n2', message: 'Manager marked Price Check as urgent', type: 'warning', time: '18 min ago', read: false },
  { id: 'n3', message: 'New task assigned: Cart Retrieval Zone B', type: 'info', time: '32 min ago', read: false },
];

export const CATEGORIES = ['Restocking', 'Cleaning', 'Customer Service', 'Price Check', 'Cart Retrieval', 'Inventory'];
export const PRIORITIES = ['high', 'medium', 'low'];
