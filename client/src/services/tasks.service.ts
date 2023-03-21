// Services
import { getAxiosApiInstance } from './axios.service';

// Utils
import { httpErrorHandler } from '../utils/axios.errorHandler';

// Models
import { Task } from '../models/task.model';

const API_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/task`;

export const fetchUserTasks = async (userId: string) => {
  return getAxiosApiInstance(API_ENDPOINT)
    .get<Task[]>(`/${userId}`)
    .then((response) => response.data)
    .catch(httpErrorHandler);
};

export const createTask = async (task: Task) => {
  return getAxiosApiInstance(API_ENDPOINT)
    .post<Task>('', task)
    .then((response) => response.data)
    .catch(httpErrorHandler);
};

export const syncTasks = async (userId: string, tasks: Task[]) => {
  return getAxiosApiInstance(API_ENDPOINT)
    .post<Task[]>(`sync/${userId}`, tasks)
    .then((response) => response.data)
    .catch(httpErrorHandler);
};

export const changeStatus = async (taskId: string, done: boolean) => {
  return getAxiosApiInstance(API_ENDPOINT)
    .patch<Task>(`/${taskId}`, { done })
    .then((response) => response.data)
    .catch(httpErrorHandler);
};

export const updateTask = async (task: Task) => {
  return getAxiosApiInstance(API_ENDPOINT)
    .put<Task>('', task)
    .then((response) => response.data)
    .catch(httpErrorHandler);
};

export const deleteTask = async (taskId: string) => {
  return getAxiosApiInstance(API_ENDPOINT)
    .delete<Task>(`/${taskId}`)
    .then((response) => response.data)
    .catch(httpErrorHandler);
};