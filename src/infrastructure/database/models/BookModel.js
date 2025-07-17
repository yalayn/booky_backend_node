const { descriptions } = require('jest-config');
const { mongoose, model, Types } = require('mongoose');

const BookSchema = new mongoose.Schema({
    _id: {
        type: Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    author_id: {
        type: Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    editorial_id: {
        type: Types.ObjectId,
        required: true,
        ref: 'Editorial'
    },
    genre: {
        type: [String],
        required: true
    },
    publication_year: {
        type: Number,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        maxlength: 20
    },
    descriptions_short: {
        type: String,
        required: false,
        maxlength: 500
    },
    descriptions_long: {
        type: String,
        required: false,
        maxlength: 2000
    },
    path_cover: {
        type: String,
        required: false
    },
    cover_i: {
        type: String,
        required: false
    },
    cover_url: {
        type: String,
        required: false
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
});

const Book = model('Book', BookSchema);

module.exports = Book;