// src/application/use_cases/registerBook.js

const mongoose = require('mongoose');

const registerBook = async (bookRepository, { title, _author_id, _editorial_id, genre, publication_year, isbn,descriptions_short,descriptions_long,path_cover,cover_i }) => {
  const _id          = new mongoose.Types.ObjectId();
  const author_id    = new mongoose.Types.ObjectId(_author_id);
  const editorial_id = new mongoose.Types.ObjectId(_editorial_id);
  const book         = {_id,title,author_id,editorial_id,genre,publication_year,isbn,descriptions_short,descriptions_long,path_cover,cover_i};
  return await bookRepository.save(book);
};

module.exports = { registerBook };