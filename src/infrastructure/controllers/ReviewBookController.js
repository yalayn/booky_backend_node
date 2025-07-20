const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/auth');

const ReviewBookRepositoryImpl = require('../repositories/ReviewBookRepositoryImpl');
const UserRepositoryImpl       = require('../repositories/UserRepositoryImpl');
const registerReviewUserBook   = require('../../application/use_cases/review_book/registreReviewUserBook');
const findReviewUserBook       = require('../../application/use_cases/review_book/findReviewUserBook');

router.post('/register', authMiddleware, async (req, res) => {
    const userRepository       = new UserRepositoryImpl();
    const reviewBookRepository = new ReviewBookRepositoryImpl();
    const { book_id, review_text, rating } = req.body;
    try {
        const user = await userRepository.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userId = user._id;
        await registerReviewUserBook(reviewBookRepository, {userId, bookId: book_id, reviewText: review_text, rating});
        res.status(201).json({ message: 'Review registered successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

router.get('/find', authMiddleware, async (req, res) => {
    const userRepository       = new UserRepositoryImpl();
    const reviewBookRepository = new ReviewBookRepositoryImpl();
    const { book_id } = req.body;
    try {
        const user = await userRepository.findById(req.user.id);
        if (!user || !book_id) {
            return res.status(404).json({ error: 'User not found or Book ID is required' });
        }
        const userId = user._id;
        const reviews = await findReviewUserBook(reviewBookRepository,userId,book_id);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;