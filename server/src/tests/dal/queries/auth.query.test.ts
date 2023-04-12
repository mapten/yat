import { Db, Binary } from 'mongodb';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

// Services
import * as mongoEncryption from '../../../services/mongodb.encrypt';

// Connector
import * as connector from '../../../dal/connector';

// Queries
import { signin } from '../../../dal/queries/auth.query';
import * as keyVaultQueries from '../../../dal/queries/keyvault.query';

describe('auth query', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('signin', () => {
    const signInUser = {
      id: '1',
      email: 'test@test.com',
      name: 'test',
      password: 'password',
      createdAt: '2021-01-01',
    };

    vi.spyOn(keyVaultQueries, 'getKeyVaultKey').mockResolvedValue('mock-key');
    vi.spyOn(mongoEncryption, 'mongoDbEncrypt').mockResolvedValue(new Binary('mock-encrypted'));

    beforeEach(() => {
      vi.spyOn(keyVaultQueries, 'getKeyVaultKey').mockResolvedValue('mock-key');
      vi.spyOn(mongoEncryption, 'mongoDbEncrypt').mockResolvedValue(new Binary('mock-encrypted'));
    });

    it.each([true, false])('should return %expected when acknowledged is %expected', async (expected: boolean) => {
      // arrange
      vi.spyOn(connector, 'getDb').mockReturnValue({
        collection: () => ({
          findOne: () => false,
          insertOne: vi.fn().mockResolvedValue({ acknowledged: expected }),
        }),
      } as unknown as Db);
  
      // act
      const result = await signin(signInUser.id, signInUser.email, signInUser.password, signInUser.name, signInUser.createdAt);
  
      // assert
      expect(result).toBe(expected);
    });

    it('should return false when the user email exists', async () => {
      // arrange  
      vi.spyOn(connector, 'getDb').mockReturnValue({
        collection: () => ({
          findOne: () => true,
        }),
      } as unknown as Db);
  
      // act
      const result = await signin(signInUser.id, signInUser.email, signInUser.password, signInUser.name, signInUser.createdAt);
  
      // assert
      expect(result).toBe(false);
    });

    it('should return false when an exception is thrown inserting into the database', async () => {
        // arrange   
        vi.spyOn(connector, 'getDb').mockReturnValue({
          collection: () => ({
            findOne: () => false,
            insertOne: vi.fn().mockRejectedValue(new Error('error')),
          }),
        } as unknown as Db);
    
        // act
        const result = await signin(signInUser.id, signInUser.email, signInUser.password, signInUser.name, signInUser.createdAt);
    
        // assert
        expect(result).toBe(false);
    });
  });
});