const BookDataMain = require('../../../domain/entities/BookDataMain');
/**
 * @module listByStateUserBook
 * @description Modulo para listar libros de un usuario por estado
 * @param {Array} userBooks - Array de libros del usuario
 * @returns {Object} - Objeto con los libros agrupados por estado
 */
async function listByStateUserBook(userBooks) {
    const booksByState = {
        to_read: [],
        reading: [],
        read: []
    };

    userBooks.forEach(book => {
        if (book.state in booksByState) {
            const bookDataMain = new BookDataMain(
                book.book_details.title,
                book.book_details.author,
                book.year_read,
                book.book_details.genre
            );
            booksByState[book.state].push(bookDataMain);
        }
    });

    return booksByState;
}
module.exports = listByStateUserBook;