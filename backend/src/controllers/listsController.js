'use strict';

import { ListNotFoundError } from '../services/listNotFoundError.js';
import { ExpressError } from '../expressError.js';

/**
 * @openapi
 * components:
 *  schemas:
 *   ListData:
 *    type: object
 *    required:
 *     - name
 *    properties:
 *     name:
 *      type: string
 *      example: My First List
 *   ListItem:
 *     allOf:
 *       - $ref: '#/components/schemas/ListData'
 *       - type: object
 *         properties: 
 *           id:
 *             type: number
*/
export class ListsController {
  static registerRoutes(app, service) {
    app.route('/lists')
    /**
     * @openapi
     * /lists:
     *   get:
     *     summary: Returns all lists (without card data)
     *     operationId: getLists
     *     responses:
     *       "200":
     *         description: successful operation
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: "#/components/schemas/ListItem"
     */
      .get(async (_req, res) => res.json(await service.getAll()))

    /**
     * @openapi
     * /lists:
     *   post:
     *     summary: Adds a new list (with no cards)
     *     operationId: createList
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ListData'
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
     *                   description: id of the new list
     */
      .post(async (req, res) => {
        const listId = await service.add(req.body);
        res.status(201);
        res.json({ id: listId });
      });
    
    app.route('/lists/:listId')
    /**
     * @openapi
     * /lists/{listId}:
     *   put:
     *     summary: Modify the core data of a list (not the cards)
     *     operationId: updateListById
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ListData'
     *     responses:
     *       "200":
     *         description: successful operation
     *       "404":
     *         description: List not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *     parameters:
     *       - name: listId
     *         in: "path"
     *         description: "id of the list to be deleted"
     *         required: true
     *         schema:
     *           type: integer
     */
      .put(async (req, res) => {
        try {
          await service.update(+req.params.listId, req.body);
          res.sendStatus(200);
        } catch (error) {
          if (error instanceof ListNotFoundError) throw new ExpressError(404, error.message);
          throw error;
        }
      })

    /**
     * @openapi
     * /lists/{listId}:
     *   delete:
     *     summary: Delete a list and the related cards
     *     operationId: deleteListById
     *     responses:
     *       "200":
     *         description: successful operation
     *       "404":
     *         description: List not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *     parameters:
     *       - name: listId
     *         in: "path"
     *         description: "id of the list to be deleted"
     *         required: true
     *         schema:
     *           type: integer
     */
      .delete(async (req, res) => {
        try {
          await service.delete(+req.params.listId);
          res.sendStatus(200);
        } catch (error) {
          if (error instanceof ListNotFoundError) throw new ExpressError(404, error.message);
          throw error;
        }
      });
  }
}
