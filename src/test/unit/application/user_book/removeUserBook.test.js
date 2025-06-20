const mongoose = require('mongoose');
const removeUserBook = require('../../../../application/use_cases/user_book/removeUserBook');

describe('removeUserBook', () => {
    let userBookRepository;

    beforeEach(() => {
        userBookRepository = {
            remove: jest.fn()
        };
    });

    it('should throw an error if userId is not provided', async () => {
        await expect(removeUserBook(userBookRepository, { userId: null, bookId: '123' }))
            .rejects
            .toThrow('User ID and Book ID are required');
    });

    it('should throw an error if bookId is not provided', async () => {
        await expect(removeUserBook(userBookRepository, { userId: '456', bookId: null }))
            .rejects
            .toThrow('User ID and Book ID are required');
    });

    it('should call userBookRepository.remove with correct arguments', async () => {
        const userId = '456';
        const bookId = new mongoose.Types.ObjectId().toHexString();
        const removedBook = { userId, bookId };
        userBookRepository.remove.mockResolvedValue(removedBook);
        const result = await removeUserBook(userBookRepository, { userId, bookId });
        expect(userBookRepository.remove).toHaveBeenCalledWith( userId, expect.any(mongoose.Types.ObjectId) );
        expect(result).toEqual(removedBook);
    });

    it('should propagate errors from userBookRepository.remove', async () => {
        const userId = '456';
        const bookId = new mongoose.Types.ObjectId().toHexString();
        userBookRepository.remove.mockRejectedValue(new Error('DB error'));
        await expect(removeUserBook(userBookRepository, { userId, bookId })).rejects.toThrow('DB error');
    });
});