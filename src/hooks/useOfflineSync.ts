import {useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online !== null ? online : false);
      setIsConnecting(state.isConnected === null);
    });

    return () => unsubscribe();
  }, []);

  return {
    isOnline,
    isConnecting,
  };
};
