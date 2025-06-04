
const formatTime = require("../../../utils/formatTime");

/**
 * Counts the total reading sessions time for a user.
 * @param {Array} listReadingSessions - List of reading sessions.
 * @returns {Object} An object containing the total hours and seconds read.
 */
async function countReadingSessionsByUser(listReadingSessions){
    let time = 0;
    for (const session of listReadingSessions) {
        time = time + session.seconds;
    }
    return {"hours":formatTime(time), seconds:time};
}

module.exports = countReadingSessionsByUser;