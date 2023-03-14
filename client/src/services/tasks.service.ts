// Services
import { getAxiosApiInstance } from './axios.service';

// Models
import { Task } from '../models/task.model';

const API_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/task`;

export const fetchTasks = async () => {
  return (await getAxiosApiInstance(API_ENDPOINT).get<Task[]>('')).data;
};

export const createTask = async (task: Task) => {
  return (await getAxiosApiInstance(API_ENDPOINT).post<Task>('', task)).data;
};

export const changeStatus = async (taskId: string, done: boolean) => {
  return (await getAxiosApiInstance(API_ENDPOINT).patch<Task>(`/${taskId}`, { done })).data;
};

export const updateTask = async (task: Task) => {
  return (await getAxiosApiInstance(API_ENDPOINT).put<Task>('', task)).data;
};

export const deleteTask = async (taskId: string) => {
  return (await getAxiosApiInstance(API_ENDPOINT).delete<Task>(`/${taskId}`)).data;
};