const express              = require('express');
const router               = express.Router();
const AuthorRepositoryImpl = require('../repositories/AuthorRepositoryImpl');
const { registerAuthor }   = require('../../application/use_cases/author/registerAuthor');
const authMiddleware       = require('../middleware/auth');

router.post('/register', authMiddleware, async (req, res) => {
    const authorRepository = new AuthorRepositoryImpl();
    const { name, country, birthday } = req.body;
    try {
        const author = await registerAuthor(authorRepository, { name, country, birthday });
        res.status(201).json(author);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;