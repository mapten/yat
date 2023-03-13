// src/mocks/handlers.js
import { rest } from 'msw';

// Models
import { Task } from '../models/task.model';

const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT;

let taskList: Task[] = [
  { id: '1', displayName: 'Paint the wall', priority: 3, done: false },
  { id: '2', displayName: 'Create a todoList demo application', priority: 0, done: true },
  { id: '3', displayName: 'Learn Kubernetes', priority: 2, done: false },
  { id: '4', displayName: 'Buy an ukelele', priority: 0, done: true },
  { id: '5', displayName: 'Learn to play ukelele', priority: 1, done: false },
  { id: '6', displayName: 'Sell ukelele', priority: 1, done: true },
];

export const handlers = [
  rest.get(`${API_ENDPOINT}/task`, (_, res, ctx) => {
    return res(ctx.json(taskList));
  }),

  rest.delete(`${API_ENDPOINT}/task/:id`, (req, res, ctx) => {
    const id = req.params.id;
    const taskListToDelete = taskList.find((task) => task.id === id);

    if (!taskListToDelete) {
      return res(ctx.status(404));
    }

    taskList = taskList.filter((task) => task.id !== id);

    return res(ctx.status(200));
  }),

  rest.post(`${API_ENDPOINT}/task`, async (req, res, ctx) => {
    const taskToCreate = await req.json<Task>();
    taskList = [...taskList, taskToCreate];

    return res(ctx.status(201));
  }),

  rest.put(`${API_ENDPOINT}/task`, async (req, res, ctx) => {
    const taskToUpdate = await req.json<Task>();

    const id = taskToUpdate.id;

    if (!taskList.find((task) => task.id === id)) {
      return res(ctx.status(404));
    }

    taskList = taskList.map((task) => (task.id === id ? taskToUpdate : task));

    return res(ctx.status(200));
  }),

  rest.patch(`${API_ENDPOINT}/task/:id`, async (req, res, ctx) => {
    const id = req.params.id;
    const taskToUpdate = taskList.find((task) => task.id === id);

    if (!taskToUpdate) {
      return res(ctx.status(404));
    }

    const isDone = await req.json<{done: boolean}>();
    taskList = taskList.map((task) => (task.id === id ? {...task, done: isDone.done} : task));

    return res(ctx.status(200));
  }),
];