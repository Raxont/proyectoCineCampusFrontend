class AsientoDTO {

    /**
     * Devuelve una plantilla cuando no se encuentra el asiento.
     * @returns {Object} - Respuesta con estado 404 y mensaje de error.
     */
    templateNotAsiento() {
        return {
            status: 404,
            message: "No se encontró el asiento."
        };
    }

    /**
     * Devuelve una plantilla cuando el asiento es encontrado.
     * @param {String} idAsiento - ID del asiento encontrado.
     * @returns {Object} - Respuesta con estado 200 y mensaje de éxito.
     */
    templateExistAsiento(idAsiento) {
        return {
            status: 200,
            message: "Asiento encontrado.",
            data: { idAsiento }
        };
    }

    /**
     * Devuelve una plantilla cuando el cliente no tiene una boleta creada para la reserva.
     * @returns {Object} - Respuesta con estado 404 y mensaje de error.
     */
    templateInvalidClient() {
        return {
            status: 404,
            message: "El usuario no tiene una boleta creada para la reserva."
        };
    }

    /**
     * Devuelve una plantilla cuando no hay asientos disponibles.
     * @returns {Object} - Respuesta con éxito false y mensaje de error.
     */
    templateNoSeatsAvailable() {
        return {
            success: false,
            message: "No hay asientos disponibles."
        };
    }

    /**
     * Devuelve una plantilla cuando el asiento ya está registrado en la boleta.
     * @returns {Object} - Respuesta con estado 400 y mensaje de error.
     */
    templateAsientoInBoleta() {
        return {
            status: 400,
            message: "El asiento ya está registrado en la boleta."
        };
    }

    /**
     * Devuelve una plantilla cuando el lugar no coincide con el registrado en la boleta.
     * @returns {Object} - Respuesta con estado 400 y mensaje de error.
     */
    templateLugarMismatch() {
        return {
            status: 400,
            message: "El lugar no coincide con el registrado en la boleta."
        };
    }

    /**
     * Devuelve una plantilla cuando el asiento no está registrado en la boleta.
     * @returns {Object} - Respuesta con estado 400 y mensaje de error.
     */
    templateAsientoNotInBoleta() {
        return {
            status: 400,
            message: "El asiento no está registrado en la boleta."
        };
    }

    /**
     * Devuelve una plantilla cuando el asiento se actualiza correctamente en la boleta.
     * @returns {Object} - Respuesta con estado 200 y mensaje de éxito.
     */
    templateUpdateSuccess() {
        return {
            status: 200,
            message: "Asiento actualizado correctamente en la boleta."
        };
    }

    /**
     * Devuelve una plantilla cuando el asiento se revierte correctamente en la boleta.
     * @returns {Object} - Respuesta con estado 200 y mensaje de éxito.
     */
    templateRevertSuccess() {
        return {
            status: 200,
            message: "Asiento revertido correctamente en la boleta."
        };
    }

    /**
     * Devuelve una plantilla cuando ocurre un error interno del servidor.
     * @returns {Object} - Respuesta con estado 500 y mensaje de error.
     */
    templateErrorInternal() {
        return {
            status: 500,
            message: "Error interno del servidor."
        };
    }

    /**
     * Devuelve una plantilla cuando ocurre una acción inválida.
     * @param {String} arg - Mensaje de error personalizado.
     * @returns {Object} - Respuesta con estado 400 y mensaje de error.
     */
    templateInvalidAction(arg) {
        return {
            status: 400,
            message: arg
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
}

module.exports = AsientoDTO;
