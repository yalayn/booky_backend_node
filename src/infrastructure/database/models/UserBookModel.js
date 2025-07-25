const { mongoose, model, Types } = require('mongoose');
const BOOK_STATES = require('../../../domain/constants/BookStates');

const UserBookSchema = new mongoose.Schema({
  user_id: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  book_id: {
    type: Types.ObjectId,
    required: true,
    ref: 'Book',
  },
  state: {
    type: String,
    default: 'to_read',
    enum: BOOK_STATES,
  },
  year_read: {
    type: Number,
    default: new Date().getFullYear(),
  },
  rating: {
    type: Number,
    default: 0,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserBookSchema.index({ user_id: 1, book_id: 1 }, { unique: true });

const UserBookModel = model('UserBook', UserBookSchema);

module.exports = UserBookModel;