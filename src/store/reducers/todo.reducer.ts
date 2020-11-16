import { Task } from "../../models/task.model";
import { TodoActionType } from "../../typings/todo.types";

type TodoPayload = {
};

export type TodoActionPartial = { type: TodoActionType } & Partial<TodoPayload>;
export type TodoAction = { type: TodoActionType } & TodoPayload;

export type TodoState = Readonly<{
  todoList: Task[],
}>;

export const todoInitialState: TodoState = {
  todoList: [],
};

export const todoReducer = (state: TodoState = todoInitialState, action: TodoAction): TodoState => {
  switch (action.type) {
    default: {
      return state;
    }
  }
}