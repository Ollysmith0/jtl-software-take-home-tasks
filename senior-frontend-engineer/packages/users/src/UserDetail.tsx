import { ApiError, alertClass } from '@app/shared';
import { useUser } from './hooks';

export function UserDetail({ userId }: { userId: string }) {
  const user = useUser(userId);

  if (user.isPending) {
    return <p role="status">Loading user…</p>;
  }

  if (user.isError) {
    const notFound = user.error instanceof ApiError && user.error.code === 'not_found';
    return (
      <p role="alert" className={alertClass}>
        {notFound ? `No user with ID ${userId}.` : `Could not load the user: ${user.error.message}`}
      </p>
    );
  }

  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2">
      <dt className="font-medium text-slate-600">ID</dt>
      <dd>{user.data.id}</dd>
      <dt className="font-medium text-slate-600">Username</dt>
      <dd>{user.data.username}</dd>
    </dl>
  );
}
