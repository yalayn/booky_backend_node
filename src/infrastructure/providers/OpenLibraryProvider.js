const axios = require('axios');
const BookSearchProvider = require('../../domain/providers/BookSearchProvider');

class OpenLibraryProvider extends BookSearchProvider {
  async searchBooksByTitle(title) {
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: { title }
    });

    // Generate a unique ISBN with the pattern 000-0000000000
    const generateUniqueISBN = () => {
      const randomPart = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
      return `000-${randomPart}`;
    };
    
    return response.data.docs.slice(0, 10).map(book => ({
        book_id  : book.key.split('/').pop(),
        title    : book.title,
        authors  : book.author_name?.join(', ') || 'Desconocido',
        publisher: book.publisher?.[0] || 'Desconocida',
        year     : book.first_publish_year || 'Desconocido',
        isbn     : book.isbn?.[0] || generateUniqueISBN(),
        cover_url: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null
    }));
  }
}

module.exports = OpenLibraryProvider;