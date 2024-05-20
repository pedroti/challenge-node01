import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (request, response) => {
  const { method, url } = request;
  await json(request, response);

  const route = routes.find(route => {
    return route.method === method && route.path.test(url);
  });
  if (route) {
    const routeParams = url.match(route.path);
    const { query, ...params } = routeParams.groups;
    request.query = query ? extractQueryParams(query) : {};
    request.params = params;
    return route.handler(request, response);
  }

  return response.writeHead(404).end('Invalid route');
});

server.listen(3335); //localhost:3335
