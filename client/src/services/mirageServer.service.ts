/* istanbul ignore file */
import { Server, Model, Response } from 'miragejs';
import { AnyRegistry } from 'miragejs/-types';
import { API_ENDPOINT } from '../constants/configuration';
import { v4 as uuidv4 } from 'uuid';

// Models
import { Task } from '../models/task.model';

/**
 * Mirage.js requires objects for the model, and as Task is an interface,
 * this class maps the interface into an class
 */
class TaskObject {
  constructor(options: Task) {
    Object.assign(this, options);
  }
}

/**
 * Generates a fake API server for working with an API during development
 */
export function makeServer({ environment = 'development' } = {}): Server<AnyRegistry> {

  return new Server({
    environment,

    models: {
      task: Model.extend(TaskObject),
    },

    /** Creates predefined data for the application. In this case, random quote information */
    seeds(server) {
      const taskList: Task[] = [
        {id: uuidv4(), displayName: 'Paint the wall', priority: 3, done: false},
        {id: uuidv4(), displayName: 'Create a todoList demo application', priority: 0, done: true},
        {id: uuidv4(), displayName: 'Learn Kubernetes', priority: 2, done: false},
        {id: uuidv4(), displayName: 'Buy an ukelele', priority: 0, done: true},
        {id: uuidv4(), displayName: 'Learn to play ukelele', priority: 1, done: false},
        {id: uuidv4(), displayName: 'Sell ukelele', priority: 1, done: true},
      ];

      taskList.forEach((task) => {
        server.create('task', task);
      });
    },

    /** Here all the API routes are managed. If any of the API calls is not specified here, Mirage.js
     * would throw an exception
     */
    routes() {

      this.get(`${API_ENDPOINT}/task/:id`, (schema, request) => {
        const id = request.params.id;

        return schema.db.tasks.find(id);
      });

      this.get(`${API_ENDPOINT}/task`, (schema) => {
        return schema.db.tasks;
      });

      this.delete(`${API_ENDPOINT}/task/:id`, (schema, request) => {
        const id = request.params.id;

        schema.db.tasks.remove(id);

        return new Response(200);
      });

      this.patch(`${API_ENDPOINT}/task/:id`, (schema, request) => {
        const id = request.params.id;
        const patchData: Partial<Task> = JSON.parse(request.requestBody);

        schema.db.tasks.update(id, patchData);

        return new Response(200);
      });

      this.post(`${API_ENDPOINT}/task`, (schema, request) => {
        const postData: Task = JSON.parse(request.requestBody);

        const newTask = {...postData, id: uuidv4()};

        return schema.db.tasks.insert(newTask);
      });

      this.passthrough();
    }
  });
}