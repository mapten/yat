// Store
import { getTaskList, TaskAction, taskInitialState, taskReducer, TaskState } from './task.reducer';
import * as actionTypes from '../../constants/redux-action-types.constants';

// Models
import { Task } from '../../models/task.model';

describe('redux reducers - task', () => {
  let initialState: TaskState;

  beforeEach(() => {
    initialState = {...taskInitialState};
  });

  describe('taskReducer', () => {
    it('should return the initial state', () => {
      // arrange
      // act
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = taskReducer(undefined, {});

      // assert
      expect(result).toEqual(initialState);
    });

    it('should handle TASK_CHANGE_STATUS_SUCCESS', () => {
      // arrange
      const initialTaskList: Task[] = [
        {id: '1', displayName: 'task 1', priority: 1, done: false},
        {id: '2', displayName: 'task 2', priority: 0, done: true},
      ];

      const initialStateWithTasks: TaskState = {...initialState, taskList: initialTaskList};

      const expectedTaskList: Task[] = [
        {id: '1', displayName: 'task 1', priority: 1, done: true},
        {id: '2', displayName: 'task 2', priority: 0, done: true},
      ];

      const expectedState: TaskState = {
        ...initialState,
        taskList: expectedTaskList,
      };

      const action = {
        type: actionTypes.TASK_CHANGE_STATUS_SUCCESS,
        taskId: '1',
        done: true,
      } as TaskAction;

      // act
      const result = taskReducer(initialStateWithTasks, action);

      // assert
      expect(result).toEqual(expectedState);
    });

    it('should handle TASK_CREATE_SUCCESS', () => {
      // arrange
      const initialTaskList: Task[] = [
        {id: '1', displayName: 'task 1', priority: 1, done: false},
        {id: '2', displayName: 'task 2', priority: 0, done: true},
      ];

      const initialStateWithTasks: TaskState = {...initialState, taskList: initialTaskList};

      const expectedTaskList: Task[] = [
        {id: '1', displayName: 'task 1', priority: 1, done: false},
        {id: '2', displayName: 'task 2', priority: 0, done: true},
        {id: '3', displayName: 'task 3', priority: 2, done: false},
      ];

      const expectedState: TaskState = {
        ...initialState,
        taskList: expectedTaskList,
      };

      const newTask: Task = {id: '3', displayName: 'task 3', priority: 2, done: false};

      const action = {
        type: actionTypes.TASK_CREATE_SUCCESS,
        newTask,
      } as TaskAction;

      // act
      const result = taskReducer(initialStateWithTasks, action);

      // assert
      expect(result).toEqual(expectedState);
    });

    it('should handle TASK_FETCH_SUCCESS', () => {
      // arrange
      const expectedTaskList: Task[] = [
        {id: '1', displayName: 'task 1', priority: 1, done: false},
        {id: '2', displayName: 'task 2', priority: 0, done: true},
      ];

      const expectedState: TaskState = {
        ...initialState,
        taskList: expectedTaskList,
      };

      const fetchedTasks = [
        {id: '1', displayName: 'task 1', priority: 1, done: false},
        {id: '2', displayName: 'task 2', priority: 0, done: true},
      ];

      const action = {
        type: actionTypes.TASK_FETCH_SUCCESS,
        taskList: fetchedTasks,
      } as TaskAction;

      // act
      const result = taskReducer(initialState, action);

      // assert
      expect(result).toEqual(expectedState);
    });
  });

  describe('selectors', () => {
    describe('getTaskList', () => {
      it('should return the list of tasks', () => {
        // arrange
        const initialTaskList: Task[] = [
          {id: '1', displayName: 'task 1', priority: 1, done: false},
          {id: '2', displayName: 'task 2', priority: 0, done: true},
        ];
  
        const initialStateWithTasks: TaskState = {...initialState, taskList: initialTaskList};

        // act
        const result = getTaskList(initialStateWithTasks);

        expect(result).toEqual(initialTaskList);
      });
    });
  });
});