'use strict';

import { ListModel } from '../models/listModel.js';
import { ListNotFoundError } from './listNotFoundError.js';

export class ListsService {
  async getAll() {
    const lists = await ListModel.find().select('-cards');
    return lists;
  }

  async add(listDetails) {
    const lists = await ListModel.find();
    const maximumId = lists
      .map(e => e.id)
      .reduce((maxId, currentId) => currentId > maxId ? currentId : maxId, -1);
    const listId = maximumId + 1;
    const newListItem = new ListModel({
      id: listId,
      cards: [],
      ...listDetails
    });
    await newListItem.save();
    return listId;
  }

  async update(listId, listDetailsToUpdate) {
    const listItem = await ListModel.findOneAndUpdate({ id: listId }, listDetailsToUpdate);
    if (!listItem) throw new ListNotFoundError(listId);
  }

  async delete(listId) {
    const result = await ListModel.deleteOne({ id: listId });
    if (!result.deletedCount) throw new ListNotFoundError(listId);
  }
}
