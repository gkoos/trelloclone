import request from 'supertest';
import { app } from '../server.js';

it('Should return 404 for an endpoint that does not exist', async () => {
  const response = await request(app).get('/test');
  expect(response.status).toBe(404);
})

it('Should return swaggerfile', async () => {
  const response = await request(app).get('/swagger.json');
  expect(response.status).toBe(200);
  expect(response.type).toBe('application/json');
  expect(response.text).toContain('"openapi":"3.0.0"');
})

it('Should return API documentation', async () => {
  const response = await request(app).get('/swagger');
  expect(response.status).toBe(301); // this is how swagger-ui-express works
  expect(response.type).toBe('text/html');
})
