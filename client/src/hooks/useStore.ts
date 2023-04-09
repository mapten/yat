import { useEffect, useState } from 'react';

// Store
import { useConfigurationStore } from '../store/configuration.store';
import { useTaskStore } from '../store/task.store';
import { useAuthStore } from '../store/auth.store';

// Hooks
import { useOnlineStatus } from './useOnlineStatus';

export const useStore = () => {
  const [isTaskStoreHydrated, setIsTaskStoreHydrated] = useState<boolean>(false);

  const { setConnectionMode } = useConfigurationStore((state) => state);
  const { loginVisibleMode } = useAuthStore((state) => state);

  useOnlineStatus(setConnectionMode);

  useTaskStore.persist.onFinishHydration(() => {
    setIsTaskStoreHydrated(true);
  });

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

  return { isTaskStoreHydrated, loginVisibleMode };
};