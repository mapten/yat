export interface Task {
  id: string;
  userId: string;
  displayName: string;
  priority: number;
  done: boolean;
  deleted?: boolean;
}