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

  const existingTask = await taskQueries.findTaskByNameAndUserId(taskFromRequest.displayName, taskFromRequest.userId);
  if (existingTask) {
    return res.status(422).send('Task already exists');
  }

  const taskToCreate = (({ _id, syncStatus, deleted, ...o }) => o)(taskFromRequest);

  await taskQueries.createTask(taskToCreate);

  res.send(req.body);
}

export const updateTask = async (req: Request, res: Response) => {
  const taskFromRequest: Task = req.body;

  const existingAnotherTask = await taskQueries.findAnotherTaskByNameAndUserId(taskFromRequest.displayName, taskFromRequest.id, taskFromRequest.userId);
  if (existingAnotherTask !== null) {
    return res.status(422).send('Another task already exists with the same name');
  }

  // remove MongoDB _id from the object, if not it would throw an error
  const taskToUpdate = (({ _id, syncStatus, deleted, ...o }) => o)(taskFromRequest);

  await taskQueries.updateTask(taskToUpdate);

  return res.send(req.body);
}

export const updateTaskStatus = async (req: Request, res: Response) => {
  const updatedTask = await taskQueries.updateTaskStatus(req.params.id, req.body.done);
  return res.send(updatedTask);
}

export const deleteTask = async (req: Request, res: Response) => {
  const deletedTask = await taskQueries.deleteTask(req.params.id);
  return res.send(deletedTask);
}

export const syncTasks = async (req: Request, res: Response) => {
  const tasksInRequest: Task[] = req.body;
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
        if (!taskInRequest.deleted) {
          await taskQueries.createTask({ ...taskInRequest, userId });
        }
      }
    });
    return res.send('Synced');
  } catch (error) {
    console.log(error);
    return res.status(400).send('There was an error syncing the tasks');
  }
}
