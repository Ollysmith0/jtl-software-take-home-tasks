import { z } from 'zod';

export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Use only letters, numbers and underscores'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
