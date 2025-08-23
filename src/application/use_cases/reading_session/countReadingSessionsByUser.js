/**
 * Counts the total reading sessions time for a user.
 * @param {Array} listReadingSessions - List of reading sessions.
 * @returns {Object} An object containing the total hours and seconds read.
 */
async function countReadingSessionsByUser(readingSessionsRepository, userId, date){
    return await readingSessionsRepository.findByUserIDate(userId, date);
}

module.exports = countReadingSessionsByUser;