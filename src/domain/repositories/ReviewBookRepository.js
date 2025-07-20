class ReviewBookRepository {
    async registerReview(userId, bookId, reviewText, rating) {
        throw new Error('Not implemented');
    }

    async getBookReviews(bookId) {
        throw new Error('Not implemented');
    }

    async getUserBookReviews(userId, bookId) {
        throw new Error('Not implemented');
    }
}

module.exports = ReviewBookRepository;
