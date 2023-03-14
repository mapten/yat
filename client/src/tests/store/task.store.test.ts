import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

// Services
import * as taskServices from '../../services/tasks.service';

// Store
import { useTaskStore, getPercentageCompletedTasks } from '../../store/task.store';

// Models
import { Task } from '../../models/task.model';

const mockCreateTask = vi.fn();
const mockFetchTasks = vi.fn();
const mockChangeStatus = vi.fn();
const mockUpdateTask = vi.fn();
const mockDeleteTask = vi.fn();

vi.mock('../../services/tasks.service', () => ({
  createTask: () => mockCreateTask(),
  fetchTasks: () => mockFetchTasks(),
  changeStatus: () => mockChangeStatus(),
  updateTask: () => mockUpdateTask(),
  deleteTask: () => mockDeleteTask(),
} as typeof taskServices));

describe('TaskStore', () => {
  afterEach(() => {
    const { result } = renderHook(() => useTaskStore());
    result.current.clearTasks();
    vi.resetAllMocks();
  });

  describe('actions', () => {
    it('should have an initial empty task list', () => {
      // arrange, act
      const { result } = renderHook(() => useTaskStore());
    
      // assert
      expect(result.current.tasks).toEqual([]);
    });
  
    it('should add a task to the list', async () => {
      // arrange
      const { result } = renderHook(() => useTaskStore());
  
      const taskToAdd: Task = {
        id: '1',
        displayName: 'Test task',
        done: false,
        priority: 1,
      };
  
      expect(result.current.tasks).toHaveLength(0);
      expect(mockCreateTask).toHaveBeenCalledTimes(0);
  
      // act
      await result.current.addTask(taskToAdd);
  
      // assert
      expect(result.current.tasks).toHaveLength(1);
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
    });
  
    it('should change the status of a task', async () => {
      // arrange
      const { result } = renderHook(() => useTaskStore());
  
      const taskToAdd: Task = {
        id: '1',
        displayName: 'Test task',
        done: false,
        priority: 1,
      };
  
      expect(mockChangeStatus).toHaveBeenCalledTimes(0);
  
      await result.current.addTask(taskToAdd);
  
      // act
      await result.current.changeTaskStatus(taskToAdd.id, true);
  
      // assert
      expect(result.current.tasks[0].done).toBe(true);
      expect(mockChangeStatus).toHaveBeenCalledTimes(1);
    });
  
    it('should update a task', async () => {
      // arrange
      const { result } = renderHook(() => useTaskStore());
  
      const taskToAdd: Task = {
        id: '1',
        displayName: 'Test task',
        done: false,
        priority: 1,
      };
  
      expect(mockUpdateTask).toHaveBeenCalledTimes(0);
  
      await result.current.addTask(taskToAdd);
  
      const updatedTask = { ...taskToAdd, displayName: 'Updated task' };
  
      // act
      await result.current.updateTask(updatedTask);
  
      // assert
      expect(mockUpdateTask).toHaveBeenCalledTimes(1);
      expect(result.current.tasks[0].displayName).toBe(updatedTask.displayName);
    });
  
    it('should delete a task', async () => {
      // arrange
      const { result } = renderHook(() => useTaskStore());
  
      const taskToAdd: Task = {
        id: '1',
        displayName: 'Test task',
        done: false,
        priority: 1,
      };
  
      expect(mockDeleteTask).toHaveBeenCalledTimes(0);
  
      await result.current.addTask(taskToAdd);
  
      expect(result.current.tasks).toHaveLength(1);
  
      // act
      await result.current.deleteTask(taskToAdd.id);
  
      // assert
      expect(mockDeleteTask).toHaveBeenCalledTimes(1);
      expect(result.current.tasks).toHaveLength(0);
    });
  
    it('should fetch tasks', async () => {
      mockFetchTasks.mockResolvedValue([
        {id: '1', displayName: 'Test task', done: false, priority: 1},
        {id: '2', displayName: 'Test task 2', done: true, priority: 1}
      ]);
  
      // arrange
      const { result } = renderHook(() => useTaskStore());
  
      expect(mockFetchTasks).toHaveBeenCalledTimes(0);
      expect(result.current.tasks).toHaveLength(0);
  
      // act
      await result.current.fetchTasks();
  
      // assert
      expect(mockFetchTasks).toHaveBeenCalledTimes(1);
      expect(result.current.tasks).toHaveLength(2);
    });
  });

  describe('selectors', () => {
    it('should get the percentage of completed tasks', async () => {
      // arrange
      const { result } = renderHook(() => useTaskStore());
  
      const tasks = [
        {id: '1', displayName: 'Test task', done: false, priority: 1},
        {id: '2', displayName: 'Test task 2', done: true, priority: 1},
        {id: '3', displayName: 'Test task 3', done: true, priority: 1},
        {id: '4', displayName: 'Test task 4', done: false, priority: 1},
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