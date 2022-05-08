import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ListSchema = new Schema({
  id: Number,
  name: String,
  cards: [{
    id: Number,
    title: String,
    description: String,
    dueDate: Date,
  }]
});

export const ListModel = mongoose.model('List', ListSchema);
