import { create } from "zustand";

interface UserState {
  id?: number;
  address?: string;
  verified: boolean;
  setUser: (
    user: Partial<Pick<UserState, "id" | "address" | "verified">>
  ) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: undefined,
  address: undefined,
  verified: false,
  setUser: (user) => set((s) => ({ ...s, ...user })),
  resetUser: () => set({ id: undefined, address: undefined, verified: false }),
}));
