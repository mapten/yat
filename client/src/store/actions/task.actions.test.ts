import * as actionTypes from '../../constants/redux-action-types.constants';
import { Task } from '../../models/task.model';
import { TaskActionPartial } from '../reducers/task.reducer';
import * as action from './task.actions';

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
        {id: '1', displayName: 'task 1', priority: 1, done: false},
        {id: '2', displayName: 'task 2', priority: 0, done: true},
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
        done,
      };

      // act
      const result = action.taskChangeStatus(taskId, done);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });

  describe('taskCreate', () => {
    it('should create an action', () => {
      // arrange
      const newTask = {id: '2', displayName: 'task 2', priority: 0, done: true};

      const expectedAction: TaskActionPartial = {
        type: actionTypes.TASK_CREATE,
        newTask
      };

      // act
      const result = action.taskCreate(newTask);

      // assert
      expect(result).toEqual(expectedAction);
    });
  });
});