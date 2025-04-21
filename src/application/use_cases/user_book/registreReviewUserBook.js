// src/application/use_cases/user_book/removeUserBook.js
const mongoose = require('mongoose');


async function registreReviewUserBook(userBookRepository, {userId, bookId, reviewText, rating}) {
    if (!userId || !bookId) {
        throw new Error('User ID and Book ID are required');
    }
    bookId = new mongoose.Types.ObjectId(bookId);
    return await userBookRepository.registreReview(userId, bookId, reviewText, rating);
}

module.exports = registreReviewUserBook;