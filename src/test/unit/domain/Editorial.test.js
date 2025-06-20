const Editorial = require('../../../domain/entities/Editorial');

describe('Editorial Entity', () => {
    it('should create an Editorial instance with all properties', () => {
        const data = {
            _id: '123',
            key: 'editorial-key',
            normalizedName: 'editorial-normalized',
            name: 'Editorial Name',
            country: 'Country',
            founding_date: '2000-01-01'
        };

        const editorial = new Editorial(data);

        expect(editorial._id).toBe(data._id);
        expect(editorial.key).toBe(data.key);
        expect(editorial.normalizedName).toBe(data.normalizedName);
        expect(editorial.name).toBe(data.name);
        expect(editorial.country).toBe(data.country);
        expect(editorial.founding_date).toBe(data.founding_date);
    });

    it('should handle missing optional properties', () => {
        const data = {
            _id: '456',
            key: 'another-key',
            normalizedName: 'another-normalized',
            name: 'Another Editorial'
            // country and founding_date are missing
        };

        const editorial = new Editorial(data);

        expect(editorial._id).toBe(data._id);
        expect(editorial.key).toBe(data.key);
        expect(editorial.normalizedName).toBe(data.normalizedName);
        expect(editorial.name).toBe(data.name);
        expect(editorial.country).toBeUndefined();
        expect(editorial.founding_date).toBeUndefined();
    });

    it('should assign undefined to all properties if no data is provided', () => {
        const editorial = new Editorial({});

        expect(editorial._id).toBeUndefined();
        expect(editorial.key).toBeUndefined();
        expect(editorial.normalizedName).toBeUndefined();
        expect(editorial.name).toBeUndefined();
        expect(editorial.country).toBeUndefined();
        expect(editorial.founding_date).toBeUndefined();
    });
});