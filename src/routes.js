import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const tasks = database.select('tasks');
      return response.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.body;
      if (!title || !description) {
        return response.writeHead(400).end(
          JSON.stringify({
            message: 'Title and Description are required fields.',
          })
        );
      }
      const currentDate = new Date();
      const task = {
        id: randomUUID(),
        title,
        description,
        updated_at: currentDate,
        created_at: currentDate,
        completed_at: null,
      };
      database.insert('tasks', task);
      return response.writeHead(201).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;
      database.delete('tasks', id);
      response.writeHead(204).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;
      if (!title || !description) {
        return response.writeHead(400).end(
          JSON.stringify({
            message: 'Title and Description are required fields.',
          })
        );
      }
      const currentDate = new Date();
      database.update('tasks', id, {
        title,
        description,
        updated_at: currentDate,
      });
      response.writeHead(201).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params;
      database.markAsComplete('tasks', id);
      response.writeHead(201).end();
    },
  },
];
