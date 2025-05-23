const express              = require('express');
const router               = express.Router();
const AuthorRepositoryImpl = require('../repositories/AuthorRepositoryImpl');
const { registerAuthor }   = require('../../application/use_cases/author/registerAuthor');
const { upsertAuthor }     = require('../../application/use_cases/author/upsertAuthor');
const authMiddleware       = require('../middleware/auth');

router.post('/register', authMiddleware, async (req, res) => {
    const authorRepository = new AuthorRepositoryImpl();
    const { key, name, country, birthday } = req.body;
    try {
        if (!key || !name || !country || !birthday) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const author = await registerAuthor(authorRepository, { key, name, country, birthday });
        res.status(201).json(author);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/update', authMiddleware, async (req, res) => {
    const authorRepository = new AuthorRepositoryImpl();
    const { id, key, name, country, birthday } = req.body;
    try {
        const author = await authorRepository.update({ _id: id, key, name, country, birthday });
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.status(200).json(author);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const authorRepository = new AuthorRepositoryImpl();
    const { id } = req.params;
    try {
        const author = await authorRepository.delete(id);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.status(200).json({ message: 'Author deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/upsert', authMiddleware, async (req, res) => {
    const authorRepository = new AuthorRepositoryImpl();
    const { key, name, country, birthday } = req.body;
    try {
        if (!key || !name || !country || !birthday) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const author = await upsertAuthor(authorRepository, { key, name, country, birthday });
        res.status(201).json(author);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;