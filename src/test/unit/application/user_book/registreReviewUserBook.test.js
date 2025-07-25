const mongoose = require('mongoose');
const registerReviewUserBook = require('../../../../application/use_cases/review_book/registreReviewUserBook');

describe('registerReviewUserBook', () => {
    let reviewBookRepository;

    beforeEach(() => {
        reviewBookRepository = {
            registerReview: jest.fn()
        };
    });

    it('should throw error if userId is missing', async () => {
        await expect(
            registerReviewUserBook(reviewBookRepository, { bookId: '60c72b2f9b1d8e1a2c8f9e1b', reviewText: 'Great book!', rating: 5 })
        ).rejects.toThrow('User ID and Book ID are required');
    });

    it('should throw error if bookId is missing', async () => {
        await expect(
            registerReviewUserBook(reviewBookRepository, { userId: '60c72b2f9b1d8e1a2c8f9e1a', reviewText: 'Great book!', rating: 5 })
        ).rejects.toThrow('User ID and Book ID are required');
    });

    it('should call registerReview with correct arguments', async () => {
        const userId = '60c72b2f9b1d8e1a2c8f9e1a';
        const bookId = '60c72b2f9b1d8e1a2c8f9e1b';
        const reviewText = 'Amazing!';
        const rating = 4;
        const reviewBook = { _id: 'reviewId', userId, bookId, reviewText, rating };
        reviewBookRepository.registerReview.mockResolvedValue(reviewBook);

        const result = await registerReviewUserBook(reviewBookRepository, { userId, bookId, reviewText, rating });

        expect(reviewBookRepository.registerReview).toHaveBeenCalledWith(
            expect.any(mongoose.Types.ObjectId),
            expect.any(mongoose.Types.ObjectId),
            reviewText,
            rating
        );
        expect(result).toBe(reviewBook);
    });

    it('should throw error if registerReview returns null', async () => {
        reviewBookRepository.registerReview.mockResolvedValue(null);

        await expect(
            registerReviewUserBook(reviewBookRepository, {
                userId: '60c72b2f9b1d8e1a2c8f9e1a',
                bookId: '60c72b2f9b1d8e1a2c8f9e1b',
                reviewText: 'Nice!',
                rating: 3
            })
        ).rejects.toThrow('User book not found or could not be updated');
    });

    it('should handle undefined reviewText and rating', async () => {
        const userId = '60c72b2f9b1d8e1a2c8f9e1a';
        const bookId = '60c72b2f9b1d8e1a2c8f9e1b';
        const reviewBook = { _id: 'reviewId', userId, bookId };
        reviewBookRepository.registerReview.mockResolvedValue(reviewBook);

        const result = await registerReviewUserBook(reviewBookRepository, { userId, bookId });

        expect(reviewBookRepository.registerReview).toHaveBeenCalledWith(
            expect.any(mongoose.Types.ObjectId),
            expect.any(mongoose.Types.ObjectId),
            undefined,
            undefined
        );
        expect(result).toBe(reviewBook);
    });
});