import { create } from "zustand";

// Define the types for the store's state and actions
interface SuperCategoriesStore {
  hasFetchedSuperCategories: boolean;
  setHasFetchedSuperCategories: (value: boolean) => void;
}

// Define the Zustand store with typed state and actions
export const useHasFetchedSuperCategories = create<SuperCategoriesStore>(
  (set) => ({
    hasFetchedSuperCategories: false, // initial state
    setHasFetchedSuperCategories: (value: boolean) =>
      set(() => ({ hasFetchedSuperCategories: value })), // update the state with the provided value
  })
);
