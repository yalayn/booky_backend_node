const express                 = require('express');
const router                  = express.Router();
const EditorialRepositoryImpl = require('../repositories/EditorialRepositoryImpl');
const { registerEditorial }   = require('../../application/use_cases/editorial/registerEditorial');
const authMiddleware          = require('../middleware/auth');

router.post('/register', authMiddleware, async (req, res) => {
    const editorialRepository = new EditorialRepositoryImpl();
    const { name, country, founding_date } = req.body;
    try {
        const editorial = await registerEditorial(editorialRepository, { name, country, founding_date });
        res.status(201).json(editorial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;