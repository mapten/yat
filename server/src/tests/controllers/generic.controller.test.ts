import { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

import { ping } from '../../controllers/generic.controller';

describe('generic controller', () => {
  describe('ping', () => {
    it('should return 200 status code', async () => {
      // arrange
      const mockSend = vi.fn();
      const mockStatus = vi.fn(() => ({ send: mockSend }));
      const res = { send: mockSend, status: mockStatus } as unknown as Response;
      const req = {} as unknown as Request;

      // act
      await ping(req, res);

      // assert
      expect(mockStatus).toHaveBeenCalledWith(200);
    });
  });
});