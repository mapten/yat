import { TodoAction } from '../reducers/todo.reducer';

export interface RootAction {
  todo: TodoAction;
}