import { Request, Response } from 'express';

// Queries
import * as taskQueries from '../dal/queries/task.query';

export const getAllTasks = async (_: Request, res: Response) => {
  const tasks = await taskQueries.fetchAllTasks();
  res.send(tasks);
};

export const createTask = async (req: Request, res: Response) => {
  const createdTask = await taskQueries.createTask(req.body);
  res.send(createdTask);
}

export const updateTask = async (req: Request, res: Response) => {
  const updatedTask = await taskQueries.updateTask(req.body);
  res.send(updatedTask);
}

export const updateTaskStatus = async (req: Request, res: Response) => {
  const updatedTask = await taskQueries.updateTaskStatus(req.params.id, req.body.done);
  res.send(updatedTask);
}

export const deleteTask = async (req: Request, res: Response) => {
  const deletedTask = await taskQueries.deleteTask(req.params.id);
  res.send(deletedTask);
}