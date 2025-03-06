const mongoose = require('mongoose');
const BookModel = require('../database/models/BookModel');
const BookRepository = require('../../domain/repositories/BookRepository');
const Book = require('../../domain/entities/Book');

class BookRepositoryImpl extends BookRepository {
  constructor() {
    super();
    this.books = [];
  }

  async save(book) {
    const newBook = new BookModel(book);
    await newBook.save();
    return new Book(newBook._id,newBook.title,newBook.autor_id,newBook.editorial_id,newBook.genre,newBook.publication_year,newBook.isbn);
  }

  async findById(id) {
    const Book = await BookModel.findOne({id});
    if (Book) {
      return new Book(Book._id,Book.title,newBook.autor_id,Book.editorial_id,Book.genre,Book.publication_year,Book.isbn);
    }
    return null;
  }
  
  async findByAuthorId(autor_id) {
    const Books = await BookModel.find({autor_id});
    if (Books) {
        return Books;
    }
    return null;
} 
  
  async findByEditorialId(editorial_id) {
    const Books = await BookModel.find({editorial_id});
    if (Books) {
      return Books;
    }
    return null;
  }

}

module.exports = BookRepositoryImpl;