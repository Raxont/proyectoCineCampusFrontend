class LugarDTO {

  /**
   * Devuelve una plantilla para una operación exitosa.
   * @param {Object} data - Datos a incluir en la respuesta.
   * @returns {Object} - Respuesta con estado 200, mensaje de éxito y los datos proporcionados.
   */
  templateSuccess(data) {
      return {
          status: 200,
          message: "Operación exitosa",
          data,
      };
  }

  /**
   * Devuelve una plantilla para un error genérico.
   * @param {String} message - Mensaje de error personalizado.
   * @returns {Object} - Respuesta con estado 500 y mensaje de error.
   */
  templateError(message) {
      return {
          status: 500,
          message,
      };
  }

  /**
   * Devuelve una plantilla cuando el ID proporcionado no es válido.
   * @returns {Object} - Respuesta con estado 400 y mensaje de error indicando que el ID no es válido.
   */
  templateInvalidId() {
      return {
          status: 400,
          message: "El ID de la película no es válido. Debe ser en formato ObjectId.",
      };
  }

  /**
   * Devuelve una plantilla cuando la fecha proporcionada no es válida.
   * @returns {Object} - Respuesta con estado 400 y mensaje de error indicando que la fecha no tiene un formato válido.
   */
  templateInvalidDate() {
      return {
          status: 400,
          message: "La fecha no tiene un formato válido. Debe ser una fecha en formato ISODate.",
      };
  }

  /**
   * Devuelve una plantilla cuando no se encuentra la película dada.
   * @returns {Object} - Respuesta con estado 404 y mensaje de error indicando que no se encontró la película.
   */
  templatePeliculaNotFound() {
      return {
          status: 404,
          message: "No se encontró la película dada.",
      };
  }

  /**
   * Devuelve una plantilla cuando no se encuentra el lugar deseado.
   * @returns {Object} - Respuesta con estado 404 y mensaje de error indicando que no se encontró el lugar.
   */
  templateLugarNotFound() {
      return {
          status: 404,
          message: "No se encontró el lugar deseado.",
      };
  }

  /**
   * Devuelve una plantilla cuando no se encuentran funciones disponibles para la fecha dada.
   * @returns {Object} - Respuesta con estado 404 y mensaje de error indicando que no hay funciones disponibles.
   */
  templateNoFunctionsForDate() {
      return {
          status: 404,
          message: "No se encontraron funciones disponibles para la fecha dada.",
      };
  }

  /**
   * Devuelve una plantilla cuando se realiza una acción no válida.
   * @returns {Object} - Respuesta con estado 400 y mensaje de error indicando que la acción no es válida.
   */
  templateInvalidAction() {
      return {
          status: 400,
          message: "Acción no válida",
      };
  }
}

module.exports = LugarDTO;
