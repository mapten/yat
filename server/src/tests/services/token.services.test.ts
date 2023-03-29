import { describe, it, expect, beforeEach, afterEach, vi, MockedFunction } from 'vitest';
import jwt from 'jsonwebtoken';

import { createAuthToken, generateCsrfTokenAndHash } from '../../services/token.service';

describe('token service', () => {
  const originalTokenSecret = process.env.TOKEN_SECRET;
  const originalcsrfSecret = process.env.CSRF_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.TOKEN_SECRET = originalTokenSecret;
    process.env.CSRF_SECRET = originalcsrfSecret;
    vi.clearAllMocks();
  });

  describe('createAuthToken', () => {
    it('should return a token', () => {
      // arrange
      const spySign = vi.spyOn(jwt, 'sign') as unknown as MockedFunction<typeof jwt.sign>;
      spySign.mockImplementation(() => 'token');
      process.env.TOKEN_SECRET = 'secret';

      const user = { id: '1', email: 'test@test.com', name: 'test', createdAt: '', password: 'test'};

      // act
      const token = createAuthToken(user);

      // assert
      expect(token).toBe('token');
    });
  });

  describe('generateCsrfTokenAndHash', () => {
    it('should return a token and a hash', () => {
      // arrange
      vi.mock('crypto', () => ({
        createHash: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnThis(),
          digest: vi.fn().mockReturnValueOnce('hash'),
        }),
      }));

      //act
      const { csrfToken, csrfTokenHash } = generateCsrfTokenAndHash('test');

      // assert
      expect(csrfToken).toBe('test');
      expect(csrfTokenHash).toBe('hash');
    });
  });
});