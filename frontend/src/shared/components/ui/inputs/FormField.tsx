import React, { useId } from 'react';
import { cn } from '../core/cn';
import { Label } from './Label';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  className?: string;
  children: React.ReactElement<{ id?: string; isError?: boolean; 'aria-describedby'?: string }>;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  helperText,
  errorMessage,
  className,
  children,
}) => {
  const generatedId = useId();
  const childId = children.props.id || generatedId;
  const helperId = `${childId}-helper`;
  const errorId = `${childId}-error`;

  const isError = Boolean(errorMessage);

  const clonedChild = React.cloneElement(children, {
    id: childId,
    isError: isError || children.props.isError,
    'aria-describedby': isError ? errorId : helperText ? helperId : undefined,
  });

  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      {label && (
        <Label htmlFor={childId} required={required}>
          {label}
        </Label>
      )}
      {clonedChild}
      {errorMessage ? (
        <p id={errorId} className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span>•</span> {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-ink-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
