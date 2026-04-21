import React from 'react';
import { Toast } from '../hooks/useToast';

interface Props {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const icons: Record<string, string> = {
  success: '✅',
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
};

const ToastContainer: React.FC<Props> = ({ toasts, removeToast }) => (
  <div className="toast-container">
    {toasts.map(t => (
      <div key={t.id} className={`toast ${t.type}`} onClick={() => removeToast(t.id)} style={{ cursor: 'pointer' }}>
        <span>{icons[t.type]}</span>
        <span>{t.message}</span>
      </div>
    ))}
  </div>
);

export default ToastContainer;
