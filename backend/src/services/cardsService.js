'use strict';

import { ListModel } from '../models/listModel.js';
import { ListNotFoundError } from './listNotFoundError.js';
import { CardNotFoundError } from './cardNotFoundError.js';

export class CardsService {
  async getAll(listId) {
    const list = await ListModel.findOne({ id: listId });
    if (!list) throw new ListNotFoundError(listId);
    return list.cards;
  }

  async add(listId, cardDetails) {
    const list = await ListModel.findOne({ id: listId });
    if (!list) throw new ListNotFoundError(listId);
    const maximumId = list.cards
      .map(e => e.id)
      .reduce((maxId, currentId) => currentId > maxId ? currentId : maxId, -1);
    const cardId = maximumId + 1;
    list.cards.push({
      id: cardId,
      ...cardDetails
    });
    await list.save();
    return cardId;
  }

  async update(listId, cardId, listDetailsToUpdate) {
    const list = await ListModel.findOne({ id: listId });
    if (!list) throw new ListNotFoundError(listId);

    const cardIndex = list.cards.findIndex(e => e.id === cardId);
    if (cardIndex === -1) throw new CardNotFoundError(listId, cardId);

    list.cards[cardIndex] = {
      ...list.cards[cardIndex],
      ...listDetailsToUpdate
    };
    await list.save();
  }

  async delete(listId, cardId) {
    const list = await ListModel.findOne({ id: listId });
    if (!list) throw new ListNotFoundError(listId);

    const cardIndex = list.cards.findIndex(e => e.id === cardId);
    if (cardIndex === -1) throw new CardNotFoundError(listId, cardId);

    list.cards.splice(cardIndex, 1);
    await list.save();
  }
}
