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
async function registerUserBookIfNotExists(userBookRepository, authorRepository, editorialRepository, bookRepository, {userId, bookData}) {
    
    if (!userId || !bookData) {
        throw new Error('User ID and bookData are required');
    }

    let bookId = null;
    let book   = await bookRepository.findByIsbn(bookData.isbn);

    if (!book) {

        const author_id    = new mongoose.Types.ObjectId();
        const authorUpsert = { _id: author_id, key: bookData.author.key, name: bookData.author.name, country: bookData.author.country, birthday: bookData.author.birthday };
        const author       = await authorRepository.upsert(authorUpsert);

        const editorial_id = new mongoose.Types.ObjectId();
        const editorialUpsert = { _id: editorial_id, key: bookData.editorial.key, name: bookData.editorial.name, country: bookData.editorial.country };
        const editorial       = await editorialRepository.upsert(editorialUpsert);

        const path_cover = null;
        const bookUpsert = {
            _id               : new mongoose.Types.ObjectId(),
            title             : bookData.title,
            author_id         : author._id,
            editorial_id      : editorial._id,
            genre             : bookData.genre,
            publication_year  : bookData.publication_year,
            isbn              : bookData.isbn,
            descriptions_short: bookData.descriptions_short,
            descriptions_long : bookData.descriptions_long,
            path_cover        : path_cover,
            cover_i           : bookData.cover_i,
        };
        book = await bookRepository.upsert(bookUpsert);
    }

    bookId = book._id;

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

module.exports = registerUserBookIfNotExists;