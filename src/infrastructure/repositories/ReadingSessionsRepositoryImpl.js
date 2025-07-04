const ReadingSessionsRepository = require('../../domain/repositories/ReadingSessionsRepository');
const ReadingSessionModel = require('../../infrastructure/database/models/ReadingSessionsModel');
const ReadingSession = require('../../domain/entities/ReadingSessions');


class ReadingSessionsRepositoryImpl extends ReadingSessionsRepository{
    constructor() {
        super();
        this.readingSessions = [];
    }

    async save(readingSession) {
        const newSession = new ReadingSessionModel(readingSession);
        await newSession.save();
        return newSession;
    }
    
    async update(readingSession) {
        
        const updatedSession = await ReadingSessionModel.findByIdAndUpdate(readingSession._id, readingSession, { new: true });
        if (updatedSession) {
            const data = new ReadingSession({_id:updatedSession._id, userId:updatedSession.user_id, bookId:updatedSession.book_id, seconds:updatedSession.seconds, date:updatedSession.date, lastPageRead:updatedSession.last_page_read});
            return {success:true, data:data, message: 'Reading session updated successfully'}
        }
        return null;
    }

    async delete(id) {
        const deletedSession = await ReadingSessionModel.findByIdAndDelete(id);
        return deletedSession;
    }

    async findById(id) {
        const session = await ReadingSessionModel.findById(id);
        if (session) {
            return new ReadingSession(session._id, session.userId, session.bookId, session.seconds, session.date, session.lastPageRead);
        }
        return null;
    }

    async findByUserId(userId) {
        const sessions = await ReadingSessionModel.find({ user_id: userId })
            .populate('book_id')
            .sort({ date: -1 }); // Ordenar por fecha descendente
        if (!sessions || sessions.length === 0) {
            return [];
        }
        return sessions;
    }

    async findByUserIdAndBookId(userId, bookId) {
        const session = await ReadingSessionModel.findOne({ userId, bookId });
        if (session) {
            return new ReadingSession(session._id, session.userId, session.bookId, session.startDate, session.endDate, session.pagesRead);
        }
        return null;
    }

    async findByDateRange(userId, startDate, endDate) {
        const sessions = await ReadingSessionModel.find({ userId, startDate: { $gte: startDate }, endDate: { $lte: endDate } });
        return sessions.map(session => new ReadingSession(session._id, session.userId, session.bookId, session.startDate, session.endDate, session.pagesRead));
    }

    async findByUserIDate(userId, dateToSearch) {
        // const dateToSearch = new Date('2025-05-28');
        const startOfDay = new Date(dateToSearch);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(dateToSearch);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const sessions = await ReadingSessionModel.find({ user_id: userId, date: { $gte: startOfDay, $lte: endOfDay }});
        if (sessions) {
            return sessions.map(session => new ReadingSession({_id:session._id, userId:session.user_id, bookId:session.book_id, seconds:session.seconds, date:session.date, lastPageRead:session.last_page_read}));
        }
        return null;
    }

    async findByUserIdAndDateRange(userId, startDate, endDate) {
        console.log('Finding reading sessions for user:', userId, 'between', startDate, 'and', endDate);
        const sessions = await ReadingSessionModel.find({ userId, startDate: { $gte: startDate }, endDate: { $lte: endDate } });
        return sessions.map(session => new ReadingSession(session._id, session.userId, session.bookId, session.startDate, session.endDate, session.pagesRead));
    }
}

module.exports = ReadingSessionsRepositoryImpl;