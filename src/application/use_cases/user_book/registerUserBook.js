// src/application/use_cases/user_book/registerUserBook.js
const mongoose = require('mongoose');
const UserModel = require('../../../infrastructure/database/models/UserModel');

/**
 * Registers a user book in the repository.
 * @param {Object} userBookRepository - The user book repository.
 * @param {Object} params - The parameters for registering the user book.
 * @param {string} params.userId - The ID of the user.
 * @param {string} params.bookId - The ID of the book.
 * @returns {Promise<Object>} The registered user book.
 * @throws {Error} If the user ID or book ID is not provided.
 */
async function registerUserBook(userBookRepository, {userId, bookId}) {

    if (!userId || !bookId) {
        throw new Error('User ID and Book ID are required');
    }

    bookId = new mongoose.Types.ObjectId(bookId);

    // Verificar si el usuario existe
    const user = await UserModel.findOne({ id: userId });
    if (!user) {
        throw new Error('User not found');
    }

    // Verificar si el libro ya existe en el arreglo books
    const bookExists = user.books.some(book => book.book_id.toString() === bookId.toString());
    if (bookExists) {
        throw new Error('Book already exists for this user');
    }
    
    return await userBookRepository.add(userId, bookId);
}

module.exports = registerUserBook;