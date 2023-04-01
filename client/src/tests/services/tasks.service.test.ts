import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Services
import { fetchUserTasks, createTask, updateTask, deleteTask, changeStatus, syncTasks } from '../../services/tasks.service';

describe('tasks.service', ()  => {
  let mockAxios: MockAdapter;

  const originalViteApiAxiosRetriesEnv = import.meta.env.VITE_API_AXIOS_RETRIES;

  beforeEach(() => {
    // Set the number of retries to 0 to avoid waiting for the retries to finish
    import.meta.env.VITE_API_AXIOS_RETRIES = 0;
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    import.meta.env.VITE_API_AXIOS_RETRIES = originalViteApiAxiosRetriesEnv;
    mockAxios.restore();
    vi.clearAllMocks();
  });

  describe('fetchUserTasks', () => {
    it('should return a list of tasks when the response is 200', async () => {
      // arrange
      mockAxios.onGet().reply(200, [
        {id: 1, displayName: '1', userId: 1},
        {id: 2, displayName: '2', userId: 1},
      ]);

      // act
      const result = await fetchUserTasks('1');

      // assert
      expect(result).toHaveLength(2);
    });

    it('should not return a result when the response is 500', async () => {
      // arrange
      mockAxios.onGet().reply(500);

      // act, assert
      expect(await fetchUserTasks('1')).toBeUndefined();
    });
  });

  describe('createTask', () => {
    it('should return a task when the response is 200', async () => {
      // arrange
      const createdTask = {id: '1', displayName: '1 created', userId: '1', priority: 1, done: false};
      mockAxios.onPost().reply(200, createdTask);

      // act
      const result = await createTask({id: '1', displayName: '1', userId: '1', priority: 1, done: false});

      // assert
      expect(result).toEqual(createdTask);
    });

    it('should not return a result when the response is 500', async () => {
      // arrange
      mockAxios.onPost().reply(500);

      // act, assert
      expect(await createTask({id: '1', displayName: '1', userId: '1', priority: 1, done: false})).toBeUndefined();
    });

    it('should display an error toast when the task name is duplicated (422)', async () => {
      // arrange
      const toastSpy = vi.spyOn(toast, 'error');
      mockAxios.onPost().reply(422);

      // act
      await createTask({id: '1', displayName: '1', userId: '1', priority: 1, done: false});

      // act
      expect(toastSpy).toHaveBeenCalledWith('Task with same name already exists');
    });
  });

  describe('updateTask', () => {
    it('should return a task when the response is 200', async () => {
      // arrange
      const updatedTask = {id: '1', displayName: '1 updated', userId: '1', priority: 1, done: false};
      mockAxios.onPut().reply(200, updatedTask);

      // act
      const result = await updateTask({id: '1', displayName: '1', userId: '1', priority: 1, done: false});

      // assert
      expect(result).toEqual(updatedTask);
    });

    it('should not return a result when the response is 500', async () => {
      // arrange
      mockAxios.onPut().reply(500);

      // act, assert
      expect(await updateTask({id: '1', displayName: '1', userId: '1', priority: 1, done: false})).toBeUndefined();
    });

    it('should display an error toast when the task name is duplicated (422)', async () => {
      // arrange
      const toastSpy = vi.spyOn(toast, 'error');
      mockAxios.onPut().reply(422);

      await updateTask({id: '1', displayName: '1', userId: '1', priority: 1, done: false});

      // act, assert
      expect(toastSpy).toHaveBeenCalledWith('Another task with same name already exists');
    });
  });

  describe('deleteTask', () => {
    it('should return a task when the response is 200', async () => {
      // arrange
      const deletedTask = {id: '1', displayName: '1 deleted', userId: '1', priority: 1, done: false};

      mockAxios.onDelete().reply(200, deletedTask);

      // act, assert
      expect(await deleteTask('1')).toEqual(deletedTask);
    });

    it('should not return a result when the response is 500', async () => {
      // arrange
      mockAxios.onDelete().reply(500);

      // act, assert
      expect(await deleteTask('1')).toBeUndefined();
    });
  });

  describe('changeStatus', () => {
    it('should return a task when the response is 200', async () => {
      // arrange
      const updatedTask = {id: '1', displayName: '1 updated', userId: '1', priority: 1, done: true};
      mockAxios.onPatch().reply(200, updatedTask);

      // act
      const result = await changeStatus('1', true);

      // assert
      expect(result).toEqual(updatedTask);
    });

    it('should not return a result when the response is 500', async () => {
      // arrange
      mockAxios.onPatch().reply(500);

      // act, assert
      expect(await changeStatus('1', true)).toBeUndefined();
    });
  });

  describe('syncTasks', () => {
    const tasksToSync = [
      {id: '1', displayName: '1', userId: '1', priority: 1, done: false},
      {id: '2', displayName: '2', userId: '1', priority: 1, done: false},
    ]

    it('should return a list of tasks when the response is 200', async () => {
      // arrange
      mockAxios.onPost().reply(200, [
        {id: '1', displayName: '1 synced', userId: '1'},
        {id: '2', displayName: '2 synced', userId: '1'},
        {id: '3', displayName: '3 synced', userId: '1'},
      ]);

      // act
      const result = await syncTasks('1', tasksToSync);

      // assert
      expect(result).toHaveLength(3);
    });

    it('should not return a result when the response is 500', async () => {
      // arrange
      mockAxios.onPost().reply(500);

      // act, assert
      expect(await syncTasks('1', tasksToSync)).toBeUndefined();
    });
  });
});