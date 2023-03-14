import { initialize, mswDecorator } from 'msw-storybook-addon';
import { rest } from 'msw';

import { Task } from '../../src/models/task.model';

initialize({
  onUnhandledRequest: (method, url) => {
    console.log('Unhandled request', method, url);
  }
});

const API_TASK_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/task`;

const initialTaskList: Task[] = [
  { id: '1', displayName: 'Paint the wall', priority: 3, done: false },
  { id: '2', displayName: 'Create a todoList demo application', priority: 0, done: true },
  { id: '3', displayName: 'Learn Kubernetes', priority: 2, done: false },
  { id: '4', displayName: 'Buy an ukelele', priority: 0, done: true },
  { id: '5', displayName: 'Learn to play ukelele', priority: 1, done: false },
  { id: '6', displayName: 'Sell ukelele', priority: 1, done: true },
];

export const mswParameters = {
  msw: {
    handlers: [
      rest.patch(`${API_TASK_ENDPOINT}/:id`, (_, res, ctx) => {
        return res(ctx.status(200));
      }),
      rest.put(API_TASK_ENDPOINT, (_, res, ctx) => {
        return res(ctx.status(200));
      }),
      rest.post(API_TASK_ENDPOINT, (_, res, ctx) => {
        return res(ctx.status(200));
      }),
      rest.delete(`${API_TASK_ENDPOINT}/:id`, (_, res, ctx) => {
        return res(ctx.status(200));
      }),
      rest.get(API_TASK_ENDPOINT, (_, res, ctx) => {
        return res(ctx.json(initialTaskList));
      }),
    ]
  }
};

export default mswDecorator;