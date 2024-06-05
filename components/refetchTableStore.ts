import { create } from "zustand";

interface IsChangingState {
  hasRefetched: boolean;
  setRefetch: () => void;
}

export const useRefetchTableStore = create<IsChangingState>((set) => ({
  hasRefetched: false,
  setRefetch: () =>
    set((state) => ({ hasRefetched: !state.hasRefetched })),
}));
