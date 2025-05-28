class ReadingSessionsRepository {

    async save(readingSession) {
        throw new Error('Not implemented');
    }
    async update(author) {
        throw new Error('Not implemented');
    }
    async delete(id) {
        throw new Error('Not implemented');
    }
    async findById(id) {
        throw new Error('Not implemented');
    }
    async findByUserId(userId) {
        throw new Error('Not implemented');
    }
    async findByUserIdAndBookId(userId, bookId) {
        throw new Error('Not implemented');
    }
    async findByUserIdBookId(userId) {
        throw new Error('Not implemented');
    }
    async findByDateRange(userId, startDate, endDate) {
        throw new Error('Not implemented');
    }
    async findByUserIDate(userId, date) {
        throw new Error('Not implemented');
    }
    async findByUserIdAndDateRange(userId, startDate, endDate) {
        throw new Error('Not implemented');
    }

}

module.exports = ReadingSessionsRepository;