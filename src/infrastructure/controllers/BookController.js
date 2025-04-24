// src/infrastructure/controllers/BookController.js

const express                = require('express');
const router                 = express.Router();
const multer                 = require('multer');
const path                   = require('path');

// Configure multer to include file extension
const storage = multer.diskStorage({
  destination: 'uploads/covers/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); // Get file extension
    cb(null, `${uniqueSuffix}${extension}`);
  }
});

const upload                 = multer({ storage }); // Use the configured storage
const BookRepositoryImpl     = require('../repositories/BookRepositoryImpl');
const { registerBook }       = require('../../application/use_cases/book/registerBook');
const authMiddleware         = require('../middleware/auth');

// Ruta para crear un usuario
router.post('/register', authMiddleware, upload.single('file_cover'), async (req, res) => {
  const bookRepository = new BookRepositoryImpl();
  const file_cover = req.file;
  const { title, _author_id, _editorial_id, genre, publication_year, isbn, descriptions_short, descriptions_long } = req.body;
  try {
    const path_cover = file_cover ? file_cover.path : null; // Use the path from multer
    if (!path_cover) {
      return res.status(400).json({ error: 'File cover is required' });
    }
    const book = await registerBook(bookRepository, { title, _author_id, _editorial_id, genre, publication_year, isbn, descriptions_short, descriptions_long, path_cover });
    if (!book) {
      return res.status(400).json({ error: 'Book not created' });
    }
    // Return the created book
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
