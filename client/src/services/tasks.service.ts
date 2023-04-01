import axios from 'axios';
import { toast } from 'react-hot-toast';

// Services
import { getAxiosApiInstance } from './axios.service';

// Utils
import { httpErrorHandler } from '../utils/axios.errorHandler';

// Models
import { Task } from '../models/task.model';

const API_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/task`;

export const fetchUserTasks = async (userId: string) => {
  return await getAxiosApiInstance(API_ENDPOINT)
    .get<Task[]>(`/${userId}`)
    .then((response) => response.data)
    .catch(httpErrorHandler);
};

export const createTask = async (task: Task) => {
  return getAxiosApiInstance(API_ENDPOINT)
    .post<Task>('', task)
    .then((response) => response.data)
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          const errorMessage = 'Task with same name already exists';
          toast.error(errorMessage);
        }
      }
      else {
        httpErrorHandler(error);
      }
    });
};

export const syncTasks = async (userId: string, tasks: Task[]) => {
  return getAxiosApiInstance(API_ENDPOINT)
    .post<Task[]>(`/sync/${userId}`, tasks)
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
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          toast.error('Another task with same name already exists');
        }
      }
      else {
        httpErrorHandler(error);
      }
    });
};

export const deleteTask = async (taskId: string) => {
  return getAxiosApiInstance(API_ENDPOINT)
    .delete<Task>(`/${taskId}`)
    .then((response) => response.data)
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          toast.error('Can not delete task. Task not found');
        }
      }
      else {
        httpErrorHandler(error);
      }
    });
};