import { MongoClient, Db, Binary } from 'mongodb';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { ClientEncryption } from 'mongodb-client-encryption';

// Connector
import * as connector from '../../../dal/connector';

// Queries
import { getKeyVaultKey } from '../../../dal/queries/keyvault.query';

describe('getKeyVaultKey', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return an existing key when exists in the database', async () => {
    // arrange
    const mockKey = Buffer.from('mock-key');
    const mockKeyVault = { _id: mockKey };

    vi.spyOn(MongoClient.prototype, 'connect').mockResolvedValue({} as unknown as MongoClient);
    vi.spyOn(MongoClient.prototype, 'close').mockResolvedValue();
    vi.spyOn(MongoClient.prototype, 'db').mockReturnValue({
      collection: () => ({
        findOne: () => mockKeyVault,
      }),
    } as unknown as Db);

    // act
    const result = await getKeyVaultKey();

    // assert
    expect(result).toEqual(mockKey.toString('base64'));
  });

  it('should create a new key if none exists', async () => {
    // arrange
    const mockKey = Buffer.from('mock-key');

    vi.spyOn(MongoClient.prototype, 'connect').mockResolvedValue({} as unknown as MongoClient);
    vi.spyOn(MongoClient.prototype, 'close').mockResolvedValue();
    const mockCreateIndex = vi.fn();
    vi.spyOn(MongoClient.prototype, 'db').mockReturnValue({
      collection: () => ({
        findOne: () => null,
        createIndex: mockCreateIndex
      }),
    } as unknown as Db);

    vi.spyOn(connector, 'getMongoDbEncryption').mockReturnValue({
      createDataKey: vi.fn().mockResolvedValue(new Binary(mockKey)),
    } as unknown as ClientEncryption);

    // act
    const result = await getKeyVaultKey();

    // assert
    expect(mockCreateIndex).toHaveBeenCalled();
    expect(result).toEqual(mockKey.toString('base64'));
  });
});