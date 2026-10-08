import { describe, expect, it } from 'vitest';
import { toFieldErrors } from '@app/shared';
import { createUserSchema } from './schema';

function errorsFor(username: string) {
  const result = createUserSchema.safeParse({ username });
  return result.success ? {} : toFieldErrors(result.error);
}

describe('createUserSchema', () => {
  it('requires a username', () => {
    expect(errorsFor('   ')).toEqual({ username: 'Username is required' });
  });

  it('rejects usernames that are too short', () => {
    expect(errorsFor('ab').username).toBe('Username must be at least 3 characters');
  });

  it('rejects unsupported characters', () => {
    expect(errorsFor('bad name!').username).toBe('Use only letters, numbers and underscores');
  });

  it('accepts and trims a valid username', () => {
    const result = createUserSchema.safeParse({ username: '  bob_42  ' });
    expect(result.success && result.data.username).toBe('bob_42');
  });
});
