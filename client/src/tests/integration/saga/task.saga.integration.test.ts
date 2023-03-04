import { describe, it, beforeEach, afterEach, expect } from 'vitest';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { combineReducers } from 'redux';
import { expectSaga } from 'redux-saga-test-plan';

// Fixtures
import * as apiTasks from '../../fixtures/apiTasks.json';

// State
import { RootState } from '../../../store/models/rootState.model';
import * as taskReducer from '../../../store/reducers/task.reducer';
import {
  changeStatusSaga,
  createTaskSaga,
  deleteTaskSaga,
  editTaskSaga,
  fetchTasksSaga,
} from '../../../store/middleware/task.Saga';
import {
  TASK_CHANGE_STATUS,
  TASK_CHANGE_STATUS_ERROR,
  TASK_CHANGE_STATUS_START,
  TASK_CHANGE_STATUS_SUCCESS,
  TASK_CREATE,
  TASK_CREATE_ERROR,
  TASK_CREATE_START,
  TASK_CREATE_SUCCESS,
  TASK_DELETE,
  TASK_DELETE_ERROR,
  TASK_DELETE_START,
  TASK_DELETE_SUCCESS,
  TASK_EDIT,
  TASK_EDIT_ERROR,
  TASK_EDIT_START,
  TASK_EDIT_SUCCESS,
  TASK_FETCH_ERROR,
  TASK_FETCH_START,
  TASK_FETCH_SUCCESS,
} from '../../../constants/redux-action-types.constants';

// Models
import { Task } from '../../../models/task.model';


