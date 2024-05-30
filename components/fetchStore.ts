import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface IsChangingState {
  initialFetch: boolean;
  setInitialFetch: () => void;
  initializeInitialFetch: () => void;
}

export const useIsInitialFetching = create<IsChangingState>((set) => ({
  initialFetch: false,
  setInitialFetch: async () => {
    await AsyncStorage.setItem('initialFetch', JSON.stringify(true)); // Store true in AsyncStorage
    set({ initialFetch: true }); // Update Zustand state
  },
  initializeInitialFetch: async () => {
    const initialFetch = await AsyncStorage.getItem('initialFetch');
    set({ initialFetch: initialFetch !== null ? JSON.parse(initialFetch) : false });
  },
}));

// Initialize state from AsyncStorage when the app starts
useIsInitialFetching.getState().initializeInitialFetch();
