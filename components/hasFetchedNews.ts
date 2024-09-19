import { create } from "zustand";

// Define the types for the store's state and actions
interface TableNewsStore {
  hasFetchedNews: boolean;
  setHasFetchedNews: (value: boolean) => void;
}

// Define the Zustand store with typed state and actions
export const useHasfetchedNews = create<TableNewsStore>((set) => ({
  hasFetchedNews: false, // initial state
  setHasFetchedNews: (value: boolean) =>
    set(() => ({ hasFetchedNews: value })), // update the state with the provided value
}));
