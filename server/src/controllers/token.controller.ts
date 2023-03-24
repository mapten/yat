import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send('Denied access');
  }

  try {
    const tokenSecret = process.env.JWT_SECRET!;
    jwt.verify(token, tokenSecret);
    next();
  } catch (error) {
    res.status(401).send('Invalid token');
  }
}