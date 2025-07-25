// src/application/use_cases/user_book/registerUserBook.js
const mongoose = require('mongoose');
const UserModel = require('../../../infrastructure/database/models/UserModel');
const UserBookModel = require('../../../infrastructure/database/models/UserBookModel');

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
    
    let bookId = null;
    let book   = await bookRepository.findByIsbn(bookData.isbn);

    if (!book) {

        const author_id    = new mongoose.Types.ObjectId();
        const authorUpsert = { _id: author_id, key: bookData.author.key, name: bookData.author.name, country: bookData.author.country, birthday: bookData.author.birthday };
        const author       = await authorRepository.upsert(authorUpsert);

        const editorial_id = new mongoose.Types.ObjectId();
        const editorialUpsert = { _id: editorial_id, key: bookData.editorial.key, name: bookData.editorial.name, country: bookData.editorial.country };
        const editorial       = await editorialRepository.upsert(editorialUpsert);

        const book_id = new mongoose.Types.ObjectId();
        const bookUpsert = {
            _id               : book_id,
            title             : bookData.title,
            author_id         : author._id,
            editorial_id      : editorial._id,
            genre             : bookData.genre,
            publication_year  : bookData.publication_year,
            isbn              : bookData.isbn,
            descriptions_short: bookData.descriptions_short,
            descriptions_long : bookData.descriptions_long,
            path_cover        : null,
            cover_url         : bookData.cover_url,     
        };
        book = await bookRepository.upsert(bookUpsert);
    }

    bookId = book._id;
    const userBook = { user_id: userId, book_id: bookId };

    const isUserBook = await UserBookModel.findOne(userBook);
    if (isUserBook) {
        throw new Error('Book already exists for this user');
    }

    const newUserBook = await userBookRepository.save(userBook);
    if (!newUserBook) {
        throw new Error('Error registering user book');
    }

    return newUserBook;

}

module.exports = registerUserBookIfNotExists;