
class Book {
  constructor(_id,title,author_id,editorial_id,genre,publication_year,isbn,cover_i) {
    this._id              = _id;
    this.title            = title;
    this.author_id        = author_id;
    this.editorial_id     = editorial_id;
    this.genre            = genre;
    this.publication_year = publication_year;
    this.isbn             = isbn;
    this.cover_i          = cover_i;
  }
}

module.exports = Book;