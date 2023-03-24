import { Request, Response } from 'express';

// Queries
import * as taskQueries from '../dal/queries/task.query';

// Models
import { Task } from '../models/task.model';

export const fetchUserTasks = async (req: Request, res: Response) => {
  const tasks = await taskQueries.fetchUserTasks(req.params.userid);
  res.send(tasks);
};

export const createTask = async (req: Request, res: Response) => {
  if (taskQueries.findTaskByNameAndUserId(req.body.displayName, req.body.userId) !== null) {
    res.status(422).send('Task already exists');
  }
  const createdTask = await taskQueries.createTask(req.body);
  res.send(createdTask);
}

export const updateTask = async (req: Request, res: Response) => {
  if (taskQueries.findAnotherTaskByNameAndUserId(req.body.displayName, req.body.id, req.body.userId) !== null) {
    res.status(422).send('Another task already exists with the same name');
  }

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

export const syncTasks = async (req: Request, res: Response) => {
  const tasksInRequest: Task[] = req.body.tasks;
  const userId = req.params.userid;

  const tasksInDatabase = await taskQueries.fetchUserTasks(userId);
  try {
    tasksInRequest.forEach(async (taskInRequest) => {
      const taskInDatabase = tasksInDatabase.find((task) => task.id === taskInRequest.id);
      if (taskInDatabase) {
        if (taskInRequest.deleted) {
          await taskQueries.deleteTask(taskInRequest.id);
        } else {
          await taskQueries.updateTask({ ...tasksInDatabase, ...taskInRequest });
        }
      } else {
        await taskQueries.createTask({ ...taskInRequest, userId });
      }
    });
    res.send('Synced');
  } catch (error) {
    res.status(400).send('There was an error syncing the tasks');
  }
}
