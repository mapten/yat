import { useEffect, useState } from 'react';

// Store
import { useConfigurationStore } from '../store/configuration.store';
import { useTaskStore } from '../store/task.store';
import { useAuthStore } from '../store/auth.store';

// Hooks
import { useOnlineStatus } from './useOnlineStatus';

export const useStore = () => {
  const [isTaskStoreHydrated, setIsTaskStoreHydrated] = useState<boolean>(false);

  const { storeMode, setConnectionState, reconnectedToServer } = useConfigurationStore((state) => state);
  const { isLoginVisible } = useAuthStore((state) => state);
  const { syncOfflineTasks } = useTaskStore((state) => state);
  
 useOnlineStatus(setConnectionState);

  useEffect(() => {
    useTaskStore.persist.onFinishHydration(() => {
      setIsTaskStoreHydrated(true);
    });
  }, []);

  useEffect(() => {
    reconnectedToServer(() => {
      syncOfflineTasks();
    });
  }, []);

  useEffect(() => {
    /** This is a way to trigger a rehydration when the store changes between 
     * online and offline mode (sessionStorage and localStorage).
     */
    setIsTaskStoreHydrated(false);
  }, [storeMode]);

  useEffect(() => {
    /**
     * It can happen that the store is hydrated after the first task list render.
     * If that happens, the app will start without tasks.
     * In this case, we need to re hydrate the store, and then render the task list.
     */
    if (isTaskStoreHydrated === false) {
      useTaskStore.persist.rehydrate();
    }
  }, [isTaskStoreHydrated]);

  return { storeHasLoaded: isTaskStoreHydrated, isLoginVisible };
};