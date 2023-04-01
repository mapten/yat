import { afterEach, beforeEach, describe, expect, vi, it } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Services
import { createUser, loginUser } from '../../services/auth.service';

describe('user.service', () => {
  let mockAxios: MockAdapter;

  const originalViteApiAxiosRetriesEnv = import.meta.env.VITE_API_AXIOS_RETRIES;

  beforeEach(() => {
    // Set the number of retries to 0 to avoid waiting for the retries to finish
    import.meta.env.VITE_API_AXIOS_RETRIES = 0;
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    import.meta.env.VITE_API_AXIOS_RETRIES = originalViteApiAxiosRetriesEnv;
    mockAxios.restore();
  });

  describe('createUser', () => {
    it('should return an user when the response is 200', async () => {
      // arrange
      const createdUser = { id: '1', email: 'john@doe.com', name: 'John Doe Created' };
      mockAxios.onPost().reply(201, createdUser);

      // act
      const result = await createUser({ email: 'john@doe.com', name: 'John Doe', password: '12345678' });

      // assert
      expect(result).toEqual(createdUser);
    });

    it('should not return a result when the response is 500', async () => {
      // arrange
      mockAxios.onPost().reply(500);

      // act, assert
      expect(await createUser({ email: 'john@doe.com', name: 'John Doe', password: '12345678' })).toBeUndefined();
    });

    it('should display a toast when the user already exists', async () => {
      // arrange
      const toastSpy = vi.spyOn(toast, 'error');
      mockAxios.onPost().reply(409);

      // act
      await createUser({ email: 'john@doe.com', name: 'John Doe', password: '12345678' });

      // assert
      expect(toastSpy).toHaveBeenCalledWith('User already exists');
    });
  });

  describe('loginUser', () => {
    it('should return an user when the response is 200', async () => {
      // arrange
      const loggedInUser = { id: '1', email: 'john@doe.com', name: 'John Doe Logged in' };
      mockAxios.onPost().reply(200, loggedInUser);

      // act
      const result = await loginUser({ email: 'john@doe.com', password: '12345678' });

      // assert
      expect(result).toEqual(loggedInUser);
    });

    it('should not return a result when the response is 500', async () => {
      // arrange
      mockAxios.onPost().reply(500);

      // act, assert
      expect(await loginUser({ email: 'john@doe.com', password: '12345678' })).toBeUndefined();
    });

    it('should display a toast when the user credentials are wrong', async () => {
      // arrange
      const toastSpy = vi.spyOn(toast, 'error');
      mockAxios.onPost().reply(401);

      // act
      await loginUser({ email: 'john@doe.com', password: '12345678' });

      // assert
      expect(toastSpy).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});