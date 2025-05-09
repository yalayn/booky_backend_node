const mongoose = require('mongoose');

const upsertAuthor = async (authorRepository, { key, name, country, birthday}) => {
    const _id    = new mongoose.Types.ObjectId();
    const author = { _id, key, name, country, birthday };
    return await authorRepository.upsert(author);
}

module.exports = { upsertAuthor };
