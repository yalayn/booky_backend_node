const { mongoose, model, Schema, Types } = require('mongoose');

const ReviewSchema = new Schema({
  user_id: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  },
  book_id: {
    type: Types.ObjectId,
    required: true,
    ref: 'Book'
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  review: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const ReviewModel = model('Review', ReviewSchema);

module.exports = ReviewModel;
