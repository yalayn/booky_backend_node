const BookDataMain = require('../../../domain/entities/BookDataMain');
/**
 * @module listByStateUserBook
 * @description Modulo para listar libros de un usuario por estado
 * @param {Array} userBooks - Array de libros del usuario
 * @param {string} baseUrl - URL base del proyecto
 * @returns {Object} - Objeto con los libros agrupados por estado
 */
async function listByStateUserBook(userBooks, baseUrl) {
    const booksByState = {
        to_read: [],
        reading: [],
        read: []
    };

    userBooks.forEach(book => {
        if (book.state in booksByState) {
            const coverUrl = (book.book_details.cover_i !== undefined) ? `https://covers.openlibrary.org/b/id/${book.book_details.cover_i}.jpg` : `${baseUrl}/${book.book_details.path_cover}`;    
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
                cover_url         : coverUrl,
                author            : book.book_details.author,
                editorial         : book.book_details.editorial,
            });
            booksByState[book.state].push(bookDataMain);
        }
    });

    return booksByState;
}
module.exports = listByStateUserBook;