import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Models
import { Task } from '../models/task.model';

// Services
import { changeStatus, createTask, deleteTask, fetchTasks, updateTask } from '../services/tasks.service';

export type State = {
  tasks: Task[];
}

type Actions = {
  setTasks: (tasks: Task[]) => void;
  clearTasks: () => void;
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  changeTaskStatus: (taskId: string, done: boolean) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export type TaskState = State & Actions;

export const useTaskStore = create<TaskState>()(
  devtools((set) => ({
    tasks: [],

    setTasks: (tasks: Task[]) => set({ tasks }),

    clearTasks: () => set({ tasks: [] }),

    fetchTasks: async () => {
      const response = await fetchTasks();
      set({ tasks: response });
    },

    addTask: async (task: Task) => {
      await createTask(task);
      set((state) => ({ tasks: [...state.tasks, task] }));
    },

    changeTaskStatus: async (taskId: string, done: boolean) => {
      await changeStatus(taskId, done);
      set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, done };
          }
          return task;
        }),
      }));
    },

    updateTask: async (task: Task) => {
      await updateTask(task);
      set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id === task.id) {
            return task;
          }
          return t;
        }),
      }));
    },

    deleteTask: async (taskId: string) => {
      await deleteTask(taskId);
      set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) }));
    },
  })),
);

// selectors

export const getPercentageCompletedTasks = (state: State) => ((state.tasks?.filter(task => task.done).length / state.tasks?.length * 100) || 0);