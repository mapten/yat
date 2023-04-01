import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

// Services
import * as userServices from '../../services/auth.service';

// Store
import { useAuthStore } from '../../store/auth.store';
import { TokenState, useTokenStore } from '../../store/token.store';


describe('AuthStore', () => {
  afterEach(() => {
    const { result } = renderHook(() => useAuthStore());
    result.current.reset();
    vi.clearAllMocks();
  });

  describe('actions', () => {
    it('should have initial values', () => {
      // arrange, act
      const { result } = renderHook(() => useAuthStore());

      // assert
      expect(result.current.user).toBeNull();
      expect(result.current.loginVisibleMode).toBeUndefined();
    });

    describe('createUser', () => {
      it('should store the user and token when service returns a response', async () => {
        // arrange
        const responseUser = {
          id: '1',
          name: 'Test user',
          email: 'test@test.com',
          token: 'token',
        }
        const mockCreateUser = vi.spyOn(userServices, 'createUser');
        mockCreateUser.mockResolvedValue(responseUser);

        const mockSetAuthToken = vi.fn();
        const mockTokenStore = vi.spyOn(useTokenStore, 'getState');
        mockTokenStore.mockReturnValue({
          setAuthToken: mockSetAuthToken,
        } as unknown as TokenState);

        const { result } = renderHook(() => useAuthStore());

        expect(result.current.user).toBeNull();
        expect(mockSetAuthToken).not.toHaveBeenCalled();

        // act
        await result.current.createUser({ name: 'Test user', email: 'test@test.com', password: 'password' });

        const expectedStoredUser = {
          id: responseUser.id,
          name: responseUser.name,
          email: responseUser.email
        }

        // assert
        expect(result.current.user).toEqual(expectedStoredUser);
        expect(mockSetAuthToken).toHaveBeenCalledWith('token');
      });

      it('should not store the user and token when service returns an error (no response)', async () => {
        // arrange
        const mockCreateUser = vi.spyOn(userServices, 'createUser');
        mockCreateUser.mockResolvedValue(undefined);

        const mockSetAuthToken = vi.fn();
        const mockTokenStore = vi.spyOn(useTokenStore, 'getState');
        mockTokenStore.mockReturnValue({
          setAuthToken: mockSetAuthToken,
        } as unknown as TokenState);

        const { result } = renderHook(() => useAuthStore());

        // act
        await result.current.createUser({ name: 'Test user', email: 'test@test.com', password: 'password' });

        // assert
        expect(result.current.user).toBeNull();
        expect(mockSetAuthToken).not.toHaveBeenCalled();
      });
    });

    describe('login', () => {
      it('should store the user and token when service returns a response', async () => {
        // arrange
        const responseUser = {
          id: '1',
          name: 'Test user',
          email: 'test@test.com',
          token: 'token',
        }

        vi.spyOn(userServices, 'loginUser').mockResolvedValue(responseUser);

        const mockSetAuthToken = vi.fn();
        const mockTokenStore = vi.spyOn(useTokenStore, 'getState');
        mockTokenStore.mockReturnValue({
          setAuthToken: mockSetAuthToken,
        } as unknown as TokenState);

        const { result } = renderHook(() => useAuthStore());

        expect(result.current.user).toBeNull();
        expect(mockSetAuthToken).not.toHaveBeenCalled();

        // act
        await result.current.login({ email: 'test@test.com', password: 'password' });

        const expectedStoredUser = {
          id: responseUser.id,
          name: responseUser.name,
          email: responseUser.email
        }

        // assert
        expect(result.current.user).toEqual(expectedStoredUser);
        expect(mockSetAuthToken).toHaveBeenCalledWith('token');
      });

      it('should not store the user and token when service returns an error (no response)', async () => {
        // arrange
        vi.spyOn(userServices, 'loginUser').mockResolvedValue(undefined);

        const mockSetAuthToken = vi.fn();
        const mockTokenStore = vi.spyOn(useTokenStore, 'getState');
        mockTokenStore.mockReturnValue({
          setAuthToken: mockSetAuthToken,
        } as unknown as TokenState);

        const { result } = renderHook(() => useAuthStore());

        expect(result.current.user).toBeNull();

        // act
        await result.current.login({ email: 'test@test.com', password: 'password' });

        // assert
        expect(result.current.user).toBeNull();
        expect(mockSetAuthToken).not.toHaveBeenCalled();
      });
    });

    describe('logout', () => {
      it('should clear the user and token', async () => {
        // arrange
        const responseUser = {
          id: '1',
          name: 'Test user',
          email: 'test@test.com',
          token: 'token',
        }

        vi.spyOn(userServices, 'loginUser').mockResolvedValue(responseUser);

        const mockSetAuthToken = vi.fn();
        const mockTokenStore = vi.spyOn(useTokenStore, 'getState');
        mockTokenStore.mockReturnValue({
          setAuthToken: mockSetAuthToken,
        } as unknown as TokenState);

        const { result, rerender } = renderHook(() => useAuthStore());

        await result.current.login({ email: 'test@test.com', password: 'password' });

        expect(result.current.user).not.toBeNull();

        // act
        result.current.logout();

        rerender();

        // assert
        expect(result.current.user).toBeNull();
        expect(mockSetAuthToken).toHaveBeenCalledWith(null);
        expect(result.current.loginVisibleMode).toBeUndefined();
      });
    });

    describe('isAuthenticated', () => {
      it('should return true if token is not null and user is not null', async () => {
        // arrange
        const responseUser = {
          id: '1',
          name: 'Test user',
          email: 'test@test.com',
          token: 'token',
        }

        vi.spyOn(userServices, 'loginUser').mockResolvedValue(responseUser);

        const mockGetAuthToken = vi.fn();
        const mockTokenStore = vi.spyOn(useTokenStore, 'getState');
        mockTokenStore.mockReturnValue({
          getAuthToken: mockGetAuthToken,
          setAuthToken: vi.fn(),
        } as unknown as TokenState);

        mockGetAuthToken.mockReturnValue('token');

        // act
        const { result, rerender } = renderHook(() => useAuthStore());

        await result.current.login({
          email: 'test@test.com',
          password: 'password',
        });

        rerender();

        // assert
        expect(result.current.isAuthenticated()).toBeTruthy();
      });

      it('should return false if token is null and user is not null', async () => {
        // arrange
        const responseUser = {
          id: '1',
          name: 'Test user',
          email: 'test@test.com',
          token: 'token',
        }

        vi.spyOn(userServices, 'loginUser').mockResolvedValue(responseUser);

        const mockGetAuthToken = vi.fn();
        const mockTokenStore = vi.spyOn(useTokenStore, 'getState');
        mockTokenStore.mockReturnValue({
          getAuthToken: mockGetAuthToken,
          setAuthToken: vi.fn(),
        } as unknown as TokenState);

        mockGetAuthToken.mockReturnValue(null);

        // act
        const { result, rerender } = renderHook(() => useAuthStore());

        await result.current.login({
          email: 'test@test.com',
          password: 'password',
        });

        rerender();

        // assert
        expect(result.current.isAuthenticated()).toBeFalsy();
      });

      it('should return false if token is not null and user is null', async () => {
        // arrange
        const mockGetAuthToken = vi.fn();
        const mockTokenStore = vi.spyOn(useTokenStore, 'getState');
        mockTokenStore.mockReturnValue({
          getAuthToken: mockGetAuthToken,
        } as unknown as TokenState);

        mockGetAuthToken.mockReturnValue('token');

        // act
        const { result } = renderHook(() => useAuthStore());

        // assert
        expect(result.current.isAuthenticated()).toBeFalsy();
      });
    });
  });
});