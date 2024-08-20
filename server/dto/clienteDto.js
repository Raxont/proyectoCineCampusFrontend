class ClienteDTO {
    /**
     * Mensaje para datos inválidos
     * @returns {Object} - Mensaje de error para datos inválidos
     */
    templateInvalidId() {
      return {
        status: "error",
        message: "ID inválido proporcionado. Asegúrese de que el ID del cliente sea correcto."
      };
    }
  
    /**
     * Mensaje para cliente no encontrado
     * @returns {Object} - Mensaje de error para cliente no encontrado
     */
    templateClienteNotFound() {
      return {
        status: "error",
        message: "Cliente no encontrado. Verifique que el identificador del cliente sea correcto."
      };
    }
  
    /**
     * Mensaje para cliente no VIP
     * @returns {Object} - Mensaje de error para cliente no VIP
     */
    templateNotVip() {
      return {
        status: "error",
        message: "El cliente no es un usuarioVIP."
      };
    }
  
    /**
     * Mensaje de éxito para la creación de un cliente
     * @param {Object} resultado - Resultado de la creación del cliente
     * @returns {Object} - Mensaje de éxito para la creación del cliente
     */
    templateClienteCreado(resultado) {
      return {
        status: "success",
        message: "Cliente creado exitosamente.",
        resultado
      };
    }
  
    /**
     * Mensaje de éxito para la actualización de datos del cliente
     * @param {Object} resultado - Resultado de la operación de actualización
     * @returns {Object} - Mensaje de éxito para la actualización de datos
     */
    templateActualizacionExitosa(resultado) {
      return {
        status: "success",
        message: "Datos del cliente actualizados correctamente.",
        detalles: resultado
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
     * Mensaje de éxito para la creación de un cliente
     * @param {Object} resultado - Resultado de la creación del cliente
     * @returns {Object} - Mensaje de éxito para la creación del cliente
     */
     templateSuccessCreate(resultado) {
        return {
            status: "success",
            message: "Cliente creado exitosamente.",
            resultado
        };
    }

    /**
     * Mensaje de éxito para la obtención de información de un cliente
     * @param {Object} resultado - Resultado de la operación de obtención de información
     * @returns {Object} - Mensaje de éxito para la obtención de información del cliente
     */
    templateSuccessInfo(resultado) {
        return {
            status: "success",
            message: "Información del cliente obtenida exitosamente.",
            resultado
        };
    }

    /**
     * Mensaje de éxito para la actualización de un cliente
     * @param {Object} resultado - Resultado de la operación de actualización
     * @returns {Object} - Mensaje de éxito para la actualización del cliente
     */
    templateSuccessUpdate(resultado) {
        return {
            status: "success",
            message: "Cliente actualizado exitosamente.",
            resultado
        };
    }

    /**
     * Mensaje de éxito para la obtención de todos los clientes con un rol específico
     * @param {Object} resultado - Resultado de la operación de obtención de clientes por rol
     * @returns {Object} - Mensaje de éxito para la obtención de clientes por rol
     */
    templateSuccessAllUsersRol(resultado) {
        return {
            status: "success",
            message: "Clientes obtenidos exitosamente.",
            resultado
        };
    }


}
  
  module.exports = ClienteDTO;
  