// src/application/use_cases/user_book/removeUserBook.js
const mongoose = require('mongoose');
const UserModel = require('../../../infrastructure/database/models/UserModel');
const validStates = require('../../../domain/constants/BookStates')

async function updateStateUserBook(userBookRepository, {userId, bookId, newState}) {
    if (!userId || !bookId) {
        throw new Error('User ID and Book ID are required');
    }

    // Validar que sea un estado válido
    const allowedStates = UserModel.schema.path('books').schema.path('state').enumValues;
    if (!allowedStates.includes(newState)) {
        throw new Error('Invalid state. Valid states are: ' + validStates.join(', '));
    }

    bookId = new mongoose.Types.ObjectId(bookId);
    return await userBookRepository.updateState(userId, bookId, newState);
}

module.exports = updateStateUserBook;