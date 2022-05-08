import request from 'supertest';

import { app } from '../server.js';
import { ListModel } from '../models/listModel.js';

beforeEach(async () => {
  const payload = { name: "List0" };
  await request(app).post('/lists').send(payload);
})

afterEach(async () => {
  await ListModel.remove({});
})


it('Returns an error if trying to retrieve card data for a list that does not exist', async () => {
  const response = await request(app).get('/lists/1/cards');
  expect(response.status).toBe(404);
  expect(response.body.message).toBe('List with id 1 not found.');
})

it('Returns an empty array of cards if no cards were added to the list', async () => {
  const response = await request(app).get('/lists/0/cards');
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual([]);
})

it('Returns cards added to the list', async () => {
  const payload = { title: "Card title", description: "Desc of card" };
  await request(app).post('/lists/0/cards').send(payload);

  const response2 = await request(app).get('/lists/0/cards');
  expect(response2.status).toBe(200);
  expect(response2.body.length).toBe(1);
  expect(response2.body[0].title).toBe(payload.title);
})


it('Returns an error if trying to add a card to a list that does not exist', async () => {
  const payload = { title: "Card title", description: "Desc of card" };
  const response = await request(app).post('/lists/1/cards').send(payload);

  expect(response.status).toBe(404);
})

it('Returns an error if trying to add a card to an existing list with incorrect payload', async () => {
  const payload = { card_title: "Card title", description: "Desc of card" };
  const response = await request(app).post('/lists/0/cards').send(payload);

  expect(response.status).toBe(400);
})

it('Adds a card to a list if the correct payload is sent to an existing card', async () => {
  const payload = { title: "Card title", description: "Desc of card" };
  const response = await request(app).post('/lists/0/cards').send(payload);

  expect(response.status).toBe(201);
})

it('Adds a card to a list with due date if the correct payload is sent to an existing card', async () => {
  const payload = { title: "Card title", description: "Desc of card", dueDate: "2022-05-06" };
  const response = await request(app).post('/lists/0/cards').send(payload);
  expect(response.status).toBe(201);

  const response2 = await request(app).get('/lists/0/cards');
  expect(response2.status).toBe(200);
  expect(response2.body.length).toBe(1);
  expect(response2.body[0].dueDate).toBe('2022-05-06T00:00:00.000Z');
})


it('Returns an error if trying to update a card from a list that does not exist', async () => {
  const payload = { title: "Card title", description: "Desc of card" };
  const response = await request(app).put('/lists/1/cards/0').send(payload);

  expect(response.status).toBe(404);
})

it('Returns an error if trying to update a card that does not exist', async () => {
  const payload = { title: "Card title", description: "Desc of card" };
  const response = await request(app).put('/lists/0/cards/1').send(payload);

  expect(response.status).toBe(404);
})

it('Returns an error if trying to update a card with the wrong payload', async () => {
  const payload = { title: "Card title", description: "Desc of card" };
  const response = await request(app).post('/lists/0/cards').send(payload);

  const payload2 = { card_title: "Card title", description: "Desc of card" };
  const response2 = await request(app).put('/lists/0/cards/0').send(payload2);

  expect(response2.status).toBe(400);
})

it('Updates a card if the correct payload is sent to an existing card', async () => {
  const payload = { title: "Card title", description: "Desc of card" };
  await request(app).post('/lists/0/cards').send(payload);

  const payload2 = { title: "Card title updated", description: "Desc of card" };
  const response2 = await request(app).put('/lists/0/cards/0').send(payload2);
  expect(response2.status).toBe(200);

  const response3 = await request(app).get('/lists/0/cards');
  expect(response3.body[0].title).toBe(payload2.title);
})


it('Returns an error if trying to delete a card from a list that does not exist', async () => {
  const response = await request(app).delete('/lists/1/cards/0');

  expect(response.status).toBe(404);
})

it('Returns an error if trying to delete a card that does not exist', async () => {
  const response = await request(app).delete('/lists/0/cards/1');

  expect(response.status).toBe(404);
})

it('Deletes a card if both the list and the card exist', async () => {
  const payload = { title: "Card title", description: "Desc of card" };
  await request(app).post('/lists/0/cards').send(payload);

  await request(app).delete('/lists/0/cards/0');
  
  const response3 = await request(app).get('/lists/0/cards');
  expect(response3.body).toStrictEqual([]);
})
