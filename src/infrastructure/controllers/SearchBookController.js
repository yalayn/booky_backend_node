const axios          = require('axios');
const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/auth');
const OpenLibraryProvider = require('../providers/OpenLibraryProvider');
const listByQuery = require('../../application/use_cases/search_book/listByQuery');

router.get('/book', authMiddleware, async (req, res) => {
    const { title } = req.query;
    if (!title) {
        return res.status(400).json({ error: 'Title query parameter is required' });
    }
    try {
        const openLibraryProvider = new OpenLibraryProvider();
        const listBooks           = listByQuery(openLibraryProvider);
        const books               = await listBooks(title);
        return res.status(200).json({ books });
    } catch (error) {
        console.error('Error fetching books:', error.message);
        return res.status(500).json({ error: 'Failed to fetch books from Open Library' });
    }
});

module.exports = router;