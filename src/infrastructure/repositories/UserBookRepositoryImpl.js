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

    async updateState(userId, bookId, newState) {
        try {
            // Validar que sea un estado válido
            const allowedStates = UserModel.schema.path('books').schema.path('state').enumValues;
            if (!allowedStates.includes(newState)) {
                throw new Error('Invalid state. Valid states are: ' + validStates.join(', '));
            }
            const result = await UserModel.updateOne(
                { id: userId, 'books.book_id': bookId }, // Buscar el usuario y el libro específico
                { $set: { 'books.$.state': newState } } // Actualizar el campo state del libro encontrado
            );

            if (result.modifiedCount === 0) {
                throw new Error('Book state not updated. Either the user or book was not found.');
            }

            return { success: true, message: 'Book state updated successfully' };
        } catch (error) {
            throw new Error('Error updating book state: ' + error.message);
        }
    }
}

module.exports = UserBookRepositoryImpl;