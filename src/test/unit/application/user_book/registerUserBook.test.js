const mongoose = require('mongoose');
const registerUserBook = require('../../../../application/use_cases/user_book/registerUserBook');
const UserModel = require('../../../../infrastructure/database/models/UserModel');

jest.mock('../../../../infrastructure/database/models/UserModel');

describe('registerUserBook', () => {
    let userBookRepository;

    beforeEach(() => {
        userBookRepository = {
            add: jest.fn()
        };
        jest.clearAllMocks();
    });

    it('should throw an error if userId is not provided', async () => {
        await expect(registerUserBook(userBookRepository, { userId: null, bookId: '68200380e597f401084fad5b' }))
            .rejects
            .toThrow('User ID and Book ID are required');
    });

    it('should throw an error if bookId is not provided', async () => {
        await expect(registerUserBook(userBookRepository, { userId: 'user123', bookId: null }))
            .rejects
            .toThrow('User ID and Book ID are required');
    });

    it('should throw an error if user is not found', async () => {
        UserModel.findOne.mockResolvedValue(null);

        await expect(registerUserBook(userBookRepository, { userId: 'user123', bookId: '68200380e597f401084fad5b' }))
            .rejects
            .toThrow('User not found');
        expect(UserModel.findOne).toHaveBeenCalledWith({ id: 'user123' });
    });

    it('should throw an error if the book already exists for the user', async () => {
        const fakeBookId = new mongoose.Types.ObjectId();
        UserModel.findOne.mockResolvedValue({
            books: [
                { book_id: fakeBookId }
            ]
        });
        await expect(registerUserBook(userBookRepository, { userId: 'user123', bookId: fakeBookId.toString() }))
            .rejects
            .toThrow('Book already exists for this user');
    });

    it('should call userBookRepository.add and return its result if valid', async () => {
        const fakeBookId = new mongoose.Types.ObjectId();
        UserModel.findOne.mockResolvedValue({
            books: []
        });
        const expectedResult = { userId: 'user123', bookId: fakeBookId };
        userBookRepository.add.mockResolvedValue(expectedResult);
        const result = await registerUserBook(userBookRepository, { userId: 'user123', bookId: fakeBookId.toString() });
        expect(UserModel.findOne).toHaveBeenCalledWith({ id: 'user123' });
        expect(userBookRepository.add).toHaveBeenCalledWith('user123', fakeBookId);
        expect(result).toBe(expectedResult);
    });
});