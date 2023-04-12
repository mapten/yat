import { Request, Response } from 'express';

// Queries
import * as taskQueries from '../dal/queries/task.query';

// Models
import { Task } from '../models/task.model';

export const fetchUserTasks = async (req: Request, res: Response) => {
  const tasks = await taskQueries.fetchUserTasks(req.params.userid);

  const filteredTasks = tasks.map((task) => {
    const { _id, ...taskWithoutId } = task;
    return taskWithoutId;
  });

  return res.send(filteredTasks);
};

export const createTask = async (req: Request, res: Response) => {
  const taskFromRequest: Task = req.body;

  if (!taskFromRequest.displayName) {
    return res.status(400).send('Task name is required');
  }
  if (taskFromRequest.priority == null) {
    return res.status(400).send('Task priority is required');
  }

  const existingTask = await taskQueries.findTaskByNameAndUserId(taskFromRequest.displayName, taskFromRequest.userId);
  if (existingTask) {
    return res.status(422).send('Task already exists');
  }

  const taskToCreate = (({ _id, syncStatus, deleted, ...o }) => o)(taskFromRequest);

  const inserResult = await taskQueries.createTask(taskToCreate);

  if (!inserResult.acknowledged) {
    return res.status(400).send('There was an error creating the task');
  }

  res.send(taskToCreate);
}

export const updateTask = async (req: Request, res: Response) => {
  const taskFromRequest: Task = req.body;

  if (!taskFromRequest.displayName) {
    return res.status(400).send('Task name is required');
  }
  if (taskFromRequest.priority == null) {
    return res.status(400).send('Task priority is required');
  }

  const existingAnotherTask = await taskQueries.findAnotherTaskByNameAndUserId(taskFromRequest.displayName, taskFromRequest.id, taskFromRequest.userId);
  if (existingAnotherTask !== null) {
    return res.status(422).send('Another task already exists with the same name');
  }

  const taskToUpdate = (({ _id, syncStatus, deleted, ...o }) => o)(taskFromRequest);

  const updateResult = await taskQueries.updateTask(taskToUpdate);

  if (!updateResult.acknowledged) {
    return res.status(400).send('There was an error updating the task');
  }

  return res.send(taskToUpdate);
}

export const updateTaskStatus = async (req: Request, res: Response) => {
  const updateResult = await taskQueries.updateTaskStatus(req.params.id, req.body.done);

  if (!updateResult.acknowledged) {
    return res.status(400).send('There was an error updating the task status');
  }

  return res.status(200).send();
}

export const deleteTask = async (req: Request, res: Response) => {
  const deleteResult = await taskQueries.deleteTask(req.params.id);

  if (!deleteResult.acknowledged) {
    return res.status(400).send('There was an error deleting the task');
  }

  return res.status(200).send();
}

export const syncTasks = async (req: Request, res: Response) => {
  const tasksInRequest: Task[] = req.body;
  const userId = req.params.userid;

  const tasksInDatabase = await taskQueries.fetchUserTasks(userId);
  try {
    // use a map to iterate over the tasks and await the result of each promise,
    // in order to be able to catch any error that might happen
    await Promise.all(tasksInRequest.map(async (taskInRequest) => {
      const taskInDatabase = tasksInDatabase.find((task) => task.id === taskInRequest.id);
      if (taskInDatabase) {
        if (taskInRequest.deleted) {
          await taskQueries.deleteTask(taskInRequest.id);
        } else {
          await taskQueries.updateTask({ ...taskInDatabase, ...taskInRequest });
        }
      } else {
        if (!taskInRequest.deleted) {
          await taskQueries.createTask({ ...taskInRequest, userId });
        }
      }
      return;
    }));
    return res.status(200).send('Synced');
  } catch (error) {
    console.log(error);
    return res.status(400).send('There was an error syncing the tasks');
  }
}
