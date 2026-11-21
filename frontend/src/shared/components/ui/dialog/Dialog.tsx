import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../core/cn';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
  className,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  const dialogContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={contentRef}
        className={cn(
          'w-full bg-surface border border-border-default rounded-xl shadow-xl overflow-hidden',
          'animate-in zoom-in-95 fade-in duration-200',
          maxWidthMap[maxWidth],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-border-default px-6 py-4.5 bg-surface-subtle">
            <div>
              {title && (
                <h3 className="font-display text-lg font-semibold text-ink leading-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-ink-muted mt-1 leading-normal">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-ink-muted hover:text-ink rounded-md transition-colors hover:bg-surface"
              aria-label="Đóng hộp thoại"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 text-sm text-ink">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-border-default bg-surface-subtle">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
};
