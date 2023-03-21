// src/mocks/handlers.js
import { DefaultBodyType, PathParams, rest, RestRequest } from 'msw';
import { LiveStorage } from '@mswjs/storage';
import { v4 as uuidv4 } from 'uuid';

// Models
import { Task } from '../models/task.model';
import { User, UserRequest } from '../models/user.model';

const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT;

type ServerTask = Omit<Task, 'deleted' | 'syncStatus'>;

const tasks: LiveStorage<ServerTask[]> = new LiveStorage('tasks', [
  { id: '1', displayName: 'Paint the wall', priority: 3, done: false, userId: '1', createdAt: '2021-08-01T12:00:00.000Z' },
  { id: '2', displayName: 'Create a todoList demo application', priority: 0, done: true, userId: '1', createdAt: '2022-12-01T12:00:00.000Z' },
  { id: '3', displayName: 'Learn Kubernetes', priority: 2, done: false, userId: '1', createdAt: '2021-08-01T12:01:00.000Z' },
  { id: '4', displayName: 'Buy an ukelele', priority: 0, done: true, userId: '1', createdAt: '2021-08-01T12:01:00.000Z' },
  { id: '5', displayName: 'Learn to play ukelele', priority: 1, done: false, userId: '1', createdAt: '2021-08-01T12:02:00.000Z' },
  { id: '6', displayName: 'Sell ukelele', priority: 1, done: true, userId: '1', createdAt: '2021-08-01T12:03:00.000Z' },
  { id: '7', displayName: 'Task 1', priority: 1, done: false, userId: '2', createdAt: '2021-08-01T12:00:00.000Z' },
  { id: '8', displayName: 'Task 2', priority: 2, done: true, userId: '2', createdAt: '2021-08-01T12:01:00.000Z' },
  { id: '9', displayName: 'Task 3', priority: 2, done: true, userId: '3', createdAt: '2021-08-01T12:02:00.000Z' }
]);

const users = new LiveStorage('users', [
  {
    id: '1',
    email: 'yat@yat.com',
    name: 'Yat',
    password: '11111111'
  },
  {
    id: '2',
    email: 'yat2@yat.com',
    name: 'Yat2',
    password: '22222222'
  }
] as (User & {password: string})[]);
const token = new LiveStorage('token', '');

export const isValidHeaderToken = (req: RestRequest<DefaultBodyType, PathParams<string>>) => {
  const tokenFromHeader = req.headers.get('Authorization')?.replace('Bearer ', '');

  return tokenFromHeader === token.getValue();
};

export const handlers = [
  rest.get(`${API_ENDPOINT}/task/:userId`, (req, res, ctx) => {
    if (!isValidHeaderToken(req)) {
      return res(ctx.status(401));
    }

    const userId = req.params.userId;
    const userTasks = tasks.getValue().filter((task) => task.userId === userId);

    return res(ctx.json(userTasks));
  }),

  rest.delete(`${API_ENDPOINT}/task/:id`, (req, res, ctx) => {
    if (!isValidHeaderToken(req)) {
      return res(ctx.status(401));
    }

    const id = req.params.id;
    const taskListToDelete = tasks.getValue().find((task) => task.id === id);

    if (!taskListToDelete) {
      return res(ctx.status(404));
    }

    tasks.update((tasks) => tasks.filter((task) => task.id !== id));

    return res(ctx.status(200));
  }),

  rest.post(`${API_ENDPOINT}/task`, async (req, res, ctx) => {
    if (!isValidHeaderToken(req)) {
      return res(ctx.status(401));
    }

    const taskToCreate = await req.json<Task>();

    tasks.update((tasks) => [...tasks, {...taskToCreate}]);

    return res(ctx.status(201));
  }),

  rest.put(`${API_ENDPOINT}/task`, async (req, res, ctx) => {
    if (!isValidHeaderToken(req)) {
      return res(ctx.status(401));
    }

    const taskToUpdate = await req.json<Task>();

    const id = taskToUpdate.id;

    if (!tasks.getValue().find((task) => task.id === id)) {
      return res(ctx.status(404));
    }

    tasks.update((tasks) => tasks.map((task) => (task.id === id ? taskToUpdate : task)));

    return res(ctx.status(200));
  }),

  rest.patch(`${API_ENDPOINT}/task/:id`, async (req, res, ctx) => {
    if (!isValidHeaderToken(req)) {
      return res(ctx.status(401));
    }

    const id = req.params.id;
    const taskToUpdate = tasks.getValue().find((task) => task.id === id);

    if (!taskToUpdate) {
      return res(ctx.status(404));
    }

    const isDone = await req.json<{done: boolean}>();

    tasks.update((tasks) => tasks.map((task) => (task.id === id ? {...task, done: isDone.done} : task)));

    return res(ctx.status(200));
  }),

  rest.post(`${API_ENDPOINT}/task/sync/:userId`, async (req, res, ctx) => {
    if (!isValidHeaderToken(req)) {
      return res(ctx.status(401));
    }

    const userId = req.params.userId;
    const tasksToSync = tasks.getValue().filter((task) => task.userId === userId);
    const tasksInRequest = await req.json<Task[]>();

    tasksInRequest.forEach((task) => {
      const taskToSync = tasksToSync.find((t) => t.id === task.id);

      if (taskToSync) {
        if (task.deleted) {
          tasks.update((tasks) => tasks.filter((t) => t.id !== task.id));
        } else {
          tasks.update((tasks) => tasks.map((t) => (t.id === task.id ? task : t)));
        }
      } else {
        tasks.update((tasks) => [...tasks, {...task}]);
      }
    });

    return res(ctx.status(200));
  }),

  rest.post(`${API_ENDPOINT}/user/login`, async (req, res, ctx) => {
    const userRequest: UserRequest = await req.json<UserRequest>();

    const user = users.getValue().find((u) => u.email === userRequest.email && u.password === userRequest.password);
    if (!user) {
      return res(ctx.status(401));
    }

    if (token.getValue() === '') {
      token.update(() => uuidv4());
    }

    return res(ctx.json({name: user.name, email: user.email, id: user.id, token}), ctx.status(200));
  }),

  rest.post(`${API_ENDPOINT}/user/signin`, async (req, res, ctx) => {
    const userRequest = await req.json<UserRequest>();

    if (users.getValue().find((u) => u.email === userRequest.email)) {
      return res(ctx.status(409));
    }

    const createdUser = { ...userRequest, id: uuidv4() };

    users.update((users) => [...users, createdUser]);

    if (token.getValue() === '') {
      token.update(() => uuidv4());
    }

    return res(ctx.json({name: createdUser.name, email: createdUser.email, id: createdUser.id, token}), ctx.status(201));
  }),

  rest.get(`${API_ENDPOINT}/ping`, (req, res, ctx) => {
    if (!isValidHeaderToken(req)) {
      return res(ctx.status(401));
    }

    return res(ctx.json({message: 'pong'}), ctx.status(200));
  })
];