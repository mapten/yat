import { Db, MongoClient } from 'mongodb';
import { ClientEncryption } from 'mongodb-client-encryption';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL as string;
const databaseName = process.env.DATABASE_NAME as string;

const KEYVAULT_DATABASE_NAME = process.env.KEYVAULT_DATABASE_NAME as string;
const KEYVAULT_COLLECTION = process.env.KEYVAULT_COLLECTION as string;
const keyVaultNamespace = `${KEYVAULT_DATABASE_NAME}.${KEYVAULT_COLLECTION}`;

let db: Db;
let mongoDbEncryption: ClientEncryption;

const encryptionConfiguration = {
  keyVaultNamespace,
  kmsProviders: {
    local: {
      key: Buffer.from(process.env.MONGO_DB_ENCRYPTION_CMK as string, 'base64'),
    }
  }
}

export const mongoConnect = (callback: () => void) => {
  MongoClient.connect(connectionString, {
    autoEncryption: {
      ...encryptionConfiguration,
      bypassAutoEncryption: true,
    },
  })
  .then(client => {
    console.log('Connected to database');
    db = client.db(databaseName);
    mongoDbEncryption = new ClientEncryption(client, encryptionConfiguration);
    callback();
  })
  .catch(err => {
    console.log(err);
  });
}

export const getMongoDbEncryption = () => {
  if (mongoDbEncryption) {
    return mongoDbEncryption;
  }
  throw 'No database encryption found';
}

export const getDb = () => {
  if (db) {
    return db;
  }
  throw 'No database found';
}

