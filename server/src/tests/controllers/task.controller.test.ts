import { describe, expect, it, afterEach, vi } from 'vitest';
import { DeleteResult, InsertOneResult, UpdateResult } from 'mongodb';
import { Request, Response } from 'express';

import { createTask, deleteTask, fetchUserTasks, syncTasks, updateTask, updateTaskStatus } from '../../controllers/task.controller';

// Queries
import * as taskQueries from '../../dal/queries/task.query';

// Models
import { Task } from '../../models/task.model';

describe('task controller', () => {
  const mockSend = vi.fn();
  const mockStatus = vi.fn(() => ({ send: mockSend }));
  const res = { send: mockSend, status: mockStatus } as unknown as Response;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchUserTasks', () => {
    it('should return a list of tasks', async () => {
      // arrange
      vi.spyOn(taskQueries, 'fetchUserTasks').mockResolvedValue([
        {_id: '1', id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false},
        {_id: '2', id: '2', displayName: 'task 2', userId: '1', priority: 2, done: false},
      ]);
      const req = { params: { userid: '1'} } as unknown as Request;

      // act
      await fetchUserTasks(req, res);

      // assert
      expect(taskQueries.fetchUserTasks).toHaveBeenCalledWith('1');
      expect(mockSend).toHaveBeenCalledWith([
        {id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false},
        {id: '2', displayName: 'task 2', userId: '1', priority: 2, done: false},
      ]);
    });
  });

  describe('createTask', () => {
    it('should return a task when the task does not exist in the database', async () => {
      // arrange
      vi.spyOn(taskQueries, 'findTaskByNameAndUserId').mockResolvedValue(null);
      vi.spyOn(taskQueries, 'createTask').mockResolvedValue({ acknowledged: true, insertedId: '1' });

      const req = { body: {_id: '1', unwantedField: 'do not', syncStatus: 'unsync', id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false} as Task }as unknown as Request;

      // act
      await createTask(req, res);

      // assert
      expect(taskQueries.findTaskByNameAndUserId).toHaveBeenCalledWith('task 1', '1');
      expect(taskQueries.createTask).toHaveBeenCalled();
      expect(mockSend).toHaveBeenCalledWith({id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false});
    });

    it('should return a 400 when displayName is empty', async () => {
      // arrange
      const req = {
        body: {
          _id: '1', syncStatus: 'unsync', id: '1', displayName: null, userId: '1', priority: 1, done: false
        } as unknown as Task
      } as unknown as Request;

      // act
      await createTask(req, res);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith('Task name is required');
    });

    it('should return a 400 when priority is empty', async () => {
      // arrange
      const req = {
        body: {
          _id: '1', syncStatus: 'unsync', id: '1', displayName: 'test', userId: '1', priority: null, done: false
        } as unknown as Task
      } as unknown as Request;

      // act
      await createTask(req, res);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith('Task priority is required');
    });

    it('should return a 422 status code when the task name already exists in the database', async () => {
      // arrange
      vi.spyOn(taskQueries, 'findTaskByNameAndUserId').mockResolvedValue({ _id: '2', id: '2', displayName: 'task 1', userId: '2', priority: 3, done: true });
      vi.spyOn(taskQueries, 'createTask');

      const req = { body: {_id: '1', syncStatus: 'unsync', id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false} as Task }as unknown as Request;

      // act
      await createTask(req, res);

      // assert
      expect(taskQueries.findTaskByNameAndUserId).toHaveBeenCalledWith('task 1', '1');
      expect(taskQueries.createTask).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(422);
    });

    it('should return a 401 status code when there is an error inserting into the database', async () => {
      // arrange
      vi.spyOn(taskQueries, 'findTaskByNameAndUserId').mockResolvedValue(null);
      vi.spyOn(taskQueries, 'createTask').mockResolvedValue({ acknowledged: false, insertedId: '' });

      const req = { body: {_id: '1', syncStatus: 'unsync', id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false} as Task }as unknown as Request;

      // act
      await createTask(req, res);

      // assert
      expect(taskQueries.findTaskByNameAndUserId).toHaveBeenCalledWith('task 1', '1');
      expect(taskQueries.createTask).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
    });
  });

  describe('updateTask', () => {
    it('should return a task when the task does not exist in the database', async () => {
      // arrange
      vi.spyOn(taskQueries, 'findAnotherTaskByNameAndUserId').mockResolvedValue(null);
      vi.spyOn(taskQueries, 'updateTask').mockResolvedValue({ acknowledged: true } as UpdateResult);

      const req = { body: {_id: '1', unwantedField: 'do not', syncStatus: 'unsync', id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false} as Task }as unknown as Request;

      // act
      await updateTask(req, res);

      // assert
      expect(taskQueries.findAnotherTaskByNameAndUserId).toHaveBeenCalledWith('task 1', '1', '1');
      expect(taskQueries.updateTask).toHaveBeenCalled();
      expect(mockSend).toHaveBeenCalledWith({id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false});
    });

    it('should return a 400 when displayName is empty', async () => {
      // arrange
      const req = {
        body: {
          _id: '1', syncStatus: 'unsync', id: '1', displayName: null, userId: '1', priority: 1, done: false
        } as unknown as Task
      } as unknown as Request;

      // act
      await updateTask(req, res);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith('Task name is required');
    });

    it('should return a 400 when priority is empty', async () => {
      // arrange
      const req = {
        body: {
          _id: '1', syncStatus: 'unsync', id: '1', displayName: 'test', userId: '1', priority: null, done: false
        } as unknown as Task
      } as unknown as Request;

      // act
      await updateTask(req, res);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith('Task priority is required');
    });

    it('should return a 422 status code when there is another task with the same name in the database', async () => {
      // arrange
      vi.spyOn(taskQueries, 'findAnotherTaskByNameAndUserId').mockResolvedValue({ _id: '2', id: '2', displayName: 'task 1', userId: '2', priority: 1, done: false });
      vi.spyOn(taskQueries, 'updateTask');

      const req = { body: {_id: '1', syncStatus: 'unsync', id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false} as Task }as unknown as Request;

      // act
      await updateTask(req, res);

      // assert
      expect(taskQueries.findAnotherTaskByNameAndUserId).toHaveBeenCalledWith('task 1', '1', '1');
      expect(taskQueries.updateTask).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(422);
    });

    it('should return a 401 status code when there is an error updating into the database', async () => {
      // arrange
      vi.spyOn(taskQueries, 'findAnotherTaskByNameAndUserId').mockResolvedValue(null);
      vi.spyOn(taskQueries, 'updateTask').mockResolvedValue({ acknowledged: false } as UpdateResult);

      const req = { body: {_id: '1', syncStatus: 'unsync', id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false} as Task }as unknown as Request;

      // act
      await updateTask(req, res);

      // assert
      expect(taskQueries.findAnotherTaskByNameAndUserId).toHaveBeenCalledWith('task 1', '1', '1');
      expect(taskQueries.updateTask).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
    });
  });

  describe('updateTaskStatus', () => {
    it('should return a task when the task exists in the database', async () => {
      // arrange
      vi.spyOn(taskQueries, 'updateTaskStatus').mockResolvedValue({ acknowledged: true } as UpdateResult);

      const req = { body: { done: true} as Task, params: {id: '1'} }as unknown as Request;

      // act
      await updateTaskStatus(req, res);

      // assert
      expect(taskQueries.updateTaskStatus).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it('should return a 401 status code when there is an error updating into the database', async () => {
      // arrange
      vi.spyOn(taskQueries, 'updateTaskStatus').mockResolvedValue({ acknowledged: false } as UpdateResult);

      const req = { body: { done: true} as Task, params: {id: '1'} }as unknown as Request;

      // act
      await updateTaskStatus(req, res);

      // assert
      expect(taskQueries.updateTaskStatus).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteTask', () => {
    it('should return a 200 status code when the task exists in the database', async () => {
      // arrange
      vi.spyOn(taskQueries, 'deleteTask').mockResolvedValue({ acknowledged: true } as DeleteResult);

      const req = { params: {id: '1'} }as unknown as Request;

      // act
      await deleteTask(req, res);

      // assert
      expect(taskQueries.deleteTask).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it('should return a 401 status code when there is an error deleting from the database', async () => {
      // arrange
      vi.spyOn(taskQueries, 'deleteTask').mockResolvedValue({ acknowledged: false } as DeleteResult);

      const req = { params: {id: '1'} }as unknown as Request;

      // act
      await deleteTask(req, res);

      // assert
      expect(taskQueries.deleteTask).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
    });
  });

  describe('syncTasks', () => {
    it('should return a 200 status code when the tasks are synced successfully', async () => {
      // arrange
      vi.spyOn(taskQueries, 'deleteTask').mockResolvedValue({ acknowledged: true } as DeleteResult);
      vi.spyOn(taskQueries, 'updateTask').mockResolvedValue({ acknowledged: true } as UpdateResult);
      vi.spyOn(taskQueries, 'createTask').mockResolvedValue({ acknowledged: true } as InsertOneResult);
      vi.spyOn(taskQueries, 'fetchUserTasks').mockResolvedValue([
        {_id: '1', id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false},
        {_id: '2', id: '2', displayName: 'task 2', userId: '1', priority: 2, done: false},
      ]);

      const req = {
        params: { userid: '1'}, 
        body: [
          {_id: '1', syncStatus: 'unsync', id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false},
          {_id: '2', syncStatus: 'unsync', id: '2', displayName: 'task 2', userId: '1', priority: 2, done: false, deleted: true},
          {_id: '3', syncStatus: 'unsync', id: '3', displayName: 'task 3', userId: '1', priority: 3, done: false},
        ]}as unknown as Request;

      // act
      await syncTasks(req, res);

      // assert
      expect(taskQueries.deleteTask).toHaveBeenNthCalledWith(1, '2');
      expect(taskQueries.updateTask).toHaveBeenNthCalledWith(1, expect.objectContaining({id: '1'}));
      expect(taskQueries.createTask).toHaveBeenNthCalledWith(1, expect.objectContaining({id: '3'}));
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it('should return a 400 status code when there is an error syncing the tasks', async () => {
      // arrange
      vi.spyOn(taskQueries, 'deleteTask').mockRejectedValue(new Error('error'));
      vi.spyOn(taskQueries, 'updateTask').mockResolvedValue({ acknowledged: false } as UpdateResult);
      vi.spyOn(taskQueries, 'createTask').mockResolvedValue({ acknowledged: false } as InsertOneResult);
      vi.spyOn(taskQueries, 'fetchUserTasks').mockResolvedValue([
        {_id: '1', id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false},
        {_id: '2', id: '2', displayName: 'task 2', userId: '1', priority: 2, done: false},
      ]);

      const req = {
        params: { userid: '1'}, 
        body: [
          {_id: '1', syncStatus: 'unsync', id: '1', displayName: 'task 1', userId: '1', priority: 1, done: false},
          {_id: '2', syncStatus: 'unsync', id: '2', displayName: 'task 2', userId: '1', priority: 2, done: false, deleted: true},
          {_id: '3', syncStatus: 'unsync', id: '3', displayName: 'task 3', userId: '1', priority: 3, done: false},
        ]} as unknown as Request;

      // act
      await syncTasks(req, res);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(400);
    });
  });
});