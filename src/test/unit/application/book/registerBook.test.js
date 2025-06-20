const mongoose = require('mongoose');
const { registerBook } = require('../../../../application/use_cases/book/registerBook');

describe('registerBook use case', () => {
    let bookRepository;

    beforeEach(() => {
        bookRepository = {
            save: jest.fn().mockResolvedValue('saved-book')
        };
    });

    it('should create a book with correct fields and call repository.save', async () => {
        const input = {
            title: 'Test Book',
            _author_id: new mongoose.Types.ObjectId().toHexString(),
            _editorial_id: new mongoose.Types.ObjectId().toHexString(),
            genre: 'Fiction',
            publication_year: 2023,
            isbn: '1234567890',
            descriptions_short: 'Short desc',
            descriptions_long: 'Long desc',
            path_cover: '/covers/test.jpg',
            cover_i: 42
        };

        const result = await registerBook(bookRepository, input);

        expect(bookRepository.save).toHaveBeenCalledTimes(1);
        const savedBook = bookRepository.save.mock.calls[0][0];

        expect(savedBook).toMatchObject({
            title: input.title,
            genre: input.genre,
            publication_year: input.publication_year,
            isbn: input.isbn,
            descriptions_short: input.descriptions_short,
            descriptions_long: input.descriptions_long,
            path_cover: input.path_cover,
            cover_i: input.cover_i
        });

        expect(savedBook._id).toBeInstanceOf(mongoose.Types.ObjectId);
        expect(savedBook.author_id).toEqual(new mongoose.Types.ObjectId(input._author_id));
        expect(savedBook.editorial_id).toEqual(new mongoose.Types.ObjectId(input._editorial_id));
        expect(result).toBe('saved-book');
    });

    it('should throw if repository.save throws', async () => {
        bookRepository.save.mockRejectedValue(new Error('DB error'));
        const input = {
            title: 'Test Book',
            _author_id: new mongoose.Types.ObjectId().toHexString(),
            _editorial_id: new mongoose.Types.ObjectId().toHexString(),
            genre: 'Fiction',
            publication_year: 2023,
            isbn: '1234567890',
            descriptions_short: 'Short desc',
            descriptions_long: 'Long desc',
            path_cover: '/covers/test.jpg',
            cover_i: 42
        };

        await expect(registerBook(bookRepository, input)).rejects.toThrow('DB error');
    });
});