import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createHash, randomBytes } from 'crypto';

// Models
import { User } from '../models/user.model';


dotenv.config();

export const createAuthToken = (user: User) => {
  const tokenSecret = process.env.TOKEN_SECRET!;
  const { id, email } = user;

  return jwt.sign({ id, email }, tokenSecret, {
    expiresIn: '1h',
  });
}

export const generateCsrfTokenAndHash = (initialCsrfToken?: string) => {
  const csrfToken = initialCsrfToken ?? randomBytes(64).toString('hex');
  const CSRF_SECRET = process.env.CSRF_SECRET!;

  const csrfTokenHash = createHash('sha256')
    .update(`${csrfToken}${CSRF_SECRET}`)
    .digest('hex');

  return { csrfToken, csrfTokenHash };
}