import { useState, useCallback } from 'react';
import { z } from 'zod';

interface ValidationResult<T> {
  data: T | null;
  errors: Record<string, string[]>;
  isValid: boolean;
  isValidating: boolean;
}

interface UseValidationOptions {
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  debounceMs?: number;
}

export function useValidation<T extends z.ZodSchema>(
  schema: T,
  options: UseValidationOptions = {}
) {
  const { mode = 'onChange', debounceMs = 300 } = options;
  const [result, setResult] = useState<ValidationResult<z.infer<T>>>({
    data: null,
    errors: {},
    isValid: false,
    isValidating: false,
  });

  const validate = useCallback(
    async (data: unknown): Promise<ValidationResult<z.infer<T>>> => {
      setResult(prev => ({ ...prev, isValidating: true }));

      try {
        const parsedData = schema.parse(data);
        const newResult: ValidationResult<z.infer<T>> = {
          data: parsedData,
          errors: {},
          isValid: true,
          isValidating: false,
        };
        setResult(newResult);
        return newResult;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string[]> = {};
          error.errors.forEach((err) => {
            const path = err.path.join('.');
            if (!errors[path]) {
              errors[path] = [];
            }
            errors[path].push(err.message);
          });

          const newResult: ValidationResult<z.infer<T>> = {
            data: null,
            errors,
            isValid: false,
            isValidating: false,
          };
          setResult(newResult);
          return newResult;
        }

        const newResult: ValidationResult<z.infer<T>> = {
          data: null,
          errors: { general: ['Validation failed'] },
          isValid: false,
          isValidating: false,
        };
        setResult(newResult);
        return newResult;
      }
    },
    [schema]
  );

  const validateField = useCallback(
    async (field: string, value: unknown): Promise<string[]> => {
      try {
        // For field validation, we'll validate the entire schema but only return errors for the specific field
        const testData = { [field]: value };
        schema.parse(testData);
        return [];
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors
            .filter(err => err.path.join('.') === field)
            .map(err => err.message);
        }
        return ['Validation failed'];
      }
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setResult(prev => ({ ...prev, errors: {} }));
  }, []);

  const reset = useCallback(() => {
    setResult({
      data: null,
      errors: {},
      isValid: false,
      isValidating: false,
    });
  }, []);

  return {
    ...result,
    validate,
    validateField,
    clearErrors,
    reset,
  };
}

// Hook for form validation with react-hook-form integration
export function useFormValidation<T extends z.ZodSchema>(
  schema: T,
  defaultValues?: Partial<z.infer<T>>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const validation = useValidation(schema);

  const handleSubmit = useCallback(
    async (data: unknown, onSuccess?: (data: z.infer<T>) => void | Promise<void>) => {
      setIsSubmitting(true);
      setSubmitCount(prev => prev + 1);

      try {
        const result = await validation.validate(data);
        if (result.isValid && result.data) {
          await onSuccess?.(result.data);
        }
        return result;
      } finally {
        setIsSubmitting(false);
      }
    },
    [validation]
  );

  return {
    ...validation,
    isSubmitting,
    submitCount,
    handleSubmit,
  };
}

// Hook for real-time field validation
export function useFieldValidation<T extends z.ZodSchema>(
  schema: T,
  fieldName: string
) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback(
    async (value: unknown) => {
      setIsValidating(true);
      try {
        // Validate by attempting to parse with the field value
        const testData = { [fieldName]: value };
        schema.parse(testData);
        setErrors([]);
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = error.errors
            .filter(err => err.path.join('.') === fieldName)
            .map(err => err.message);
          setErrors(fieldErrors);
          return fieldErrors.length === 0;
        }
        setErrors(['Validation failed']);
        return false;
      } finally {
        setIsValidating(false);
      }
    },
    [schema, fieldName]
  );

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    isValidating,
    validateField,
    clearErrors,
    hasErrors: errors.length > 0,
  };
}