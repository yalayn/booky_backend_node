
async function listReadingSessionsByUser(listReadingSessions){
    const data = []
    for (const session of listReadingSessions) {
        data.push({
            _id         : session._id,
            book_id     : session.book_id,
            seconds     : session.seconds,
            date        : session.date,
            lastPageRead: session.lastPageRead
        });
    }
    return data;
}

module.exports = listReadingSessionsByUser;