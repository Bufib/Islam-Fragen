import { useState, useEffect } from 'react';
import * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';

export default function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        // Get the network state from Expo's Network API
        const networkState = await Network.getNetworkStateAsync();
        const netInfoState = await NetInfo.fetch();
        const isOnline = netInfoState.isConnected && networkState.isConnected;

        if (!isConnected && isOnline) {
          // If the connection was previously offline and is now online, reload the app or do something
          console.log('Back online');
        }
        
        setIsConnected(isOnline);
      } catch (error) {
        console.error('Failed to fetch network status:', error);
        setIsConnected(false);
      }
    };

    // Initial check for network status
    checkNetworkStatus();

    // Subscribe to network status updates
    const unsubscribe = NetInfo.addEventListener(state => {
      const isOnline = state.isConnected;
      if (isOnline !== isConnected) {
        setIsConnected(isOnline);
        if (isOnline) {
          // Handle case when back online
          console.log('Back online');
        }
      }
    });

    // Cleanup the listener on component unmount
    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  return { isConnected };
}
