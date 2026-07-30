import { z } from 'zod';

// File type validation
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
] as const;

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv'
] as const;

export const ALLOWED_SPREADSHEET_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv'
] as const;

// File size limits (in bytes)
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_SPREADSHEET_SIZE = 5 * 1024 * 1024; // 5MB

// File name sanitization
export const sanitizeFileName = (fileName: string): string => {
  // Remove path separators and control characters
  return fileName
    .replace(/[/\\:*?"<>|]/g, '_')
    .substring(0, 255); // Limit length
};

// Image file schema
export const imageFileSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => (ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type), {
      message: 'Only JPEG, PNG, WebP, and GIF images are allowed'
    })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      message: 'Image file size must be less than 5MB'
    })
    .refine((file) => file.name.length <= 255, {
      message: 'File name is too long'
    }),
  alt: z.string().max(500, 'Alt text is too long').optional(),
});

// Document file schema
export const documentFileSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => (ALLOWED_DOCUMENT_TYPES as readonly string[]).includes(file.type), {
      message: 'Only PDF, Word documents, and text files are allowed'
    })
    .refine((file) => file.size <= MAX_DOCUMENT_SIZE, {
      message: 'Document file size must be less than 10MB'
    })
    .refine((file) => file.name.length <= 255, {
      message: 'File name is too long'
    }),
});

// Spreadsheet file schema
export const spreadsheetFileSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => (ALLOWED_SPREADSHEET_TYPES as readonly string[]).includes(file.type), {
      message: 'Only Excel and CSV files are allowed'
    })
    .refine((file) => file.size <= MAX_SPREADSHEET_SIZE, {
      message: 'Spreadsheet file size must be less than 5MB'
    })
    .refine((file) => file.name.length <= 255, {
      message: 'File name is too long'
    }),
});

// Generic file upload schema
export const fileUploadSchema = z.object({
  files: z.array(z.instanceof(File))
    .min(1, 'At least one file is required')
    .max(10, 'Cannot upload more than 10 files at once')
    .refine((files) => {
      return files.every(file => {
        const allowedTypes: string[] = [
          ...ALLOWED_IMAGE_TYPES,
          ...ALLOWED_DOCUMENT_TYPES,
          ...ALLOWED_SPREADSHEET_TYPES
        ];
        return allowedTypes.includes(file.type);
      });
    }, {
      message: 'One or more files have unsupported file types'
    })
    .refine((files) => {
      return files.every(file => file.size <= MAX_DOCUMENT_SIZE);
    }, {
      message: 'One or more files exceed the maximum size limit'
    })
    .refine((files) => {
      return files.every(file => file.name.length <= 255);
    }, {
      message: 'One or more file names are too long'
    }),
  category: z.enum(['project_images', 'documents', 'reports', 'certificates']).default('documents'),
});

// File validation utilities
export const validateFile = (file: File, options: {
  allowedTypes?: string[];
  maxSize?: number;
  maxNameLength?: number;
} = {}): { valid: boolean; error?: string } => {
  const {
    allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES, ...ALLOWED_SPREADSHEET_TYPES],
    maxSize = MAX_DOCUMENT_SIZE,
    maxNameLength = 255
  } = options;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size ${file.size} bytes exceeds maximum allowed size of ${maxSize} bytes`
    };
  }

  if (file.name.length > maxNameLength) {
    return {
      valid: false,
      error: `File name is too long. Maximum length is ${maxNameLength} characters`
    };
  }

  return { valid: true };
};

// Types
export type ImageFileData = z.infer<typeof imageFileSchema>;
export type DocumentFileData = z.infer<typeof documentFileSchema>;
export type SpreadsheetFileData = z.infer<typeof spreadsheetFileSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;