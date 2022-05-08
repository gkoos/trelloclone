'use strict';

import { ListNotFoundError } from '../services/listNotFoundError.js';
import { CardNotFoundError } from '../services/cardNotFoundError.js';
import { ExpressError } from '../expressError.js';

/**
 * @openapi
 * components:
 *  schemas:
 *   CardData:
 *    type: object
 *    required:
 *     - title
 *     - description
 *    properties:
 *     title:
 *       type: string
 *     description:
 *       type: string
 *     dueDate:
 *       type: string
 *       format: date
 *   CardItem:
 *     allOf:
 *       - $ref: '#/components/schemas/CardData'
 *       - type: object
 *         properties: 
 *           id:
 *             type: number
*/
export class CardsController {
  static registerRoutes(app, service) {
    app.route('/lists/:listId/cards')
    /**
     * @openapi
     * /lists/{listId}/cards:
     *   get:
     *     summary: Returns all cards in the given list
     *     operationId: getCardsByListId
     *     responses:
     *       "200":
     *         description: successful operation
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: "#/components/schemas/CardItem"
     *       "404":
     *         description: List not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *     parameters:
     *       - name: listId
     *         in: "path"
     *         description: "list id"
     *         required: true
     *         schema:
     *           type: integer
     */
      .get(async (req, res) => {
        try {
          res.json(await service.getAll(+req.params.listId))
        } catch (error) {
          if (error instanceof ListNotFoundError) throw new ExpressError(404, error.message);
          throw error;
        }
      })

    /**
     * @openapi
     * /lists/{listId}/cards:
     *   post:
     *     summary: Creates a new card for the list
     *     operationId: createCardByListId
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CardData'
     *     responses:
     *       "201":
     *         description: successful operation
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   description: id of the new card
     *       "404":
     *         description: List not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *     parameters:
     *       - name: listId
     *         in: "path"
     *         description: "list id"
     *         required: true
     *         schema:
     *           type: integer
     */
      .post(async (req, res) => {
        try {
          const cardId = await service.add(+req.params.listId, req.body);
          res.status(201);
          res.json({ id: cardId });
        } catch (error) {
          if (error instanceof ListNotFoundError) throw new ExpressError(404, error.message);
          throw error;
        }
      });
    
    app.route('/lists/:listId/cards/:cardId')
    /**
     * @openapi
     * /lists/{listId}/cards/{cardId}:
     *   put:
     *     summary: Modifies a card of the list
     *     operationId: updateCardById
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CardData'
     *     responses:
     *       "200":
     *         description: successful operation
     *       "404":
     *         description: Card or list not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *     parameters:
     *       - name: listId
     *         in: "path"
     *         description: "list id"
     *         required: true
     *         schema:
     *           type: integer
     *       - name: cardId
     *         in: "path"
     *         description: "card id"
     *         required: true
     *         schema:
     *           type: integer
     */
      .put(async (req, res) => {
        try {
          await service.update(+req.params.listId, +req.params.cardId, req.body);
          res.sendStatus(200);
        } catch (error) {
          if (error instanceof ListNotFoundError) throw new ExpressError(404, error.message);
          if (error instanceof CardNotFoundError) throw new ExpressError(404, error.message);
          throw error;
        }
      })

    /**
     * @openapi
     * /lists/{listId}/cards/{cardId}:
     *   delete:
     *     summary: Delete a card from the list
     *     operationId: deleteCardById
     *     responses:
     *       "200":
     *         description: successful operation
     *       "404":
     *         description: Card or list not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *     parameters:
     *       - name: listId
     *         in: "path"
     *         description: "list id"
     *         required: true
     *         schema:
     *           type: integer
     *       - name: cardId
     *         in: "path"
     *         description: "card id"
     *         required: true
     *         schema:
     *           type: integer
     */
      .delete(async (req, res) => {
        try {
          await service.delete(+req.params.listId, +req.params.cardId);
          res.sendStatus(200);
        } catch (error) {
          if (error instanceof ListNotFoundError) throw new ExpressError(404, error.message);
          if (error instanceof CardNotFoundError) throw new ExpressError(404, error.message);
          throw error;
        }
      });
  }
}
