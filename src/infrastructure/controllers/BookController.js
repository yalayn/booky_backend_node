// src/infrastructure/controllers/BookController.js

const express                = require('express');
const router                 = express.Router();
const BookRepositoryImpl     = require('../repositories/BookRepositoryImpl');
const { registerBook }       = require('../../application/use_cases/registerBook');
// const { findBookByBookname } = require('../../application/use_cases/findBook');
const authMiddleware         = require('../middleware/auth');
const { default: mongoose } = require('mongoose');

// Ruta para crear un usuario
router.post('/register', authMiddleware, async (req, res) => {
  const bookRepository = new BookRepositoryImpl();
  const { title,_autor_id,_editorial_id,genre,publication_year,isbn } = req.body;
  try {

    console.log("params: ",title,_autor_id,_editorial_id,genre,publication_year,isbn);
    const book = await registerBook(bookRepository, { title,_autor_id,_editorial_id,genre,publication_year,isbn });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta protegida para obtener usuario segun su bookname.
// router.get('/', authMiddleware, async (req, res) => {
//   const bookRepository = new BookRepositoryImpl();
//   const { bookname } = req.body;
//   try {
//     const book = await findBookByBookname(bookRepository, { bookname });
//     if (book) {
//       res.status(200).json(book);
//     } else {
//       res.status(404).json({ error: `${bookname} Book not found` });
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

module.exports = router;
