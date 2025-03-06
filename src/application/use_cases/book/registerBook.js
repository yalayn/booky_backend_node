// src/application/use_cases/registerBook.js

const mongoose = require('mongoose');

const registerBook = async (bookRepository, { title, _autor_id, _editorial_id, genre, publication_year, isbn }) => {
  // Asegúrate de que los valores sean ObjectId válidos

  const _id          = new mongoose.Types.ObjectId();
  const autor_id     = new mongoose.Types.ObjectId(_autor_id);
  const editorial_id = new mongoose.Types.ObjectId(_editorial_id);
  const book = {_id,title,autor_id,editorial_id,genre,publication_year,isbn};
  return await bookRepository.save(book);
};

module.exports = { registerBook };