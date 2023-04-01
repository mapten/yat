import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

// Services
import * as tokenServices from '../../services/token.service';

// Store
import { useTokenStore } from '../../store/token.store';

describe('token store', () => {

  afterEach(() => {
    const { result } = renderHook(() => useTokenStore());
    result.current.reset();
    vi.clearAllMocks();
  });

  it('should have initial values', () => {
    // arrange, act
    const { result } = renderHook(() => useTokenStore());

    // assert
    expect(result.current.authToken).toBeNull();
    expect(result.current.csrfToken).toBeNull();
  });

  describe('actions', () => {
    describe('fetchCsrfToken', () => {
      it('should store the csrf token when service returns a response', async () => {
        // arrange
        const responseCsrfToken = 'csrfToken';
        const mockFetchCsrfToken = vi.spyOn(tokenServices, 'fetchCSRFToken');
        mockFetchCsrfToken.mockResolvedValue(responseCsrfToken);

        const { result } = renderHook(() => useTokenStore());

        expect(result.current.csrfToken).toBeNull();

        // act
        await result.current.fetchCsrfToken();

        // assert
        expect(result.current.csrfToken).toBe(responseCsrfToken);
      });
    });
  });
});