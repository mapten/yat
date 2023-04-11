import dotenv from 'dotenv';
import { Collection, Document, MongoClient } from 'mongodb';

import { getMongoDbEncryption } from '../connector';

dotenv.config();

const KEYVAULT_DATABASE_NAME = process.env.KEYVAULT_DATABASE_NAME as string;
const KEYVAULT_COLLECTION = process.env.KEYVAULT_COLLECTION as string;
const connectionString = process.env.DATABASE_URL as string;

export const getKeyVaultKey = async () => {
  const keyVaultClient = new MongoClient(connectionString);
  keyVaultClient.connect();

  const keyVaultDatabase = keyVaultClient.db(KEYVAULT_DATABASE_NAME);
  const keyVaultCollection = keyVaultDatabase.collection(KEYVAULT_COLLECTION);

  const keyVault = await keyVaultCollection.findOne({ keyAltNames: process.env.MONGO_DB_ALT_KEY_NAME as string });

  const key = !keyVault ? await createKeyVaultIfDoesNotExists(keyVaultCollection) : keyVault._id;

  keyVaultClient.close();

  return key.toString('base64');
};

const createKeyVaultIfDoesNotExists = async (keyVaultCollection: Collection<Document>) => {
  await keyVaultCollection.createIndex({ keyAltNames: 1 }, { unique: true, partialFilterExpression: { keyAltNames: { $exists: true } } });

  const key = await getMongoDbEncryption().createDataKey('local', {
    keyAltNames: [process.env.MONGO_DB_ALT_KEY_NAME as string],
  });

  return key;
};