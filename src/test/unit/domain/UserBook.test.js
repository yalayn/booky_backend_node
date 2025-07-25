const UserBook = require('../../../domain/entities/UserBook');

describe('UserBook Entity', () => {
    it('should create a UserBook instance with default values', () => {
        const userId = 1;
        const bookId = 2;
        const userBook = new UserBook(userId, bookId);

        expect(userBook.user_id).toBe(userId);
        expect(userBook.book_id).toBe(bookId);
        expect(userBook.state).toBe('to_read');
        expect(userBook.year_read).toBe(new Date().getFullYear());
        expect(userBook.rating).toBe(0);
        expect(userBook.registeredAt).toBeInstanceOf(Date);
        expect(userBook.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a UserBook instance with custom values', () => {
        const userId = 3;
        const bookId = 4;
        const state = 'reading';
        const yearRead = 2022;
        const rating = 5;
        const registeredAt = new Date('2022-01-01');
        const updatedAt = new Date('2022-06-01');

        const userBook = new UserBook(userId, bookId, state, yearRead, rating, registeredAt, updatedAt);

        expect(userBook.user_id).toBe(userId);
        expect(userBook.book_id).toBe(bookId);
        expect(userBook.state).toBe(state);
        expect(userBook.year_read).toBe(yearRead);
        expect(userBook.rating).toBe(rating);
        expect(userBook.registeredAt).toBe(registeredAt);
        expect(userBook.updatedAt).toBe(updatedAt);
    });

    it('should allow rating to be zero', () => {
        const userBook = new UserBook(1, 2, 'read', 2023, 0);
        expect(userBook.rating).toBe(0);
    });

    it('should set registeredAt and updatedAt to current date if not provided', () => {
        const before = new Date();
        const userBook = new UserBook(1, 2);
        const after = new Date();

        expect(userBook.registeredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(userBook.registeredAt.getTime()).toBeLessThanOrEqual(after.getTime());
        expect(userBook.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(userBook.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
});