class PeliculaDTO {

    /**
     * Devuelve una plantilla para una operación exitosa con la lista de películas.
     * @param {Array} peliculas - Lista de películas obtenidas.
     * @returns {Object} - Respuesta con éxito true y los datos de las películas.
     */
    templateSuccess(peliculas) {
        return { success: true, data: peliculas };
    }

    /**
     * Devuelve una plantilla cuando no se encuentran películas.
     * @returns {Object} - Respuesta con éxito false y un mensaje indicando que no se encontraron películas.
     */
    templateNoPeliculasFound() {
        return { success: false, message: 'No se encontraron películas' };
    }

    /**
     * Devuelve una plantilla para una acción no válida.
     * @param {String} [message] - Mensaje personalizado opcional para la acción no válida.
     * @returns {Object} - Respuesta con éxito false y un mensaje de acción no válida.
     */
    templateInvalidAction(message) {
        return { success: false, message: message || 'Acción no válida' };
    }

    /**
     * Devuelve una plantilla para un error genérico.
     * @param {String} message - Mensaje de error personalizado.
     * @returns {Object} - Respuesta con éxito false y un mensaje de error.
     */
    templateError(message) {
        return { success: false, message: message };
    }
}

module.exports = PeliculaDTO;
