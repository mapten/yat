import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

// Models
import { Task } from '../models/task.model';

// Types
import { STORE_RESULT, SYNC_STATUS } from '../typings/common.types';

//Store
import { useConfigurationStore } from './configuration.store';
import { useAuthStore } from './auth.store';

// Services
import {
  changeStatus as changeStatusService,
  createTask as createTaskService,
  deleteTask as deleteTaskService,
  fetchUserTasks as fetchUserTasksService,
  updateTask as updateTaskService,
  syncTasks as syncTasksService
} from '../services/tasks.service';
import { getDateNowService } from '../services/system/datetimeNow.service';

const getStoreMode = () => useConfigurationStore.getState().getStoreMode();
const getUser = () => useAuthStore.getState().getUser();

type State = {
  tasks: Task[];
}

type Actions = {
  setTasks: (tasks: Task[]) => void;
  reset: () => void;
  fetchTasks: () => Promise<void>;
  syncOfflineTasks: () => Promise<void>;
  getTasks: () => Task[];
  getFilteredTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getPendingTasks: () => Task[];
  addTask: (task: Partial<Task>) => Promise<STORE_RESULT>;
  changeTaskStatus: (taskId: string, done: boolean) => Promise<void>;
  updateTask: (task: Partial<Task>) => Promise<STORE_RESULT>;
  deleteTask: (taskId: string) => Promise<STORE_RESULT>;
}

export type TaskState = State & Actions;

export const initialState = {
  tasks: [],
};

