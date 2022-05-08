'use strict';

export class CardNotFoundError extends Error {
  constructor(listId, cardId) {
    super(`Card with id ${cardId} for list ${listId} not found.`);
  }
}
