const ReadingSessions = require('../../../domain/entities/ReadingSessions');

describe('ReadingSessions Entity', () => {
    const sampleData = {
        _id: 'session123',
        userId: 'user456',
        bookId: 'book789',
        seconds: 3600,
        date: new Date('2024-06-01T12:00:00Z'),
        lastPageRead: 120,
        createdAt: new Date('2024-06-01T12:01:00Z'),
        updatedAt: new Date('2024-06-01T12:02:00Z')
    };

    it('should create an instance with correct properties', () => {
        const session = new ReadingSessions(sampleData);
        expect(session._id).toBe(sampleData._id);
        expect(session.userId).toBe(sampleData.userId);
        expect(session.bookId).toBe(sampleData.bookId);
        expect(session.seconds).toBe(sampleData.seconds);
        expect(session.date).toBe(sampleData.date);
        expect(session.lastPageRead).toBe(sampleData.lastPageRead);
        expect(session.createdAt).toBe(sampleData.createdAt);
        expect(session.updatedAt).toBe(sampleData.updatedAt);
    });

    it('should create an instance from database data using fromDatabase', () => {
        const dbData = {
            _id: 'session321',
            user_id: 'user654',
            book_id: 'book987',
            seconds: 1800,
            date: new Date('2024-06-02T10:00:00Z'),
            lastPageRead: 45,
            created_at: new Date('2024-06-02T10:01:00Z'),
            updated_at: new Date('2024-06-02T10:02:00Z')
        };
        const session = ReadingSessions.fromDatabase(dbData);
        expect(session._id).toBe(dbData._id);
        expect(session.userId).toBe(dbData.user_id);
        expect(session.bookId).toBe(dbData.book_id);
        expect(session.seconds).toBe(dbData.seconds);
        expect(session.date).toBe(dbData.date);
        expect(session.lastPageRead).toBe(dbData.lastPageRead);
        expect(session.createdAt).toBe(dbData.created_at);
        expect(session.updatedAt).toBe(dbData.updated_at);
    });

    it('should handle missing optional fields gracefully', () => {
        const partialData = {
            _id: 'session999',
            userId: 'user000',
            bookId: 'book111',
            seconds: 0,
            date: null,
            lastPageRead: undefined,
            createdAt: undefined,
            updatedAt: undefined
        };
        const session = new ReadingSessions(partialData);
        expect(session._id).toBe(partialData._id);
        expect(session.userId).toBe(partialData.userId);
        expect(session.bookId).toBe(partialData.bookId);
        expect(session.seconds).toBe(0);
        expect(session.date).toBeNull();
        expect(session.lastPageRead).toBeUndefined();
        expect(session.createdAt).toBeUndefined();
        expect(session.updatedAt).toBeUndefined();
    });
});