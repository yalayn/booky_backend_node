const BookDataMain = require('../../../domain/entities/BookDetails');
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
            const bookDataMain = new BookDataMain({
                book_id           : book.book_id,
                state             : book.state,
                year_read         : book.year_read,
                rating            : book.rating,
                review            : book.review,
                title             : book.book_details.title,
                genre             : book.book_details.genre,
                publication_year  : book.book_details.publication_year,
                isbn              : book.book_details.isbn,
                descriptions_short: book.book_details.descriptions_short,
                descriptions_long : book.book_details.descriptions_long,
                path_cover        : book.book_details.path_cover,
                author            : book.book_details.author,
                editorial         : book.book_details.editorial,
            });
            booksByState[book.state].push(bookDataMain);
        }
    });

    return booksByState;
}
module.exports = listByStateUserBook;