
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
            booksByState[book.state].push(book);
        }
    });

    return booksByState;
}
module.exports = listByStateUserBook;