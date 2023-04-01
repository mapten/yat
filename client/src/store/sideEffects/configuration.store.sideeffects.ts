import toast from 'react-hot-toast';
import { StoreApi } from 'zustand';

// Types
import { CONNECTION_MODE, SERVER_CONNECTION_STATE } from '../../typings/common.types';

// Services
import { pingToServer } from '../../services/generic.service';

// Store
import { ConfigurationState } from '../configuration.store';
import { createJSONStorage } from 'zustand/middleware';

/**
 * Function that tries to reconnect to the server every 2 minutes
 */
const tryToReconnectToServer = async (state: StoreApi<ConfigurationState>) => {
  const { getState: get, setState: set } = state;

  let retries = Number(import.meta.env.VITE_API_AXIOS_RETRIES);

  const checkIsConnectedToServer = async () => {
    const isOnline = await pingToServer().then(() => true).catch(() => false);
    if (isOnline) {
      set({ connectionErrors: 0 });
      set({ serverConnectionState: 'connected' });
      toast.success('Connection to the server has been restored');
    } else {
      retries--;
    }
  };

  while (retries > 0) {
    await new Promise(resolve => setTimeout(() => resolve(true), 120000));
    await checkIsConnectedToServer();
  }
}

export const serverConnectionStateAfterChange = (store: StoreApi<ConfigurationState>, newServerConnectionState: SERVER_CONNECTION_STATE) => {
  const { getState: get, setState: set } = store;

  if (get().connectionMode === 'connected' && get().storeMode === 'online' && newServerConnectionState === 'error') {
    toast.error('There is a problem with the connection to the server. You are working in offline mode. Your changes will be synchronized when the connection is restored');
    set({ storeMode: 'offline' });
    tryToReconnectToServer(store);
    return;
  }
};

export const connectionModeBeforeChange = (store: StoreApi<ConfigurationState>, newConnectionMode: CONNECTION_MODE) => {
  const { getState: get, setState: set } = store;

  if (get().connectionMode === 'connected' && newConnectionMode === 'disconnected' && get().storeMode === 'online') {
    set({ storeMode: 'offline' });
    toast.error('There is no internet connection. You are working in offline mode. Your changes will be synchronized when the connection is restored');
    return;
  }
  if (get().connectionMode !== 'connected' && newConnectionMode === 'connected') {
    toast.success('Internet connection has been restored');

    import('../auth.store').then(({ useAuthStore }) => {
      if (useAuthStore().isAuthenticated()) {
        set({ storeMode: 'online' });
        return;
      }
      toast('Log in again to synchronize your data');
    });
  }
}

export const connectionErrorsAfterChange = (store: StoreApi<ConfigurationState>, connectionErrors: number) => {
  const { setState: set } = store;

  if (connectionErrors > Number(import.meta.env.VITE_API_AXIOS_RETRIES)) {
    set({ serverConnectionState: 'error' });
  }
};

export const storeModeBeforeChange = async (store: StoreApi<ConfigurationState>, newStoreMode: 'online' | 'offline') => {
  if (newStoreMode === store.getState().storeMode) {
    return;
  }

  if (newStoreMode === 'offline' && store.getState().storeMode === 'online') {
    import('../auth.store').then(({ useAuthStore }) => {
      useAuthStore().logout();
    });
  }

  import('../task.store').then(({ useTaskStore }) => {
    useTaskStore.persist.setOptions({
      storage: createJSONStorage(() => newStoreMode === 'online' ? sessionStorage : localStorage),
    });

    if (newStoreMode === 'offline') {
      // when the user goes offline, we remove the task storage in order to avoid conflicts
      sessionStorage.removeItem('task-storage');
      return;
    }

    import('./task.store.sideefffects').then(({ syncAndFetchTasks }) => {
      syncAndFetchTasks(useTaskStore, true);
    });
  });
}