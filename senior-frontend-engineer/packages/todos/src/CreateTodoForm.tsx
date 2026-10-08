import { useRef, useState, type FormEvent } from 'react';
import {
  TextField,
  alertClass,
  buttonClass,
  toFieldErrors,
  type FieldErrors,
} from '@app/shared';
import { useCreateTodo } from './hooks';
import { createTodoSchema } from './schema';

type CreateTodoFormProps = {
  defaultAssigneeId?: string;
};

export function CreateTodoForm({ defaultAssigneeId = '' }: CreateTodoFormProps) {
  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState(defaultAssigneeId);
  const [errors, setErrors] = useState<FieldErrors>({});
  const titleRef = useRef<HTMLInputElement>(null);
  const assigneeRef = useRef<HTMLInputElement>(null);
  const createTodo = useCreateTodo();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = createTodoSchema.safeParse({ title, assigneeId });
    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      (fieldErrors.title ? titleRef : assigneeRef).current?.focus();
      return;
    }
    setErrors({});

    const submitted = parsed.data;
    // The item is already in the list, so clear the input right away.
    setTitle('');
    createTodo.mutate(submitted, {
      // Give the text back if the server rejected it, so nothing is lost.
      onError: () => setTitle(submitted.title),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField
        label="Title"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        error={errors.title}
        autoComplete="off"
        inputRef={titleRef}
      />
      <TextField
        label="Assignee user ID"
        name="assigneeId"
        value={assigneeId}
        onChange={(event) => setAssigneeId(event.target.value)}
        error={errors.assigneeId}
        autoComplete="off"
        inputRef={assigneeRef}
      />
      {createTodo.isError ? (
        <p role="alert" className={alertClass}>
          Could not add &ldquo;{createTodo.variables.title}&rdquo;: {createTodo.error.message} The
          item was removed from the list.
        </p>
      ) : null}
      <button type="submit" className={buttonClass}>
        Add todo
      </button>
    </form>
  );
}
