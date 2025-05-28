class ReadingSessions {
    constructor({ _id, userId, bookId, seconds, date, lastPageRead, createdAt, updatedAt }) {
        this._id          = _id;
        this.userId       = userId;
        this.bookId       = bookId;
        this.seconds      = seconds;
        this.date         = date;
        this.lastPageRead = lastPageRead;
        this.createdAt    = createdAt;
        this.updatedAt    = updatedAt;
    }

    static fromDatabase(data) {
        return new ReadingSessions({
            _id         : data._id,
            userId      : data.user_id,
            bookId      : data.book_id,
            seconds     : data.seconds,
            date        : data.date,
            lastPageRead: data.lastPageRead,
            createdAt   : data.created_at,
            updatedAt   : data.updated_at
        });
    }
}

module.exports = ReadingSessions;