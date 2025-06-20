const mongoose = require('mongoose');
const { registerAuthor } = require('../../../../application/use_cases/author/registerAuthor');

describe('registerAuthor use case', () => {
    let authorRepository;

    beforeEach(() => {
        // Se crea un mock del repositorio de autores antes de cada prueba
        authorRepository = {
            save: jest.fn()
        };
    });

    it('should create and save a new author with the provided data', async () => {
        // Datos de ejemplo para un nuevo autor
        const authorData = {
            key: 'author-key',
            name: 'Author Name',
            country: 'Country',
            birthday: new Date('1990-01-01')
        };

        // Se configura el mock para que resuelva con los datos del autor y un _id simulado
        authorRepository.save.mockResolvedValue({ ...authorData, _id: expect.any(mongoose.Types.ObjectId) });

        // Se ejecuta el caso de uso
        const result = await registerAuthor(authorRepository, authorData);

        // Se verifica que el método save fue llamado exactamente una vez
        expect(authorRepository.save).toHaveBeenCalledTimes(1);

        // Se obtiene el argumento con el que fue llamado save
        const savedAuthor = authorRepository.save.mock.calls[0][0];

        // Se verifica que los datos enviados a save coinciden con authorData
        expect(savedAuthor).toMatchObject(authorData);

        // Se verifica que el _id generado es una instancia de ObjectId
        expect(savedAuthor._id).toBeInstanceOf(mongoose.Types.ObjectId);

        // Se verifica que el resultado devuelto por el caso de uso contiene los datos esperados
        expect(result).toMatchObject({ ...authorData, _id: expect.any(mongoose.Types.ObjectId) });
    });

    it('should throw if authorRepository.save throws', async () => {
        // Datos de ejemplo para un nuevo autor
        const authorData = {
            key: 'author-key',
            name: 'Author Name',
            country: 'Country',
            birthday: new Date('1990-01-01')
        };

        // Se configura el mock para que lance un error al intentar guardar
        authorRepository.save.mockRejectedValue(new Error('Save failed'));

        // Se espera que el caso de uso lance el mismo error
        await expect(registerAuthor(authorRepository, authorData)).rejects.toThrow('Save failed');
    });

    it('should generate a new ObjectId for each author', async () => {
        // Datos para dos autores diferentes
        const authorData1 = {
            key: 'key1',
            name: 'Name1',
            country: 'Country1',
            birthday: new Date('1980-01-01')
        };
        const authorData2 = {
            key: 'key2',
            name: 'Name2',
            country: 'Country2',
            birthday: new Date('1990-01-01')
        };

        // El mock simplemente devuelve el autor recibido (ya debe tener un _id generado por el caso de uso)
        authorRepository.save.mockImplementation(author => Promise.resolve(author));

        // Se ejecuta el caso de uso para ambos autores
        const result1 = await registerAuthor(authorRepository, authorData1);
        const result2 = await registerAuthor(authorRepository, authorData2);

        // Se verifica que los _id generados sean distintos
        expect(result1._id).not.toEqual(result2._id);
    });
});