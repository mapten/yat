/* eslint-disable indent */
import { Selector } from 'reselect';

// Store
import { TaskActionType } from '../../typings/task.types';
import * as actionTypes from '../../constants/redux-action-types.constants';

// Utils
import { updateObject } from '../../utils/common';

// Models
import { Task } from '../../models/task.model';

type TaskPayload = {
  taskId: string;
  done: boolean;
  newTask: Task;
  taskList: Task[];
};

export type TaskActionPartial = { type: TaskActionType } & Partial<TaskPayload>;
export type TaskAction = { type: TaskActionType } & TaskPayload;

export type TaskState = Readonly<{
  taskList: Task[],
}>;

export const taskInitialState: TaskState = {
  taskList: [],
};

export const taskReducer = (state: TaskState = taskInitialState, action: TaskAction): TaskState => {
  switch (action.type) {
    case actionTypes.TASK_CHANGE_STATUS_SUCCESS: {
      return updateObject(state, {
        taskList: state.taskList.map((todoItem) => {
          if (todoItem.id === action.taskId) {
            const modifiedTask = {...todoItem};
            modifiedTask.done = action.done;

            return modifiedTask;
          }
          return todoItem;
        }),
      });
    }
    case actionTypes.TASK_CREATE_SUCCESS: {
      return updateObject(state, {
        taskList: [...state.taskList, action.newTask],
      });
    }
    case actionTypes.TASK_FETCH_SUCCESS: {
      return updateObject(state, {
        taskList: action.taskList,
      });
    }
    default: {
      return state;
    }
  }
};

/**
 * Selector to get all the task in store
 */
export const getTaskList: Selector<TaskState, Task[]> = (state: TaskState): Task[] => {
  return state.taskList;
};