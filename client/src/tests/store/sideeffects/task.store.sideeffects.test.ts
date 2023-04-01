import { describe, it, expect, vi, afterEach } from 'vitest';
import { StoreApi } from 'zustand';
import { toast } from 'react-hot-toast';

// Models
import { TaskState } from '../../../store/task.store';

// Side effects
import { syncAndFetchTasks } from '../../../store/sideEffects/task.store.sideefffects';


describe('user store side effects', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call to sync and fetch functions', async () => {
    // arrange
    const mockSyncOfflineTasks = vi.fn();
    const mockFetchTasks = vi.fn();
    const fakeTaskStore = {
      getState: () => ({
        syncOfflineTasks: mockSyncOfflineTasks,
        fetchTasks: mockFetchTasks
      }),
    };

    // act
    await syncAndFetchTasks(fakeTaskStore as unknown as StoreApi<TaskState>, true);

    // assert
    expect(mockSyncOfflineTasks).toHaveBeenCalled();
    expect(mockFetchTasks).toHaveBeenCalled();
  });

  it('should display a toast when displayToast is true', async () => {
    // arrange
    const mockToastPromise = vi.spyOn(toast, 'promise').mockResolvedValue(true);

    const fakeTaskStore = {
      getState: () => ({
        syncOfflineTasks: vi.fn(),
        fetchTasks: vi.fn()
      }),
    };

    // act
    await syncAndFetchTasks(fakeTaskStore as unknown as StoreApi<TaskState>, true);

    // assert
    expect(mockToastPromise).toHaveBeenCalled();
  });

  it('should not display a toast when displayToast is false', async () => {
    // arrange
    const mockToastPromise = vi.spyOn(toast, 'promise').mockResolvedValue(true);

    const fakeTaskStore = {
      getState: () => ({
        syncOfflineTasks: vi.fn(),
        fetchTasks: vi.fn()
      }),
    };

    // act
    await syncAndFetchTasks(fakeTaskStore as unknown as StoreApi<TaskState>, false);

    // assert
    expect(mockToastPromise).not.toHaveBeenCalled();
  });
});