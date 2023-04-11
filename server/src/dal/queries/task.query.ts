// Models
import { Task } from '../../models/task.model';
import { EncryptedTask } from '../../models/encryptedTask.model';

// Constants
import { TASK_TABLE } from '../../constants/dbTables.constants';

// DB
import { getDb } from '../connector';

// Services
import { mongoDbEncrypt } from '../../services/mongodb.encrypt';

// Queries
import { getKeyVaultKey } from './keyvault.query';

export const fetchUserTasks = async (userId: string) => {
  return await getDb().collection<Task>(TASK_TABLE).find({ userId }).toArray();
}

export const findTaskByNameAndUserId = async (displayName: string, userId: string) => {
  const keyVaultKey = await getKeyVaultKey();

  const encryptedDisplayName = await mongoDbEncrypt(displayName, keyVaultKey);

  return getDb().collection<Task>(TASK_TABLE).findOne({ displayName: encryptedDisplayName, userId });
};

export const findAnotherTaskByNameAndUserId = async (displayName: string, id: string, userId: string) => {
  const keyVaultKey = await getKeyVaultKey();
  const encryptedDisplayName = await mongoDbEncrypt(displayName, keyVaultKey);

  return getDb().collection<Task>(TASK_TABLE).findOne({ displayName: encryptedDisplayName, id, userId });
};

export const createTask = async (task: Task) => {
  const keyVaultKey = await getKeyVaultKey();
  const encryptedDisplayName = await mongoDbEncrypt(task.displayName, keyVaultKey);

  const encryptedTask = {
    ...task,
    displayName: encryptedDisplayName,
  };

  return await getDb().collection<EncryptedTask>(TASK_TABLE).insertOne({ ...encryptedTask });
};

export const updateTask = async (task: Task) => {
  const keyVaultKey = await getKeyVaultKey();
  const encryptedDisplayName = await mongoDbEncrypt(task.displayName, keyVaultKey);

  const encryptedTask = {
    ...task,
    displayName: encryptedDisplayName,
  }

  return await getDb().collection<EncryptedTask>(TASK_TABLE).updateOne({ id: task.id }, { $set: encryptedTask });
}

export const updateTaskStatus = async (id: string, done: boolean) => {
  return await getDb().collection<EncryptedTask>(TASK_TABLE).updateOne({ id }, { $set: { done } });
}

export const deleteTask = async (id: string) => {
  return await getDb().collection<EncryptedTask>(TASK_TABLE).deleteOne({ id });
}