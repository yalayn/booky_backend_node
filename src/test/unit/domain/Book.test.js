const Book = require('../../../domain/entities/Book');

describe('Book Entity', () => {
  it('should create a Book instance with all properties', () => {
    const book = new Book(
      '1',
      'The Great Gatsby',
      'author123',
      'editorial456',
      'Novel',
      1925,
      '978-3-16-148410-0',
      'https://covers.test.com/test.jpg'
    );

    expect(book._id).toBe('1');
    expect(book.title).toBe('The Great Gatsby');
    expect(book.author_id).toBe('author123');
    expect(book.editorial_id).toBe('editorial456');
    expect(book.genre).toBe('Novel');
    expect(book.publication_year).toBe(1925);
    expect(book.isbn).toBe('978-3-16-148410-0');
    expect(book.cover_url).toBe('https://covers.test.com/test.jpg');
  });

  it('should allow undefined or null values for optional fields', () => {
    const book = new Book(
      '2',
      '1984',
      'author456',
      null,
      undefined,
      1949,
      null,
      null
    );

    expect(book._id).toBe('2');
    expect(book.title).toBe('1984');
    expect(book.author_id).toBe('author456');
    expect(book.editorial_id).toBeNull();
    expect(book.genre).toBeUndefined();
    expect(book.publication_year).toBe(1949);
    expect(book.isbn).toBeNull();
    expect(book.cover_url).toBeNull();
  });

  it('should assign values in the correct order', () => {
    const values = ['id', 'title', 'aid', 'eid', 'genre', 2000, 'isbn', 'https://covers.test.com/test.jpg'];
    const book = new Book(...values);

    expect(book._id).toBe('id');
    expect(book.title).toBe('title');
    expect(book.author_id).toBe('aid');
    expect(book.editorial_id).toBe('eid');
    expect(book.genre).toBe('genre');
    expect(book.publication_year).toBe(2000);
    expect(book.isbn).toBe('isbn');
    expect(book.cover_url).toBe('https://covers.test.com/test.jpg');
  });
});