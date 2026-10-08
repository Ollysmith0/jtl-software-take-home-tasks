import type { ZodError } from 'zod';

export type FieldErrors = Record<string, string>;

// Keeps the first message per field so a form shows one clear error at a time.
export function toFieldErrors(error: ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? '');
    if (field && !(field in errors)) errors[field] = issue.message;
  }
  return errors;
}
