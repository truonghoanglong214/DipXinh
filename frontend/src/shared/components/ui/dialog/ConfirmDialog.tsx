import React from 'react';
import { Dialog } from './Dialog';
import { Button } from '../buttons/Button';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy bỏ',
  variant = 'primary',
  isLoading = false,
}) => {
  const iconConfig = {
    danger: {
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      bg: 'bg-red-100',
      btnVariant: 'destructive' as const,
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-100',
      btnVariant: 'primary' as const,
    },
    primary: {
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      bg: 'bg-primary-soft',
      btnVariant: 'primary' as const,
    },
  }[variant];

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex gap-4">
        <div
          className={`w-10 h-10 shrink-0 rounded-full ${iconConfig.bg} flex items-center justify-center`}
        >
          {iconConfig.icon}
        </div>
        <div>
          <h4 className="text-base font-semibold text-ink leading-snug">{title}</h4>
          <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border-default">
        <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={iconConfig.btnVariant}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
};
