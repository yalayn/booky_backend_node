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
        return new Author(newAuthor._id, newAuthor.key, newAuthor.name, newAuthor.country, newAuthor.birthday);
    }

    async update(author) {
        const updatedAuthor = await AuthorModel.findByIdAndUpdate(author._id, author, { new: true });
        if (updatedAuthor) {
            return new Author(updatedAuthor._id, updatedAuthor.key, updatedAuthor.name, updatedAuthor.country, updatedAuthor.birthday);
        }
        return null;
    }

    async delete(_id) {
        const deletedAuthor = await AuthorModel.findByIdAndDelete(_id);
        return deletedAuthor;
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