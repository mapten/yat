import { PRIORITY_ORDER_TYPE } from "../constants/priorityLevels.constant";

export interface Task {
  id: string;
  displayName: string;
  priority: PRIORITY_ORDER_TYPE;
  done: boolean;
}