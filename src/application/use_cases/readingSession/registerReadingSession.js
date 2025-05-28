const mongoose = require('mongoose');
/**
 * Register a new reading session.
 * @param {*} readingSessionsRepository 
 * @param {*} param1 
 * @returns 
 */
async function registerReadingSession(readingSessionsRepository,readingSessionData) {
    const { userId, book_id, seconds, date, lastPageRead } = readingSessionData;

    if (!userId || !book_id || !seconds || !date) {
        throw new Error('Missing required fields: userId, bookId, seconds, date');
    }

    const bookId = new mongoose.Types.ObjectId(book_id);
    const _id = new mongoose.Types.ObjectId();
    const readingSession = {
        _id           : _id,
        user_id       : userId,
        book_id       : bookId,
        seconds       : seconds,
        date          : date,
        last_page_read: lastPageRead
    };

    const savedSession = await readingSessionsRepository.save(readingSession);
    return savedSession;
}
module.exports = registerReadingSession;