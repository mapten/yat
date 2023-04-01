import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

// Types
import { CONNECTION_MODE, SERVER_CONNECTION_STATE, STORE_MODE, THEME } from '../typings/common.types';

// Middleware
import { interceptor } from './middleware/interceptor.middleware';

export type State = {
  isLoading: boolean;
  theme: THEME;
  storeMode: STORE_MODE;
  connectionMode: CONNECTION_MODE;
  serverConnectionState: SERVER_CONNECTION_STATE;
  connectionErrors: number;
}

type Actions = {
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
  setTheme: (theme: THEME) => void;
  getStoreMode: () => STORE_MODE;
  setStoreMode: (storeMode: STORE_MODE) => void;
  setConnectionMode: (connectionMode: CONNECTION_MODE) => void;
  setServerConnectionState: (serverConnectionState: SERVER_CONNECTION_STATE) => void;
  increaseConnectionErrors: () => void;
}

export type ConfigurationState = State & Actions;

const initialState: State = {
  isLoading: false,
  storeMode: 'offline',
  connectionMode: 'connected',
  serverConnectionState: 'connected',
  theme: 'light',
  connectionErrors: 0
};

export const useConfigurationStore = create<ConfigurationState>()(
  persist(interceptor(devtools((set, get) => ({
    ...initialState,

    setIsLoading: (isLoading: boolean) => set({ isLoading }),

    reset: () => set(initialState),

    setTheme: (theme: THEME) => set({ theme }),

    getStoreMode: () => {
      return get().storeMode;
    },

    setStoreMode: (storeMode: STORE_MODE) => set({ storeMode }),

    setConnectionMode: (connectionMode: CONNECTION_MODE) => {
      set({ connectionMode: connectionMode });
    },

    setServerConnectionState: (serverConnectionState: SERVER_CONNECTION_STATE) => {
      set({ serverConnectionState });
    },

    increaseConnectionErrors: () => {
      set((state) => ({ connectionErrors: state.connectionErrors + 1 }));
    }
  }))), {
    name: 'configuration-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ theme: state.theme, storeMode: state.storeMode, connectionState: state.connectionMode, serverConnectionState: state.serverConnectionState }),
  })
);