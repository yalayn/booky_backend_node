const mongoose = require('mongoose');
const registerUserBookIfNotExists = require('../../../../application/use_cases/user_book/registerUserBookIfNotExists');
const UserModel = require('../../../../infrastructure/database/models/UserModel');

jest.mock('../../../../infrastructure/database/models/UserModel');

describe('registerUserBookIfNotExists', () => {
    let userBookRepository, authorRepository, editorialRepository, bookRepository;
    let userId, bookData, user, book, author, editorial;

    beforeEach(() => {
        userId = '507f1f77bcf86cd799439011';
        bookData = {
            title: 'Test Book',
            author: { key: 'author-key', name: 'Author Name', country: 'Country', birthday: '2000-01-01' },
            editorial: { key: 'editorial-key', name: 'Editorial Name', country: 'Country' },
            genre: 'Fiction',
            publication_year: 2020,
            isbn: '1234567890',
            descriptions_short: 'Short desc',
            descriptions_long: 'Long desc',
            cover_i: 123
        };

        user = { id: userId, books: [], };
        book = { _id: new mongoose.Types.ObjectId(), isbn: bookData.isbn, };
        author = { _id: new mongoose.Types.ObjectId() };
        editorial = { _id: new mongoose.Types.ObjectId() };
        userBookRepository = { add: jest.fn().mockResolvedValue({ userId, bookId: book._id }), };
        authorRepository = { upsert: jest.fn().mockResolvedValue(author), };
        editorialRepository = { upsert: jest.fn().mockResolvedValue(editorial), };
        bookRepository = { findByIsbn: jest.fn().mockResolvedValue(book), upsert: jest.fn().mockResolvedValue(book), };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw error if userId or bookData is missing', async () => {
        await expect(registerUserBookIfNotExists(userBookRepository, authorRepository, editorialRepository, bookRepository, { userId: null, bookData }))
            .rejects.toThrow('User ID and bookData are required');
        await expect(registerUserBookIfNotExists(userBookRepository, authorRepository, editorialRepository, bookRepository, { userId, bookData: null }))
            .rejects.toThrow('User ID and bookData are required');
    });

    it('should throw error if user is not found', async () => {
        UserModel.findOne.mockResolvedValue(null);
        await expect(registerUserBookIfNotExists(userBookRepository, authorRepository, editorialRepository, bookRepository, { userId, bookData }))
            .rejects.toThrow('User not found');
    });

    it('should throw error if book already exists for user', async () => {
        UserModel.findOne.mockResolvedValue({
            id: userId,
            books: [{ book_id: book._id }],
        });
        await expect(registerUserBookIfNotExists(userBookRepository, authorRepository, editorialRepository, bookRepository, { userId, bookData }))
            .rejects.toThrow('Book already exists for this user');
    });

    it('should upsert author, editorial, and book if book does not exist', async () => {
        bookRepository.findByIsbn.mockResolvedValue(null);
        UserModel.findOne.mockResolvedValue(user);
        await registerUserBookIfNotExists(userBookRepository, authorRepository, editorialRepository, bookRepository, { userId, bookData });
        expect(authorRepository.upsert).toHaveBeenCalled();
        expect(editorialRepository.upsert).toHaveBeenCalled();
        expect(bookRepository.upsert).toHaveBeenCalled();
        expect(userBookRepository.add).toHaveBeenCalledWith(userId, expect.anything());
    });

    it('should add book to user if all checks pass and book exists', async () => {
        UserModel.findOne.mockResolvedValue(user);
        await registerUserBookIfNotExists(userBookRepository, authorRepository, editorialRepository, bookRepository, { userId, bookData });
        expect(bookRepository.findByIsbn).toHaveBeenCalledWith(bookData.isbn);
        expect(userBookRepository.add).toHaveBeenCalledWith(userId, book._id);
    });
});