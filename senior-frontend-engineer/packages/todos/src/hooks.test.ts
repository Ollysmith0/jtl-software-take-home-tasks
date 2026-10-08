import { MutationObserver, QueryObserver, type QueryClient } from '@tanstack/react-query';
import {
  configureFakeDb,
  createQueryClient,
  resetFakeDb,
  setSimulateFailure,
  type ToDoItem,
} from '@app/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createTodoMutationOptions,
  isOptimisticTodo,
  todoKeys,
  todosByUserQueryOptions,
} from './hooks';
import { createTodoSchema } from './schema';

const USER_ID = '1';
const NEW_TODO = { title: 'Write the tests', assigneeId: USER_ID };

let queryClient: QueryClient;
let seeded: ToDoItem[];

const cachedTodos = () => queryClient.getQueryData<ToDoItem[]>(todoKeys.byUser(USER_ID)) ?? [];

// Observe the outcome right away so a quick rejection is never unhandled.
function createTodo() {
  return new MutationObserver(queryClient, createTodoMutationOptions(queryClient))
    .mutate(NEW_TODO)
    .then(
      (value) => ({ ok: true as const, value }),
      (error: unknown) => ({ ok: false as const, error }),
    );
}

beforeEach(async () => {
  resetFakeDb();
  // Long enough for waitFor to catch the optimistic state before the server answers.
  configureFakeDb({ latencyMs: 150 });
  queryClient = createQueryClient();
  seeded = await queryClient.fetchQuery(todosByUserQueryOptions(USER_ID));
});

afterEach(() => {
  queryClient.clear();
  resetFakeDb();
});

describe('createTodo optimistic update', () => {
  it('shows the new item immediately, then replaces it with the server item', async () => {
    // An active observer is what refetches the list after the mutation settles.
    const unsubscribe = new QueryObserver(
      queryClient,
      todosByUserQueryOptions(USER_ID),
    ).subscribe(() => {});

    const outcome = createTodo();

    await vi.waitFor(() => expect(cachedTodos()).toHaveLength(seeded.length + 1));
    const optimistic = cachedTodos().at(-1);
    expect(optimistic && isOptimisticTodo(optimistic)).toBe(true);
    expect(optimistic?.title).toBe(NEW_TODO.title);

    expect((await outcome).ok).toBe(true);
    await vi.waitFor(() => expect(cachedTodos().some(isOptimisticTodo)).toBe(false));
    expect(cachedTodos()).toHaveLength(seeded.length + 1);
    expect(cachedTodos().at(-1)?.title).toBe(NEW_TODO.title);
    unsubscribe();
  });

  it('rolls back to the previous list when the server rejects the request', async () => {
    setSimulateFailure(true);

    const outcome = createTodo();

    // The item is visible while the request is still in flight.
    await vi.waitFor(() => expect(cachedTodos().some(isOptimisticTodo)).toBe(true));

    const result = await outcome;
    expect(result.ok).toBe(false);
    // No observer is active, so this is the rollback itself, not a refetch.
    expect(cachedTodos()).toEqual(seeded);
  });

  it('does not touch the cache of a list that is not loaded', async () => {
    const result = await new MutationObserver(
      queryClient,
      createTodoMutationOptions(queryClient),
    )
      .mutate({ title: 'Orphan', assigneeId: '999' })
      .then(
        () => 'ok',
        () => 'failed',
      );

    expect(result).toBe('failed');
    expect(queryClient.getQueryData(todoKeys.byUser('999'))).toBeUndefined();
    expect(cachedTodos()).toEqual(seeded);
  });
});

describe('createTodoSchema', () => {
  it('requires a title and an assignee', () => {
    const result = createTodoSchema.safeParse({ title: '  ', assigneeId: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        'Title is required',
        'Assignee user ID is required',
      ]);
    }
  });

  it('trims the title', () => {
    const result = createTodoSchema.safeParse({ title: '  Buy milk ', assigneeId: '1' });
    expect(result.success && result.data.title).toBe('Buy milk');
  });
});
