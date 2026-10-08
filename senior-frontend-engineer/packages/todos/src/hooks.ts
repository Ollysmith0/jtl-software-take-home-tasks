import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import type { ToDoItem } from '@app/shared';
import { createTodo, fetchTodosByUser } from './api';
import type { CreateTodoInput } from './schema';

export const todoKeys = {
  byUser: (userId: string) => ['todos', 'user', userId] as const,
};

export const todosByUserQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: todoKeys.byUser(userId),
    queryFn: () => fetchTodosByUser(userId),
  });

export function useTodos(userId: string) {
  return useQuery(todosByUserQueryOptions(userId));
}

const OPTIMISTIC_ID_PREFIX = 'optimistic-';

export const isOptimisticTodo = (todo: ToDoItem) => todo.id.startsWith(OPTIMISTIC_ID_PREFIX);

type CreateTodoContext = { previous: ToDoItem[] | undefined };

// Takes the QueryClient so the optimistic flow can be tested without React.
export function createTodoMutationOptions(queryClient: QueryClient) {
  return mutationOptions<ToDoItem, Error, CreateTodoInput, CreateTodoContext>({
    mutationFn: createTodo,

    onMutate: async (input) => {
      const listKey = todoKeys.byUser(input.assigneeId);
      // Stop in-flight refetches from overwriting the optimistic item.
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<ToDoItem[]>(listKey);

      // Nothing cached means no list is on screen, so there is nothing to update.
      if (previous !== undefined) {
        const optimistic: ToDoItem = {
          id: `${OPTIMISTIC_ID_PREFIX}${crypto.randomUUID()}`,
          title: input.title,
          assigneeId: input.assigneeId,
          createdAt: Date.now(),
        };
        queryClient.setQueryData<ToDoItem[]>(listKey, [...previous, optimistic]);
      }
      return { previous };
    },

    onError: (_error, input, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(todoKeys.byUser(input.assigneeId), context.previous);
      }
    },

    onSettled: (_data, _error, input) =>
      queryClient.invalidateQueries({ queryKey: todoKeys.byUser(input.assigneeId) }),
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation(createTodoMutationOptions(queryClient));
}
