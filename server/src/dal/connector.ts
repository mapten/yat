import { Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const databaseName = process.env.DATABASE_NAME!;

let db: Db;

export const mongoConnect = (callback: () => void) => {
  MongoClient.connect(connectionString)
    .then(client => {
      console.log('Connected to database');
      db = client.db(databaseName);
      callback();
    })
    .catch(err => {
      console.log(err);
    });
}

export const getDb = () => {
  if (db) {
    return db;
  }
  throw 'No database found';
}

