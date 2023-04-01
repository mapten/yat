import { renderHook } from '@testing-library/react';
import { afterEach, describe, it, vi, expect } from 'vitest';
import { create } from 'zustand';

// Helpers
import * as sideEffectsFactory from '../../../store/helpers/sideEffects.factory';

// Middleware
import { interceptor } from '../../../store/middleware/interceptor.middleware';


describe('interceptor middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be able to intercept actions and call side effects factory', () => {
    // arrange
    const mockSideEffects = vi.spyOn(sideEffectsFactory, 'sideEffectsFactory');

    type TestState = {
      count: number;
      increaseCount: () => void;
    }
    const initialState = { count: 0 };

    const useTestStore = create<TestState>()(
      interceptor((set) => ({
        ...initialState,
        increaseCount: () => set({ count: 1 }),
      })));

    // act
    const { result } = renderHook(() => useTestStore());

    result.current.increaseCount();
    
    //expect
    expect(mockSideEffects).toHaveBeenCalledTimes(2);
    expect(mockSideEffects).toHaveBeenNthCalledWith(1, 'count.beforeChange', expect.anything(), expect.anything());
    expect(mockSideEffects).toHaveBeenNthCalledWith(2, 'count.afterChange', expect.anything(), expect.anything());
  });
});