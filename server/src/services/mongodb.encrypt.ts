import dotenv from 'dotenv';
import { Binary } from 'mongodb';

// Encryption
import { getMongoDbEncryption } from '../dal/connector';

dotenv.config();

/**
 * Based on DEK (Data Encryption Key), encrypts the data.
 * 
 * It is not required to create a decrypt similar funtion, as it is automatically handled by the MongoDB driver.
 * @returns a @type {Promise<Binary>} containing the encrypted data
 */
export const mongoDbEncrypt = async (data: string, key: string) => {
  const bufferKey = Buffer.from(key, 'base64');
  return await getMongoDbEncryption().encrypt(data, {
    algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
    keyId: new Binary(bufferKey),
  });
}