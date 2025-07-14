const axios = require('axios');
const BookSearchProvider = require('../../domain/providers/BookSearchProvider');
const BookDataSearch     = require('../../domain/entities/BookDataSearch');

class OpenLibraryProvider extends BookSearchProvider {
  async searchBooksByTitle(title) {
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: { title }
    });

    /**
     * Genera un ISBN único con el patrón 000-0000000000
     * @returns {string} ISBN único generado aleatoriamente.
     */
    const generateUniqueISBN = () => {
      const randomPart = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
      return `000-${randomPart}`;
    };

    /**
     * Genera una clave aleatoria de 10 caracteres en mayúsculas.
     * @returns {string} Clave aleatoria generada.
     */
    const generateRandomKey = () => Math.random().toString(36).substr(2, 10).toUpperCase();

    const books = response.data.docs.slice(0, 10).map(book => new BookDataSearch({
      key               : book.key.split('/').pop(),
      title             : book.title,
      genre             : book.subject?.[0] || ['Desconocido'],
      publication_year  : book.first_publish_year || 'Desconocido',
      isbn              : book.isbn?.[0] || generateUniqueISBN(),
      descriptions_short: 'No se encuentra la descripción.',
      descriptions_long : 'No se encuentra la descripción.',
      cover_i           : book.cover_i || null,
      cover_url         : book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg`: null,
      editorial         : {
        name         : book.publisher?.[0] || 'Desconocida',
        country      : 'Desconocido',
        founding_date: '1990-01-01',
        key          : generateRandomKey()
      },
      author          : {
        "name"    : book.author_name?.[0] || 'Desconocido',
        "country" : 'Desconocido',
        "birthday": '1990-01-01',
        key       : book.author_key?.[0] || generateRandomKey(),
      }
    }));
    return books;
  }
}

module.exports = OpenLibraryProvider;