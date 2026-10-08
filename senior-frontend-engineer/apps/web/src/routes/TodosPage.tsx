import { useAtom } from 'jotai';
import { selectedUserIdAtom } from '@app/shared';
import { CreateTodoForm, TodoList } from '@app/todos';
import { SelectUserForm } from './SelectUserForm';

export function TodosPage() {
  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdAtom);

  return (
    <>
      <h1 className="text-2xl font-semibold">Todos</h1>
      <SelectUserForm initialUserId={selectedUserId} onSelect={setSelectedUserId} />

      <section aria-labelledby="add-todo-heading" className="space-y-3">
        <h2 id="add-todo-heading" className="text-lg font-semibold">
          Add a todo
        </h2>
        {/* key resets the form's assignee field when the selected user changes */}
        <CreateTodoForm key={selectedUserId ?? 'none'} defaultAssigneeId={selectedUserId ?? ''} />
      </section>

      <section aria-labelledby="todo-list-heading" className="space-y-3">
        <h2 id="todo-list-heading" className="text-lg font-semibold">
          {selectedUserId ? `Todos for user ${selectedUserId}` : 'Todos'}
        </h2>
        {selectedUserId ? (
          <TodoList userId={selectedUserId} />
        ) : (
          <p className="text-slate-600">Choose a user to see their todos.</p>
        )}
      </section>
    </>
  );
}
