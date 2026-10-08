import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, fetchUser } from './api';

export const userKeys = {
  detail: (id: string) => ['users', id] as const,
};

export const userQueryOptions = (id: string) =>
  queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
  });

export function useUser(id: string) {
  return useQuery(userQueryOptions(id));
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (user) => {
      // Seed the detail cache so the redirect to the new user renders instantly.
      queryClient.setQueryData(userKeys.detail(user.id), user);
    },
  });
}
