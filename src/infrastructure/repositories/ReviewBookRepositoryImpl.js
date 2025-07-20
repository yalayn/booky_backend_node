const ReviewBookRepository = require("../../domain/repositories/ReviewBookRepository");
const ReviewModel = require("../database/models/ReviewModel");

class ReviewBookRepositoryImpl extends ReviewBookRepository {
    constructor() {
        super();
        this.reviews = [];
    }

    async registerReview(userId, bookId, reviewText, rating) {
        let review = await ReviewModel.findOne({ user_id: userId, book_id: bookId });
        if (review) {
            review.review     = reviewText;
            review.rating     = rating;
            review.updated_at = new Date();
        } else {
            review = new ReviewModel({
                user_id: userId,
                book_id: bookId,
                review : reviewText,
                rating : rating
            });
        }
        return await review.save();
    }

    async getBookReviews(bookId) {
        try {
            const reviews = await ReviewModel.find({ book_id: bookId })
                .populate('user_id', 'name username') // Populate user details
                .select('rating review created_at');
            return reviews;
        } catch (error) {
            throw new Error('Error fetching book reviews: ' + error.message);
        }
    }

    async getUserBookReviews(userId, bookId) {
        try {
            const reviews = await ReviewModel.find({ user_id: userId, book_id: bookId })
                .populate('user_id', 'name username') // Populate user details
                .select('rating review created_at');
            return reviews;
        } catch (error) {
            throw new Error('Error fetching user book reviews: ' + error.message);
        }
    }
}

module.exports = ReviewBookRepositoryImpl;
