  import { create } from "zustand";

  type VersionState = {
    isDifferent: boolean;
    setIsDifferent: () => void;
    setIsEqual: () => void;
  }
  const useVersionStore = create<VersionState>((set) => ({
    isDifferent: false,
    setIsDifferent: () => set({ isDifferent: true }),
    setIsEqual: () => set({ isDifferent: false }),
  }));

  export default useVersionStore;
