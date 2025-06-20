const Author = require('../../../domain/entities/Author');

describe('Author Entity', () => {
    const authorData = {
        _id: '123',
        key: 'author-key',  
        normalizedName: 'john-doe',
        name: 'John Doe',
        country: 'USA',
        birthday: '1980-01-01'
    };

    it('should create an Author instance with correct properties', () => {
        const author = new Author(authorData);
        expect(author._id).toBe(authorData._id);
        expect(author.key).toBe(authorData.key);
        expect(author.normalizedName).toBe(authorData.normalizedName);
        expect(author.name).toBe(authorData.name);
        expect(author.country).toBe(authorData.country);
        expect(author.birthday).toBe(authorData.birthday);
    });

    it('should return correct JSON representation', () => {
        const author = new Author(authorData);
        expect(author.toJSON()).toEqual(authorData);
    });

    it('should return correct string representation', () => {
        const author = new Author(authorData);
        expect(author.toString()).toBe(JSON.stringify(authorData));
    });

    it('should handle missing optional properties', () => {
        const partialData = { name: 'Jane Doe' };
        const author = new Author(partialData);
        expect(author.name).toBe('Jane Doe');
        expect(author._id).toBeUndefined();
        expect(author.key).toBeUndefined();
        expect(author.normalizedName).toBeUndefined();
        expect(author.country).toBeUndefined();
        expect(author.birthday).toBeUndefined();
    });

    it('toJSON should not mutate the instance', () => {
        const author = new Author(authorData);
        const json = author.toJSON();
        json.name = 'Changed Name';
        expect(author.name).toBe(authorData.name);
    });
});