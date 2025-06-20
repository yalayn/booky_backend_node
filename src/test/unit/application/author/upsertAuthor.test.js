const mongoose = require('mongoose');
const { upsertAuthor } = require('../../../../application/use_cases/author/upsertAuthor');

describe('upsertAuthor use case', () => {
    let authorRepository;

    beforeEach(() => {
        // Se crea un mock del repositorio de autores antes de cada prueba
        authorRepository = {
            upsert: jest.fn()
        };
    });

    it('should call authorRepository.upsert with the correct author object', async () => {
        // Datos de entrada simulados para un autor
        const input = {
            key: 'author-key',
            name: 'Author Name',
            country: 'Country',
            birthday: '1990-01-01'
        };

        // Se configura el mock para que resuelva con un objeto de éxito
        authorRepository.upsert.mockResolvedValue({ success: true });

        // Se ejecuta el caso de uso
        const result = await upsertAuthor(authorRepository, input);

        // Se verifica que el método upsert fue llamado exactamente una vez
        expect(authorRepository.upsert).toHaveBeenCalledTimes(1);

        // Se obtiene el argumento con el que fue llamado upsert
        const calledWith = authorRepository.upsert.mock.calls[0][0];

        // Se verifica que el _id generado es un ObjectId válido
        expect(mongoose.Types.ObjectId.isValid(calledWith._id)).toBe(true);

        // Se verifica que los datos enviados a upsert coinciden con los de entrada
        expect(calledWith.key).toBe(input.key);
        expect(calledWith.name).toBe(input.name);
        expect(calledWith.country).toBe(input.country);
        expect(calledWith.birthday).toBe(input.birthday);

        // Se verifica que el resultado devuelto por el caso de uso es el esperado
        expect(result).toEqual({ success: true });
    });

    it('should throw if authorRepository.upsert throws', async () => {
        // Datos de entrada simulados para un autor
        const input = {
            key: 'author-key',
            name: 'Author Name',
            country: 'Country',
            birthday: '1990-01-01'
        };

        // Se configura el mock para que lance un error al intentar hacer upsert
        authorRepository.upsert.mockRejectedValue(new Error('DB error'));

        // Se espera que el caso de uso lance el mismo error
        await expect(upsertAuthor(authorRepository, input)).rejects.toThrow('DB error');
    });

    it('should generate a new ObjectId for each call', async () => {
        // Se configura el mock para que resuelva con un objeto vacío
        authorRepository.upsert.mockResolvedValue({});
        const input = {
            key: 'key1',
            name: 'Name1',
            country: 'Country1',
            birthday: '2000-01-01'
        };

        // Se ejecuta el caso de uso dos veces con el mismo input
        await upsertAuthor(authorRepository, input);
        const firstId = authorRepository.upsert.mock.calls[0][0]._id;

        await upsertAuthor(authorRepository, input);
        const secondId = authorRepository.upsert.mock.calls[1][0]._id;

        // Se verifica que los ObjectId generados sean distintos en cada llamada
        expect(firstId.equals(secondId)).toBe(false);
    });
});