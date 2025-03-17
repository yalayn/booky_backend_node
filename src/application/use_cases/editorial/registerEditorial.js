const mongoose = require('mongoose');

const registerEditorial = async (editorialRepository, { name, country, founding_date}) => {
    const _id       = new mongoose.Types.ObjectId();
    const editorial = { _id, name, country, founding_date };
    return await editorialRepository.save(editorial);
}

module.exports = { registerEditorial };
