const mongoose           = require('mongoose');
const UserModel          = require('../database/models/UserModel');
const ReviewModel        = require('../database/models/ReviewModel');
const UserBookModel      = require('../database/models/UserBookModel');
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

    async findUserBooksWithDetails(userId, page = 1, limit = 10) {
        try {
            userId = new mongoose.Types.ObjectId(userId);
            const skip = (page - 1) * limit;
            // Construir el filtro para $match
            const matchFilter = { user_id: userId };
            if (state !== null) {
                matchFilter.state = state;
            }
            const userBooks = await UserBookModel.aggregate([
                { $match: matchFilter },
                {
                    $lookup: {
                        from        : 'books',
                        localField  : 'book_id',
                        foreignField: '_id',
                        as          : 'bookDetails'
                    }
                },
                { $unwind: '$bookDetails' },
                {
                    $lookup: {
                        from        : 'authors',
                        localField  : 'bookDetails.author_id',
                        foreignField: '_id',
                        as          : 'authorDetails'
                    }
                },
                { $unwind: '$authorDetails' },
                {
                    $lookup: {
                        from        : 'editorials',
                        localField  : 'bookDetails.editorial_id',
                        foreignField: '_id',
                        as          : 'editorialDetails'
                    }
                },
                { $unwind: '$editorialDetails' },
                {
                    $lookup: {
                        from: 'reviews',
                        let: { bookId: '$book_id', userId: '$user_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$book_id', '$$bookId'] },
                                            { $eq: ['$user_id', '$$userId'] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'reviewDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$reviewDetails',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 0,
                        book_id     : '$book_id',
                        state       : '$state',
                        year_read   : '$year_read',
                        rating      : '$reviewDetails.rating',
                        review      : '$reviewDetails.review',
                        registeredAt: '$registeredAt',
                        updatedAt   : '$updatedAt',
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
                            cover_i           : '$bookDetails.cover_i',
                            cover_url         : '$bookDetails.cover_url'
                        }
                    }
                },
                {$skip: skip},
                {$limit: limit}
            ]);

            return userBooks;
        } catch (error) {
            throw new Error('Error fetching user books with details: ' + error.message);
        }
    }

    async findUserBooksWithDetailsBySearch(userId, page = 1, limit = 10, search = '') {
        try {
            userId = new mongoose.Types.ObjectId(userId);
            const skip = (page - 1) * limit;
            // Construir el filtro para $match
            const matchFilter = { user_id: userId };
            const pipeline = [
                { $match: matchFilter },
                {
                    $lookup: {
                        from        : 'books',
                        localField  : 'book_id',
                        foreignField: '_id',
                        as          : 'bookDetails'
                    }
                },
                { $unwind: '$bookDetails' },
                {
                    $lookup: {
                        from        : 'authors',
                        localField  : 'bookDetails.author_id',
                        foreignField: '_id',
                        as          : 'authorDetails'
                    }
                },
                { $unwind: '$authorDetails' },
                {
                    $lookup: {
                        from        : 'editorials',
                        localField  : 'bookDetails.editorial_id',
                        foreignField: '_id',
                        as          : 'editorialDetails'
                    }
                },
                { $unwind: '$editorialDetails' },
                {
                    $lookup: {
                        from: 'reviews',
                        let: { bookId: '$book_id', userId: '$user_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$book_id', '$$bookId'] },
                                            { $eq: ['$user_id', '$$userId'] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'reviewDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$reviewDetails',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 0,
                        book_id     : '$book_id',
                        state       : '$state',
                        year_read   : '$year_read',
                        rating      : '$reviewDetails.rating',
                        review      : '$reviewDetails.review',
                        registeredAt: '$registeredAt',
                        updatedAt   : '$updatedAt',
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
                            cover_i           : '$bookDetails.cover_i',
                            cover_url         : '$bookDetails.cover_url'
                        }
                    }
                }
            ];

            // Si hay search, agregar filtro por nombre de libro, autor o editorial
            if (search && search.trim() !== '') {
                const regex = new RegExp(search, 'i');
                pipeline.push({
                    $match: {
                        $or: [
                            { 'book_details.title': { $regex: regex } },
                            { 'book_details.author': { $regex: regex } },
                            { 'book_details.editorial': { $regex: regex } }
                        ]
                    }
                });
            }
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });

            const userBooks = await UserBookModel.aggregate(pipeline);

            return userBooks;
        } catch (error) {
            throw new Error('Error fetching user books with details: ' + error.message);
        }
    }

    async save(userBook) {
        const newUserBook = new UserBookModel(userBook);
        await newUserBook.save();
        return newUserBook;
    }

    async remove(userId, bookId) {
        return await UserBookModel.findOneAndDelete({ user_id: userId, book_id: bookId });
    }

    async updateState(userId, bookId, newState) {
        return await UserBookModel.findOneAndUpdate(
            { user_id: userId, book_id: bookId },
            { state: newState, updatedAt: new Date() }
        );
    }
}

module.exports = UserBookRepositoryImpl;