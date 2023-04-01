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
    result.current.reset();
    vi.restoreAllMocks();
  });

  describe('actions', () => {
    it('should have initial values first time loaded', () => {
      // arrange, act
      const { result } = renderHook(() => useConfigurationStore());

      // assert
      expect(result.current.isLoading).toBe(false);
      expect(result.current.storeMode).toBe('offline');
      expect(result.current.connectionMode).toBe('connected');
      expect(result.current.theme).toBe('light');
      expect(result.current.connectionErrors).toBe(0);
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
    });
  });
});