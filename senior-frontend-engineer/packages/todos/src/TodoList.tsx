import { ApiError, alertClass, buttonClass } from '@app/shared';
import { isOptimisticTodo, useTodos } from './hooks';

export function TodoList({ userId }: { userId: string }) {
  const todos = useTodos(userId);

  if (todos.isPending) {
    return <p role="status">Loading todos…</p>;
  }

  if (todos.isError) {
    const notFound = todos.error instanceof ApiError && todos.error.code === 'not_found';
    return (
      <div className="space-y-3">
        <p role="alert" className={alertClass}>
          {notFound ? `No user with ID ${userId}.` : `Could not load todos: ${todos.error.message}`}
        </p>
        {notFound ? null : (
          <button type="button" className={buttonClass} onClick={() => void todos.refetch()}>
            Try again
          </button>
        )}
      </div>
    );
  }

  if (todos.data.length === 0) {
    return <p className="text-slate-600">No todos assigned to user {userId} yet.</p>;
  }

  return (
    <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
      {todos.data.map((todo) => {
        const saving = isOptimisticTodo(todo);
        return (
          <li key={todo.id} aria-busy={saving} className="flex items-center justify-between px-4 py-3">
            <span>{todo.title}</span>
            {saving ? <span className="text-sm text-slate-500">Saving…</span> : null}
          </li>
        );
      })}
    </ul>
  );
}