export const useTaskStore = create<TaskState>()(
  persist(devtools((set, get) => ({
    ...initialState,

    setTasks: (tasks: Task[]) => set({ tasks }),

    reset: () => set({ tasks: [] }),

    getTasks: () => get().tasks,

    getFilteredTasks: () => get().tasks
      .filter((task) => !task.deleted)
      .sort((taskA, taskB) => (taskA.priority - taskB.priority)),

    getCompletedTasks: () => get().getFilteredTasks().filter((task) => task.done),

    getPendingTasks: () => get().getFilteredTasks().filter((task) => !task.done),

    fetchTasks: async () => {
      const user = getUser();
      if (!user) {
        return;
      }

      const fetchTasks = () => fetchUserTasksService(user.id).then((response) => {
        if (!response) {
          return;
        }

        const { existingTasksFromResponse, newTaskFromResponse } =
          response
            .reduce((acc: { existingTasksFromResponse: Task[], newTaskFromResponse: Task[] }, task) => {
              if (get().tasks.find((t) => t.id === task.id)) {
                acc.existingTasksFromResponse.push(task);
              } else {
                acc.newTaskFromResponse.push(task);
              }
              return acc;
            }, { existingTasksFromResponse: [], newTaskFromResponse: [] });

        const mergedExistingTasks = get().tasks.map((task) => {
          const matchingTaskFromResponse = existingTasksFromResponse.find((t) => t.id === task.id);
          if (matchingTaskFromResponse) {
            return { ...matchingTaskFromResponse, ...task };
          }
          return task;
        });

        const finalTasks = mergedExistingTasks.concat(newTaskFromResponse).map((task) => ({...task, syncStatus: 'synced' as SYNC_STATUS}));

        set((state) => ({ ...state, tasks: finalTasks }));
      });

      await fetchTasks();
    },

    addTask: async (task: Partial<Task>) => {
      const existsTaskWithSameName = () =>
        get()
          .getFilteredTasks()
          .some((t) =>
            t.displayName === task.displayName
            && (task.categoryId ? t.categoryId === task.categoryId : true)
          );

      if (existsTaskWithSameName()) {
        toast.error(`Task with name "${task.displayName}" already exists${task.categoryId ? ` in category "${task.categoryId}"` : ''}`);
        return 'fail';
      }

      const createdTask = {
        ...task,
        id: uuidv4(),
        createdAt: getDateNowService().toISOString(),
        userId: getUser()?.id,
        syncStatus: 'unsynced',
      } as Task;

      if (getStoreMode() === 'online') {
        const { syncStatus, isFail } = await createTaskService(createdTask).then(() => {
          return { syncStatus: 'synced' as SYNC_STATUS, isFail: false };
        }).catch((error) => {
          return { syncStatus: 'error' as SYNC_STATUS, isFail: error.response?.status === 422 };
        });

        if (isFail) {
          return 'fail';
        }

        createdTask.syncStatus = syncStatus;
      }
      set((state) => ({ tasks: [...state.tasks, createdTask] }));

      return 'success';
    },

    changeTaskStatus: async (taskId: string, done: boolean) => {
      const updatedTask: Task = {
        ...get().tasks.find((task) => task.id === taskId) as Task,
        done,
        updatedAt: getDateNowService().toISOString(),
        syncStatus: 'unsynced'
      };

      if (getStoreMode() === 'online') {
        const syncStatus = await changeStatusService(taskId, done).then(() => {
          return 'synced';
        }).catch(() => {
          return 'error';
        });

        updatedTask.syncStatus = syncStatus as SYNC_STATUS;
      }
      set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id === taskId) {
            return updatedTask;
          }
          return task;
        }),
      }));
    },

    updateTask: async (task: Partial<Task>) => {
      const existsTaskWithSameName = () =>
        get()
          .getFilteredTasks()
          .some((t) =>
            t.id !== task.id
            && t.displayName === task.displayName
            && (task.categoryId ? t.categoryId === task.categoryId : true)
          );

      if (existsTaskWithSameName()) {
        toast.error(`Task with name "${task.displayName}" already exists${task.categoryId ? ` in category "${task.categoryId}"` : ''}`);
        return 'fail';
      }

      const existingTask = get().getFilteredTasks().find((t) => t.id === task.id) as Task;

      const updatedTask: Task = {
        ...existingTask,
        ...task,
        updatedAt: getDateNowService().toISOString(),
        syncStatus: 'unsynced'
      };

      if (getStoreMode() === 'online') {
        const { syncStatus, isFail } = await updateTaskService(updatedTask).then(() => {
          return { syncStatus: 'synced' as SYNC_STATUS, isFail: false };
        }).catch((error) => {
          return { syncStatus: 'error' as SYNC_STATUS, isFail: error.response?.status === 422 };
        });

        if (isFail) {
          return 'fail';
        }

        updatedTask.syncStatus = syncStatus;
      }
      set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id === task.id) {
            return updatedTask;
          }
          return t;
        }),
      }));
      return 'success';
    },

    deleteTask: async (taskId: string) => {
      if (getStoreMode() === 'online') {
        const deletedTask = await deleteTaskService(taskId);

        if (deletedTask) {
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
          }));
          return 'success';
        }
        return 'fail';
      }
      set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, deleted: true, syncStatus: 'unsynced' };
          }
          return task;
        }),
      }));

      return 'success';
    },

    syncOfflineTasks: async () => {
      const user = getUser();
      if (!user) {
        return;
      }

      const tasksToSync = get().tasks
        .filter((task) => task.syncStatus !== 'synced')
        .map((task) => (
          {
            ...task,
            userId: user.id,
          })
        );

      if (!tasksToSync?.length) {
        return;
      }

      const syncTasks = () => syncTasksService(user.id, tasksToSync).then(() => {
        set((state) => {
          const updatedTasks = [...state.tasks].map((task) => {
            if (task.syncStatus !== 'synced') {
              return { ...task, syncStatus: 'synced' };
            }
            return task;
          }).filter((task) => task && !task.deleted) as Task[];

          return { ...state, tasks: updatedTasks };
        });
      }).catch(() => {
        set((state) => ({
          ...state,
          tasks: state.tasks.map((task) => {
            if (task.syncStatus === 'unsynced') {
              return { ...task, syncStatus: 'error' };
            }
            return task;
          }),
        }));
      });
      await syncTasks();
    },
  })), {
    name: 'task-storage',
    storage: createJSONStorage(() => localStorage)
  })
);

// selectors
export const getPercentageCompletedTasks = (state: State) => {
  if (!state.tasks || state.tasks.length === 0) {
    return 0;
  }

  const nonDeletedTasks = state.tasks.filter(task => !task.deleted);

  if (!nonDeletedTasks || nonDeletedTasks.length === 0) {
    return 0;
  }

  return nonDeletedTasks.filter(task => task.done).length / nonDeletedTasks.length * 100;
}