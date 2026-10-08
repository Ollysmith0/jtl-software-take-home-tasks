import { ApiError } from './errors';
import type { ToDoItem, User } from './types';

const DEFAULT_LATENCY_MS = 400;

let latencyMs = DEFAULT_LATENCY_MS;
let failWrites = false;
let users: User[] = [];
let todos: ToDoItem[] = [];
let nextUserId = 1;
let nextTodoId = 1;

function seed() {
  users = [];
  todos = [];
  nextUserId = 1;
  nextTodoId = 1;
  const alice = insertUser('alice');
  insertTodo('Review the take-home task', alice.id);
  insertTodo('Write the README', alice.id);
}

function insertUser(username: string): User {
  const user = { id: String(nextUserId++), username };
  users.push(user);
  return user;
}

function insertTodo(title: string, assigneeId: string): ToDoItem {
  const todo = { id: `todo-${nextTodoId++}`, title, assigneeId, createdAt: Date.now() };
  todos.push(todo);
  return todo;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function assertWritable() {
  if (failWrites) {
    throw new ApiError('server_error', 'The server rejected the request (simulated failure).');
  }
}

function requireUser(id: string): User {
  const user = users.find((candidate) => candidate.id === id);
  if (!user) throw new ApiError('not_found', `No user with ID ${id}.`);
  return user;
}

seed();

export const fakeDb = {
  async getUser(id: string): Promise<User> {
    await wait(latencyMs);
    return { ...requireUser(id) };
  },

  async createUser(username: string): Promise<User> {
    await wait(latencyMs);
    assertWritable();
    const taken = users.some((user) => user.username.toLowerCase() === username.toLowerCase());
    if (taken) throw new ApiError('conflict', `The username "${username}" is already taken.`);
    return { ...insertUser(username) };
  },

  async listTodosByUser(userId: string): Promise<ToDoItem[]> {
    await wait(latencyMs);
    requireUser(userId);
    return todos.filter((todo) => todo.assigneeId === userId).map((todo) => ({ ...todo }));
  },

  async createTodo(input: { title: string; assigneeId: string }): Promise<ToDoItem> {
    await wait(latencyMs);
    assertWritable();
    requireUser(input.assigneeId);
    return { ...insertTodo(input.title, input.assigneeId) };
  },
};

export function setSimulateFailure(enabled: boolean) {
  failWrites = enabled;
}

export function isSimulatingFailure() {
  return failWrites;
}

export function configureFakeDb(options: { latencyMs: number }) {
  latencyMs = options.latencyMs;
}

export function resetFakeDb() {
  latencyMs = DEFAULT_LATENCY_MS;
  failWrites = false;
  seed();
}
