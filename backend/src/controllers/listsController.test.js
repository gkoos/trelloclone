import request from 'supertest';

import { app } from '../server.js';
import { ListModel } from '../models/listModel.js';

afterEach(async () => {
  await ListModel.remove({});
})


it('Returns an empty list of lists from empty db', async () => {
  const response = await request(app).get('/lists');
  expect(response.body).toStrictEqual([]);
})

it('Returns an error if post an empty payload to create a list', async () => {
  const payload = null;
  const response = await request(app).post('/lists').send(payload);
  expect(response.status).toBe(415);
})


it('Returns an error if payload does not match definition to create a list', async () => {
  const payload = { title: "List name" };
  const response = await request(app).post('/lists').send(payload);
  expect(response.status).toBe(400);
})

it('Creates a list when the correct payload is sent', async () => {
  const payload = { name: "List name" };
  const response = await request(app).post('/lists').send(payload);
  expect(response.status).toBe(201);
  expect(response.body).toStrictEqual({ id: 0 });

  const response2 = await request(app).get('/lists');
  expect(response2.body[0].id).toBe(0);
  expect(response2.body[0].name).toBe(payload.name);
})

it('Returns the correct list id for subsequent calls to create lists', async () => {
  const payload = { name: "List name" };
  const response = await request(app).post('/lists').send(payload);
  expect(response.status).toBe(201);
  expect(response.body).toStrictEqual({ id: 0 });

  const payload2 = { name: "List name 2" };
  const response2 = await request(app).post('/lists').send(payload2);
  expect(response2.status).toBe(201);
  expect(response2.body).toStrictEqual({ id: 1 });
})


it('Returns an error if updating a list that does not exist', async () => {
  const id = 3;
  const payload = { name: "List name" };
  const response = await request(app).put(`/lists/${id}`).send(payload);
  expect(response.status).toBe(404);
})

it('Returns an error if updating a list with incorrect data', async () => {
  const payload = { name: "List name" };
  const response = await request(app).post('/lists').send(payload);

  const id = 0;
  const payload2 = { card_name: "List name" };
  const response2 = await request(app).put(`/lists/${id}`).send(payload2);
  expect(response2.status).toBe(400);
  expect(response2.body.message).toBe('request.body should have required property \'name\'');
})

it('Updates a list if the correct data is sent', async () => {
  const payload = { name: "List name" };
  const response = await request(app).post('/lists').send(payload);

  const id = 0;
  const payload2 = { name: "List name modified" };
  const response2 = await request(app).put(`/lists/${id}`).send(payload2);
  expect(response2.status).toBe(200);

  const response3 = await request(app).get('/lists');
  expect(response3.body[0].name).toBe(payload2.name);
})


it('Returns an error if deleting a nonexisting list', async () => {
  const id = 0;
  const response = await request(app).delete(`/lists/${id}`);
  expect(response.status).toBe(404);
})

it('Deletes a list if it exists', async () => {
  const payload = { name: "List name" };
  const response = await request(app).post('/lists').send(payload);

  const id = 0;
  const response2 = await request(app).delete(`/lists/${id}`);
  expect(response2.status).toBe(200);

  const response3 = await request(app).get('/lists');
  expect(response3.body).toStrictEqual([]);
})
