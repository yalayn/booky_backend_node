class AuthorRepository {
  
  /**
   * Guarda un nuevo autor.
   * @param {Object} author - Datos del autor a guardar.
   * @returns {Object} - Autor guardado.
   */
  async save(author) {
    throw new Error('Not implemented');
  }

  /**
   * Actualiza un autor existente.
   * @param {Object} author - Datos del autor a actualizar.
   * @returns {Object} - Autor actualizado.
   */
  async update(author) {
    throw new Error('Not implemented');
  }

  /**
   * Elimina un autor por su ID.
   * @param {string} id - ID del autor a eliminar.
   * @returns {boolean} - Verdadero si se eliminó correctamente, falso en caso contrario.
   */
  async delete(id) {
    throw new Error('Not implemented');
  }

  /**
   * Inserta o actualiza un registro de autor.
   * @param {Object} author - Datos del autor.
   * @returns {Object} - Autor insertado o actualizado.
   */
  async upsert(author) {
    throw new Error('Not implemented');
  }

  /**
   * Busca todos los autores.
   * @returns {Array} - Lista de autores.
   */
  async findAll() {
    throw new Error('Not implemented');
  }

  /**
   * Busca un autor por su ID.
   * @param {string} id - ID del autor a buscar.
   * @returns {Object} - Autor encontrado.
   */
  async findById(id) {
    throw new Error('Not implemented');
  }
}

module.exports = AuthorRepository;