const mongoose = require('mongoose');
const registerUserBookIfNotExists = require('../../../../application/use_cases/user_book/registerUserBookIfNotExists');

describe('registerUserBookIfNotExists', () => {
    let userBookRepository, authorRepository, editorialRepository, bookRepository;
    let UserBookModelFindOneSpy;

    const userId = new mongoose.Types.ObjectId().toString();
    const bookData = {
        title: 'Test Book',
        genre: 'Fiction',
        publication_year: 2023,
        isbn: '1234567890',
        descriptions_short: 'Short desc',
        descriptions_long: 'Long desc',
        cover_url: 'http://cover.url',
        author: {
            key: 'author-key',
            name: 'Author Name',
            country: 'Country',
            birthday: '1990-01-01'
        },
        editorial: {
            key: 'editorial-key',
            name: 'Editorial Name',
            country: 'Country'
        }
    };

    beforeEach(() => {
        userBookRepository = {
            save: jest.fn()
        };
        authorRepository = {
            upsert: jest.fn()
        };
        editorialRepository = {
            upsert: jest.fn()
        };
        bookRepository = {
            findByIsbn: jest.fn(),
            upsert: jest.fn()
        };
        UserBookModelFindOneSpy = jest.spyOn(require('../../../../infrastructure/database/models/UserBookModel'), 'findOne');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new user book if book does not exist', async () => {
        bookRepository.findByIsbn.mockResolvedValue(null);
        const author = { _id: new mongoose.Types.ObjectId() };
        const editorial = { _id: new mongoose.Types.ObjectId() };
        authorRepository.upsert.mockResolvedValue(author);
        editorialRepository.upsert.mockResolvedValue(editorial);
        const book = { _id: new mongoose.Types.ObjectId() };
        bookRepository.upsert.mockResolvedValue(book);
        UserBookModelFindOneSpy.mockResolvedValue(null);
        const newUserBook = { user_id: userId, book_id: book._id };
        userBookRepository.save.mockResolvedValue(newUserBook);

        const result = await registerUserBookIfNotExists(
            userBookRepository,
            authorRepository,
            editorialRepository,
            bookRepository,
            { userId, bookData }
        );

        expect(bookRepository.findByIsbn).toHaveBeenCalledWith(bookData.isbn);
        expect(authorRepository.upsert).toHaveBeenCalled();
        expect(editorialRepository.upsert).toHaveBeenCalled();
        expect(bookRepository.upsert).toHaveBeenCalled();
        expect(UserBookModelFindOneSpy).toHaveBeenCalledWith({ user_id: userId, book_id: book._id });
        expect(userBookRepository.save).toHaveBeenCalledWith({ user_id: userId, book_id: book._id });
        expect(result).toEqual(newUserBook);
    });

    it('should register a new user book if book exists', async () => {
        const book = { _id: new mongoose.Types.ObjectId() };
        bookRepository.findByIsbn.mockResolvedValue(book);
        UserBookModelFindOneSpy.mockResolvedValue(null);
        const newUserBook = { user_id: userId, book_id: book._id };
        userBookRepository.save.mockResolvedValue(newUserBook);

        const result = await registerUserBookIfNotExists(
            userBookRepository,
            authorRepository,
            editorialRepository,
            bookRepository,
            { userId, bookData }
        );

        expect(bookRepository.findByIsbn).toHaveBeenCalledWith(bookData.isbn);
        expect(authorRepository.upsert).not.toHaveBeenCalled();
        expect(editorialRepository.upsert).not.toHaveBeenCalled();
        expect(bookRepository.upsert).not.toHaveBeenCalled();
        expect(UserBookModelFindOneSpy).toHaveBeenCalledWith({ user_id: userId, book_id: book._id });
        expect(userBookRepository.save).toHaveBeenCalledWith({ user_id: userId, book_id: book._id });
        expect(result).toEqual(newUserBook);
    });

    it('should throw error if user book already exists', async () => {
        const book = { _id: new mongoose.Types.ObjectId() };
        bookRepository.findByIsbn.mockResolvedValue(book);
        UserBookModelFindOneSpy.mockResolvedValue({ user_id: userId, book_id: book._id });

        await expect(
            registerUserBookIfNotExists(
                userBookRepository,
                authorRepository,
                editorialRepository,
                bookRepository,
                { userId, bookData }
            )
        ).rejects.toThrow('Book already exists for this user');
    });

    it('should throw error if userBookRepository.save returns null', async () => {
        const book = { _id: new mongoose.Types.ObjectId() };
        bookRepository.findByIsbn.mockResolvedValue(book);
        UserBookModelFindOneSpy.mockResolvedValue(null);
        userBookRepository.save.mockResolvedValue(null);

        await expect(
            registerUserBookIfNotExists(
                userBookRepository,
                authorRepository,
                editorialRepository,
                bookRepository,
                { userId, bookData }
            )
        ).rejects.toThrow('Error registering user book');
    });
});