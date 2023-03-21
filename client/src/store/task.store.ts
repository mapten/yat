import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

// Models
import { Task } from '../models/task.model';

//Store
import { useConfigurationStore } from './configuration.store';

// Services
import { changeStatus, createTask, deleteTask, fetchUserTasks, updateTask, syncTasks } from '../services/tasks.service';
import { useAuthStore } from './auth.store';

const getStoreMode = () => useConfigurationStore.getState().getStoreMode();
const getUser = () => useAuthStore.getState().getUser();


type State = {
  tasks: Task[];
  hasHydrated: boolean;
}

type Actions = {
  setTasks: (tasks: Task[]) => void;
  clearTasks: () => void;
  fetchTasks: () => Promise<void>;
  getTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getPendingTasks: () => Task[];
  addTask: (task: Task) => Promise<void>;
  changeTaskStatus: (taskId: string, done: boolean) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  syncOfflineTasks: () => void;
}

export type TaskState = State & Actions;

export const useTaskStore = create<TaskState>()(
  // @ts-ignore
  persist(devtools((set, get) => ({
    tasks: [],
    hasHydrated: false,

    setTasks: (tasks: Task[]) => set({ tasks }),

    clearTasks: () => set({ tasks: [] }),

    getTasks: () => get().tasks
      .filter((task) => !task.deleted)
      .sort((taskA, taskB) => (taskA.priority - taskB.priority)),

    getCompletedTasks: () => get().getTasks().filter((task) => task.done),

    getPendingTasks: () => get().getTasks().filter((task) => !task.done),

    fetchTasks: async () => {
      const user = getUser();
      if (getStoreMode() === 'offline' || !user) {
        return;
      }

      const response = await fetchUserTasks(user.id);
      if (!response) {
        return;
      }

      const { existingTasksFromResponse, newTaskFromResponse } = 
        response.reduce((acc: {existingTasksFromResponse: Task[], newTaskFromResponse: Task[]}, task) => {
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
          return {...matchingTaskFromResponse, ...task};
        }
        return task;
      });

      const finalTasks = mergedExistingTasks.concat(newTaskFromResponse);

      set({tasks: finalTasks});
    },

    addTask: async (task: Task) => {
      const existsTaskWithSameName = () =>
        get()
          .getTasks()
          .some((t) => 
            t.displayName === task.displayName 
            && (task.categoryId ? t.categoryId === task.categoryId : true)
          );

      if (existsTaskWithSameName()) {
        toast.error(`Task with name "${task.displayName}" already exists${task.categoryId ? ` in category "${task.categoryId}"` : ''}`);
        return;
      }

      const createdTask: Task = {
        ...task,
        createdAt: new Date().toISOString(),
        userId: getUser()?.id,
        deleted: false,
        syncStatus: 'unsynced',
      };

      if (getStoreMode() === 'online') {
        await createTask(createdTask).then(() => {
          createdTask.syncStatus = 'synced';
        }).catch(() => {
          createdTask.syncStatus = 'error';
        });
      }
      set((state) => ({ tasks: [...state.tasks, createdTask] }));
    },

    changeTaskStatus: async (taskId: string, done: boolean) => {
      const updatedTask: Task = {
        ...get().tasks.find((task) => task.id === taskId) as Task,
        done,
        updatedAt: new Date().toISOString(),
        syncStatus: 'unsynced'
      };

      if (getStoreMode() === 'online') {
        await changeStatus(taskId, done).then(() => {
          updatedTask.syncStatus = 'synced';
        }).catch(() => {
          updatedTask.syncStatus = 'error';
        });
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

    updateTask: async (task: Task) => {
      const existsTaskWithSameName = () =>
        get()
          .getTasks()
          .some((t) => 
            t.id !== task.id
            && t.displayName === task.displayName 
            && (task.categoryId ? t.categoryId === task.categoryId : true)
          );

      if (existsTaskWithSameName()) {
        toast.error(`Task with name "${task.displayName}" already exists${task.categoryId ? ` in category "${task.categoryId}"` : ''}`);
        return;
      }

      const existingTask = get().getTasks().find((t) => t.id === task.id);

      const updatedTask: Task = {
        ...existingTask,
        ...task,
        updatedAt: new Date().toISOString(),
        syncStatus: 'unsynced'
      };

      if (getStoreMode() === 'online') {
        await updateTask(task).then(() => {
          updatedTask.syncStatus = 'synced';
        }).catch(() => {
          updatedTask.syncStatus = 'error';
        });
      }
      set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id === task.id) {
            return updatedTask;
          }
          return t;
        }),
      }));
    },

    deleteTask: async (taskId: string) => {
      if (getStoreMode() === 'online') {
        await deleteTask(taskId);
      } else {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, deleted: true, syncStatus: 'unsynced' };
            }
            return task;
          }),
        }));
      }
    },

    syncOfflineTasks: () => {
      const user = getUser();
      if (getStoreMode() !== 'online' || !user) {
        return;
      }

      const tasksToSync = get().tasks
        .filter((task) => task.syncStatus !== 'synced')
        .map((task) => (
          {...task,
            userId: user.id,
          })
        );

      const syncingTasks = syncTasks(user.id, tasksToSync).then(() => {
        set((state) => {
          const updatedTasks = [...state.tasks].map((task) => {
            if (task.syncStatus !== 'synced') {
              return { ...task, syncStatus: 'synced' };
            }
          }).filter((task) => task && !task.deleted) as Task[];

          return { tasks: updatedTasks };
        });
      }).catch(() => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.syncStatus === 'unsynced') {
              return { ...task, syncStatus: 'error' };
            }
            return task;
          }),
        }));
      });

      toast.promise(
        syncingTasks,
        {
          loading: 'Syncing tasks...',
          success: 'Tasks have been synced',
          error: 'Error while syncing tasks',
        },
      );
    }
  })), {
    name: 'configuration-storage',
    storage: createJSONStorage(() => getStoreMode() === 'online' ? sessionStorage : localStorage)
  })
);

// selectors
export const getPercentageCompletedTasks = (state: State) => ((state.tasks?.filter(task => task.done).length / state.tasks?.length * 100) || 0);