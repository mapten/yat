import { Request, Response } from 'express';

export const ping = async (_: Request, res: Response) => {
  res.status(200).send(true);
}