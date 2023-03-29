import { Request, Response } from 'express';

export const ping = async (_: Request, res: Response) => {
  return res.status(200).send(true);
}