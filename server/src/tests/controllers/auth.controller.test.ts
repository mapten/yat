import { describe, expect, it, afterEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

// Services
import * as tokenServices from '../../services/token.service';

// Controllers
import * as authController from '../../controllers/auth.controller';

// Queries
import * as authQueries from '../../dal/queries/auth.query';

describe('auth controller', () => {
  const mockSend = vi.fn();
  const mockStatus = vi.fn(() => ({ send: mockSend }));
  const res = { send: mockSend, status: mockStatus } as unknown as Response;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should return a 200 and a token when the user exists in the database and password is correct', async () => {
      // arrange
      vi.spyOn(authQueries, 'getUserByEmail').mockResolvedValue({
        _id: '1' as unknown as ObjectId,
        id: '1',
        email: 'test@test.com',
        password: 'test',
        name: 'test',
        createdAt: ''
      });
      vi.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      vi.spyOn(tokenServices, 'createAuthToken').mockReturnValue('newToken');
      const req = { body: { email: 'test@test.com', password: 'test' } } as unknown as Request;

      // act
      await authController.login(req, res);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith(expect.not.objectContaining({ _id: '1' }));
      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ token: 'newToken' }));
    });

    it('should return a 401 when the user does not exist in the database', async () => {
      vi.spyOn(authQueries, 'getUserByEmail').mockResolvedValue(null);
      const req = { body: { email: 'test@test.com', password: 'test' } } as unknown as Request;

      // act
      await authController.login(req, res);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockSend).toHaveBeenCalledWith('Invalid credentials');
    });

    it('should return a 401 when the password is incorrect', async () => {
      // arrange
      vi.spyOn(authQueries, 'getUserByEmail').mockResolvedValue(
        {_id: '1' as unknown as ObjectId,
        id: '1',
        email: 'test@test.com',
        password: 'test',
        name: 'test',
        createdAt: ''
      });
      vi.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      const req = { body: { email: 'test@test.com', password: 'test' } } as unknown as Request;

      // act
      await authController.login(req, res);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockSend).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  describe('signIn', () => {
    it('should return a 201 and a token when the user does not exist in the database', async () => {
      // arrange
      vi.spyOn(authQueries, 'signin').mockResolvedValue(true);
      vi.spyOn(bcrypt, 'hashSync').mockResolvedValue('hashedPassword');
      vi.spyOn(tokenServices, 'createAuthToken').mockReturnValue('newToken');

      const req = { body: { email: 'test@test.com', password: 'test', name: 'test' } } as unknown as Request;

      // act
      await authController.signIn(req, res);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockSend).toHaveBeenCalledWith(expect.not.objectContaining({ _id: '1' }));
      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ token: 'newToken' }));
    });

    it('should return a 409 when the user exists in the database', async () => {
      // arrange
      vi.spyOn(authQueries, 'signin').mockResolvedValue(false);
      vi.spyOn(bcrypt, 'hashSync').mockResolvedValue('hashedPassword');

      const req = { body: { email: 'test@test.com', password: 'test', name: 'test' } } as unknown as Request;

      // act
      await authController.signIn(req, res);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(409);
    });
  });
});