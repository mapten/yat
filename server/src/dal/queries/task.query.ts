// Models
import { Task } from '../../models/task.model';

// DB
import { getDb } from '../connector';

export const fetchAllTasks = async () => {
  return await getDb().collection<Task>('task').find().toArray();
};

export const createTask = async (task: Task) => {
  return await getDb().collection<Task>('task').insertOne(task);
};

export const updateTask = async (task: Task) => {
  return await getDb().collection<Task>('task').updateOne({ id: task.id }, { $set: task });
}

export const updateTaskStatus = async (id: string, done: boolean) => {
  return await getDb().collection<Task>('task').updateOne({ id }, { $set: { done } });
}

export const deleteTask = async (id: string) => {
  return await getDb().collection<Task>('task').deleteOne({ id });
}