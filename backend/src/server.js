'use strict';

import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import mongoose from 'mongoose';
import swaggerJsDoc from 'swagger-jsdoc';
import openApiValidator from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';

import './loadEnv.js';
import { ListsService } from './services/listsService.js';
import { ListsController } from './controllers/listsController.js';
import { CardsService } from './services/cardsService.js';
import { CardsController } from './controllers/cardsController.js';

export const app = express();
const port = process.env.PORT;

app.use(cors())

try {
  await mongoose.connect(`${process.env.MONGO_CONNECT}/${process.env.MONGO_DB}`,
    {
      "authSource": "admin",
      "user": process.env.MONGO_USER,
      "pass": process.env.MONGO_PASS
    }
  );
}
catch (e) {
  console.log('Could not connect to mongo');
}
const db = mongoose.connection;

app.use(express.json());

const swaggerJsDocOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trello Clone API',
      version: '1.0.0',
      description: 'A REST service for managing Trello lists and cards.'
    }
  },
  apis: ['./src/controllers/*.js']
};
const apiSpec = swaggerJsDoc(swaggerJsDocOptions);

app.get('/swagger.json', (_req, res) => res.json(apiSpec));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(null, { swaggerOptions: { url: '/swagger.json' } }));

app.use(openApiValidator.middleware({
  apiSpec,
  validateRequests: true,
  validateResponses: true
}));

ListsController.registerRoutes(app, new ListsService());
CardsController.registerRoutes(app, new CardsService());

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors
  });
});
