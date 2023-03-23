import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { toast } from 'react-hot-toast';

// Services
import * as taskServices from '../../services/tasks.service';

// Store
import { useTaskStore, getPercentageCompletedTasks } from '../../store/task.store';
import { AuthState, useAuthStore } from '../../store/auth.store';
import { ConfigurationState, useConfigurationStore } from '../../store/configuration.store';

// Services
import * as getDateNowService from '../../services/system/datetimeNow.service';

// Models
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';


const mockCreateTask = vi.fn();
const mockFetchTasks = vi.fn();
const mockChangeStatus = vi.fn();
const mockUpdateTask = vi.fn();
const mockDeleteTask = vi.fn();
const mockSyncTasks = vi.fn();

vi.mock('../../services/tasks.service', () => ({
  createTask: () => mockCreateTask(),
  fetchUserTasks: () => mockFetchTasks(),
  changeStatus: () => mockChangeStatus(),
  updateTask: () => mockUpdateTask(),
  deleteTask: () => mockDeleteTask(),
  syncTasks: () => mockSyncTasks(),
} as typeof taskServices));

describe('TaskStore', () => {
  const user: User = {
    id: '1',
    name: 'Test user',
    email: 'test@test.com'
  };

  beforeEach(() => {
    vi.mock('uuid', () => ({
      v4: () => '9999',
    }));
  });


  afterEach(() => {
    const { result } = renderHook(() => useTaskStore());
    result.current.clearTasks();
    vi.restoreAllMocks();
  });

  describe('actions', () => {
    it('should have an initial empty task list', () => {
      // arrange, act
      const { result } = renderHook(() => useTaskStore());

      // assert
      expect(result.current.tasks).toEqual([]);
    });

    describe('setTasks', () => {
      it('should set the tasks', () => {
        // arrange
        const { result, rerender } = renderHook(() => useTaskStore());

        const tasks = [
          { id: '1', displayName: 'Test task', done: false, priority: 1 },
          { id: '2', displayName: 'Test task 2', done: true, priority: 1 },
        ];

        expect(result.current.tasks).toHaveLength(0);

        // act
        result.current.setTasks(tasks);

        rerender();

        // assert
        expect(result.current.tasks).toHaveLength(2);
      });
    });

    describe('fetchTasks', () => {
      it('should fetch tasks and merge with existing ones when storeMode is "online"', async () => {
        // arrange
        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
          getUser: vi.fn().mockReturnValue(user),
        } as unknown as AuthState);

        const apiTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 1 },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1 },
          { id: '3', displayName: 'Test task 3', done: false, priority: 2 },
        ];
        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: true, priority: 3 },
          { id: '4', displayName: 'Test task 4', done: false, priority: 1 },
        ];

        mockFetchTasks.mockResolvedValue(apiTasks);

        const { result, rerender } = renderHook(() => useTaskStore());

        result.current.setTasks(storeTasks);

        rerender();

        expect(mockFetchTasks).toHaveBeenCalledTimes(0);
        expect(result.current.tasks).toHaveLength(2);

        // act
        await result.current.fetchTasks();

        // assert
        expect(mockFetchTasks).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(4);
        expect(result.current.tasks).toContainEqual({ id: '1', displayName: 'Test task 1', done: true, priority: 3, syncStatus: 'synced' });
        expect(result.current.tasks).toContainEqual({ id: '2', displayName: 'Test task 2', done: false, priority: 1, syncStatus: 'synced' });
        expect(result.current.tasks).toContainEqual({ id: '3', displayName: 'Test task 3', done: false, priority: 2, syncStatus: 'synced' });
        expect(result.current.tasks).toContainEqual({ id: '4', displayName: 'Test task 4', done: false, priority: 1 });
      });

      it('should not call to fetch tasks service when user is null and storeMode is "online"', async () => {
        // arrange
        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
          getUser: vi.fn().mockReturnValue(null),
        } as unknown as AuthState);

        const { result } = renderHook(() => useTaskStore());

        // act
        await result.current.fetchTasks();

        // assert
        expect(mockFetchTasks).toHaveBeenCalledTimes(0);
      });

      it('should not call to fetch tasks service when user is not null and storeMode is "offline"', async () => {
        // arrange
        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('offline'),
        } as unknown as ConfigurationState);

        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
          getUser: vi.fn().mockReturnValue(user),
        } as unknown as AuthState);

        const { result } = renderHook(() => useTaskStore());

        // act
        await result.current.fetchTasks();

        // assert
        expect(mockFetchTasks).toHaveBeenCalledTimes(0);
      });
    });

    describe('getFilteredTasks', () => {
      it('should return the tasks, filtering out the tasks labeled as deleted', () => {
        // arrange
        const { result } = renderHook(() => useTaskStore());

        const tasks = [
          { id: '1', displayName: 'Test task', done: false, priority: 1 },
          { id: '2', displayName: 'Test task 2', done: true, priority: 1 },
          { id: '3', displayName: 'Test task 3', done: false, priority: 1, deleted: true },
        ];

        result.current.setTasks(tasks);

        // act
        const resultTasks = result.current.getFilteredTasks();

        // assert
        expect(resultTasks).toHaveLength(2);
        expect(resultTasks).toContainEqual({ id: '1', displayName: 'Test task', done: false, priority: 1 });
        expect(resultTasks).toContainEqual({ id: '2', displayName: 'Test task 2', done: true, priority: 1 });
        expect(resultTasks).not.toContainEqual({ id: '3', displayName: 'Test task 3', done: false, priority: 1, deleted: true });
      });
    });

    describe('getCompletedTasks', () => {
      it('should return the completed tasks', () => {
        // arrange
        const { result } = renderHook(() => useTaskStore());

        const tasks = [
          { id: '1', displayName: 'Test task', done: false, priority: 1 },
          { id: '2', displayName: 'Test task 2', done: true, priority: 1 },
          { id: '3', displayName: 'Test task 3', done: false, priority: 1 },
        ];

        result.current.setTasks(tasks);

        // act
        const resultTasks = result.current.getCompletedTasks();

        // assert
        expect(resultTasks).toHaveLength(1);
        expect(resultTasks).toContainEqual({ id: '2', displayName: 'Test task 2', done: true, priority: 1 });
        expect(resultTasks).not.toContainEqual({ id: '1', displayName: 'Test task', done: false, priority: 1 });
        expect(resultTasks).not.toContainEqual({ id: '3', displayName: 'Test task 3', done: false, priority: 1 });
      });
    });

    describe('getPendingTasks', () => {
      it('should return the pending tasks', () => {
        // arrange
        const { result } = renderHook(() => useTaskStore());

        const tasks = [
          { id: '1', displayName: 'Test task', done: false, priority: 1 },
          { id: '2', displayName: 'Test task 2', done: true, priority: 1 },
          { id: '3', displayName: 'Test task 3', done: false, priority: 1 },
        ];

        result.current.setTasks(tasks);

        // act
        const resultTasks = result.current.getPendingTasks();

        // assert
        expect(resultTasks).toHaveLength(2);
        expect(resultTasks).toContainEqual({ id: '1', displayName: 'Test task', done: false, priority: 1 });
        expect(resultTasks).toContainEqual({ id: '3', displayName: 'Test task 3', done: false, priority: 1 });
        expect(resultTasks).not.toContainEqual({ id: '2', displayName: 'Test task 2', done: true, priority: 1 });
      });
    });
    describe('addTask', () => {
      it('should add a task to the list when storeMode is "online"', async () => {
        // arrange
        mockCreateTask.mockResolvedValue({});
        vi.spyOn(getDateNowService, 'getDateNowService').mockReturnValue(new Date('2021-01-01T00:00:00.000Z'));

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
          getUser: vi.fn().mockReturnValue(user),
        } as unknown as AuthState);

        const { result, rerender } = renderHook(() => useTaskStore());

        const taskToAdd = {
          displayName: 'Test task 3',
          done: false,
          priority: 1,
        };

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '4', displayName: 'Test task 4', done: false, priority: 1 },
        ];

        result.current.setTasks(storeTasks);

        rerender();

        expect(result.current.tasks).toHaveLength(2);
        expect(mockCreateTask).toHaveBeenCalledTimes(0);

        // act
        const addTaskResult = await result.current.addTask(taskToAdd);

        // assert
        expect(addTaskResult).toBe('success');
        expect(mockCreateTask).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(3);
        expect(result.current.tasks).toContainEqual({ ...taskToAdd, id: '9999', userId: user.id, syncStatus: 'synced', createdAt: '2021-01-01T00:00:00.000Z' });
        expect(result.current.tasks).toContainEqual(storeTasks[0]);
        expect(result.current.tasks).toContainEqual(storeTasks[1]);
      });

      it('should not add a task to the list when already exists another task with the same name in store', async () => {
        // arrange
        const toastSpy = vi.spyOn(toast, 'error');

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
          getUser: vi.fn().mockReturnValue(user),
        } as unknown as AuthState);

        const { result, rerender } = renderHook(() => useTaskStore());

        const taskToAdd: Task = {
          id: '3',
          displayName: 'Same name',
          done: false,
          priority: 1,
        };

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '4', displayName: 'Same name', done: false, priority: 1 },
        ];

        result.current.setTasks(storeTasks);

        rerender();

        expect(result.current.tasks).toHaveLength(2);

        // act
        const addTaskResult = await result.current.addTask(taskToAdd);

        // assert
        expect(addTaskResult).toBe('fail');
        expect(mockCreateTask).toHaveBeenCalledTimes(0);
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks).toContainEqual(storeTasks[0]);
        expect(result.current.tasks).toContainEqual(storeTasks[1]);
        expect(toastSpy).toHaveBeenCalledWith('Task with name "Same name" already exists');
      });

      it('should add a task to the list when there is an error in the service', async () => {
        // arrange
        vi.spyOn(getDateNowService, 'getDateNowService').mockReturnValue(new Date('2021-01-01T00:00:00.000Z'));

        const error = {
          response: {
            status: 400
          }
        };
        mockCreateTask.mockRejectedValue(error);

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
          getUser: vi.fn().mockReturnValue(user),
        } as unknown as AuthState);

        const { result, rerender } = renderHook(() => useTaskStore());

        const taskToAdd: Task = {
          id: '3',
          displayName: 'Test task 3',
          done: false,
          priority: 1,
        };

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '4', displayName: 'Same name', done: false, priority: 1 },
        ];

        result.current.setTasks(storeTasks);

        rerender();

        expect(result.current.tasks).toHaveLength(2);
        expect(mockCreateTask).toHaveBeenCalledTimes(0);

        // act
        const addTaskResult = await result.current.addTask(taskToAdd);

        // assert
        expect(addTaskResult).toBe('success');
        expect(mockCreateTask).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(3);
        expect(result.current.tasks).toContainEqual(storeTasks[0]);
        expect(result.current.tasks).toContainEqual(storeTasks[1]);
        expect(result.current.tasks).toContainEqual({ ...taskToAdd, id: '9999', userId: user.id, syncStatus: 'error', createdAt: '2021-01-01T00:00:00.000Z' });
      });

      it('should not add a task to the list when already exists another task with the same name in service but not in store', async () => {
        // arrange
        const error = {
          response: {
            status: 422
          }
        };
        mockCreateTask.mockRejectedValue(error);
        vi.spyOn(getDateNowService, 'getDateNowService').mockReturnValue(new Date('2021-01-01T00:00:00.000Z'));

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
          getUser: vi.fn().mockReturnValue(user),
        } as unknown as AuthState);

        const { result, rerender } = renderHook(() => useTaskStore());

        const taskToAdd: Task = {
          id: '3',
          displayName: 'Test task 3',
          done: false,
          priority: 1,
        };

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '4', displayName: 'Same name', done: false, priority: 1 },
        ];

        result.current.setTasks(storeTasks);

        rerender();

        expect(result.current.tasks).toHaveLength(2);
        expect(mockCreateTask).toHaveBeenCalledTimes(0);

        // act
        const addTaskResult = await result.current.addTask(taskToAdd);

        // assert
        expect(addTaskResult).toBe('fail');
        expect(mockCreateTask).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks).toContainEqual(storeTasks[0]);
        expect(result.current.tasks).toContainEqual(storeTasks[1]);
      });

      // TODO: add test checking same name in the same category when categories are implemented

      it('should add a task to the list when storeMode is "offline"', async () => {
        // arrange
        vi.spyOn(getDateNowService, 'getDateNowService').mockReturnValue(new Date('2021-01-01T00:00:00.000Z'));

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('offline'),
        } as unknown as ConfigurationState);

        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
          getUser: vi.fn().mockReturnValue(user),
        } as unknown as AuthState);

        const { result, rerender } = renderHook(() => useTaskStore());

        const taskToAdd = {
          displayName: 'Test task 3',
          done: false,
          priority: 1,
        };

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '4', displayName: 'Test task 4', done: false, priority: 1 },
        ];

        result.current.setTasks(storeTasks);

        rerender();

        expect(result.current.tasks).toHaveLength(2);

        // act
        const addTaskResult = await result.current.addTask(taskToAdd);

        // assert
        expect(addTaskResult).toBe('success');
        expect(mockCreateTask).toHaveBeenCalledTimes(0);
        expect(result.current.tasks).toHaveLength(3);
        expect(result.current.tasks).toContainEqual({ ...taskToAdd, id: '9999', syncStatus: 'unsynced', userId: user.id, createdAt: '2021-01-01T00:00:00.000Z' });
        expect(result.current.tasks).toContainEqual(storeTasks[0]);
        expect(result.current.tasks).toContainEqual(storeTasks[1]);
      });
    });

    describe('changeTaskStatus', () => {
      it('should change the status of a task when storeMode is "online" and call the service', async () => {
        // arrange
        vi.spyOn(getDateNowService, 'getDateNowService').mockReturnValue(new Date('2021-01-01T01:00:00.000Z'));

        mockChangeStatus.mockResolvedValue({});

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        const { result, rerender } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1 },
        ];

        result.current.setTasks(storeTasks);

        expect(mockChangeStatus).toHaveBeenCalledTimes(0);

        // act
        await result.current.changeTaskStatus('1', true);

        // assert
        expect(mockChangeStatus).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks).toContainEqual({ id: '1', displayName: 'Test task 1', done: true, priority: 3, syncStatus: 'synced', updatedAt: '2021-01-01T01:00:00.000Z' });
        expect(result.current.tasks).toContainEqual(storeTasks[1]);
      });

      it('should change the status of a task when storeMode is "online" and call the service, but store with syncStatus as "error" it there is a communication error with the server', async () => {
        // arrange
        const error = {
          response: {
            status: 422
          }
        };
        mockChangeStatus.mockRejectedValue(error);

        vi.spyOn(getDateNowService, 'getDateNowService').mockReturnValue(new Date('2021-01-01T01:00:00.000Z'));

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        const { result } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1 },
        ];

        result.current.setTasks(storeTasks);

        expect(mockChangeStatus).toHaveBeenCalledTimes(0);

        // act
        await result.current.changeTaskStatus('1', true);

        // assert
        expect(mockChangeStatus).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks).toContainEqual({ id: '1', displayName: 'Test task 1', done: true, priority: 3, syncStatus: 'error', updatedAt: '2021-01-01T01:00:00.000Z' });
        expect(result.current.tasks).toContainEqual(storeTasks[1]);
      });

      it('should change the status of a task when storeMode is "offline" then not call the service a store it with syncStatus as "unsynced"', async () => {
        // arrange
        const error = {
          response: {
            status: 400
          }
        };
        mockChangeStatus.mockRejectedValue(error);
        vi.spyOn(getDateNowService, 'getDateNowService').mockReturnValue(new Date('2021-01-01T00:00:00.000Z'));

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('offline'),
        } as unknown as ConfigurationState);

        const { result } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1 },
        ];

        result.current.setTasks(storeTasks);

        expect(mockChangeStatus).toHaveBeenCalledTimes(0);

        // act
        await result.current.changeTaskStatus('1', true);

        // assert
        expect(mockChangeStatus).toHaveBeenCalledTimes(0);
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks).toContainEqual({ id: '1', displayName: 'Test task 1', done: true, priority: 3, syncStatus: 'unsynced', updatedAt: '2021-01-01T00:00:00.000Z' });
        expect(result.current.tasks).toContainEqual(storeTasks[1]);
      });
    });

    describe('updateTask', () => {
      it('should update a task in store and call to the service when storeMode is "online"', async () => {
        // arrange
        vi.spyOn(getDateNowService, 'getDateNowService').mockReturnValue(new Date('2021-01-01T02:00:00.000Z'));

        mockUpdateTask.mockResolvedValue({});

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        const { result } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1 },
        ];
        result.current.setTasks(storeTasks);

        const taskToUpdate = { ...storeTasks[0], displayName: 'Updated task', priority: 2 };

        expect(mockUpdateTask).toHaveBeenCalledTimes(0);

        // act
        const updateTaskResult = await result.current.updateTask(taskToUpdate);

        // assert
        expect(updateTaskResult).toBe('success');
        expect(mockUpdateTask).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks).toContainEqual({ ...taskToUpdate, syncStatus: 'synced', updatedAt: '2021-01-01T02:00:00.000Z' });
      });

      it('should update a task in store and call to the service when storeMode is "online" and store it with syncStatus as "error" if there is a communication error with the server', async () => {
        // arrange
        const error = {
          response: {
            status: 400
          }
        };
        mockUpdateTask.mockRejectedValue(error);
        vi.spyOn(getDateNowService, 'getDateNowService').mockReturnValue(new Date('2021-01-01T02:00:00.000Z'));

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        const { result } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1 },
        ];
        result.current.setTasks(storeTasks);

        const taskToUpdate = { ...storeTasks[0], displayName: 'Updated task', priority: 2 };

        expect(mockUpdateTask).toHaveBeenCalledTimes(0);

        // act
        const updateTaskResult = await result.current.updateTask(taskToUpdate);

        // assert
        expect(updateTaskResult).toBe('success');
        expect(mockUpdateTask).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks).toContainEqual({ ...taskToUpdate, syncStatus: 'error', updatedAt: '2021-01-01T02:00:00.000Z' });
      });

      it('should update a task in store and not call to the service when storeMode is "offline" then store it with syncStatus as "unsynced"', async () => {
        // arrange
        vi.spyOn(getDateNowService, 'getDateNowService').mockReturnValue(new Date('2021-01-01T02:00:00.000Z'));

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('offline'),
        } as unknown as ConfigurationState);

        const { result } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1 },
        ];
        result.current.setTasks(storeTasks);

        const taskToUpdate = { ...storeTasks[0], displayName: 'Updated task', priority: 2 };

        // act
        const updateTaskResult = await result.current.updateTask(taskToUpdate);

        // assert
        expect(updateTaskResult).toBe('success');
        expect(mockUpdateTask).toHaveBeenCalledTimes(0);
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks).toContainEqual({ ...taskToUpdate, syncStatus: 'unsynced', updatedAt: '2021-01-01T02:00:00.000Z' });
      });

      it('should not update the task in store if there is another task in store with the same name', async () => {
        // arrange
        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        const { result } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1 },
        ];
        result.current.setTasks(storeTasks);

        const taskToUpdate = { ...storeTasks[0], displayName: 'Test task 2', priority: 2 };

        // act
        const updateTaskResult = await result.current.updateTask(taskToUpdate);

        // assert
        expect(updateTaskResult).toBe('fail');
        expect(mockUpdateTask).toHaveBeenCalledTimes(0);
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks).toContainEqual(storeTasks[0]);
        expect(result.current.tasks).toContainEqual(storeTasks[1]);
      });

      it('should not update the task in store if the service returns a 422 error (name duplicated in server)', async () => {
        // arrange
        vi.spyOn(getDateNowService, 'getDateNowService').mockReturnValue(new Date('2021-01-01T00:00:00.000Z'));
        const error = {
          response: {
            status: 422
          }
        };
        mockUpdateTask.mockRejectedValue(error);

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        const { result } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1 },
        ];
        result.current.setTasks(storeTasks);

        const taskToUpdate = { ...storeTasks[0], displayName: 'Test task modified', priority: 2 };

        // act
        const updateTaskResult = await result.current.updateTask(taskToUpdate);

        // assert
        expect(updateTaskResult).toBe('fail');
        expect(mockUpdateTask).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks).toContainEqual(storeTasks[0]);
        expect(result.current.tasks).toContainEqual(storeTasks[1]);
      });

      // TODO category
    });

    describe('deleteTask', () => {
      it('should delete a task in store and call to the service when storeMode is "online"', async () => {
        // arrange
        mockDeleteTask.mockResolvedValue({ id: '1', displayName: 'Test task 1', done: false, priority: 3 });

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        const { result } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1 },
        ];
        result.current.setTasks(storeTasks);

        expect(mockDeleteTask).toHaveBeenCalledTimes(0);

        // act
        const deleteTaskResult = await result.current.deleteTask('1');

        // await for the internal promise to be resolved
        await new Promise(process.nextTick);

        // assert
        expect(deleteTaskResult).toBe('success');
        expect(mockDeleteTask).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.tasks).toContainEqual(storeTasks[1]);
      });

      it('should label the task as "deleted" in store and not call to the service when storeMode is "offline"', async () => {
        // arrange
        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('offline'),
        } as unknown as ConfigurationState);

        const { result } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1 },
        ];
        result.current.setTasks(storeTasks);

        expect(mockDeleteTask).toHaveBeenCalledTimes(0);

        // act
        const deleteTaskResult = await result.current.deleteTask('1');

        // assert
        expect(deleteTaskResult).toBe('success');
        expect(mockDeleteTask).toHaveBeenCalledTimes(0);
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks).toContainEqual({ ...storeTasks[0], deleted: true, syncStatus: 'unsynced' });
      });

      it('should not delete the task in store if the service returns an error', async () => {
        // arrange
        mockDeleteTask.mockResolvedValue(undefined);

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        const { result } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3 },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1 },
        ];
        result.current.setTasks(storeTasks);

        expect(mockDeleteTask).toHaveBeenCalledTimes(0);

        // act
        const deleteTaskResult = await result.current.deleteTask(storeTasks[0].id);

        // assert
        expect(deleteTaskResult).toBe('fail');
        expect(mockDeleteTask).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks).toContainEqual(storeTasks[0]);
        expect(result.current.tasks).toContainEqual(storeTasks[1]);
      });
    });

    describe('syncOfflineTasks', () => {
      it('should sync the offline tasks with the server and delete tasks labeled as "deleted"', async () => {
        // arrange
        mockSyncTasks.mockResolvedValue([]);

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
          getUser: vi.fn().mockReturnValue(user),
        } as unknown as AuthState);

        const { result } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3, syncStatus: 'unsynced', deleted: false },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1, syncStatus: 'unsynced', deleted: false },
          { id: '3', displayName: 'Test task 3', done: false, priority: 2, syncStatus: 'unsynced', deleted: true },
          { id: '4', displayName: 'Test task 3', done: false, priority: 2, syncStatus: 'synced', deleted: false },
        ] as Task[];
        result.current.setTasks(storeTasks);

        // act
        result.current.syncOfflineTasks();

        // await for the internal promise to be resolved
        await new Promise(process.nextTick);

        // assert
        expect(mockSyncTasks).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(3);
        expect(result.current.tasks).toContainEqual({ ...storeTasks[0], syncStatus: 'synced' });
        expect(result.current.tasks).toContainEqual({ ...storeTasks[1], syncStatus: 'synced' });
        expect(result.current.tasks).not.toContain(expect.objectContaining({ id: '3' }));
        expect(result.current.tasks).toContainEqual(storeTasks[3]);
      });

      it('should not sync the offline tasks with the server when the service throws an error', async () => {
        // arrange
        mockSyncTasks.mockRejectedValue(new Error());

        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
          getUser: vi.fn().mockReturnValue(user),
        } as unknown as AuthState);

        const { result } = renderHook(() => useTaskStore());

        const storeTasks = [
          { id: '1', displayName: 'Test task 1', done: false, priority: 3, syncStatus: 'unsynced', deleted: false },
          { id: '2', displayName: 'Test task 2', done: false, priority: 1, syncStatus: 'unsynced', deleted: false },
          { id: '3', displayName: 'Test task 3', done: false, priority: 2, syncStatus: 'unsynced', deleted: true },
          { id: '4', displayName: 'Test task 3', done: false, priority: 2, syncStatus: 'synced', deleted: false },
        ] as Task[];
        result.current.setTasks(storeTasks);

        // act
        result.current.syncOfflineTasks();

        // await for the internal promise to be resolved
        await new Promise(process.nextTick);

        // assert
        expect(mockSyncTasks).toHaveBeenCalledTimes(1);
        expect(result.current.tasks).toHaveLength(4);
        expect(result.current.tasks).toContainEqual({ ...storeTasks[0], syncStatus: 'error' });
        expect(result.current.tasks).toContainEqual({ ...storeTasks[1], syncStatus: 'error' });
        expect(result.current.tasks).toContainEqual({ ...storeTasks[2], syncStatus: 'error' });
        expect(result.current.tasks).toContainEqual(storeTasks[3]);
      });

      it('should not sync the offline tasks with the server if the storeMode is "offline"', async () => {
        // arrange
        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('offline'),
        } as unknown as ConfigurationState);

        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
          getUser: vi.fn().mockReturnValue(user),
        } as unknown as AuthState);

        const { result } = renderHook(() => useTaskStore());

        // act
        result.current.syncOfflineTasks();

        // assert
        expect(mockSyncTasks).toHaveBeenCalledTimes(0);
      });

      it('should not sync the offline tasks with the server if the user is not logged in', async () => {
        // arrange
        vi.spyOn(useConfigurationStore, 'getState').mockReturnValue({
          getStoreMode: vi.fn().mockReturnValue('online'),
        } as unknown as ConfigurationState);

        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
          getUser: vi.fn().mockReturnValue(null),
        } as unknown as AuthState);

        const { result } = renderHook(() => useTaskStore());

        // act
        result.current.syncOfflineTasks();

        // assert
        expect(mockSyncTasks).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('selectors', () => {
    it('should get the percentage of completed tasks', async () => {
      // arrange
      const { result } = renderHook(() => useTaskStore());

      const tasks = [
        { id: '1', displayName: 'Test task', done: false, priority: 1 },
        { id: '2', displayName: 'Test task 2', done: true, priority: 1 },
        { id: '3', displayName: 'Test task 3', done: true, priority: 1 },
        { id: '4', displayName: 'Test task 4', done: false, priority: 1 },
      ];

      result.current.tasks = tasks;

      // act
      const percentage = getPercentageCompletedTasks(result.current);

      // assert
      expect(percentage).toBe(50);
    });

    it('should get the percentage of completed tasks as 0 when tasks is empty', () => {
      // arrange
      const { result } = renderHook(() => useTaskStore());

      result.current.tasks = [];

      // act
      const percentage = getPercentageCompletedTasks(result.current);

      // assert
      expect(percentage).toBe(0);
    });

    it('should get the percentage of completed tasks as 0 when tasks is undefined', () => {
      // arrange
      const { result } = renderHook(() => useTaskStore());
      const nullValue: unknown = undefined;

      result.current.tasks = nullValue as Task[];

      // act
      const percentage = getPercentageCompletedTasks(result.current);

      // assert
      expect(percentage).toBe(0);
    });
  });
});