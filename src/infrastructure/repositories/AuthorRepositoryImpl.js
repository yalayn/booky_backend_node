const AuthorModel      = require('../../infrastructure/database/models/AuthorModel');
const AuthorRepository = require('../../domain/repositories/AuthorRepository');
const Author           = require('../../domain/entities/Author');
const regularizedText  = require('../../utils/normalizeText');

class AuthorRepositoryImpl extends AuthorRepository {
    constructor() {
        super();
        this.authors = [];
    }

    async save(author) {
        author.normalizedName = regularizedText(author.name);
        const newAuthor = new AuthorModel(author);
        await newAuthor.save();
        return newAuthor;
    }

    async update(author) {
        const existingAuthor = await AuthorModel.findOne({ _id: author._id });
        if (!existingAuthor) { throw new Error('Author not found'); }
        author.normalizedName = author.name ? regularizedText(author.name) : regularizedText(existingAuthor.name);
        const updatedAuthor = await AuthorModel.findByIdAndUpdate(author._id, author, { new: true });
        if (updatedAuthor) {
            return new Author(updatedAuthor._id, updatedAuthor.key, updatedAuthor.normalizedName, updatedAuthor.name, updatedAuthor.country, updatedAuthor.birthday);
        }
        return null;
    }

    async delete(_id) {
        const deletedAuthor = await AuthorModel.findByIdAndDelete(_id);
        return deletedAuthor;
    }

    async upsert(author) {
        author.normalizedName = regularizedText(author.name);
        const existingAuthor  = await AuthorModel.findOne({ normalizedName: author.normalizedName });
        return existingAuthor || this.save(author);
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