// src/domain/entities/UserBook.js

class BookDetails {
    constructor({title, author, year_read, genre, state, rating, review, publication_year, isbn, editorial}) {
        this.state            = state;
        this.year_read        = year_read;
        this.rating           = rating;
        this.review           = review;
        this.title            = title;
        this.genre            = genre;
        this.publication_year = publication_year;
        this.isbn             = isbn;
        this.author           = author;
        this.editorial        = editorial;
    }
  }
  
  module.exports = BookDetails;