const mongoose = require('mongoose');
/**
 * Register a new reading session.
 * @param {*} readingSessionsRepository 
 * @param {*} param1 
 * @returns 
 */
const registerReadingSession = async (readingSessionsRepository,readingSessionData) => {
    const { user_id, book_id, seconds, date, last_page_read } = readingSessionData;

    if (!user_id || !book_id || !seconds || !date) {
        throw new Error('Missing required fields: user_id, book_id, seconds, date');
    }

    const _id = new mongoose.Types.ObjectId();
    const readingSession = {
        _id           : _id,
        user_id       : user_id,
        book_id       : new mongoose.Types.ObjectId(book_id),
        seconds       : seconds,
        date          : date,
        last_page_read: last_page_read
    };

    const savedSession = await readingSessionsRepository.save(readingSession);
    return savedSession;
}
module.exports = registerReadingSession;