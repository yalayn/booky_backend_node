const mongoose = require('mongoose');
const updateStateUserBook = require('../../../../application/use_cases/user_book/updateStateUserBook');
const UserBookModel = require('../../../../infrastructure/database/models/UserBookModel');
const validStates = require('../../../../domain/constants/BookStates');

jest.mock('../../../../infrastructure/database/models/UserBookModel', () => ({
    schema: {
        path: () => ({
            enumValues: ['reading', 'completed', 'wantToRead']
        })
    }
}));

describe('updateStateUserBook', () => {
    let userBookRepository;
    let userId;
    let bookId;

    beforeEach(() => {
        userId = new mongoose.Types.ObjectId().toString();
        bookId = new mongoose.Types.ObjectId().toString();
        userBookRepository = {
            updateState: jest.fn()
        };
    });

    it('should throw error if userId is missing', async () => {
        await expect(
            updateStateUserBook(userBookRepository, { userId: null, bookId, newState: 'reading' })
        ).rejects.toThrow('User ID and Book ID are required');
    });

    it('should throw error if bookId is missing', async () => {
        await expect(
            updateStateUserBook(userBookRepository, { userId, bookId: null, newState: 'reading' })
        ).rejects.toThrow('User ID and Book ID are required');
    });

    it('should throw error if newState is invalid', async () => {
        await expect(
            updateStateUserBook(userBookRepository, { userId, bookId, newState: 'invalidState' })
        ).rejects.toThrow(/Invalid state/);
    });

    it('should call repository and return userBook if update is successful', async () => {
        const userBook = { userId, bookId, state: 'completed' };
        userBookRepository.updateState.mockResolvedValue(userBook);

        const result = await updateStateUserBook(userBookRepository, { userId, bookId, newState: 'completed' });
        expect(userBookRepository.updateState).toHaveBeenCalledWith(
            expect.any(mongoose.Types.ObjectId),
            expect.any(mongoose.Types.ObjectId),
            'completed'
        );
        expect(result).toBe(userBook);
    });

    it('should throw error if repository returns null', async () => {
        userBookRepository.updateState.mockResolvedValue(null);

        await expect(
            updateStateUserBook(userBookRepository, { userId, bookId, newState: 'reading' })
        ).rejects.toThrow('User book not found or could not be updated');
    });

    it('should use allowedStates from UserBookModel', async () => {
        userBookRepository.updateState.mockResolvedValue({ userId, bookId, state: 'reading' });
        await expect(
            updateStateUserBook(userBookRepository, { userId, bookId, newState: 'reading' })
        ).resolves.toBeDefined();
    });
});