const UserModel          = require('../database/models/UserModel');
const ReviewModel        = require('../database/models/ReviewModel');
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

    async findUserBooksWithDetails(userId) {
        try {
            const userBooks = await UserModel.aggregate([
                {
                    $match: { id: userId } // Filtrar por el usuario específico
                },
                {
                    $unwind: '$books' // Descomponer el arreglo de libros
                },
                {
                    $lookup: {
                        from        : 'books', // Nombre de la colección de libros
                        localField  : 'books.book_id', // Campo en la colección de usuarios
                        foreignField: '_id', // Campo en la colección de libros
                        as          : 'bookDetails' // Nombre del campo donde se almacenarán los detalles del libro
                    }
                },
                {
                    $unwind: '$bookDetails' // Descomponer el arreglo de detalles del libro
                },
                {
                    $lookup: {
                        from: 'authors', // Nombre de la colección de autores
                        localField: 'bookDetails.author_id', // Campo en la colección de libros
                        foreignField: '_id', // Campo en la colección de autores
                        as: 'authorDetails' // Nombre del campo donde se almacenarán los detalles del autor
                    }
                },
                {
                    $unwind: '$authorDetails' // Descomponer el arreglo de detalles del autor
                },
                {
                    $lookup: {
                        from: 'editorials', // Nombre de la colección de editoriales
                        localField: 'bookDetails.editorial_id', // Campo en la colección de libros
                        foreignField: '_id', // Campo en la colección de editoriales
                        as: 'editorialDetails' // Nombre del campo donde se almacenarán los detalles de la editorial
                    }
                },
                {
                    $unwind: '$editorialDetails' // Descomponer el arreglo de detalles de la editorial
                },
                {
                    $lookup: {
                        from: 'reviews', // Nombre de la colección de reviews
                        let: { bookId: '$books.book_id', userId: '$_id' }, // Variables locales para usar en el pipeline
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$book_id', '$$bookId'] }, // Coincidir con el book_id
                                            { $eq: ['$user_id', '$$userId'] }  // Coincidir con el user_id
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'reviews' // Nombre del campo donde se almacenarán los reviews
                    }
                },
                {
                    $unwind: {
                        path: '$reviews', // Descomponer el arreglo de reviews
                        preserveNullAndEmptyArrays: true // Permitir que los libros sin reviews no sean eliminados
                    }
                },
                {
                    $project: {
                        _id: 0, // Excluir el _id del usuario
                        book_id     : '$books.book_id',
                        state       : '$books.state',
                        year_read   : '$books.year_read',
                        rating      : '$reviews.rating',
                        review      : '$reviews.review',
                        registeredAt: '$books.registeredAt',
                        updatedAt   : '$books.updatedAt',
                        book_details: {
                            title             : '$bookDetails.title',
                            genre             : '$bookDetails.genre',
                            publication_year  : '$bookDetails.publication_year',
                            isbn              : '$bookDetails.isbn',
                            descriptions_short: '$bookDetails.descriptions_short',
                            descriptions_long : '$bookDetails.descriptions_long',
                            path_cover        : '$bookDetails.path_cover',
                            author            : '$authorDetails.name',
                            editorial         : '$editorialDetails.name',
                            cover_i           : '$bookDetails.cover_i'
                        }
                    }
                }
            ]);

            return userBooks;
        } catch (error) {
            throw new Error('Error fetching user books with details: ' + error.message);
        }
    }

    async add(userId, bookId) {
        try {
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

    async registreReview(userId, bookId, reviewText, rating) {
        try {
            const review = await ReviewModel.findOne({ user_id: userId, book_id: bookId });
            if (review) {
                review.review = reviewText;
                review.rating = rating;
                await review.save();
                return { success: true, message: 'Review update successfully' };
            } else {
                const newReview = new ReviewModel({
                    user_id: userId,
                    book_id: bookId,
                    review : reviewText,
                    rating : rating
                });
                await newReview.save();
                return { success: true, message: 'Review add successfully' };
            }
        } catch (error) {
            throw new Error('Error adding review: ' + error.message);
        }
    }

    async getBookReviews(bookId) {
        try {
            const reviews = await ReviewModel.find({ book_id: bookId })
                .populate('user_id', 'name username') // Populate user details
                .select('rating review created_at');
            return reviews;
        } catch (error) {
            throw new Error('Error fetching book reviews: ' + error.message);
        }
    }
}

module.exports = UserBookRepositoryImpl;