// src/domain/entities/UserBook.js

class BookDataMain {
    constructor({ book_id, state, year_read, rating, review, title, genre, publication_year, isbn, descriptions_short, descriptions_long, cover_url, author, editorial }) {
        this.book_id            = book_id;
        this.state              = state;
        this.year_read          = year_read;
        this.rating             = rating;
        this.review             = review;
        this.title              = title;
        this.genre              = genre;
        this.publication_year   = publication_year;
        this.isbn               = isbn;
        this.descriptions_short = descriptions_short;
        this.descriptions_long  = descriptions_long;
        this.cover_url          = cover_url;
        this.author             = author;
        this.editorial          = editorial;
    }
  }
  
  module.exports = BookDataMain;