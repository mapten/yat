import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

// Services
import { pingToServer } from '../services/general.service';

// Types
import { CONNECTION_STATE, STORE_MODE, THEME } from '../typings/common.types';

export type State = {
  isLoginVisible: boolean;
  theme: THEME;
  storeMode: STORE_MODE;
  connectionState: CONNECTION_STATE;
  connectionErrors: number;
  reconnectToServerListeners: (() => void)[];
}

type Actions = {
  clear: () => void;
  setTheme: (theme: THEME) => void;
  getStoreMode: () => STORE_MODE;
  setStoreMode: (storeMode: STORE_MODE) => void;
  increaseConnectionErrors: () => void;
  tryToReconnectToServer: () => Promise<void>;
  setConnectionState: (connectionState: CONNECTION_STATE) => void;
  reconnectedToServer: (callback: () => void) => void;
}

export type ConfigurationState = State & Actions;

export const useConfigurationStore = create<ConfigurationState>()(
  // @ts-ignore
  persist(devtools((set, get) => ({
    storeMode: 'offline',
    connectionState: 'connected',
    theme: 'light',
    connectionErrors: 0,
    reconnectToServerListeners: [],

    clear: () => set({
      storeMode: 'offline',
      connectionState: 'connected',
      theme: 'light',
      connectionErrors: 0,
      reconnectToServerListeners: [],
    }),

    setTheme: (theme: THEME) => set({ theme }),

    getStoreMode: () => {
      return get().storeMode;
    },

    setStoreMode: (storeMode: STORE_MODE) => {
      if (get().storeMode === 'offline' && storeMode === 'online') {
        get().reconnectToServerListeners.forEach((cb) => cb());
      }
      set({
        storeMode
      });
    },

    tryToReconnectToServer: async () => {
      let retries = 20;

      const checkIsConnectedToServer = async () => {
        const isOnline = await pingToServer().then(() => true).catch(() => false);
        if (isOnline) {
          set({ connectionErrors: 0 });
          toast.success('Connection to the server has been restored');
          get().reconnectToServerListeners.forEach((cb) => cb());
          return true;
        } else {
          retries--;
          return false;
        }
      };

      while (retries > 0) {
        await new Promise(resolve => setTimeout(() => resolve(true), 120000))

        const connected = await checkIsConnectedToServer();
        if (connected) {
          get().setConnectionState('connected');
          return;
        }
      }
    },

    increaseConnectionErrors: () => {
      set({ connectionErrors: get().connectionErrors + 1 });

      if (get().connectionErrors > Number(import.meta.env.VITE_API_AXIOS_RETRIES)) {
        set({ connectionErrors: 0 });
        get().setConnectionState('serverError');
      }
    },

    setConnectionState: (connectionState: CONNECTION_STATE) => {
      if (get().connectionState === 'connected' && connectionState === 'serverError' && get().storeMode === 'online') {
        toast.error('There is a problem with the connection to the server. You are working in offline mode. Your changes will be synchronized when the connection is restored');
        set({ storeMode: 'error' });
        get().tryToReconnectToServer();
      }
      if (get().connectionState === 'connected' && connectionState === 'disconnected' && get().storeMode === 'online') {
        set({ storeMode: 'error' });
        toast.error('There is no internet connection. You are working in offline mode. Your changes will be synchronized when the connection is restored');
      }
      if (get().connectionState !== 'connected' && connectionState === 'connected' && get().storeMode === 'error') {
        toast.success('Internet connection has been restored');
        get().setStoreMode('online');
      }
      set({ connectionState });
    },

    reconnectedToServer: (callback: () => void) => {
      set((state) => ({ reconnectToServerListeners: [...new Set([...state.reconnectToServerListeners, callback])] }));

      return () => {
        set((state) => ({ reconnectToServerListeners: state.reconnectToServerListeners.filter((listener) => listener !== callback) }));
      };
    }
  })), {
    name: 'configuration-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ theme: state.theme }),
  })
);