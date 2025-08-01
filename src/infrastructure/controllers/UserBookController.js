const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/auth');

const UserBookRepositoryImpl      = require('../repositories/UserBookRepositoryImpl');
const AuthorRepositoryImpl        = require('../repositories/AuthorRepositoryImpl');
const EditorialRepositoryImpl     = require('../repositories/EditorialRepositoryImpl');
const BookRepositoryImpl          = require('../repositories/BookRepositoryImpl');
const registerUserBookIfNotExists = require('../../application/use_cases/user_book/registerUserBookIfNotExists');
const registerUserBook            = require('../../application/use_cases/user_book/registerUserBook');
const removeUserBook              = require('../../application/use_cases/user_book/removeUserBook');
const updateStateUserBook         = require('../../application/use_cases/user_book/updateStateUserBook');
const listByStateUserBook         = require('../../application/use_cases/user_book/listByStateUserBook');

router.post('/add', authMiddleware, async (req, res) => {
    const userBookRepository  = new UserBookRepositoryImpl();
    const authorRepository    = new AuthorRepositoryImpl();
    const editorialRepository = new EditorialRepositoryImpl();
    const bookRepository      = new BookRepositoryImpl();

    const { title, genre, publication_year, isbn, descriptions_short, descriptions_long, cover_url, editorial, author } = req.body;
    try {
        if (!title || !genre || !publication_year || !isbn || !descriptions_short || !descriptions_long || !cover_url || !editorial || !author) {
            return res.status(400).json({ error: 'All fields are required..' });
        }
        const userId   = req.user._id;
        const bookData = { title, genre, publication_year, isbn, descriptions_short, descriptions_long, cover_url, editorial, author }
        const userBook = await registerUserBookIfNotExists(userBookRepository, authorRepository, editorialRepository, bookRepository, {userId, bookData});
        res.status(201).json(userBook);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

// Ruta para agregar un nuevo libro a un usuario
router.post('/register', authMiddleware, async (req, res) => {
    const userBookRepository = new UserBookRepositoryImpl();
    const { book_id } = req.body;
    try {
        const userId = req.user._id;
        const userBook = await registerUserBook(userBookRepository, {userId, bookId: book_id});
        res.status(201).json(userBook);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

// Ruta para remover un libro de un usuario
router.post('/remove', authMiddleware, async (req, res) => {
    const userBookRepository = new UserBookRepositoryImpl();
    const { book_id } = req.body;
    try {
        const userId = req.user._id;
        await removeUserBook(userBookRepository, {userId, bookId: book_id});
        res.status(200).json({ message: 'User book removed successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

// Ruta para actualizar estado de un libro de un usuario
router.put('/update_state', authMiddleware, async (req, res) => {
    const userBookRepository = new UserBookRepositoryImpl();
    const { book_id, new_state } = req.body;
    try {
        const userId = req.user._id;
        await updateStateUserBook(userBookRepository, {userId, bookId: book_id, newState: new_state});
        res.status(200).json({ message: 'Book state updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

// Ruta para listar libros de un usuario
router.get('/list', authMiddleware, async (req, res) => {
    const userBookRepository = new UserBookRepositoryImpl();
    try {
        const userId = req.user._id;
        const userBooks = await userBookRepository.findUserBooksWithDetails(userId);
        if (!userBooks) {
            res.status(404).json({ error: 'User books not found' });
        }
        res.status(200).json(userBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para listar libros de un usuario
router.get('/list_by_state', authMiddleware, async (req, res) => {
    const userBookRepository = new UserBookRepositoryImpl();
    try {
        const baseUrl = `${req.protocol}: //${req.get('host')}`;
        const userId  = req.user._id;
        const listUserBook = await listByStateUserBook(userBookRepository,{baseUrl,userId});
        res.status(200).json(listUserBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;