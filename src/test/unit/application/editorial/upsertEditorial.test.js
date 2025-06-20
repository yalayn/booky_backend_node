const mongoose = require('mongoose');
const { upsertEditorial } = require('../../../../application/use_cases/editorial/upsertEditorial');

describe('upsertEditorial use case', () => {
    let editorialRepository;

    beforeEach(() => {
        editorialRepository = {
            upsert: jest.fn()
        };
    });

    it('should call editorialRepository.upsert with correct editorial object', async () => {
        const editorialData = {
            key: 'editorial-key',
            name: 'Editorial Name',
            country: 'Country',
            founding_date: new Date('2000-01-01')
        };

        editorialRepository.upsert.mockResolvedValue({ success: true });

        const result = await upsertEditorial(editorialRepository, editorialData);

        expect(editorialRepository.upsert).toHaveBeenCalledTimes(1);
        const editorialArg = editorialRepository.upsert.mock.calls[0][0];
        expect(mongoose.Types.ObjectId.isValid(editorialArg._id)).toBe(true);
        expect(editorialArg.key).toBe(editorialData.key);
        expect(editorialArg.name).toBe(editorialData.name);
        expect(editorialArg.country).toBe(editorialData.country);
        expect(editorialArg.founding_date).toBe(editorialData.founding_date);
        expect(result).toEqual({ success: true });
    });

    it('should throw if editorialRepository.upsert throws', async () => {
        editorialRepository.upsert.mockRejectedValue(new Error('DB error'));

        await expect(
            upsertEditorial(editorialRepository, {
                key: 'k', name: 'n', country: 'c', founding_date: new Date()
            })
        ).rejects.toThrow('DB error');
    });

    it('should generate a new ObjectId for each call', async () => {
        editorialRepository.upsert.mockResolvedValue({});
        const editorialData = {
            key: 'key', name: 'name', country: 'country', founding_date: new Date()
        };

        await upsertEditorial(editorialRepository, editorialData);
        const firstId = editorialRepository.upsert.mock.calls[0][0]._id;

        await upsertEditorial(editorialRepository, editorialData);
        const secondId = editorialRepository.upsert.mock.calls[1][0]._id;

        expect(firstId.equals(secondId)).toBe(false);
    });
});