describe('redux saga - integration - task', () => {
  let mockInitialState: RootState;
  let mockAxios: MockAdapter;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rootReducer: any;

  beforeEach(() => {
    mockInitialState = {
      task: taskReducer.taskInitialState,
    } as RootState;

    rootReducer = combineReducers({
      task: taskReducer.taskReducer,
    });

    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.resetHistory();
  });

  describe('fetchTasksSaga', () => {
    it('should put fetchSucess when API response code is not an error', async () => {
      // arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiTasksFromJson: Task[] = (apiTasks as any).default;
      mockAxios.onGet().replyOnce(200, apiTasksFromJson);

      // act, assert
      return expectSaga(fetchTasksSaga)
        .withReducer(rootReducer)
        .withState({ ...mockInitialState })
        .put.actionType(TASK_FETCH_START)
        .put.actionType(TASK_FETCH_SUCCESS)
        .not.put.actionType(TASK_FETCH_ERROR)
        .run()
        .then((result) => {
          const stateTask = result.storeState.task as taskReducer.TaskState;
          expect(stateTask.taskList).toHaveLength(6);
          expect(stateTask.taskList[0].id).toBe('1');
          expect(stateTask.taskList[0].displayName).toBe('Paint the wall');
        });
    });

    it('should put fetchError when API response code is error', async () => {
      // arrange
      mockAxios.onGet().networkErrorOnce();

      // act, assert
      return expectSaga(fetchTasksSaga)
        .withReducer(rootReducer)
        .withState({ ...mockInitialState })
        .put.actionType(TASK_FETCH_START)
        .not.put.actionType(TASK_FETCH_SUCCESS)
        .put.actionType(TASK_FETCH_ERROR)
        .run();
    });
  });

  describe('createTaskSaga', () => {
    it('should create a new Task when the API response code is not an error', async () => {
      // arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiTasksFromJson: Task[] = (apiTasks as any).default;

      const newTask: Task = {
        id: 'new',
        displayName: 'foo',
        priority: 2,
        done: false,
      };

      mockAxios.onPost().replyOnce(200, { ...newTask, id: '7' });

      const modifiedMockInitialState: RootState = {
        ...mockInitialState,
        task: {
          ...mockInitialState.task,
          taskList: apiTasksFromJson,
        },
      };

      const taskAction = {
        type: TASK_CREATE, // any task, doesn't matter
        editTask: newTask,
      } as taskReducer.TaskAction;

      // act, assert
      return expectSaga(createTaskSaga, taskAction)
        .withReducer(rootReducer)
        .withState({ ...modifiedMockInitialState })
        .put.actionType(TASK_CREATE_START)
        .put.actionType(TASK_CREATE_SUCCESS)
        .not.put.actionType(TASK_CREATE_ERROR)
        .run()
        .then((result) => {
          const stateTask = result.storeState.task as taskReducer.TaskState;
          expect(stateTask.taskList).toHaveLength(7);
          expect(stateTask.taskList[6].id).toBe('7');
          expect(stateTask.taskList[6].displayName).toBe('foo');
        });
    });

    it('should put TASK_CREATE_ERROR when API response code is error', async () => {
      // arrange
      mockAxios.onPost().networkErrorOnce();

      const taskAction = {
        type: TASK_CREATE, // any task, doesn't matter
        editTask: {},
      } as taskReducer.TaskAction;

      // act, assert
      return expectSaga(createTaskSaga, taskAction)
        .withReducer(rootReducer)
        .withState({ ...mockInitialState })
        .put.actionType(TASK_CREATE_START)
        .not.put.actionType(TASK_CREATE_SUCCESS)
        .put.actionType(TASK_CREATE_ERROR)
        .run();
    });
  });

  describe('changeStatusSaga', () => {
    it('should update a Task done value when the API response code is not an error', async () => {
      // arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiTasksFromJson: Task[] = (apiTasks as any).default;

      mockAxios.onPatch().replyOnce(200);

      const modifiedMockInitialState: RootState = {
        ...mockInitialState,
        task: {
          ...mockInitialState.task,
          taskList: apiTasksFromJson,
        },
      };

      const taskAction = {
        type: TASK_CHANGE_STATUS, // any task, doesn't matter
        taskId: '1',
        done: true
      } as taskReducer.TaskAction;

      // act, assert
      return expectSaga(changeStatusSaga, taskAction)
        .withReducer(rootReducer)
        .withState({ ...modifiedMockInitialState })
        .put.actionType(TASK_CHANGE_STATUS_START)
        .put.actionType(TASK_CHANGE_STATUS_SUCCESS)
        .not.put.actionType(TASK_CHANGE_STATUS_ERROR)
        .run()
        .then((result) => {
          const stateTask = result.storeState.task as taskReducer.TaskState;
          expect(stateTask.taskList[0].id).toBe('1');
          expect(stateTask.taskList[0].done).toBe(true);
        });
    });

    it('should put TASK_CHANGE_STATUS_ERROR when API response code is error', async () => {
      // arrange
      mockAxios.onPatch().networkErrorOnce();

      const taskAction = {
        type: TASK_CHANGE_STATUS, // any task, doesn't matter
        taskId: '1',
        done: true
      } as taskReducer.TaskAction;

      // act, assert
      return expectSaga(changeStatusSaga, taskAction)
        .withReducer(rootReducer)
        .withState({ ...mockInitialState })
        .put.actionType(TASK_CHANGE_STATUS_START)
        .not.put.actionType(TASK_CHANGE_STATUS_SUCCESS)
        .put.actionType(TASK_CHANGE_STATUS_ERROR)
        .run();
    });
  });

  describe('editTaskSaga', () => {
    it('should update a Task when the API response code is not an error', async () => {
      // arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiTasksFromJson: Task[] = (apiTasks as any).default;

      mockAxios.onPatch().replyOnce(200);

      const modifiedMockInitialState: RootState = {
        ...mockInitialState,
        task: {
          ...mockInitialState.task,
          taskList: apiTasksFromJson,
        },
      };

      const editTask: Task = {
        ...apiTasksFromJson[0],
        displayName: 'modified'
      };

      const taskAction = {
        type: TASK_EDIT, // any task, doesn't matter
        editTask
      } as taskReducer.TaskAction;

      // act, assert
      return expectSaga(editTaskSaga, taskAction)
        .withReducer(rootReducer)
        .withState({ ...modifiedMockInitialState })
        .put.actionType(TASK_EDIT_START)
        .put.actionType(TASK_EDIT_SUCCESS)
        .not.put.actionType(TASK_EDIT_ERROR)
        .run()
        .then((result) => {
          const stateTask = result.storeState.task as taskReducer.TaskState;
          expect(stateTask.taskList[0].id).toBe('1');
          expect(stateTask.taskList[0].displayName).toBe('modified');
        });
    });

    it('should put TASK_EDIT_ERROR when API response code is error', async () => {
      // arrange
      mockAxios.onPatch().networkErrorOnce();

      const editTask: Task = {
        id: '1',
        displayName: 'foo',
        priority: 1,
        done: false
      };

      const taskAction = {
        type: TASK_EDIT, // any task, doesn't matter
        editTask
      } as taskReducer.TaskAction;

      // act, assert
      return expectSaga(editTaskSaga, taskAction)
        .withReducer(rootReducer)
        .withState({ ...mockInitialState })
        .put.actionType(TASK_EDIT_START)
        .not.put.actionType(TASK_EDIT_SUCCESS)
        .put.actionType(TASK_EDIT_ERROR)
        .run();
    });
  });

  describe('deleteTaskSaga', () => {
    it('should delete a Task when the API response code is not an error', async () => {
      // arrange

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiTasksFromJson: Task[] = (apiTasks as any).default;

      mockAxios.onDelete().replyOnce(200);

      const modifiedMockInitialState: RootState = {
        ...mockInitialState,
        task: {
          ...mockInitialState.task,
          taskList: apiTasksFromJson,
        },
      };

      const taskIdToDelete = '1';

      const taskAction = {
        type: TASK_DELETE, // any task, doesn't matter
        taskId: taskIdToDelete
      } as taskReducer.TaskAction;

      // act, assert
      return expectSaga(deleteTaskSaga, taskAction)
        .withReducer(rootReducer)
        .withState({ ...modifiedMockInitialState })
        .put.actionType(TASK_DELETE_START)
        .put.actionType(TASK_DELETE_SUCCESS)
        .not.put.actionType(TASK_DELETE_ERROR)
        .run()
        .then((result) => {
          const stateTask = result.storeState.task as taskReducer.TaskState;
          expect(stateTask.taskList.length).toBe(5);
          expect(stateTask.taskList.find((task) => task.id === taskIdToDelete)).toBeUndefined();
        });
    });

    it('should put TASK_DELETE_ERROR when API response code is error', async () => {
      // arrange
      mockAxios.onDelete().networkErrorOnce();

      const taskIdToDelete = '1';

      const taskAction = {
        type: TASK_DELETE, // any task, doesn't matter
        taskId: taskIdToDelete
      } as taskReducer.TaskAction;

      // act, assert
      return expectSaga(deleteTaskSaga, taskAction)
        .withReducer(rootReducer)
        .withState({ ...mockInitialState })
        .put.actionType(TASK_DELETE_START)
        .not.put.actionType(TASK_DELETE_SUCCESS)
        .put.actionType(TASK_DELETE_ERROR)
        .run();
    });
  });
});
