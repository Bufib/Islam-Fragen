import { create } from "zustand";

// Define the types for the store's state and actions
interface TableNamesStore {
  hasFetchedTableNames: boolean;
  setHasFetchedTableNames: (value: boolean) => void;
}

// Define the Zustand store with typed state and actions
export const useHasFetchedTableNames = create<TableNamesStore>((set) => ({
  hasFetchedTableNames: false, // initial state
  setHasFetchedTableNames: (value: boolean) =>
    set(() => ({ hasFetchedTableNames: value })), // update the state with the provided value
}));
