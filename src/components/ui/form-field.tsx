import React, { useEffect, useState } from 'react';
import type { z } from 'zod';
import { useFieldValidation } from '@/hooks/useValidation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BaseFormFieldProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  showValidationIcon?: boolean;
}

interface InputFormFieldProps extends BaseFormFieldProps {
  type: 'input';
  inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  autoComplete?: string;
}

interface TextareaFormFieldProps extends BaseFormFieldProps {
  type: 'textarea';
  placeholder?: string;
  rows?: number;
}

type FormFieldProps<T extends z.ZodSchema> = (InputFormFieldProps | TextareaFormFieldProps) & {
  schema: T;
  value: string | number;
  onChange: (value: string | number) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
};

export function FormField<T extends z.ZodSchema>({
  schema,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  validationMode = 'onChange',
  showValidationIcon = true,
  value,
  onChange,
  onValidationChange,
  ...props
}: FormFieldProps<T>) {
  const [hasBlurred, setHasBlurred] = useState(false);
  const [touched, setTouched] = useState(false);

  const { errors, isValidating, validateField, hasErrors } = useFieldValidation(schema, name);

  // Validate on change if mode is onChange
  useEffect(() => {
    if (validationMode === 'onChange' && touched) {
      validateField(value);
    }
  }, [value, validationMode, touched, validateField]);

  // Validate on blur if mode is onBlur
  useEffect(() => {
    if (validationMode === 'onBlur' && hasBlurred) {
      validateField(value);
    }
  }, [hasBlurred, validationMode, validateField]);

  // Notify parent of validation changes
  useEffect(() => {
    onValidationChange?.(!hasErrors, errors);
  }, [hasErrors, errors, onValidationChange]);

  const handleBlur = () => {
    setHasBlurred(true);
    if (validationMode === 'onBlur') {
      validateField(value);
    }
  };

  const handleFocus = () => {
    setTouched(true);
  };

  const shouldShowErrors = (validationMode === 'onChange' && touched) ||
                          (validationMode === 'onBlur' && hasBlurred) ||
                          validationMode === 'onSubmit';

  const hasValidationErrors = shouldShowErrors && hasErrors;
  const isValid = shouldShowErrors && !hasErrors && touched;

  const inputClassName = cn(
    'transition-colors',
    hasValidationErrors && 'border-destructive focus:border-destructive',
    isValid && 'border-green-500 focus:border-green-500'
  );

  const renderInput = () => {
    if (props.type === 'textarea') {
      return (
        <Textarea
          id={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={props.placeholder}
          rows={props.rows || 3}
          disabled={disabled}
          className={inputClassName}
          aria-invalid={hasValidationErrors}
          aria-describedby={hasValidationErrors ? `${name}-error` : description ? `${name}-description` : undefined}
        />
      );
    }

    return (
      <Input
        id={name}
        type={props.inputType || 'text'}
        value={value}
        onChange={(e) => onChange(props.inputType === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        disabled={disabled}
        className={inputClassName}
        aria-invalid={hasValidationErrors}
        aria-describedby={hasValidationErrors ? `${name}-error` : description ? `${name}-description` : undefined}
      />
    );
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        {renderInput()}

        {showValidationIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValidating && (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
            {!isValidating && isValid && (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            )}
            {!isValidating && hasValidationErrors && (
              <AlertCircle className="w-4 h-4 text-destructive" />
            )}
          </div>
        )}
      </div>

      {description && !hasValidationErrors && (
        <p id={`${name}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {hasValidationErrors && (
        <div id={`${name}-error`} className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// Higher-order component for form sections with validation
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <fieldset className={cn('space-y-4', className)}>
      {title && (
        <legend className="text-lg font-semibold text-foreground border-b border-border pb-2">
          {title}
        </legend>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </fieldset>
  );
}