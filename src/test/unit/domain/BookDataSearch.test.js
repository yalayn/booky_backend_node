const BookDataSearch = require('../../../domain/entities/BookDataSearch');

describe('BookDataSearch Entity', () => {
    const sampleData = {
        key: 'book_001',
        title: 'Clean Code',
        genre: 'Programming',
        publication_year: 2008,
        isbn: '9780132350884',
        descriptions_short: 'A handbook of agile software craftsmanship.',
        descriptions_long: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees...',
        cover_i: 12345,
        cover_url: 'http://covers.openlibrary.org/b/id/12345-L.jpg',
        editorial: 'Prentice Hall',
        author: 'Robert C. Martin'
    };

    it('should create an instance with all properties set correctly', () => {
        const book = new BookDataSearch(sampleData);
        expect(book.key).toBe(sampleData.key);
        expect(book.title).toBe(sampleData.title);
        expect(book.genre).toBe(sampleData.genre);
        expect(book.publication_year).toBe(sampleData.publication_year);
        expect(book.isbn).toBe(sampleData.isbn);
        expect(book.descriptions_short).toBe(sampleData.descriptions_short);
        expect(book.descriptions_long).toBe(sampleData.descriptions_long);
        expect(book.cover_i).toBe(sampleData.cover_i);
        expect(book.cover_url).toBe(sampleData.cover_url);
        expect(book.editorial).toBe(sampleData.editorial);
        expect(book.author).toBe(sampleData.author);
    });

    it('should set properties to undefined if not provided', () => {
        const book = new BookDataSearch({});
        expect(book.key).toBeUndefined();
        expect(book.title).toBeUndefined();
        expect(book.genre).toBeUndefined();
        expect(book.publication_year).toBeUndefined();
        expect(book.isbn).toBeUndefined();
        expect(book.descriptions_short).toBeUndefined();
        expect(book.descriptions_long).toBeUndefined();
        expect(book.cover_i).toBeUndefined();
        expect(book.cover_url).toBeUndefined();
        expect(book.editorial).toBeUndefined();
        expect(book.author).toBeUndefined();
    });

    it('should allow partial data', () => {
        const partialData = { title: 'Refactoring', author: 'Martin Fowler' };
        const book = new BookDataSearch(partialData);
        expect(book.title).toBe('Refactoring');
        expect(book.author).toBe('Martin Fowler');
        expect(book.key).toBeUndefined();
        expect(book.genre).toBeUndefined();
    });
});