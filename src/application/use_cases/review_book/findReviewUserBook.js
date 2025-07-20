
async function findReviewUserBook(reviewBookRepository, userId, book_id){
    const reviews = await reviewBookRepository.getUserBookReviews(userId, book_id);
    if(!reviews || reviews.length === 0) {
        throw new Error('No reviews found for this book');
    }
    return reviews;
}

module.exports = findReviewUserBook;