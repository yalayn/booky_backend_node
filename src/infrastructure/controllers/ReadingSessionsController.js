const express = require('express');
const router  = express.Router();
const ReadingSessionsRepositoryImpl = require('../repositories/ReadingSessionsRepositoryImpl');
const registerReadingSession = require('../../application/use_cases/readingSession/registerReadingSession');
const UserRepositoryImpl = require('../repositories/UserRepositoryImpl');
const authMiddleware = require('../middleware/auth');
const listReadingSessionsByUser = require('../../application/use_cases/readingSession/listReadingSessionsByUser');
const listReadingSessionsByUserBook = require('../../application/use_cases/readingSession/listReadingSessionsByUserBook');
const countReadingSessionsByUser = require('../../application/use_cases/readingSession/countReadingSessionsByUser');
const mongoose = require('mongoose');

router.post('/register', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const { book_id, seconds, date, lastPageRead } = req.body;
    try {
        const userId = await getUserId(req);
        if (!book_id || !seconds || !date) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const readingSession = await registerReadingSession(readingSessionsRepository, { userId, book_id, seconds, date, lastPageRead });
        res.status(201).json(readingSession);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
);

router.put('/update', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const { id, userId, bookId, startDate, endDate, pagesRead } = req.body;
    try {
        const readingSession = await readingSessionsRepository.update({ _id: id, userId, bookId, startDate, endDate, pagesRead });
        if (!readingSession) {
            return res.status(404).json({ error: 'Reading session not found' });
        }
        res.status(200).json(readingSession);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
);

router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const { id } = req.params;
    try {
        const readingSession = await readingSessionsRepository.delete(id);
        if (!readingSession) {
            return res.status(404).json({ error: 'Reading session not found' });
        }
        res.status(200).json({ message: 'Reading session deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
); 

router.get('/find/:id', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const { id } = req.params;
    try {
        const readingSession = await readingSessionsRepository.findById(id);
        if (!readingSession) {
            return res.status(404).json({ error: 'Reading session not found' });
        }
        res.status(200).json(readingSession);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
);

router.get('/user', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const userId = await getUserId(req);
    try {
        const listReadingSessions = await readingSessionsRepository.findByUserId(userId);
        if (!listReadingSessions || listReadingSessions.length === 0) {
            return res.status(404).json({ error: 'No reading sessions found for this user' });
        }
        const data = await listReadingSessionsByUser(listReadingSessions);
        res.status(200).json({"success": true, "data": data, "message": "Reading sessions retrieved successfully"
        });
    } catch (error) {
        res.status(400).json({ "success":false, error: error.message });
    }
}
);

router.get('/user/book/:bookId', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const userId = await getUserId(req);
    try {
        const bookId = new mongoose.Types.ObjectId(req.params.bookId);
        const listReadingSessions = await readingSessionsRepository.findByUserIdAndBookId(userId,bookId);
        if (!listReadingSessions || listReadingSessions.length === 0) {
            return res.status(404).json({ error: 'No reading sessions found for this user' });
        }
        const data = await listReadingSessionsByUserBook(listReadingSessions);
        res.status(200).json({"success": true, "data": data, "message": "Reading sessions retrieved successfully"
        });
    } catch (error) {
        res.status(400).json({ "success":false, error: error.message });
    }
}
);

router.get('/user_by_book', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const userId = await getUserId(req);
    try {
        const listReadingSessions = await readingSessionsRepository.findByUserIdBookId(userId);
        if (!listReadingSessions || listReadingSessions.length === 0) {
            return res.status(404).json({ error: 'No reading sessions found for this user' });
        }
        const data = await listReadingSessionsByUserBook(listReadingSessions);
        res.status(200).json({"success": true, "data": data, "message": "Reading sessions retrieved successfully"
        });
    } catch (error) {
        res.status(400).json({ "success":false, error: error.message });
    }
}
);

router.get('/user_count_day', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const userId = await getUserId(req);
    const date = req.body.date ? new Date(req.body.date) : new Date();
    try {
        const listReadingSessions = await readingSessionsRepository.findByUserIDate(userId, date);
        if (!listReadingSessions || listReadingSessions.length === 0) {
            return res.status(404).json({ error: 'No reading sessions found for this user' });
        }
        const data = await countReadingSessionsByUser(listReadingSessions);
        res.status(200).json({"success": true, "data": data, "message": "Reading sessions retrieved successfully"
        });
    } catch (error) {
        res.status(400).json({ "success":false, error: error.message });
    }
}
);

router.get('/user/:userId/date-range', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    try {
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        const readingSessions = await readingSessionsRepository.findByDateRange(userId, new Date(startDate), new Date(endDate));
        res.status(200).json(readingSessions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const getUserId = async (req) => {
    const userRepository = new UserRepositoryImpl();
    const user = await userRepository.findById(req.user.id);
    if (!user) {
        throw new Error('User not found');
    }
    return user._id;
}

module.exports = router;