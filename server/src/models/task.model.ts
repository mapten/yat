export interface Task {
  _id?: string;
  id: string;
  userId: string;
  displayName: string;
  priority: number;
  done: boolean;
  deleted?: boolean;
  syncStatus?: string;
}