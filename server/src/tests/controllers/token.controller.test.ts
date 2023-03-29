import { describe, expect, it, afterEach, vi } from 'vitest';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Constants
import { CSRF_COOKIE_NAME, CSRF_HEADERS_NAME } from '../../constants/common';

// Controllers
import * as tokenController from '../../controllers/token.controller';

// Services
import *  as tokenServices from '../../services/token.service';

describe('token controller', () => {
  const mockSend = vi.fn();
  const mockStatus = vi.fn(() => ({ send: mockSend }));
  const res = { send: mockSend, status: mockStatus } as unknown as Response;
  const next = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('verifyAuthToken', () => {
    it('should call next if the token is valid', () => {
      // arrange
      vi.spyOn(jwt, 'verify').mockImplementation(() => {
        return 'correct';
      });

      const req = { headers: { authorization: 'Bearer correct'} } as unknown as Request;

      // act
      tokenController.verifyAuthToken(req, res, next);

      // assert
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if there is no authorization header', () => {
      // arrange
      const req = { headers: {} } as unknown as Request;

      // act
      tokenController.verifyAuthToken(req, res, next);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(401);
    });
    it('should return 401 if the token is invalid', () => {
      // arrange
      vi.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('invalid token');
      });

      const req = { headers: { authorization: 'Bearer wrong'} } as unknown as Request;

      // act
      tokenController.verifyAuthToken(req, res, next);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('verifyCsrfToken', () => {
    it('should call next if the token is valid', () => {
      // arrange
      vi.spyOn(tokenServices, 'generateCsrfTokenAndHash')
        .mockReturnValue({ csrfToken: '', csrfTokenHash: 'correct hash' });

      const req = {
        headers: { [CSRF_HEADERS_NAME]: 'correct' }, 
        signedCookies: { [CSRF_COOKIE_NAME]: 'correct hash' },
        cookies: {}
      } as unknown as Request;

      // act
      tokenController.verifyCsrfToken(req, res, next);

      // assert
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if there is the generated token and the token in cookies do not match', () => {
      // arrange
      vi.spyOn(tokenServices, 'generateCsrfTokenAndHash')
      .mockReturnValue({ csrfToken: '', csrfTokenHash: 'correct hash' });

      const req = {
        headers: { [CSRF_HEADERS_NAME]: 'correct' }, 
        signedCookies: { [CSRF_COOKIE_NAME]: 'invalid hash' },
        cookies: {}
      } as unknown as Request;

      // act
      tokenController.verifyCsrfToken(req, res, next);

      // assert
      expect(next).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(403);
    });
  });

  describe('generateCsrfToken', () => {
    it('should return a csrf token and call cookie function in response', () => {
      // arrange
      vi.spyOn(tokenServices, 'generateCsrfTokenAndHash')
      .mockReturnValue({ csrfToken: 'token', csrfTokenHash: 'hash' });

      const req = {} as unknown as Request;
      const res = { cookie: vi.fn(), send: mockSend, status: mockStatus } as unknown as Response;

      // act
      tokenController.generateCsrfToken(req, res);

      // assert
      expect(mockSend).toHaveBeenCalledWith({ csrfToken: 'token' });
      expect(res.cookie).toHaveBeenCalledWith(CSRF_COOKIE_NAME, 'hash', expect.any(Object));
    });
  });
});