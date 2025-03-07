const AuthorModel      = require('../../infrastructure/database/models/AuthorModel');
const AuthorRepository = require('../../domain/repositories/AuthorRepository');
const Author           = require('../../domain/entities/Author');

class AuthorRepositoryImpl extends AuthorRepository {
    constructor() {
        super();
        this.authors = [];
    }

    async save(author) {
        const newAuthor = new AuthorModel(author);
        await newAuthor.save();
        return new Author(newAuthor._id, newAuthor.name, newAuthor.country, newAuthor.birthday);
    }

    async findById(id) {
        const Author = await AuthorModel.findById(id);
        if (Author) {
            return new Author(Author._id, Author.name, Author.country, Author.birthday);
        }
        return null;
    }
}

module.exports = AuthorRepositoryImpl;