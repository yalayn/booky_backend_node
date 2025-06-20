const updateReadingSession = require('../../../../application/use_cases/readingSession/updateReadingSession');
const ReadingSessionModel = require('../../../../infrastructure/database/models/ReadingSessionsModel');

jest.mock('../../../../infrastructure/database/models/ReadingSessionsModel');

describe('updateReadingSession', () => {
    let readingSessionsRepository;

    beforeEach(() => {
        readingSessionsRepository = {
            update: jest.fn()
        };
        jest.clearAllMocks();
    });

    it('should throw error if required fields are missing', async () => {
        const data = { id: null, user_id: 1, book_id: 2, seconds: 100, date: new Date() };
        await expect(updateReadingSession(readingSessionsRepository, data))
            .rejects
            .toThrow('Missing required fields: id, userId, bookId, seconds, date');
    });

    it('should return not found if session does not exist', async () => {
        ReadingSessionModel.findOne.mockResolvedValue(null);
        const data = { id: '1', user_id: 'u1', book_id: 'b1', seconds: 100, date: new Date() };
        const result = await updateReadingSession(readingSessionsRepository, data);
        expect(result).toEqual({ success: false, data: [], message: 'Reading session not found' });
    });

    it('should return error if total seconds exceed 24 hours', async () => {
        const existingSession = { _id: '1', seconds: 100 };
        ReadingSessionModel.findOne.mockResolvedValue(existingSession);
        ReadingSessionModel.find.mockResolvedValue([
            { seconds: 86000 },
            { seconds: 500 }
        ]);
        const data = { id: '1', user_id: 'u1', book_id: 'b1', seconds: 2000, date: new Date() };
        const result = await updateReadingSession(readingSessionsRepository, data);
        expect(result).toEqual({ success: false, data: [], message: 'Las horas no pueden exceder el dia (24 horas)' });
    });

    it('should update and return session if all is valid', async () => {
        const existingSession = { _id: '1', seconds: 100 };
        ReadingSessionModel.findOne.mockResolvedValue(existingSession);
        ReadingSessionModel.find.mockResolvedValue([
            { seconds: 200 },
            { seconds: 300 }
        ]);
        const updatedSession = { _id: '1', user_id: 'u1', book_id: 'b1', seconds: 400, date: new Date(), last_page_read: 10 };
        readingSessionsRepository.update.mockResolvedValue(updatedSession);

        const data = { id: '1', user_id: 'u1', book_id: 'b1', seconds: 400, date: updatedSession.date, last_page_read: 10 };
        const result = await updateReadingSession(readingSessionsRepository, data);

        expect(readingSessionsRepository.update).toHaveBeenCalledWith({
            _id: '1',
            user_id: 'u1',
            book_id: 'b1',
            seconds: 400,
            date: updatedSession.date,
            last_page_read: 10
        });
        expect(result).toEqual(updatedSession);
    });
});