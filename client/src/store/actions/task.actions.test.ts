import { describe, it, expect } from 'vitest';

import * as actionTypes from '../../constants/redux-action-types.constants';

// Store
import { TaskActionPartial } from '../reducers/task.reducer';
import * as action from './task.actions';

// Models
import { Task } from '../../models/task.model';

describe('redux actions - task', () => {
  describe('taskFetch', () => {
    it('should create an action', () => {
      // arrange
      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_FETCH,
      };

      // act
      const result = action.taskFetch();

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskFetchStart', () => {
    it('should create an action', () => {
      // arrange
      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_FETCH_START,
      };

      // act
      const result = action.taskFetchStart();

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskFetchSuccess', () => {
    it('should create an action', () => {
      // arrange
      const taskList: Task[] = [
        { id: '1', displayName: 'task 1', priority: 1, done: false },
        { id: '2', displayName: 'task 2', priority: 0, done: true },
      ];

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_FETCH_SUCCESS,
        taskList,
      };

      // act
      const result = action.taskFetchSuccess(taskList);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskFetchError', () => {
    it('should create an action', () => {
      // arrange
      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_FETCH_ERROR,
      };

      // act
      const result = action.taskFetchError();

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskChangeStatus', () => {
    it('should create an action', () => {
      // arrange
      const taskId = '1';
      const done = true;

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_CHANGE_STATUS,
        taskId,
        done
      };

      // act
      const result = action.taskChangeStatus(taskId, done);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskChangeStatusStart', () => {
    it('should create an action', () => {
      // arrange
      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_CHANGE_STATUS_START
      };

      // act
      const result = action.taskChangeStatusStart();

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskChangeStatusSuccess', () => {
    it('should create an action', () => {
      // arrange
      const taskId = '1';
      const done = true;

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_CHANGE_STATUS_SUCCESS,
        taskId,
        done,
      };

      // act
      const result = action.taskChangeStatusSuccess(taskId, done);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskChangeStatusStartError', () => {
    it('should create an action', () => {
      // arrange
      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_CHANGE_STATUS_ERROR
      };

      // act
      const result = action.taskChangeStatusError();

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskCreate', () => {
    it('should create an action', () => {
      // arrange
      const newTask = { id: '2', displayName: 'task 2', priority: 0, done: true };

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_CREATE,
        editTask: newTask,
      };

      // act
      const result = action.taskCreate(newTask);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });
});

describe('taskCreateStart', () => {
  it('should create an action', () => {
    // arrange
    const expectedAction: TaskActionPartial = {
      type: actionTypes.TASK_CREATE_START
    };

    // act
    const result = action.taskCreateStart();

    // assert
    expect(result).toEqual(expectedAction);
  });

  describe('taskCreateSuccess', () => {
    it('should create an action', () => {
      // arrange
      const newTask = { id: '2', displayName: 'task 2', priority: 0, done: true };

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_CREATE_SUCCESS,
        editTask: newTask
      };

      // act
      const result = action.taskCreateSuccess(newTask);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskCreateError', () => {
    it('should create an action', () => {
      // arrange
      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_CREATE_ERROR
      };

      // act
      const result = action.taskCreateError();

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskSetEditId', () => {
    it('should create an action', () => {
      // arrange
      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_SET_EDIT_ID
      };

      // act
      const result = action.taskSetEditId();

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskEdit', () => {
    it('should create an action', () => {
      // arrange
      const taskToEdit = { id: '2', displayName: 'task 2', priority: 0, done: true };

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_EDIT,
        editTask: taskToEdit,
      };

      // act
      const result = action.taskEdit(taskToEdit);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });
});

describe('taskEditStart', () => {
  it('should create an action', () => {
    // arrange
    const expectedAction: TaskActionPartial = {
      type: actionTypes.TASK_EDIT_START
    };

    // act
    const result = action.taskEditStart();

    // assert
    expect(result).toEqual(expectedAction);
  });

  describe('taskEditSuccess', () => {
    it('should create an action', () => {
      // arrange
      const newTask = { id: '2', displayName: 'task 2', priority: 0, done: true };

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_EDIT_SUCCESS,
        editTask: newTask
      };

      // act
      const result = action.taskEditSuccess(newTask);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskEditError', () => {
    it('should create an action', () => {
      // arrange
      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_EDIT_ERROR
      };

      // act
      const result = action.taskEditError();

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskDelete', () => {
    it('should create an action', () => {
      // arrange
      const taskId = '1';

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_DELETE,
        taskId
      };

      // act
      const result = action.taskDelete(taskId);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });
});

describe('taskDeleteStart', () => {
  it('should create an action', () => {
    // arrange
    const expectedAction: TaskActionPartial = {
      type: actionTypes.TASK_DELETE_START
    };

    // act
    const result = action.taskDeleteStart();

    // assert
    expect(result).toEqual(expectedAction);
  });

  describe('taskDeleteSuccess', () => {
    it('should create an action', () => {
      // arrange
      const taskId = '1';

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_DELETE_SUCCESS,
        taskId
      };

      // act
      const result = action.taskDeleteSuccess(taskId);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskDeleteError', () => {
    it('should create an action', () => {
      // arrange
      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_DELETE_ERROR
      };

      // act
      const result = action.taskDeleteError();

      // assert
      expect(result).toEqual(expectedAction);
    });
  });
});