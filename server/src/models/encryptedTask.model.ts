import { Binary } from 'mongodb';

// Model
import { Task } from './task.model';

export interface EncryptedTask extends Omit<Task, 'displayName'> {
  displayName: Binary;
}