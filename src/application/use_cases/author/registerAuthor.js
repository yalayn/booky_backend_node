const mongoose = require('mongoose');

const registerAuthor = async (authorRepository, { name, country, birthday}) => {
    const _id    = new mongoose.Types.ObjectId();
    const author = { _id, name, country, birthday };
    return await authorRepository.save(author);
}

module.exports = { registerAuthor };
