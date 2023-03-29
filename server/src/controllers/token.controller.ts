import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { generateCsrfTokenAndHash } from '../services/token.service';

import { CSRF_COOKIE_NAME, CSRF_HEADERS_NAME } from '../constants/common';

dotenv.config();

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied. No token provided');
  }

  try {
    const tokenSecret = process.env.TOKEN_SECRET as string;
    jwt.verify(token, tokenSecret);
    next();
  } catch (error) {
    res.status(401).send('Invalid token');
  }
}

export const verifyCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  const requestToken = req.headers[CSRF_HEADERS_NAME] as string;

  const tokenHashInCookies = req.signedCookies[CSRF_COOKIE_NAME] || req.cookies[CSRF_COOKIE_NAME];

  const csrfTokenHash = generateCsrfTokenAndHash(requestToken).csrfTokenHash;

  if (csrfTokenHash !== tokenHashInCookies) {
    return res.status(403).send('Invalid CSRF token');
  }
  next();
}

export const generateCsrfToken = (req: Request, res: Response) => {
  const { csrfToken, csrfTokenHash } = generateCsrfTokenAndHash();

  res.cookie(CSRF_COOKIE_NAME, csrfTokenHash, {
    sameSite: 'none',
    secure: true,
    signed: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.send({ csrfToken });
}