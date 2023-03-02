import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_CONNECTION!;

export const mongoConnect = (callback: (param: MongoClient) => {}) => {
  MongoClient.connect(connectionString)
    .then(client => {
      console.log('Connected!');
      callback(client);
    })
    .catch(err => {
      console.log(err);
    });
}

