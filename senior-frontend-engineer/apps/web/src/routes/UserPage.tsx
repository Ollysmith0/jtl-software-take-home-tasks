import { Link } from '@tanstack/react-router';
import { useSetAtom } from 'jotai';
import { linkClass, selectedUserIdAtom } from '@app/shared';
import { UserDetail } from '@app/users';

export function UserPage({ userId }: { userId: string }) {
  const setSelectedUserId = useSetAtom(selectedUserIdAtom);

  return (
    <>
      <h1 className="text-2xl font-semibold">User details</h1>
      <UserDetail userId={userId} />
      <p>
        <Link to="/todos" className={linkClass} onClick={() => setSelectedUserId(userId)}>
          View this user&rsquo;s todos
        </Link>
      </p>
    </>
  );
}
