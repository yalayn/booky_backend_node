const UserBook = require('../../../domain/entities/UserBook');

describe('UserBook Entity', () => {
    it('should create an instance with the given books', () => {
        const books = [{ id: 1, title: 'Book 1' }, { id: 2, title: 'Book 2' }];
        const userBook = new UserBook(books);
        expect(userBook.books).toEqual(books);
    });

    it('should allow books to be an empty array', () => {
        const books = [];
        const userBook = new UserBook(books);
        expect(userBook.books).toEqual([]);
    });

    it('should store any type of value as books', () => {
        const books = 'not an array';
        const userBook = new UserBook(books);
        expect(userBook.books).toBe('not an array');
    });

    it('should have a property named books', () => {
        const userBook = new UserBook([]);
        expect(userBook).toHaveProperty('books');
    });
});