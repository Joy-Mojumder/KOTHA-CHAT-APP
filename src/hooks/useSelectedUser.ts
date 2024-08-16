import { create } from "zustand";
interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

type SelectedUser = {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
};

export const useSelectedUser = create<SelectedUser>((set) => ({
  selectedUser: null,
  setSelectedUser: (user: User | null) => set({ selectedUser: user }),
}));
