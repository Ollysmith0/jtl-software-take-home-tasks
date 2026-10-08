import { fakeDb, type ToDoItem } from '@app/shared';
import type { CreateTodoInput } from './schema';

// Swap point: replace fakeDb with real HTTP calls here.
export function fetchTodosByUser(userId: string): Promise<ToDoItem[]> {
  return fakeDb.listTodosByUser(userId);
}

export function createTodo(input: CreateTodoInput): Promise<ToDoItem> {
  return fakeDb.createTodo(input);
}
