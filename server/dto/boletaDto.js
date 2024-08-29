class BoletaDTO {

  /**
   * Devuelve una plantilla cuando se proporciona un ID inválido.
   * @returns {Object} - Respuesta con éxito false y mensaje de error.
   */
  templateInvalidId() {
      return {
          success: false,
          message: "ID inválido proporcionado."
      };
  }

  /**
   * Devuelve una plantilla cuando se proporcionan datos inválidos.
   * @returns {Object} - Respuesta con éxito false y mensaje de error.
   */
  templateInvalidData() {
      return {
          success: false,
          message: "Datos inválidos proporcionados."
      };
  }

  /**
   * Devuelve una plantilla cuando no se encuentran boletas.
   * @returns {Object} - Respuesta con éxito false y mensaje de error.
   */
  templateBoletaNotFound() {
      return {
          success: false,
          message: "No se encontraron boletas."
      };
  }

  /**
   * Devuelve una plantilla de éxito con datos adicionales.
   * @param {Object} data - Datos a incluir en la respuesta.
   * @returns {Object} - Respuesta con éxito true y los datos proporcionados.
   */
  templateSuccess(data) {
      return {
          success: true,
          data: data
      };
  }

  /**
   * Devuelve una plantilla cuando ocurre un error con un mensaje personalizado.
   * @param {String} message - Mensaje de error personalizado.
   * @returns {Object} - Respuesta con éxito false y mensaje de error.
   */
  templateError(message) {
      return {
          success: false,
          message: message
      };
  }

  /**
   * Devuelve una plantilla cuando se realiza una acción no válida.
   * @returns {Object} - Respuesta con éxito false y mensaje de error.
   */
  templateInvalidAction() {
      return {
          success: false,
          message: "Acción no válida."
      };
  }
}

module.exports = BoletaDTO;
