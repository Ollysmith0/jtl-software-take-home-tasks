import { useRef, useState, type FormEvent } from 'react';
import { TextField, buttonClass } from '@app/shared';

type SelectUserFormProps = {
  initialUserId: string | null;
  onSelect: (userId: string) => void;
};

export function SelectUserForm({ initialUserId, onSelect }: SelectUserFormProps) {
  const [value, setValue] = useState(initialUserId ?? '');
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const userId = value.trim();
    if (!userId) {
      setError('Enter a user ID');
      inputRef.current?.focus();
      return;
    }
    setError(undefined);
    onSelect(userId);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-wrap items-end gap-3">
      <div className="min-w-48 flex-1">
        <TextField
          label="Show todos for user ID"
          name="userId"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          error={error}
          autoComplete="off"
          inputRef={inputRef}
        />
      </div>
      <button type="submit" className={buttonClass}>
        Show todos
      </button>
    </form>
  );
}
