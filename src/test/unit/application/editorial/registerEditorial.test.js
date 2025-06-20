const mongoose = require('mongoose');
const { registerEditorial } = require('../../../../application/use_cases/editorial/registerEditorial');

describe('registerEditorial use case', () => {
    let editorialRepository;

    beforeEach(() => {
        editorialRepository = {
            save: jest.fn()
        };
    });

    it('should save a new editorial with correct data', async () => {
        const editorialData = {
            key: 'EDT001',
            name: 'Editorial Test',
            country: 'Spain',
            founding_date: new Date('2000-01-01')
        };

        editorialRepository.save.mockResolvedValue({ ...editorialData, _id: expect.any(mongoose.Types.ObjectId) });

        const result = await registerEditorial(editorialRepository, editorialData);

        expect(editorialRepository.save).toHaveBeenCalledTimes(1);
        const savedEditorial = editorialRepository.save.mock.calls[0][0];
        expect(savedEditorial).toMatchObject(editorialData);
        expect(savedEditorial._id).toBeInstanceOf(mongoose.Types.ObjectId);
        expect(result).toMatchObject({ ...editorialData, _id: expect.any(mongoose.Types.ObjectId) });
    });

    it('should throw if repository.save throws', async () => {
        const editorialData = {
            key: 'EDT002',
            name: 'Editorial Error',
            country: 'Mexico',
            founding_date: new Date('2010-05-15')
        };

        editorialRepository.save.mockRejectedValue(new Error('DB error'));

        await expect(registerEditorial(editorialRepository, editorialData)).rejects.toThrow('DB error');
    });
});