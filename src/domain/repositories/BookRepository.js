class BookRepository {
  
  /**
   * Guarda un nuevo libro.
   * @param {Object} book - Datos del libro a guardar.
   * @returns {Object} - Libro guardado.
   */
  async save(book) {
    throw new Error('Not implemented');
  }

  /**
   * Actualiza un libro existente.
   * @param {Object} book - Datos del libro a actualizar.
   * @returns {Object} - Libro actualizado.
   */
  async upsert(book) {
    throw new Error('Not implemented');
  }
  
  /**
   * Elimina un libro por su ID.
   * @param {string} id - ID del libro a eliminar.
   * @returns {boolean} - Verdadero si se eliminó correctamente, falso en caso contrario.
   */
  async delete(id) {
    throw new Error('Not implemented');
  }

  /**
   * Actualiza un libro existente.
   * @param {Object} book - Datos del libro a actualizar.
   * @returns {Object} - Libro actualizado.
   */
  async findById(id) {
    throw new Error('Not implemented');
  }

  /**
   * Busca todos los libros.
   * @returns {Array} - Lista de libros encontrados.
   */
  async findByAuthorId(author_id) {
    throw new Error('Not implemented');
  }

  /**
   * Busca un libro por su ISBN.
   * @param {string} isbn - ISBN del libro a buscar.
   * @returns {Object} - Libro encontrado.
   */
  async findByIsbn(isbn) {
    throw new Error('Not implemented');
  }

  /**
   * Busca libros por el ID de la editorial.
   * @param {string} editorial_id - ID de la editorial.
   * @returns {Array} - Lista de libros encontrados.
   */
  async findByEditorialId(editorial_id) {
    throw new Error('Not implemented');
  }
}
  
module.exports = BookRepository;