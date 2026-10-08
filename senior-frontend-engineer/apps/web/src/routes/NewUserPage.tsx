import { useNavigate } from '@tanstack/react-router';
import { useSetAtom } from 'jotai';
import { selectedUserIdAtom } from '@app/shared';
import { CreateUserForm } from '@app/users';

export function NewUserPage() {
  const navigate = useNavigate();
  const setSelectedUserId = useSetAtom(selectedUserIdAtom);

  return (
    <>
      <h1 className="text-2xl font-semibold">Create a user</h1>
      <CreateUserForm
        onCreated={(user) => {
          setSelectedUserId(user.id);
          void navigate({ to: '/users/$userId', params: { userId: user.id } });
        }}
      />
    </>
  );
}
