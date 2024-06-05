import { create } from "zustand";

interface IsChangingState {
  hasRefetched: boolean;
  setRefetch: () => void;
}

export const useRefetchNewsStore = create<IsChangingState>((set) => ({
  hasRefetched: false,
  setRefetch: () =>
    set((state) => ({ hasRefetched: !state.hasRefetched })),
}));
