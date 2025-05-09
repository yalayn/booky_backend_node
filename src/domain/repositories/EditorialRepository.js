class EditorialRepository {

    /**
     * Guarda una nueva editorial.
     * @param {Object} editorial - Datos de la editorial a guardar.
     * @returns {Object} - Editorial guardado.
     */
    async save(editorial) {
      throw new Error('Not implemented');
    }

    /**
     * Actualiza un editorial existente.
     * @param {Object} editorial - Datos del editorial a actualizar.
     * @returns {Object} - Editorial actualizado.
     */
    async update(editorial) {
      throw new Error('Not implemented');
    } 

    /**
     * Elimina un editorial por su ID.
     * @param {string} id - ID del editorial a eliminar.
     * @returns {boolean} - Verdadero si se eliminó correctamente, falso en caso contrario.
     */
    async delete(id) {
      throw new Error('Not implemented');
    }
  
    /**
     * Inserta o actualiza un registro de editorial.
     * @param {Object} editorial - Datos del editorial.
     * @returns {Object} - Editorial insertado o actualizado.
     */
    async upsert(editorial) {
      throw new Error('Not implemented');
    }

    /**
     * Busca todos los editoriales.
     * @returns {Array} - Lista de editoriales.
     */
    async findAll() {
      throw new Error('Not implemented');
    }
  
    /**
     * Busca un editorial por su ID.
     * @param {string} id - ID del editorial a buscar.
     * @returns {Object} - Editorial encontrado.
     */
    async findById(id) {
      throw new Error('Not implemented');
    }
  }
  
  module.exports = EditorialRepository;