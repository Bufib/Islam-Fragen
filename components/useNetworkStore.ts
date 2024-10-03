// useNetworkStore.ts
import { create } from "zustand";
import NetInfo from "@react-native-community/netinfo";

interface NetworkState {
  isConnected: boolean | null;
  initialize: () => () => void; // Update the return type to () => void
}

const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: null,
  initialize: () => {
    // Fetch the current network state once
    NetInfo.fetch().then((state) => {
      set({ isConnected: state.isConnected });
    });

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      set({ isConnected: state.isConnected });
    });

    // Return the unsubscribe function for cleanup
    return unsubscribe;
  },
}));

export default useNetworkStore;
