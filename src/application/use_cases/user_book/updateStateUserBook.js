// src/application/use_cases/user_book/removeUserBook.js
const mongoose = require('mongoose');
const UserBookModel = require('../../../infrastructure/database/models/UserBookModel');
const validStates = require('../../../domain/constants/BookStates')

async function updateStateUserBook(userBookRepository, {userId, bookId, newState}) {
    if (!userId || !bookId) {
        throw new Error('User ID and Book ID are required');
    }

    // Validar que sea un estado válido
    const allowedStates = UserBookModel.schema.path('state').enumValues;
    if (!allowedStates.includes(newState)) {
        throw new Error('Invalid state. Valid states are: ' + validStates.join(', '));
    }

    bookId = new mongoose.Types.ObjectId(bookId);
    userId = new mongoose.Types.ObjectId(userId);
    const userBook = await userBookRepository.updateState(userId, bookId, newState);
    if (!userBook) {
        throw new Error('User book not found or could not be updated');
    }
    return userBook;
}

module.exports = updateStateUserBook;