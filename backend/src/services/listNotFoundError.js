'use strict';

export class ListNotFoundError extends Error {
  constructor(listId) {
    super(`List with id ${listId} not found.`);
  }
}
