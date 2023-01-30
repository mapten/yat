import * as actionTypes from '../../constants/redux-action-types.constants';

// Store
import { TaskActionPartial } from '../reducers/task.reducer';

// Models
import { Task } from '../../models/task.model';

export const taskFetch = (): TaskActionPartial => {
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

export const taskCreate = (task: Task): TaskActionPartial => {
  return {
    type: actionTypes.TASK_CREATE,
    editTask: task
  };
};

export const taskCreateStart = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_CREATE_START
  };
};

export const taskCreateSuccess = (task: Task): TaskActionPartial => {
  return {
    type: actionTypes.TASK_CREATE_SUCCESS,
    editTask: task
  };
};

export const taskCreateError = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_CREATE_ERROR
  };
};

export const taskSetEditId = (taskId?: string): TaskActionPartial => {
  return {
    type: actionTypes.TASK_SET_EDIT_ID,
    taskId
  };
};

export const taskEdit = (task: Task): TaskActionPartial => {
  return {
    type: actionTypes.TASK_EDIT,
    editTask: task
  };
};

export const taskEditStart = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_EDIT_START
  };
};

export const taskEditSuccess = (task: Task): TaskActionPartial => {
  return {
    type: actionTypes.TASK_EDIT_SUCCESS,
    editTask: task
  };
};

export const taskEditError = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_EDIT_ERROR
  };
};

export const taskDelete = (taskId: string): TaskActionPartial => {
  return {
    type: actionTypes.TASK_DELETE,
    taskId
  };
};

export const taskDeleteStart = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_DELETE_START
  };
};

export const taskDeleteSuccess = (taskId: string): TaskActionPartial => {
  return {
    type: actionTypes.TASK_DELETE_SUCCESS,
    taskId
  };
};

export const taskDeleteError = (): TaskActionPartial => {
  return {
    type: actionTypes.TASK_DELETE_ERROR
  };
};