// src/infrastructure/controllers/BookController.js

const express                = require('express');
const router                 = express.Router();
const BookRepositoryImpl     = require('../repositories/BookRepositoryImpl');
const { registerBook }       = require('../../application/use_cases/book/registerBook');
// const { findBookByBookname } = require('../../application/use_cases/book/findBook');
const authMiddleware         = require('../middleware/auth');
const { default: mongoose } = require('mongoose');

// Ruta para crear un usuario
router.post('/register', authMiddleware, async (req, res) => {
  const bookRepository = new BookRepositoryImpl();
  const { title,_autor_id,_editorial_id,genre,publication_year,isbn } = req.body;
  try {
    const book = await registerBook(bookRepository, { title,_autor_id,_editorial_id,genre,publication_year,isbn });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
