import * as actionTypes from '../../constants/redux-action-types.constants';

// Store
import { TaskActionPartial } from '../reducers/task.reducer';

// Models
import { Task } from '../../models/task.model';

export const fetchTask = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_FETCH
  };
};

export const taskFetchStart = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_FETCH_START
  };
};

export const taskFetchSuccess = (taskList: Task[]): TaskActionPartial => {
  return {
    type: actionTypes.TASK_FETCH_SUCCESS,
    taskList
  };
};

export const taskFetchError = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_FETCH_ERROR
  };
};

export const taskChangeStatus = (taskId: string, done: boolean): TaskActionPartial => {
  return {
    type: actionTypes.TASK_CHANGE_STATUS,
    taskId,
    done,
  };
};

export const taskChangeStatusStart = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_CHANGE_STATUS_START
  };
};

export const taskChangeStatusSuccess = (taskId: string, done: boolean): TaskActionPartial => {
  return {
    type: actionTypes.TASK_CHANGE_STATUS_SUCCESS,
    taskId,
    done,
  };
};

export const taskChangeStatusError = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_CHANGE_STATUS_ERROR
  };
};

export const addTask = (task: Task): TaskActionPartial => {
  return {
    type: actionTypes.TASK_ADD,
    editTask: task
  };
};

export const addTaskStart = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_ADD_START
  };
};

export const addTaskSuccess = (task: Task): TaskActionPartial => {
  return {
    type: actionTypes.TASK_ADD_SUCCESS,
    editTask: task
  };
};

export const addTaskError = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_ADD_ERROR
  };
};

export const updateTask = (task: Task): TaskActionPartial => {
  return {
    type: actionTypes.TASK_UPDATE,
    editTask: task
  };
};

export const updateTaskStart = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_UPDATE_START
  };
};

export const updateTaskSuccess = (task: Task): TaskActionPartial => {
  return {
    type: actionTypes.TASK_UPDATE_SUCCESS,
    editTask: task
  };
};

export const updateTaskError = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_UPDATE_ERROR
  };
};

export const deleteTask = (taskId: string): TaskActionPartial => {
  return {
    type: actionTypes.TASK_DELETE,
    taskId
  };
};

export const deleteTaskStart = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_DELETE_START
  };
};

export const deleteTaskSuccess = (taskId: string): TaskActionPartial => {
  return {
    type: actionTypes.TASK_DELETE_SUCCESS,
    taskId
  };
};

export const deleteTaskError = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_DELETE_ERROR
  };
};