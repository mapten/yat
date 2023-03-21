import { useEffect } from 'react';

// types
import { CONNECTION_STATE } from '../typings/common.types';

/**
 * Hook is used to detect when the user goes online or offline.
 */
export const useOnlineStatus = (callback: (mode: CONNECTION_STATE) => void) => {
  useEffect(() => {
    window.addEventListener('online', () => callback('connected'), true);
    window.addEventListener('offline', () => callback('disconnected'), true);
    return () => {
      window.removeEventListener('online', () => callback('connected'), true);
      window.removeEventListener('offline', () => callback('disconnected'), true);
    };
  }, [callback]);
};