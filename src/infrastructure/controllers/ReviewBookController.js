const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/auth');

const ReviewBookRepositoryImpl = require('../repositories/ReviewBookRepositoryImpl');
const UserRepositoryImpl       = require('../repositories/UserRepositoryImpl');
const registerReviewUserBook   = require('../../application/use_cases/review_book/registreReviewUserBook');
const findReviewUserBook       = require('../../application/use_cases/review_book/findReviewUserBook');

router.post('/register', authMiddleware, async (req, res) => {
    const reviewBookRepository = new ReviewBookRepositoryImpl();
    const { book_id, review_text, rating } = req.body;
    try {
        const userId = req.user._id;
        const review = await registerReviewUserBook(reviewBookRepository, {userId, bookId: book_id, reviewText: review_text, rating});
        if (!review) {
            return res.status(404).json({ success:false, message: 'Review could not be registered' });
        }
        res.status(200).json({ success:true, message: 'Review registered successfully' });
    } catch (error) {
        res.status(401).json({ success:false, message: error.message });
    }
});

router.get('/find', authMiddleware, async (req, res) => {
    const reviewBookRepository = new ReviewBookRepositoryImpl();
    const { book_id } = req.body;
    try {
        const userId = req.user._id;
        const reviews = await findReviewUserBook(reviewBookRepository,userId,book_id);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;