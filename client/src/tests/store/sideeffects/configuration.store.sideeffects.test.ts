import { afterEach, it, describe, expect, vi, beforeEach } from 'vitest';
import toast from 'react-hot-toast';
import { StoreApi } from 'zustand';
import * as zustandMiddleware from 'zustand/middleware';

// services
import * as genericService from '../../../services/generic.service';

// store
import { ConfigurationState } from '../../../store/configuration.store';
//import { AuthState } from '../../../store/auth.store';
//import * as authStore from '../../../store/auth.store';
//import * as taskStore from '../../../store/task.store';



// side effects
import {
  connectionErrorsAfterChange,
  connectionModeBeforeChange,
  serverConnectionStateAfterChange,
  storeModeBeforeChange
} from '../../../store/sideEffects/configuration.store.sideeffects';
import { PersistStorage, StateStorage } from 'zustand/middleware';
import * as taskSideEffects from '../../../store/sideEffects/task.store.sideefffects';


describe('configuration store side effects', () => {
  const originalAxiosRetries = import.meta.env.VITE_API_AXIOS_RETRIES;

  beforeEach(() => {
    import.meta.env.VITE_API_AXIOS_RETRIES = 5;
  })

  afterEach(() => {
    import.meta.env.VITE_API_AXIOS_RETRIES = originalAxiosRetries;
    vi.clearAllMocks();
  });

  describe('serverConnectionStateAfterChange', () => {
    it('should reconnect to server after a few tries when newServerConnectionState is "error"', async () => {
      // arrange
      const toastSpyError = vi.spyOn(toast, 'error');
      const toastSpySuccess = vi.spyOn(toast, 'success');

      // mocked setTimeout to avoid waiting for the timeout. For this scenario, vitest/jest timeout tools did not work
      const mockSetTimeout = async (callback: (args: void) => void) => {
        callback();
      };
      vi.spyOn(global, 'setTimeout').mockImplementation(mockSetTimeout as any);

      const mockPing = vi.spyOn(genericService, 'pingToServer');

      mockPing.mockRejectedValueOnce(false)
        .mockRejectedValueOnce(false)
        .mockRejectedValueOnce(false)
        .mockResolvedValueOnce(true);

      const mockSetState = vi.fn();
      const fakeConfigurationStore = {
        getState: () => ({
          connectionMode: 'connected',
          storeMode: 'online',
        }),
        setState: mockSetState,
      };

      // act
      serverConnectionStateAfterChange(fakeConfigurationStore as unknown as StoreApi<ConfigurationState>, 'error');

      await new Promise(process.nextTick);

      // assert
      expect(toastSpyError).toHaveBeenCalled();
      expect(toastSpySuccess).toHaveBeenCalled();
      expect(mockSetState).toHaveBeenCalledWith({ serverConnectionState: 'connected' });
      expect(mockSetState).toHaveBeenCalledWith({ storeMode: 'offline' });
      expect(mockSetState).toHaveBeenCalledWith({ connectionErrors: 0 });
    });
  });

  describe('connectionModeBeforeChange', () => {
    it('should set store mode to "offline" when connection mode is "disconnected"', () => {
      // arrange
      const toastSpyError = vi.spyOn(toast, 'error');

      const mockSetState = vi.fn();
      const fakeConfigurationStore = {
        getState: () => ({
          connectionMode: 'connected',
          storeMode: 'online',
        }),
        setState: mockSetState,
      };

      // act
      connectionModeBeforeChange(fakeConfigurationStore as unknown as StoreApi<ConfigurationState>, 'disconnected');

      // assert
      expect(mockSetState).toHaveBeenCalledWith({ storeMode: 'offline' });
      expect(toastSpyError).toHaveBeenCalled();
    });

    it('should set store mode to "online" when connection mode is "connected" and user is authenticated', async () => {
      // arrange
      const toastSpySuccess = vi.spyOn(toast, 'success');

      const mockSetState = vi.fn();
      const fakeConfigurationStore = {
        getState: () => ({
          connectionMode: 'disconnected',
          storeMode: 'offline',
        }),
        setState: mockSetState,
      };

      const authStore = await import('../../../store/auth.store');

      vi.spyOn(authStore, 'useAuthStore').mockImplementation(() => ({
        isAuthenticated: () => true,
      }));

      // act
      connectionModeBeforeChange(fakeConfigurationStore as unknown as StoreApi<ConfigurationState>, 'connected');

      await new Promise(process.nextTick);

      // assert
      expect(mockSetState).toHaveBeenCalledWith({ storeMode: 'online' });
      expect(toastSpySuccess).toHaveBeenCalled();
    });

    it('should not set store mode to "online" when connection mode is "connected" and user is not authenticated', async () => {
      // arrange
      const toastSpySuccess = vi.spyOn(toast, 'success');

      const mockSetState = vi.fn();
      const fakeConfigurationStore = {
        getState: () => ({
          connectionMode: 'disconnected',
          storeMode: 'offline',
        }),
        setState: mockSetState,
      };

      const authStore = await import('../../../store/auth.store');
  
      vi.spyOn(authStore, 'useAuthStore').mockImplementation(() => ({
        isAuthenticated: () => false,
      }));

      // act
      connectionModeBeforeChange(fakeConfigurationStore as unknown as StoreApi<ConfigurationState>, 'connected');

      await new Promise(process.nextTick);

      // assert
      expect(mockSetState).not.toHaveBeenCalledWith({ storeMode: 'online' });
      expect(toastSpySuccess).toHaveBeenCalled();
    });
  });

  describe('connectionErrorsAfterChange', () => {
    it('should set server connection state to "error" when connection errors is greater than number of errors', () => {
      // arrange
      const mockSetState = vi.fn();
      const fakeConfigurationStore = {
        getState: () => ({
          connectionErrors: import.meta.env.VITE_API_AXIOS_RETRIES,
        }),
        setState: mockSetState,
      };

      // act
      connectionErrorsAfterChange(fakeConfigurationStore as unknown as StoreApi<ConfigurationState>, 6);

      // assert
      expect(mockSetState).toHaveBeenCalledWith({ serverConnectionState: 'error' });
    });

    it('should not set server connection state to "error" when connection errors is smaller than number of errors', () => {
      // arrange
      const mockSetState = vi.fn();
      const fakeConfigurationStore = {
        getState: () => ({
          connectionErrors: 3,
        }),
        setState: mockSetState,
      };

      // act
      connectionErrorsAfterChange(fakeConfigurationStore as unknown as StoreApi<ConfigurationState>, 4);

      // assert
      expect(mockSetState).not.toHaveBeenCalledWith({ serverConnectionState: 'error' });
    });
  });

  describe('storeModeBeforeChange', () => {
    it('should call to logout when store mode changes to "offline"', async () => {
      // arrange
      const mockSetState = vi.fn();
      const fakeConfigurationStore = {
        getState: () => ({
          storeMode: 'online'
        }),
        setState: mockSetState,
      };

      const mockLogout = vi.fn();
      const authStore = await import('../../../store/auth.store'); 
      vi.spyOn(authStore, 'useAuthStore').mockImplementation(() => ({
        logout: mockLogout,
      }));

      // act
      storeModeBeforeChange(fakeConfigurationStore as unknown as StoreApi<ConfigurationState>, 'offline');

      await new Promise(process.nextTick);

      // assert
      expect(mockLogout).toHaveBeenCalled();
    });

    it('should not call to logout when store mode changes to "online"', async () => {
      // arrange
      const mockSetState = vi.fn();
      const fakeConfigurationStore = {
        getState: () => ({
          storeMode: 'offline'
        }),
        setState: mockSetState,
      };

      const mockLogout = vi.fn();
      const authStore = await import('../../../store/auth.store'); 
      vi.spyOn(authStore, 'useAuthStore').mockImplementation(() => ({
        logout: mockLogout,
      }));

      // act
      storeModeBeforeChange(fakeConfigurationStore as unknown as StoreApi<ConfigurationState>, 'online');

      await new Promise(process.nextTick);

      // assert
      expect(mockLogout).not.toHaveBeenCalled();
    });

    it('should call to "syncAndFetchTasks" when new store mode is "online"', async () => {
      // arrange
      const mockSetState = vi.fn();
      const fakeConfigurationStore = {
        getState: () => ({
          storeMode: 'offline'
        }),
        setState: mockSetState,
      };

      vi.mock('../../../store/task.store', () => ({
        useTaskStore: {
          persist: {
            setOptions: () => ({foo: 'bar'})
          }
        }
      }));

      const mockSyncAndFetchTasks = vi.spyOn(taskSideEffects, 'syncAndFetchTasks');
      mockSyncAndFetchTasks.mockResolvedValue(undefined);

      //act
      storeModeBeforeChange(fakeConfigurationStore as unknown as StoreApi<ConfigurationState>, 'online');


      await new Promise(process.nextTick);

      // assert
      expect(mockSyncAndFetchTasks).toHaveBeenCalled();
    });

    it('should remove "task-storage" from sessionStorage when the storageMode is set to "offline"', async () => {
      // arrange
      const mockSetState = vi.fn();
      const fakeConfigurationStore = {
        getState: () => ({
          storeMode: 'online'
        }),
        setState: mockSetState,
      };

      vi.mock('../../../store/task.store', () => ({
        useTaskStore: {
          persist: {
            setOptions: () => ({foo: 'bar'})
          }
        }
      }));

      const oritinalSessionStorage = window.sessionStorage.getItem('task-storage') as string;
      window.sessionStorage.setItem('task-storage', 'foo');

      expect(window.sessionStorage.getItem('task-storage')).toBeTruthy();

      //act
      storeModeBeforeChange(fakeConfigurationStore as unknown as StoreApi<ConfigurationState>, 'offline');

      await new Promise(process.nextTick);
      await new Promise(process.nextTick);

      // assert
      expect(window.sessionStorage.getItem('task-storage')).toBeNull();

      window.sessionStorage.setItem('task-storage', oritinalSessionStorage);
    });
  })
});