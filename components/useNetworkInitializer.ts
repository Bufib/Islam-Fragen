// useNetworkInitializer.ts
import { useEffect } from 'react';
import useNetworkStore from './useNetworkStore';

export function useNetworkInitializer() {
  const initialize = useNetworkStore((state) => state.initialize);

  useEffect(() => {
    const unsubscribe = initialize(); // initialize returns the unsubscribe function

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Unsubscribe from network changes when component unmounts
      }
    };
  }, [initialize]);
}
