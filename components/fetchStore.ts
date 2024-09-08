import { create } from "zustand";

type UpdateStore = {
  isfetching: boolean;
  setIsfetching: (updating: boolean) => void;
}

export const useFetchStore = create<UpdateStore>((set) => ({
    isfetching: false,
    setIsfetching: (updating: boolean) => set({ isfetching: updating }),
}));
