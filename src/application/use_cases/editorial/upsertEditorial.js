const mongoose = require('mongoose');

const upsertEditorial = async (editorialRepository, { key, name, country, founding_date}) => {
    const _id       = new mongoose.Types.ObjectId();
    const editorial = { _id, key, name, country, founding_date };
    return await editorialRepository.upsert(editorial);
}

module.exports = { upsertEditorial };