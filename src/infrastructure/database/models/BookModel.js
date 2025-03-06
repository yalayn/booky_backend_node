const { mongoose, model, Types } = require('mongoose');

const BookSchema = new mongoose.Schema({
    _id: {
        type: Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    autor_id: {
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
        required: true
    }
});

const Book = model('Book', BookSchema);

module.exports = Book;