// src/application/use_cases/user_book/removeUserBook.js
const mongoose = require('mongoose');

async function registerReviewUserBook(reviewBookRepository, {userId, bookId, reviewText, rating}) {
    if (!userId || !bookId) {
        throw new Error('User ID and Book ID are required');
    }
    userId = new mongoose.Types.ObjectId(userId);
    bookId = new mongoose.Types.ObjectId(bookId);
    const reviewBook = await reviewBookRepository.registerReview(userId, bookId, reviewText, rating);
    if (!reviewBook) {
        throw new Error('User book not found or could not be updated');
    }
    return reviewBook;
}

module.exports = registerReviewUserBook;