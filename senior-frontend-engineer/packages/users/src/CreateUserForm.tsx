import { useRef, useState, type FormEvent } from 'react';
import {
  TextField,
  alertClass,
  buttonClass,
  toFieldErrors,
  type FieldErrors,
  type User,
} from '@app/shared';
import { useCreateUser } from './hooks';
import { createUserSchema } from './schema';

type CreateUserFormProps = {
  onCreated: (user: User) => void;
};

export function CreateUserForm({ onCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const usernameRef = useRef<HTMLInputElement>(null);
  const createUser = useCreateUser();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = createUserSchema.safeParse({ username });
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      usernameRef.current?.focus();
      return;
    }
    setErrors({});
    createUser.mutate(parsed.data, { onSuccess: onCreated });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField
        label="Username"
        name="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        error={errors.username}
        hint="3 to 20 letters, numbers or underscores."
        autoComplete="off"
        inputRef={usernameRef}
      />
      {createUser.isError ? (
        <p role="alert" className={alertClass}>
          Could not create the user: {createUser.error.message}
        </p>
      ) : null}
      <button type="submit" className={buttonClass} disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating…' : 'Create user'}
      </button>
    </form>
  );
}
