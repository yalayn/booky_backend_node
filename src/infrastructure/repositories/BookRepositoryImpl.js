const BookModel      = require('../database/models/BookModel');
const BookRepository = require('../../domain/repositories/BookRepository');
const Book           = require('../../domain/entities/Book');

class BookRepositoryImpl extends BookRepository {
  constructor() {
    super();
    this.books = [];
  }

  async save(book) {
    const newBook = new BookModel(book);
    await newBook.save();
    return new Book(newBook._id,newBook.title,newBook.author_id,newBook.editorial_id,newBook.genre,newBook.publication_year,newBook.isbn);
  }

  async upsert(book) {
    const existingBook = await BookModel.findOne({ isbn: book.isbn });
    return existingBook || this.save(book);
  }

  async delete(_id) {
    const deletedBook = await BookModel.findByIdAndDelete(_id);
    return deletedBook;
  }
  
  async findById(id) {
    const Book = await BookModel.findOne({id});
    if (Book) {
      return new Book(Book._id,Book.title,newBook.author_id,Book.editorial_id,Book.genre,Book.publication_year,Book.isbn);
    }
    return null;
  }
  
  async findByAuthorId(author_id) {
    const Books = await BookModel.find({author_id});
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

  async findByIsbn(isbn) {
    const Book = await BookModel.findOne({isbn});
    if (Book) {
      return Book;
    }
    return null;
  }

}

module.exports = BookRepositoryImpl;