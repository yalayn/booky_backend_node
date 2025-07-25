// src/domain/entities/UserBook.js
class UserBook {
  constructor(userId, bookId, state = 'to_read', yearRead = new Date().getFullYear(), rating = 0, registeredAt = new Date(), updatedAt = new Date()) {
    this.user_id      = userId;
    this.book_id      = bookId;
    this.state        = state;
    this.year_read    = yearRead;
    this.rating       = rating;
    this.registeredAt = registeredAt;
    this.updatedAt    = updatedAt;
  }
}
  
module.exports = UserBook;