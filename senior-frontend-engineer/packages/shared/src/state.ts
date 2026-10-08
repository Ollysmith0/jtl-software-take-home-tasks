import { atom } from 'jotai';

// Stores only the ID. The User itself stays in TanStack Query.
export const selectedUserIdAtom = atom<string | null>(null);
