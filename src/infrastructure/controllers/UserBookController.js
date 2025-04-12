const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/auth');
const UserBookRepositoryImpl = require('../repositories/UserBookRepositoryImpl');
const UserRepositoryImpl     = require('../repositories/UserRepositoryImpl');
const registerUserBook       = require('../../application/use_cases/user_book/registerUserBook');
const removeUserBook         = require('../../application/use_cases/user_book/removeUserBook');
const updateStateUserBook    = require('../../application/use_cases/user_book/updateStateUserBook');
const listByStateUserBook    = require('../../application/use_cases/user_book/listByStateUserBook');

// Ruta para agregar un nuevo libro a un usuario
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

// Ruta para remover un libro de un usuario
router.post('/remove', authMiddleware, async (req, res) => {
    const userRepository     = new UserRepositoryImpl();
    const userBookRepository = new UserBookRepositoryImpl();
    const { book_id } = req.body;
    try {
        const user = await userRepository.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userId   = user.id;
        const userBook = await removeUserBook(userBookRepository, {userId, bookId: book_id});
        res.status(201).json(userBook);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

// Ruta para actualizar estado de un libro de un usuario
router.put('/update_state', authMiddleware, async (req, res) => {
    const userRepository     = new UserRepositoryImpl();
    const userBookRepository = new UserBookRepositoryImpl();
    const { book_id, new_state } = req.body;
    try {
        const user = await userRepository.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userId   = user.id;
        const userBook = await updateStateUserBook(userBookRepository, {userId, bookId: book_id, newState: new_state});
        res.status(201).json(userBook);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

// Ruta para listar libros de un usuario
router.get('/list', authMiddleware, async (req, res) => {
    const userBookRepository = new UserBookRepositoryImpl();
    try {
        const userId = req.user.id;
        const userBooks = await userBookRepository.findUserBooksWithDetails(userId);
        if (userBooks) {
            res.status(200).json(userBooks);
        } else {
            res.status(404).json({ error: 'User books not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para listar libros de un usuario
router.get('/list_by_state', authMiddleware, async (req, res) => {
    const userBookRepository = new UserBookRepositoryImpl();
    try {
        const userId = req.user.id;
        const userBooks = await userBookRepository.findUserBooksWithDetails(userId);
        if (!userBooks) {
            res.status(404).json({ error: 'User books not found' });
        }
        const listUserBook = await listByStateUserBook(userBooks);
        res.status(200).json(listUserBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;