const formatTime = require("../../../utils/formatTime");

async function listReadingSessionsByUser(listReadingSessions,baseUrl){
    const data = []
    for (const session of listReadingSessions) {
        const book    = session.book_id;
        let bookTitle = 'Unknown Title';
        let coverUrl  = `${baseUrl}/assets/images/default_cover.jpg`;
        if (book && typeof book === 'object') {
            bookTitle = book.title || 'Unknown Title';
            coverUrl  = (book.cover_i !== undefined) ? `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg` : `${baseUrl}/${book.path_cover}`;
        }
        data.push({
            _id         : session._id,
            book_id     : book._id,
            book_title  : bookTitle,
            cover_url   : coverUrl,
            seconds     : session.seconds,
            hours       : formatTime(session.seconds),
            date        : session.date,
            lastPageRead: session.lastPageRead,
        });
    }
    return data;
}

module.exports = listReadingSessionsByUser;