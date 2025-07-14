const axios          = require('axios');
const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/auth');
const OpenLibraryProvider = require('../providers/OpenLibraryProvider');
const GoogleApisProvider = require('../providers/GoogleApisProvider');
const listByQuery = require('../../application/use_cases/search_book/listByQuery');

router.get('/book', authMiddleware, async (req, res) => {
    const { title, id_provider } = req.query;
    if (!title) {
        return res.status(400).json({ error: 'Title query parameter is required' });
    }
    try {
        const ID_PROVIDER_GOOGLE = '1';
        const ID_PROVIDER_OPEN_LIBRARY = '2';

        let bookSearchProvider = new GoogleApisProvider(process.env.GOOGLE_BOOKS_API_KEY);

        if (id_provider && (id_provider !== ID_PROVIDER_OPEN_LIBRARY && id_provider !== ID_PROVIDER_GOOGLE)) {
            return res.status(400).json({ error: 'Invalid provider ID' });
        }
        if (id_provider === ID_PROVIDER_OPEN_LIBRARY) {
            bookSearchProvider = new OpenLibraryProvider();
        }
        
        const listBooks           = listByQuery(bookSearchProvider);
        const books               = await listBooks(title);
        return res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error.message);
        return res.status(500).json({ error: 'Failed to fetch books from Open Library' });
    }
});

module.exports = router;