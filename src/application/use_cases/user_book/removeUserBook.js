// src/application/use_cases/user_book/removeUserBook.js
const mongoose = require('mongoose');

/**
 * Removes a user book in the repository.
 * @param {Object} userBookRepository - The user book repository.
 * @param {Object} params - The parameters for removeing the user book.
 * @param {string} params.userId - The ID of the user.
 * @param {string} params.bookId - The ID of the book.
 * @returns {Promise<Object>} The removeed user book.
 * @throws {Error} If the user ID or book ID is not provided.
 */
async function removeUserBook(userBookRepository, {userId, bookId}) {
    if (!userId || !bookId) {
        throw new Error('User ID and Book ID are required');
    }
    bookId = new mongoose.Types.ObjectId(bookId);
    return await userBookRepository.remove(userId, bookId);
}

module.exports = removeUserBook;