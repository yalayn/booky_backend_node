const mongoose = require('mongoose');
const registreReviewUserBook = require('../../../../application/use_cases/user_book/registreReviewUserBook');

describe('registreReviewUserBook', () => {
    let userBookRepository;

    beforeEach(() => {
        userBookRepository = {
            registreReview: jest.fn()
        };
    });

    it('should throw an error if userId is missing', async () => {
        await expect(
            registreReviewUserBook(userBookRepository, { userId: null, bookId: '60c72b2f9b1e8e6d88f0c9b1', reviewText: 'Great book', rating: 5 })
        ).rejects.toThrow('User ID and Book ID are required');
    });

    it('should throw an error if bookId is missing', async () => {
        await expect(
            registreReviewUserBook(userBookRepository, { userId: 'user123', bookId: null, reviewText: 'Great book', rating: 5 })
        ).rejects.toThrow('User ID and Book ID are required');
    });

    it('should call userBookRepository.registreReview with correct arguments', async () => {
        const userId = 'user123';
        const bookId = new mongoose.Types.ObjectId().toHexString();
        const reviewText = 'Awesome!';
        const rating = 4;
        userBookRepository.registreReview.mockResolvedValue('reviewed');
        const result = await registreReviewUserBook(userBookRepository, { userId, bookId, reviewText, rating });
        expect(userBookRepository.registreReview).toHaveBeenCalledWith(
            userId,
            expect.any(mongoose.Types.ObjectId),
            reviewText,
            rating
        );
        expect(result).toBe('reviewed');
    });

    it('should convert bookId to mongoose ObjectId', async () => {
        const userId = 'user123';
        const bookId = new mongoose.Types.ObjectId().toHexString();
        const reviewText = 'Nice!';
        const rating = 3;
        userBookRepository.registreReview.mockResolvedValue('ok');
        await registreReviewUserBook(userBookRepository, { userId, bookId, reviewText, rating });
        const calledBookId = userBookRepository.registreReview.mock.calls[0][1];
        expect(mongoose.Types.ObjectId.isValid(calledBookId)).toBe(true);
        expect(calledBookId).toBeInstanceOf(mongoose.Types.ObjectId);
    });
});