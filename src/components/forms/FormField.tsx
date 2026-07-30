/**
 * FormField Component
 * Reusable form field with validation support
 */

import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={fieldId}
            className={`
              block w-full rounded-lg border
              ${leftIcon ? 'pl-10' : 'pl-4'}
              ${rightIcon ? 'pr-10' : 'pr-4'}
              py-2.5
              ${error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500'
              }
              focus:outline-none focus:ring-2
              disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
              transition-colors
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${fieldId}-error`}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${fieldId}-helper`}
            className="mt-1.5 text-sm text-slate-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, error, helperText, fullWidth = true, className = '', id, ...props }, ref) => {
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          className={`
            block w-full rounded-lg border
            px-4 py-2.5
            ${error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500'
            }
            focus:outline-none focus:ring-2
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            transition-colors resize-y min-h-[100px]
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

TextAreaField.displayName = 'TextAreaField';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { label, error, helperText, options, fullWidth = true, placeholder, id, className = '', ...props },
    ref
  ) => {
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={fieldId}
          className={`
            block w-full rounded-lg border
            px-4 py-2.5
            ${error
              ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500'
            }
            focus:outline-none focus:ring-2
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            transition-colors
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

interface CheckboxFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, description, id, className = '', ...props }, ref) => {
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`flex items-start ${className}`}>
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            id={fieldId}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            {...props}
          />
        </div>
        <div className="ml-3">
          <label
            htmlFor={fieldId}
            className="text-sm font-medium text-slate-700 cursor-pointer"
          >
            {label}
          </label>
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';

interface RadioGroupProps {
  label: string;
  name: string;
  options: { value: string; label: string; description?: string }[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  fullWidth?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  fullWidth = true,
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      <fieldset>
        <legend className="text-sm font-medium text-slate-700 mb-3">
          {label}
        </legend>
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  id={`${name}-${option.value}`}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange?.(option.value)}
                  className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3">
                <label
                  htmlFor={`${name}-${option.value}`}
                  className="text-sm font-medium text-slate-700 cursor-pointer"
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-sm text-slate-500">{option.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </fieldset>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;
