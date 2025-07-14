const BookDataMain = require('../../../domain/entities/BookDataMain');

/** * Lists user books by their state (to_read, reading, read).
 * @param {Object} userBookRepository - The repository to interact with user books.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.baseUrl - The base URL for constructing cover URLs.
 * @param {string} params.userId - The ID of the user   
 * @return {Promise<Object>} A promise that resolves to an object containing arrays of books categorized by their state.
 * @throws {Error} If there is an error fetching user books or if user books are
 * not found.
 */
async function listByStateUserBook(userBookRepository,{baseUrl,userId}) {
    const booksByState = {
        to_read: [],
        reading: [],
        read: []
    };

    const userBooks = await userBookRepository.findUserBooksWithDetails(userId);
    if (!userBooks) {
        throw new Error('Error fetching user books: User books not found');
    }

    userBooks.forEach(book => {
        if (book.state in booksByState) {
            const coverUrl = (book.book_details.cover_i !== undefined) ? `https://covers.openlibrary.org/b/id/${book.book_details.cover_id}.jpg` : `${baseUrl}/${book.book_details.path_cover}`;
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