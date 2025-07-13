
async function listReadingSessionsByUserBook(listReadingSessions){
    const data = {}
    for (const session of listReadingSessions) {
        data[session.bookId] = data[session.bookId] || {};
        data[session.bookId][session._id] = [
            {
                seconds     : session.seconds,
                date        : session.date,
                lastPageRead: session.lastPageRead
            }
        ];
    }
    return data;
}

module.exports = listReadingSessionsByUserBook;