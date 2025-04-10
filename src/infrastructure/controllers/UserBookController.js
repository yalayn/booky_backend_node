const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/auth');
const UserBookRepositoryImpl = require('../repositories/UserBookRepositoryImpl');
const UserRepositoryImpl     = require('../repositories/UserRepositoryImpl');
const registerUserBook       = require('../../application/use_cases/user_book/registerUserBook');

// Ruta para crear un usuario
router.post('/register', authMiddleware, async (req, res) => {
    const userRepository     = new UserRepositoryImpl();
    const userBookRepository = new UserBookRepositoryImpl();
    const { book_id } = req.body;
    try {
        const user = await userRepository.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userId = user.id;
        const userBook = await registerUserBook(userBookRepository, {userId, bookId: book_id});
        res.status(201).json(userBook);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

module.exports = router;