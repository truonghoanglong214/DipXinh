import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Toast, ToastItem, ToastType } from './Toast';

interface ToastOptions {
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (title: string, options?: ToastOptions) => void;
    error: (title: string, options?: ToastOptions) => void;
    warning: (title: string, options?: ToastOptions) => void;
    info: (title: string, options?: ToastOptions) => void;
    dismiss: (id: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, options?: ToastOptions) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = {
        id,
        type,
        title,
        description: options?.description,
      };

      setToasts((prev) => [...prev, newToast]);

      const duration = options?.duration ?? 4000;
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const toastMethods = useMemo(
    () => ({
      success: (title: string, options?: ToastOptions) => addToast('success', title, options),
      error: (title: string, options?: ToastOptions) => addToast('error', title, options),
      warning: (title: string, options?: ToastOptions) => addToast('warning', title, options),
      info: (title: string, options?: ToastOptions) => addToast('info', title, options),
      dismiss,
    }),
    [addToast, dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-label="Thông báo hệ thống"
            className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-auto"
          >
            {toasts.map((item) => (
              <Toast key={item.id} toast={item} onDismiss={dismiss} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      toast: {
        success: (title: string) => console.log('Toast success:', title),
        error: (title: string) => console.log('Toast error:', title),
        warning: (title: string) => console.log('Toast warning:', title),
        info: (title: string) => console.log('Toast info:', title),
        dismiss: () => {},
      },
    };
  }
  return context;
}
