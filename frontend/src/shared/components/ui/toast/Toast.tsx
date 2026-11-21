import React from 'react';
import { cn } from '../core/cn';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const config = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 text-[#2E7D5F] shrink-0" />,
      border: 'border-[#BFE3D4]',
      bg: 'bg-surface',
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 text-[#B93838] shrink-0" />,
      border: 'border-[#F5C9C9]',
      bg: 'bg-surface',
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4 text-[#C2781E] shrink-0" />,
      border: 'border-[#F2D7B2]',
      bg: 'bg-surface',
    },
    info: {
      icon: <Info className="w-4 h-4 text-[#3A7799] shrink-0" />,
      border: 'border-[#BFD9E8]',
      bg: 'bg-surface',
    },
  }[toast.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 w-80 max-w-full rounded-xl border p-3.5 shadow-lg',
        'animate-in slide-in-from-top-3 fade-in duration-200',
        config.bg,
        config.border
      )}
    >
      <div className="mt-0.5">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <h5 className="text-xs font-semibold text-ink leading-tight">{toast.title}</h5>
        {toast.description && (
          <p className="text-[11px] text-ink-muted mt-0.5 leading-normal">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-ink-subtle hover:text-ink p-1 rounded transition-colors"
        aria-label="Đóng thông báo"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
