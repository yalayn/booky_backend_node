const BookDataMain = require('../../../domain/entities/BookDataMain');

describe('BookDataMain Entity', () => {
    const sampleData = {
        book_id: 1,
        state: 'read',
        year_read: 2023,
        rating: 5,
        review: 'Great book!',
        title: 'Clean Code',
        genre: 'Programming',
        publication_year: 2008,
        isbn: '9780132350884',
        descriptions_short: 'A handbook of agile software craftsmanship.',
        descriptions_long: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees.',
        cover_url: 'https://example.com/cover.jpg',
        author: 'Robert C. Martin',
        editorial: 'Prentice Hall'
    };

    it('should create an instance with all properties set correctly', () => {
        const book = new BookDataMain(sampleData);
        expect(book.book_id).toBe(sampleData.book_id);
        expect(book.state).toBe(sampleData.state);
        expect(book.year_read).toBe(sampleData.year_read);
        expect(book.rating).toBe(sampleData.rating);
        expect(book.review).toBe(sampleData.review);
        expect(book.title).toBe(sampleData.title);
        expect(book.genre).toBe(sampleData.genre);
        expect(book.publication_year).toBe(sampleData.publication_year);
        expect(book.isbn).toBe(sampleData.isbn);
        expect(book.descriptions_short).toBe(sampleData.descriptions_short);
        expect(book.descriptions_long).toBe(sampleData.descriptions_long);
        expect(book.cover_url).toBe(sampleData.cover_url);
        expect(book.author).toBe(sampleData.author);
        expect(book.editorial).toBe(sampleData.editorial);
    });

    it('should set properties to undefined if not provided', () => {
        const book = new BookDataMain({});
        expect(book.book_id).toBeUndefined();
        expect(book.state).toBeUndefined();
        expect(book.year_read).toBeUndefined();
        expect(book.rating).toBeUndefined();
        expect(book.review).toBeUndefined();
        expect(book.title).toBeUndefined();
        expect(book.genre).toBeUndefined();
        expect(book.publication_year).toBeUndefined();
        expect(book.isbn).toBeUndefined();
        expect(book.descriptions_short).toBeUndefined();
        expect(book.descriptions_long).toBeUndefined();
        expect(book.cover_url).toBeUndefined();
        expect(book.author).toBeUndefined();
        expect(book.editorial).toBeUndefined();
    });

    it('should allow partial data', () => {
        const partialData = { book_id: 2, title: 'Refactoring', author: 'Martin Fowler' };
        const book = new BookDataMain(partialData);
        expect(book.book_id).toBe(2);
        expect(book.title).toBe('Refactoring');
        expect(book.author).toBe('Martin Fowler');
        expect(book.state).toBeUndefined();
        expect(book.year_read).toBeUndefined();
        expect(book.rating).toBeUndefined();
        expect(book.review).toBeUndefined();
        expect(book.genre).toBeUndefined();
        expect(book.publication_year).toBeUndefined();
        expect(book.isbn).toBeUndefined();
        expect(book.descriptions_short).toBeUndefined();
        expect(book.descriptions_long).toBeUndefined();
        expect(book.cover_url).toBeUndefined();
        expect(book.editorial).toBeUndefined();
    });
});