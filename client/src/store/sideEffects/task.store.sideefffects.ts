import toast from 'react-hot-toast';
import { StoreApi } from 'zustand';

// Stores
import { ConfigurationState } from '../configuration.store';
import { TaskState } from '../task.store';

/**
 * Sync the offline tasks and fetch the tasks from the server
 */
export const syncAndFetchTasks = async (taskStore: StoreApi<TaskState>, displayToast: boolean) => {
  const functionArray = [
    () => taskStore.getState().syncOfflineTasks(), 
    () => taskStore.getState().fetchTasks()
  ];

  const secuentiallyExecute = async () => {
    for (const fn of functionArray) {
      await fn();
    }
  };

  if (displayToast) {
    toast.promise(
      secuentiallyExecute(),
      {
        loading: 'Syncing tasks...',
        success: 'Tasks have been synced',
        error: 'Error while syncing tasks',
      },
    );
  } else {
    await secuentiallyExecute();
  }
}