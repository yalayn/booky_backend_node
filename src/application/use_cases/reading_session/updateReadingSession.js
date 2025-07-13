
const ReadingSessionModel = require('../../../infrastructure/database/models/ReadingSessionsModel');

async function updateReadingSession(readingSessionsRepository, readingSessionData) {
    const { id, user_id, book_id, seconds, date, last_page_read } = readingSessionData;

    if (!id || !user_id || !book_id || !seconds || !date) {
        throw new Error('Missing required fields: id, userId, bookId, seconds, date');
    }

    const SECOND_TODAY = 86400; // 24 horas en segundos
    const existingSession = await ReadingSessionModel.findOne({ _id: id });
    if (!existingSession) {
        // Retornar un objeto con mensaje en vez de lanzar error para evitar 404
        return { success:false, data:[], message: 'Reading session not found' };
    }
    
    const startOfDay = new Date(date);
    const endOfDay   = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const sessions = await ReadingSessionModel.find({ user_id, date: { $gte: startOfDay, $lte: endOfDay } });
    const totalSeconds = parseInt(sessions.reduce((sum, s) => sum + (s.seconds || 0), 0)) + parseInt((seconds || 0)) - parseInt(existingSession.seconds || 0);

    if (totalSeconds > SECOND_TODAY) {
        return { success:false, data:[], message: 'Las horas no pueden exceder el dia (24 horas)' };
    }

    const updatedSession = {
        _id    : id,
        user_id: user_id,
        book_id: book_id,
        seconds: seconds,
        date   : date,
        last_page_read:last_page_read
    };
    
    const session = await readingSessionsRepository.update(updatedSession);
    return session;
}

module.exports = updateReadingSession;