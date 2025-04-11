
const UserModel          = require('../database/models/UserModel');
const UserBookRepository = require('../../domain/repositories/UserBookRepository');
const UserBook           = require('../../domain/entities/UserBook');

class UserBookRepositoryImpl extends UserBookRepository{

    constructor() {
        super();
        this.userBooks = [];
    }

    async findByUserId(userId) {
        const user = await UserModel.findOne({id:userId});
        if (user) {
            return new UserBook(user.books);
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

    async add(userId, bookId) {
        try {
            // Verificar si el usuario existe
            const user = await UserModel.findOne({ id: userId });
            if (!user) {
                throw new Error('User not found');
            }

            // Verificar si el libro ya existe en el arreglo books
            const bookExists = user.books.some(book => book.book_id.toString() === bookId.toString());
            if (bookExists) {
                throw new Error('Book already exists for this user');
            }

            // Agregar el libro al arreglo books
            const result = await UserModel.updateOne(
                { id: userId },
                { $push: { books: { book_id: bookId } } }
            );

            if (result.modifiedCount === 0) {
                throw new Error('Book not added');
            }

            return { success: true, message: 'Book added successfully' };
        } catch (error) {
            throw new Error('Error adding user book: ' + error.message);
        }
    }

    async remove(userId, bookId) {
        try {
            const result = await UserModel.updateOne(
                { id: userId },
                { $pull: { books: { book_id: bookId } } }
            );
            if (result.modifiedCount === 0) {
                throw new Error('Book not found or not removed');
            }
            return { success: true, message: 'Book removed successfully' };
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