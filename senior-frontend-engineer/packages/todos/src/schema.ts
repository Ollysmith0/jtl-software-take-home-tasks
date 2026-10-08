import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
  assigneeId: z.string().trim().min(1, 'Assignee user ID is required'),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
