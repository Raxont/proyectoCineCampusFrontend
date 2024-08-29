class TarjetaDTO {
    /**
     * Mensaje para datos inválidos
     * @returns {Object} - Mensaje de error para datos inválidos
     */
    templateInvalidId() {
      return {
        status: "error",
        message: "ID inválido proporcionado. Asegúrese de que el ID de la boleta sea correcto."
      };
    }
  
    /**
     * Mensaje para tarjeta no encontrada
     * @returns {Object} - Mensaje de error para tarjeta no encontrada
     */
    templateTarjetaNotFound() {
      return {
        status: "error",
        message: "Tarjeta no encontrada. Asegúrese de que el cliente tenga una tarjeta activa."
      };
    }
  
    /**
     * Mensaje para lugar no encontrado
     * @returns {Object} - Mensaje de error para lugar no encontrado
     */
    templateBoletaNotFound() {
      return {
        status: "error",
        message: "Boleta no encontrado. Verifique que el ID de la boleta sea correcto."
      };
    }
  
    /**
     * Mensaje de éxito para actualización de precio
     * @param {Object} resultado - Resultado de la operación de actualización
     * @returns {Object} - Mensaje de éxito para la actualización de precio
     */
    templateSuccess(precioOriginal, precioConDescuento, resultadoBoleta) {
      return {
        status: "success",
        message: "Precio actualizado correctamente.",
        detalles: {
          precioOriginal,
          precioConDescuento,
          resultadoBoleta
        }
      };
    }
  
    /**
     * Mensaje de error genérico
     * @param {String} mensaje - Mensaje de error personalizado
     * @returns {Object} - Mensaje de error genérico
     */
    templateError(mensaje) {
      return {
        status: "error",
        message: mensaje
      };
    }

    /**
   * Mensaje para cuando el cliente no es usuarioVIP
   * @returns {Object} - Mensaje de error para cliente no VIP
   */
    templateNotVip() {
        return {
        status: "error",
        message: "El cliente no es un usuarioVIP."
    };
  }

    /**
   * Mensaje de éxito para la creación de una tarjeta
   * @param {Object} resultado - Resultado de la creación de la tarjeta
   * @returns {Object} - Mensaje de éxito para la creación de la tarjeta
   */
    templateTarjetaCreada(resultado) {
        return {
        status: "success",
        message: "Tarjeta creada exitosamente",
        resultado
        };
    }
}
  
  module.exports = TarjetaDTO;
  