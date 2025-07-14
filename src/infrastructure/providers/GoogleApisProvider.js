const axios = require('axios');
const BookSearchProvider = require('../../domain/providers/BookSearchProvider');
const BookDataSearch     = require('../../domain/entities/BookDataSearch');

class GoogleApisProvider extends BookSearchProvider {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
        // this.baseUrl = 'https://www.googleapis.com/books/v1/books';
        this.baseUrl = 'https://www.googleapis.com/books/v1/volumes';
    }

    async searchBooksByTitle(title) {

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
        const params = {
            q         : title,
            key       : this.apiKey,
            maxResults: 10,
            startIndex: 0,
        };
        try {
            const response = await axios.get(this.baseUrl, { params });
            const books = response.data.items.map(book => new BookDataSearch({
                key               : book.id,
                title             : book.volumeInfo.title,
                genre             : book.volumeInfo.categories || ['Desconocido'],
                publication_year  : book.volumeInfo.publishedDate || 'Desconocido',
                isbn              : book.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || generateUniqueISBN(),
                descriptions_short: book.searchInfo?.textSnippet || 'No se encuentra la descripción.',
                descriptions_long : book.volumeInfo.description || 'No se encuentra la descripción.',
                cover_i          : null,
                cover_url         : book.volumeInfo.imageLinks?.thumbnail?.replace(/^http:/, 'https:') || null,
                editorial         : {
                    name         : book.volumeInfo.publisher || 'Desconocida',
                    country      : 'Desconocido',
                    founding_date: '1990-01-01',
                    key          : generateRandomKey()
                },
                author: {
                    "name"    : Array.isArray(book.volumeInfo.authors) ? book.volumeInfo.authors[0] : 'Desconocido',
                    "country" : 'Desconocido',
                    "birthday": '1990-01-01',
                    key       : book.author_key || generateRandomKey(),
                }
            }));
            return books;
        } catch (error) {
            console.error('Error fetching books from Google Books API:', error);
            throw new Error('Error fetching books from Google Books API');
        }
    }
}

module.exports = GoogleApisProvider;