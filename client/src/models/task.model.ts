import { PRIORITY_ORDER_TYPE } from "../constants/priorityLevels.constants";
import { SYNC_STATUS } from '../typings/common.types';

export interface Task {
  id: string;
  userId?: string;
  categoryId?: string;
  displayName: string;
  priority: PRIORITY_ORDER_TYPE;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
  /**
   * Indicates if the task is deleted. It is used to mark the task as deleted, and finally delete it when syncing to database.
   */
  deleted?: boolean;
  syncStatus?: SYNC_STATUS;
}