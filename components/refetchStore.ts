import { create } from "zustand";

type UpdateStore = {
  isRefetching: boolean;
  setIsRefetching: (updating: boolean) => void;
}

export const useRefetchStore = create<UpdateStore>((set) => ({
  isRefetching: false,
  setIsRefetching: (updating: boolean) => set({ isRefetching: updating }),
}));
