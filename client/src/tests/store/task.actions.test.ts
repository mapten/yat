import { describe, it, expect } from 'vitest';

import * as actionTypes from '../../constants/redux-action-types.constants';

// Store
import { TaskActionPartial } from '../../store/reducers/task.reducer';
import * as action from '../../store/actions/task.actions';

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
      const result = action.fetchTask();

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
        type: actionTypes.TASK_ADD,
        editTask: newTask,
      };

      // act
      const result = action.addTask(newTask);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });
});

describe('taskCreateStart', () => {
  it('should create an action', () => {
    // arrange
    const expectedAction: TaskActionPartial = {
      type: actionTypes.TASK_ADD_START
    };

    // act
    const result = action.addTaskStart();

    // assert
    expect(result).toEqual(expectedAction);
  });

  describe('taskCreateSuccess', () => {
    it('should create an action', () => {
      // arrange
      const newTask = { id: '2', displayName: 'task 2', priority: 0, done: true };

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_ADD_SUCCESS,
        editTask: newTask
      };

      // act
      const result = action.addTaskSuccess(newTask);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskCreateError', () => {
    it('should create an action', () => {
      // arrange
      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_ADD_ERROR
      };

      // act
      const result = action.addTaskError();

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskEdit', () => {
    it('should create an action', () => {
      // arrange
      const taskToEdit = { id: '2', displayName: 'task 2', priority: 0, done: true };

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_UPDATE,
        editTask: taskToEdit,
      };

      // act
      const result = action.updateTask(taskToEdit);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });
});

describe('taskEditStart', () => {
  it('should create an action', () => {
    // arrange
    const expectedAction: TaskActionPartial = {
      type: actionTypes.TASK_UPDATE_START
    };

    // act
    const result = action.updateTaskStart();

    // assert
    expect(result).toEqual(expectedAction);
  });

  describe('taskEditSuccess', () => {
    it('should create an action', () => {
      // arrange
      const newTask = { id: '2', displayName: 'task 2', priority: 0, done: true };

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_UPDATE_SUCCESS,
        editTask: newTask
      };

      // act
      const result = action.updateTaskSuccess(newTask);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskEditError', () => {
    it('should create an action', () => {
      // arrange
      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_UPDATE_ERROR
      };

      // act
      const result = action.updateTaskError();

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
      const result = action.deleteTask(taskId);

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
    const result = action.deleteTaskStart();

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
      const result = action.deleteTaskSuccess(taskId);

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
      const result = action.deleteTaskError();

      // assert
      expect(result).toEqual(expectedAction);
    });
  });
});