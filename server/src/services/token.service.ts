import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Models
import { User } from '../models/user.model';

dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET!;

export const createToken = (user: User) => {
  const { id, email } = user;

  return jwt.sign({ id, email }, tokenSecret, {
    expiresIn: '1h',
  });
}