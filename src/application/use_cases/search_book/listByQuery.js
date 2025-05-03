const listByQuery = function listByQuery(bookSearchProvider) {
  return async function (query) {
    if (!query) {
      throw new Error('Debe proporcionar un término de búsqueda');
    }
    return await bookSearchProvider.searchBooksByTitle(query);
  };
};

module.exports = listByQuery;