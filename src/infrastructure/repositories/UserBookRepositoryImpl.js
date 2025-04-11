
const UserModel          = require('../database/models/UserModel');
const UserBookRepository = require('../../domain/repositories/UserBookRepository');
const UserBook           = require('../../domain/entities/UserBook');

class UserBookRepositoryImpl extends UserBookRepository{

    constructor() {
        super();
        this.userBooks = [];
    }

    async findByUserId(userId) {
        const user = await UserModel.findOne({id});
        if (user) {
            return new UserBook(user.id, user.books);
        }
        return null;
    }

    async findByUserIdState(userId, state) {
        const user = await UserModel.findOne({ id: userId, 'books.state': state }).select('id books');
        if (user) {
            user.books = user.books.filter(book => book.state === state);
        }
        return null;
    }

    async add({userId, book}) {
        try {
            const user = await UserModel.findOne({id:userId});
            if (!user) {
                throw new Error('User not found');
            }
            await UserModel.updateOne(
                { id: userId },
                { $push: { books: book } }
            );
            return new UserBook(userId, book);
        } catch (error) {
            throw new Error('Error adding user book: ' + error.message);
        }
    }

    async remove(userId, bookId) {
        try {
            return await this.database('user_books')
                .where({ user_id: userId, book_id: bookId })
                .del();
        } catch (error) {
            throw new Error('Error removing user book: ' + error.message);
        }
    }

    async updateState(userId, bookId, updates) {
        try {
            return await this.database('user_books')
                .where({ user_id: userId, book_id: bookId })
                .update(updates);
        } catch (error) {
            throw new Error('Error updating user book: ' + error.message);
        }
    }
}

module.exports = UserBookRepositoryImpl;