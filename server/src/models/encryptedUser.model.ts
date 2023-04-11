import { Binary } from 'mongodb';

// Model
import { User } from './user.model';

export interface EncryptedUser extends Omit<User, 'name' | 'email' | 'password'> {
  name: Binary;
  email: Binary;
  password: Binary;
}