const mongoose = require('mongoose');
const updateStateUserBook = require('../../../../application/use_cases/user_book/updateStateUserBook');
const UserModel = require('../../../../infrastructure/database/models/UserModel');

jest.mock('mongoose', () => ({
    Types: {
        ObjectId: jest.fn((id) => `ObjectId(${id})`)
    }
}));

const validStates = ['reading', 'completed', 'wishlist'];
jest.mock('../../../../domain/constants/BookStates', () => validStates);

const allowedStates = ['reading', 'completed', 'wishlist'];
jest.mock('../../../../infrastructure/database/models/UserModel', () => ({
    schema: {
        path: jest.fn().mockImplementation((field) => {
            if (field === 'books') {
                return {
                    schema: {
                        path: jest.fn().mockImplementation((subField) => {
                            if (subField === 'state') {
                                return { enumValues: allowedStates };
                            }
                            return {};
                        })
                    }
                };
            }
            return {};
        })
    }
}));

describe('updateStateUserBook', () => {
    let userBookRepository;

    beforeEach(() => {
        userBookRepository = {
            updateState: jest.fn()
        };
        mongoose.Types.ObjectId.mockClear();
    });

    it('should throw error if userId is missing', async () => {
        await expect(
            updateStateUserBook(userBookRepository, { userId: null, bookId: '123', newState: 'reading' })
        ).rejects.toThrow('User ID and Book ID are required');
    });

    it('should throw error if bookId is missing', async () => {
        await expect(
            updateStateUserBook(userBookRepository, { userId: 'user1', bookId: null, newState: 'reading' })
        ).rejects.toThrow('User ID and Book ID are required');
    });

    it('should throw error if newState is invalid', async () => {
        await expect(
            updateStateUserBook(userBookRepository, { userId: 'user1', bookId: '123', newState: 'invalidState' })
        ).rejects.toThrow('Invalid state. Valid states are: reading, completed, wishlist');
    });

    it('should call repository.updateState with correct params', async () => {
        const fakeBookId = new mongoose.Types.ObjectId();
        userBookRepository.updateState.mockResolvedValue('updated');
        const result = await updateStateUserBook(userBookRepository, { userId: 'user1', bookId: '123', newState: 'reading' });
        expect(mongoose.Types.ObjectId).toHaveBeenCalledWith('123');
        expect(userBookRepository.updateState).toHaveBeenCalledWith('user1', fakeBookId, 'reading');
        expect(result).toBe('updated');
    });
});