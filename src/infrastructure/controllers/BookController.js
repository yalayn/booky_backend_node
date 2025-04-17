// src/infrastructure/controllers/BookController.js

const express                = require('express');
const router                 = express.Router();
const BookRepositoryImpl     = require('../repositories/BookRepositoryImpl');
const { registerBook }       = require('../../application/use_cases/book/registerBook');
const authMiddleware         = require('../middleware/auth');

// Ruta para crear un usuario
router.post('/register', authMiddleware, async (req, res) => {
  const bookRepository = new BookRepositoryImpl();
  const { title,_author_id,_editorial_id,genre,publication_year,isbn,descriptions_short,descriptions_long,path_cover } = req.body;
  try {
    const book = await registerBook(bookRepository, { title,_author_id,_editorial_id,genre,publication_year,isbn,descriptions_short,descriptions_long,path_cover });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
