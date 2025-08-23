const express = require('express');
const router  = express.Router();
const ReadingSessionsRepositoryImpl = require('../repositories/ReadingSessionsRepositoryImpl');
const registerReadingSession        = require('../../application/use_cases/reading_session/registerReadingSession');
const updateReadingSession          = require('../../application/use_cases/reading_session/updateReadingSession');
const authMiddleware                = require('../middleware/auth');
const listReadingSessionsByUser     = require('../../application/use_cases/reading_session/listReadingSessionsByUser');
const listReadingSessionsByUserBook = require('../../application/use_cases/reading_session/listReadingSessionsByUserBook');
const countReadingSessionsByUser    = require('../../application/use_cases/reading_session/countReadingSessionsByUser');
const mongoose = require('mongoose');
const now = new Date();

router.post('/register', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    let { book_id, seconds, date, last_page_read } = req.body;
    try {
        const userId = await getUserId(req);
        if (!book_id || !seconds) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        date = date ? new Date(date) : new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const readingSession = await registerReadingSession(readingSessionsRepository, { user_id:userId, book_id, seconds, date, last_page_read });
        res.status(201).json({ success:true, data:readingSession, message: 'Reading session registered successfully'});
    } catch (error) {
        res.status(400).json({ success:false, data:[], message: error.message });
    }
}
);

router.put('/update', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const { id, book_id, seconds, date, last_page_read } = req.body;
    try {
        const userId = await getUserId(req);
        const readingSession =  await updateReadingSession(readingSessionsRepository, { id, user_id: userId, book_id, seconds, date, last_page_read });
        if (!readingSession) {
            return res.status(404).json({ success:false, data:[], message: 'Reading session not found' });
        }
        res.status(200).json({ success:true, data:readingSession, message: 'Reading session updated successfully' });
    } catch (error) {
        res.status(400).json({ success:false, data:[], message:error.message });
    }
}
);

router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const { id } = req.params;
    try {
        const readingSession = await readingSessionsRepository.delete(id);
        if (!readingSession) {
            return res.status(404).json({ success:false, data:[], message: 'Reading session not found' });
        }
        res.status(200).json({ success:true, message: 'Reading session deleted successfully' });
    } catch (error) {
        res.status(400).json({ success:false, data:[], message: error.message });
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

router.get('/history', authMiddleware, async (req, res) => {
    const baseUrl   = `${req.protocol}://${req.get('host')}`;
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const userId = req.user._id;
    try {
        const listReadingSessions = await readingSessionsRepository.findByUserId(userId);
        if (!listReadingSessions || listReadingSessions.length === 0) {
            return res.status(200).json({ success:false, data:[], error: 'No reading sessions found for this user' });
        }
        const data = await listReadingSessionsByUser(listReadingSessions,baseUrl);
        res.status(200).json({success: true, "data": data, "message": "Reading sessions retrieved successfully"
        });
    } catch (error) {
        res.status(400).json({success:false, error: error.message });
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
            return res.status(200).json({ error: 'No reading sessions found for this user' });
        }
        const data = await listReadingSessionsByUserBook(listReadingSessions);
        res.status(200).json({"success": true, "data": data, "message": "Reading sessions retrieved successfully"
        });
    } catch (error) {
        res.status(400).json({ "success":false, error: error.message });
    }
}
);

router.get('/today', authMiddleware, async (req, res) => {
    const readingSessionsRepository = new ReadingSessionsRepositoryImpl();
    const userId = req.user._id;
    const date   = req.body.date ? new Date(req.body.date) : new Date(now.getFullYear(), now.getMonth(), now.getDate());
    try {
        const data = await countReadingSessionsByUser(readingSessionsRepository, userId, date);
        res.status(200).json({"success": true, "data": data, "message": "Reading sessions retrieved successfully"
        });
    } catch (error) {
        res.status(400).json({ success:false, error: error.message });
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
    const id = req.user._id;
    return id;
}

module.exports = router;