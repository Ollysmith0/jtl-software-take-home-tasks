import { fakeDb, type User } from '@app/shared';
import type { CreateUserInput } from './schema';

// Swap point: replace fakeDb with real HTTP calls here.
export function fetchUser(id: string): Promise<User> {
  return fakeDb.getUser(id);
}

export function createUser(input: CreateUserInput): Promise<User> {
  return fakeDb.createUser(input.username);
}
