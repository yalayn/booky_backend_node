// src/application/use_cases/user_book/removeUserBook.js
const mongoose = require('mongoose');


async function updateStateUserBook(userBookRepository, {userId, bookId, newState}) {
    if (!userId || !bookId) {
        throw new Error('User ID and Book ID are required');
    }
    bookId = new mongoose.Types.ObjectId(bookId);
    return await userBookRepository.updateState(userId, bookId, newState);
}

module.exports = updateStateUserBook;