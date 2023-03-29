// Models
import { Task } from '../../models/task.model';

// Constants
import { TASK_TABLE } from '../../constants/dbTables.constants';

// DB
import { getDb } from '../connector';

export const fetchUserTasks = async (userId: string) => {
  return await getDb().collection<Task>(TASK_TABLE).find({ userId }).toArray();
};

export const findTaskByNameAndUserId = async (name: string, userId: string) => {
  return await getDb().collection<Task>(TASK_TABLE).findOne({ name, userId });
};

export const findAnotherTaskByNameAndUserId = async (name: string, id: string, userId: string) => {
  return await getDb().collection<Task>(TASK_TABLE).findOne({ name, id, userId });
};

export const createTask = async (task: Task) => {
  return await getDb().collection<Task>(TASK_TABLE).insertOne({...task});
};

export const updateTask = async (task: Task) => {
  return await getDb().collection<Task>(TASK_TABLE).updateOne({ id: task.id }, { $set: task });
}

export const updateTaskStatus = async (id: string, done: boolean) => {
  return await getDb().collection<Task>(TASK_TABLE).updateOne({ id }, { $set: { done } });
}

export const deleteTask = async (id: string) => {
  return await getDb().collection<Task>(TASK_TABLE).deleteOne({ id });
}