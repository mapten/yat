import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

// Services
import * as userServices from '../../services/user.service';

// Store
import { useAuthStore } from '../../store/auth.store';

const mockCreateUser = vi.fn();
const mockLoginUser = vi.fn();

vi.mock('../../services/user.service', () => ({
  createUser: () => mockCreateUser(),
  loginUser: () => mockLoginUser(),
} as typeof userServices));

describe('AuthStore', () => {
    beforeEach(() => {
  });

  afterEach(() => {
    const { result } = renderHook(() => useAuthStore());
    result.current.clear();
    vi.restoreAllMocks();
  });

  describe('actions', () => {
    it('should have an initial null user', () => {
      // arrange, act
      const { result } = renderHook(() => useAuthStore());

      // assert
      expect(result.current.user).toBeNull();
    });

    it('should have an initial null token', () => {
      // arrange, act
      const { result } = renderHook(() => useAuthStore());

      // assert
      expect(result.current.token).toBeNull();
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

        mockCreateUser.mockResolvedValue(responseUser);

        const { result } = renderHook(() => useAuthStore());

        result.current.setIsLoginVisible(true);

        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();

        // act
        await result.current.createUser({ name: 'Test user', email: 'test@test.com', password: 'password'});
  
        const expectedStoredUser = {
          id: responseUser.id,
          name: responseUser.name,
          email: responseUser.email
        }

        // assert
        expect(result.current.user).toEqual(expectedStoredUser);
        expect(result.current.token).toBe(responseUser.token);
        expect(result.current.isLoginVisible).toBe(false);
      });

      it('should not store the user and token when service returns an error (no response)', async () => {
        // arrange
        mockCreateUser.mockResolvedValue(undefined);

        const { result } = renderHook(() => useAuthStore());

        result.current.setIsLoginVisible(true);

        // act
        await result.current.createUser({ name: 'Test user', email: 'test@test.com', password: 'password'});

        // assert
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(result.current.isLoginVisible).toBe(true);
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

        mockLoginUser.mockResolvedValue(responseUser);

        const { result } = renderHook(() => useAuthStore());

        result.current.setIsLoginVisible(true);

        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();

        // act
        await result.current.login({ email: 'test@test.com', password: 'password'});

        const expectedStoredUser = {
          id: responseUser.id,
          name: responseUser.name,
          email: responseUser.email
        }

        // assert
        expect(result.current.user).toEqual(expectedStoredUser);
        expect(result.current.token).toBe(responseUser.token);
        expect(result.current.isLoginVisible).toBe(false);
      });

      it('should not store the user and token when service returns an error (no response)', async () => {
        // arrange
        mockLoginUser.mockResolvedValue(undefined);

        const { result } = renderHook(() => useAuthStore());

        result.current.setIsLoginVisible(true);

        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();

        // act
        await result.current.login({ email: 'test@test.com', password: 'password'});

        // assert
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(result.current.isLoginVisible).toBe(true);
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

        mockLoginUser.mockResolvedValue(responseUser);

        const { result, rerender } = renderHook(() => useAuthStore());

        await result.current.login({ email: 'test@test.com', password: 'password'});

        expect(result.current.user).not.toBeNull();
        expect(result.current.token).toBe(responseUser.token);
        expect(result.current.isLoginVisible).toBe(false);

        // act
        result.current.logout();

        rerender();

        // assert
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(result.current.isLoginVisible).toBe(true);
      });
    });

    describe('isAuthenticated', () => {
      it('should return true if token is not null', async () => {
        // arrange
        const responseUser = {
          id: '1',
          name: 'Test user',
          email: 'test@test.com',
          token: 'token',
        }

        mockLoginUser.mockResolvedValue(responseUser);

        const { result } = renderHook(() => useAuthStore());

        expect(result.current.isAuthenticated()).toBeFalsy();

        await result.current.login({ email: 'test@test.com', password: 'password'});

        // act, assert
        expect(result.current.isAuthenticated()).toBeTruthy();
      });
    });
  });
});