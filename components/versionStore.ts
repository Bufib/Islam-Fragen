import { create } from "zustand";

type VersionState = {
  isDifferent: boolean;
  dataVersion: string | null;
  setIsDifferent: () => void;
  setIsEqual: () => void;
  setVersion: (newVersion: string) => void;
};
const useVersionStore = create<VersionState>((set) => ({
  isDifferent: false,
  dataVersion: null,
  setIsDifferent: () => set({ isDifferent: true }),
  setIsEqual: () => set({ isDifferent: false }),
  setVersion: (newVersion) => set({ dataVersion: newVersion }),
}));

export default useVersionStore;
