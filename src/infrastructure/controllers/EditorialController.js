const express                 = require('express');
const router                  = express.Router();
const EditorialRepositoryImpl = require('../repositories/EditorialRepositoryImpl');
const { registerEditorial }   = require('../../application/use_cases/editorial/registerEditorial');
const authMiddleware          = require('../middleware/auth');
const { upsertEditorial }     = require('../../application/use_cases/editorial/upsertEditorial');

router.post('/register', authMiddleware, async (req, res) => {
    const editorialRepository = new EditorialRepositoryImpl();
    const { key, name, country, founding_date } = req.body;
    try {
        const editorial = await registerEditorial(editorialRepository, { key, name, country, founding_date });
        res.status(201).json(editorial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/update', authMiddleware, async (req, res) => {
    const editorialRepository = new EditorialRepositoryImpl();
    const { id, key, name, country, founding_date } = req.body;
    try {
        const editorial = await editorialRepository.update({ _id: id, key, name, country, founding_date });
        if (!editorial) {
            return res.status(404).json({ error: 'Editorial not found' });
        }
        res.status(200).json(editorial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const editorialRepository = new EditorialRepositoryImpl();
    const { id } = req.params;
    try {
        const editorial = await editorialRepository.delete(id);
        if (!editorial) {
            return res.status(404).json({ error: 'Editorial not found' });
        }
        res.status(200).json({ message: 'Editorial deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/upsert', authMiddleware, async (req, res) => {
    const editorialRepository = new EditorialRepositoryImpl();
    const { key, name, country, founding_date } = req.body;
    try {
        if (!key || !name || !country || !founding_date) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const editorial = await upsertEditorial(editorialRepository, { key, name, country, founding_date });
        res.status(201).json(editorial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;