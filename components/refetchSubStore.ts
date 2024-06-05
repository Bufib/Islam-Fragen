import { create } from "zustand";

interface IsChangingState {
  fetchStatus: { [tableName: string]: boolean };
  setRefetch: (tableName: string) => void;
  hasRefetched: (tableName: string) => boolean;
}

export const useRefetchSubeStore = create<IsChangingState>((set, get) => ({
  fetchStatus: {},
  setRefetch: (tableName: string) =>
    set((state) => ({
      fetchStatus: {
        ...state.fetchStatus,
        [tableName]: true,
      },
    })),
  hasRefetched: (tableName: string) => {
    const state = get();
    // Convert to Boolean
    return !!state.fetchStatus[tableName];
  },
}));
