import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { toast } from 'react-hot-toast';

// Store
import { useConfigurationStore } from '../../store/configuration.store';

// Services
import * as generalService from '../../services/generic.service';

describe('ConfigurationStore', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    const { result } = renderHook(() => useConfigurationStore());
    result.current.clear();
    vi.restoreAllMocks();
  });

  describe('actions', () => {
    it('should have initial values first time loaded', () => {
      // arrange, act
      const { result } = renderHook(() => useConfigurationStore());

      // assert
      expect(result.current.storeMode).toBe('offline');
      expect(result.current.connectionMode).toBe('connected');
      expect(result.current.theme).toBe('light');
      expect(result.current.connectionErrors).toBe(0);
      expect(result.current.reconnectToServerListeners).toEqual([]);
    });

    describe('setTheme', () => {
      it('should store the theme', async () => {
        // arrange
        const { result, rerender } = renderHook(() => useConfigurationStore());

        // act
        result.current.setTheme('dark');

        rerender({});

        // assert
        expect(result.current.theme).toEqual('dark');
      });
    });

    describe('setStoreMode', () => {
      it('should store storeMode', () => {
        const { result, rerender } = renderHook(() => useConfigurationStore());

        // act
        result.current.setStoreMode('online');

        rerender({});

        // assert
        expect(result.current.storeMode).toEqual('online');
      });

      it('should call to reconnect to server listeners when changes from "offline" to "online"', () => {
        // arrange
        let listener1Called = false;
        let listener2Called = false;

        const listener1 = () => {
          listener1Called = true;
        };

        const listener2 = () => {
          listener2Called = true;
        };

        const { result, rerender } = renderHook(() => useConfigurationStore());

        result.current.reconnectedToServer(listener1);
        result.current.reconnectedToServer(listener2);

        // act
        result.current.setStoreMode('online');

        rerender();

        // assert
        expect(result.current.reconnectToServerListeners).toHaveLength(2);
        expect(listener1Called).toBeTruthy();
        expect(listener2Called).toBeTruthy();
      })
    });

    describe('tryToReconnectToServer', () => {
      it('should reconnect to server after a few tries', async () => {
        // arrange
        const toastSpy = vi.spyOn(toast, 'success');

        // mocked setTimeout to avoid waiting for the timeout. For this scenario, vitest/jest timeout tools did not work
        const mockSetTimeout = async (callback: (args: void) => void) => {
          callback();
        };
        vi.spyOn(global, 'setTimeout').mockImplementation(mockSetTimeout as any);

        const mockPing = vi.spyOn(generalService, 'pingToServer');

        mockPing.mockRejectedValueOnce(false)
          .mockRejectedValueOnce(false)
          .mockRejectedValueOnce(false)
          .mockResolvedValueOnce(true);

        let listener1Called = false;
        const listener1 = () => {
          listener1Called = true;
        };

        const { result, rerender } = renderHook(() => useConfigurationStore());

        result.current.reconnectedToServer(listener1);
        result.current.increaseConnectionErrors();
        result.current.setConnectionMode('disconnected');

        // act
        await result.current.tryToReconnectToServer();

        rerender();

        // assert
        expect(result.current.connectionMode).toEqual('connected');
        expect(result.current.connectionErrors).toEqual(0);
        expect(listener1Called).toBeTruthy();
        expect(toastSpy).toHaveBeenCalledWith('Connection to the server has been restored');
      });
    });

    describe('increaseConnectionErrors', () => {
      it('should increase connection errors', () => {
        // arrange
        const { result, rerender } = renderHook(() => useConfigurationStore());

        // act
        result.current.increaseConnectionErrors();

        rerender();

        // assert
        expect(result.current.connectionErrors).toEqual(1);
      });

      it('should set connection state to "disconnected" when connection errors are greater than 3', () => {
        // arrange
        const originalViteApiAxiosRetriesEnv = import.meta.env.VITE_API_AXIOS_RETRIES;

        import.meta.env.VITE_API_AXIOS_RETRIES = 3;

        const { result, rerender } = renderHook(() => useConfigurationStore());

        // act
        result.current.increaseConnectionErrors();
        result.current.increaseConnectionErrors();
        result.current.increaseConnectionErrors();
        result.current.increaseConnectionErrors();

        rerender();

        // assert
        expect(result.current.connectionMode).toEqual('serverError');

        import.meta.env.VITE_API_AXIOS_RETRIES = originalViteApiAxiosRetriesEnv;
      });
    });

    describe('setConnectionState', () => {
      it('should set store mode as error state when connectionState is "serverError" and store storeMode is "online"', () => {
        // arrange
        const spyToastError = vi.spyOn(toast, 'error');

        const { result, rerender } = renderHook(() => useConfigurationStore());

        const mockTryToReconnect = vi.spyOn(result.current, 'tryToReconnectToServer');

        result.current.setStoreMode('online');

        // act
        result.current.setConnectionMode('serverError');

        rerender();

        // assert
        expect(result.current.storeMode).toEqual('error');
        expect(spyToastError).toHaveBeenCalledWith(expect.stringContaining('server'));
        expect(mockTryToReconnect).toHaveBeenCalled();
      });

      it('should set store mode as error state when connectionState is "disconnected" and store storeMode is "online"', () => {
        // arrange
        const spyToastError = vi.spyOn(toast, 'error');

        const { result, rerender } = renderHook(() => useConfigurationStore());

        result.current.setStoreMode('online');

        // act
        result.current.setConnectionMode('disconnected');

        rerender();

        // assert
        expect(result.current.storeMode).toEqual('error');
        expect(spyToastError).toHaveBeenCalledWith(expect.stringContaining('internet'));
      });

      it('should set store mode as "online" state when connectionState is "connected" and store storeMode is "error"', () => {
        // arrange
        const spyToastSuccess = vi.spyOn(toast, 'success');

        const { result, rerender } = renderHook(() => useConfigurationStore());

        result.current.setStoreMode('error');

        result.current.setConnectionMode('disconnected');
        // act
        result.current.setConnectionMode('connected');

        rerender();

        // assert
        expect(result.current.storeMode).toEqual('online');
        expect(spyToastSuccess).toHaveBeenCalledWith(expect.stringContaining('restored'));
      });
    });

    describe('reconnectedToServer', () => {
      it('should add non duplicated listeners to the reconnectToServerListeners array', () => {
        // arrange
        const fooCallback1 = () => { };
        const fooCallback2 = () => { };
        const fooCallback3 = () => { };

        const { result, rerender } = renderHook(() => useConfigurationStore());

        // act
        result.current.reconnectedToServer(fooCallback1);
        result.current.reconnectedToServer(fooCallback1);
        result.current.reconnectedToServer(fooCallback2);
        result.current.reconnectedToServer(fooCallback3);

        rerender();

        // assert
        expect(result.current.reconnectToServerListeners).toHaveLength(3);
      });
    });
  });
});