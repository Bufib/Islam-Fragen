import { create } from "zustand";

interface IsUpdatingState {
  newUpdateAvailable: boolean;
  update: (bool: boolean) => void;
}

export const useIsNewUpdateAvailable = create<IsUpdatingState>((set) => ({
    newUpdateAvailable: false,
    update: (bool: boolean) => set((state) => ({ newUpdateAvailable: bool })),
}));
