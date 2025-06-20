const registerReadingSession = require('../../../../application/use_cases/readingSession/registerReadingSession');
const mongoose = require('mongoose');

describe('RegisterReadingSession Use Case', () => {
    let readingSessionRepositoryMock;

    beforeEach(() => {
        readingSessionRepositoryMock = {
            save: jest.fn(),
        };
    });
    
    it('should register a reading session successfully', async () => {
        const sessionData = { user_id:'user-1', book_id:'68200380e597f401084fad5b', seconds: 3600, date: '2024-06-10', last_page_read: 100 };
        readingSessionRepositoryMock.save.mockResolvedValue({ _id: "session_1", ...sessionData });
        const result = await registerReadingSession(readingSessionRepositoryMock, sessionData);
        expect(result).toMatchObject({ _id: expect.any(String),...sessionData });
        expect(result).toEqual({ _id: 'session_1', ...sessionData });
    });

    it('should throw an error if required fields are missing', async () => {
        const sessionData = { user_id:'user-1', last_page_read:20, date:'2024-06-10'};
        readingSessionRepositoryMock.save.mockResolvedValue({ _id: "session_1", ...sessionData });
        await expect(registerReadingSession(readingSessionRepositoryMock, sessionData)).rejects.toThrow('Missing required fields');
        expect(readingSessionRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
        const sessionData = { user_id:'user-1', book_id:'68200380e597f401084fad5b', seconds:1800, last_page_read:20, date:'2024-06-10'};
        readingSessionRepositoryMock.save.mockRejectedValue(new Error('DB error'));
        await expect(registerReadingSession(readingSessionRepositoryMock, sessionData)).rejects.toThrow('DB error');
    });
});