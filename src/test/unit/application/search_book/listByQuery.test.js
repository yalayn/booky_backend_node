const listByQuery = require('../../../../application/use_cases/search_book/listByQuery');

describe('listByQuery use case', () => {
    let mockBookSearchProvider;

    beforeEach(() => {
        mockBookSearchProvider = {
            searchBooksByTitle: jest.fn(),
        };
    });

    it('should throw an error if query is not provided', async () => {
        const useCase = listByQuery(mockBookSearchProvider);
        await expect(useCase()).rejects.toThrow('Debe proporcionar un término de búsqueda');
        await expect(useCase(null)).rejects.toThrow('Debe proporcionar un término de búsqueda');
        await expect(useCase('')).rejects.toThrow('Debe proporcionar un término de búsqueda');
    });

    it('should call searchBooksByTitle with the provided query', async () => {
        const useCase = listByQuery(mockBookSearchProvider);
        mockBookSearchProvider.searchBooksByTitle.mockResolvedValue(['book1', 'book2']);
        const result = await useCase('harry potter');
        expect(mockBookSearchProvider.searchBooksByTitle).toHaveBeenCalledWith('harry potter');
        expect(result).toEqual(['book1', 'book2']);
    });

    it('should propagate errors from bookSearchProvider', async () => {
        const useCase = listByQuery(mockBookSearchProvider);
        mockBookSearchProvider.searchBooksByTitle.mockRejectedValue(new Error('Provider error'));
        await expect(useCase('some query')).rejects.toThrow('Provider error');
    });
});