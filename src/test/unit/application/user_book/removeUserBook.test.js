const mongoose = require('mongoose');
const removeUserBook = require('../../../../application/use_cases/user_book/removeUserBook');

describe('removeUserBook', () => {
    let userBookRepository;

    beforeEach(() => {
        userBookRepository = {
            remove: jest.fn()
        };
    });

    it('should remove a user book when valid userId and bookId are provided', async () => {
        const userId = new mongoose.Types.ObjectId().toString();
        const bookId = new mongoose.Types.ObjectId().toString();
        const removedUserBook = { userId, bookId };

        userBookRepository.remove.mockResolvedValue(removedUserBook);

        const result = await removeUserBook(userBookRepository, { userId, bookId });

        expect(userBookRepository.remove).toHaveBeenCalledWith(
            expect.any(mongoose.Types.ObjectId),
            expect.any(mongoose.Types.ObjectId)
        );
        expect(result).toEqual(removedUserBook);
    });

    it('should throw an error if userId is missing', async () => {
        const bookId = new mongoose.Types.ObjectId().toString();

        await expect(removeUserBook(userBookRepository, { bookId }))
            .rejects.toThrow('User ID and Book ID are required');
    });

    it('should throw an error if bookId is missing', async () => {
        const userId = new mongoose.Types.ObjectId().toString();

        await expect(removeUserBook(userBookRepository, { userId }))
            .rejects.toThrow('User ID and Book ID are required');
    });

    it('should throw an error if userBookRepository.remove returns null', async () => {
        const userId = new mongoose.Types.ObjectId().toString();
        const bookId = new mongoose.Types.ObjectId().toString();

        userBookRepository.remove.mockResolvedValue(null);

        await expect(removeUserBook(userBookRepository, { userId, bookId }))
            .rejects.toThrow('User book not found or could not be removed');
    });

    it('should throw an error if userBookRepository.remove returns undefined', async () => {
        const userId = new mongoose.Types.ObjectId().toString();
        const bookId = new mongoose.Types.ObjectId().toString();

        userBookRepository.remove.mockResolvedValue(undefined);

        await expect(removeUserBook(userBookRepository, { userId, bookId }))
            .rejects.toThrow('User book not found or could not be removed');
    });
});