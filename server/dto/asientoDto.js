class AsientoDTO {
    templateNotAsiento() {
        return {
            status: 404,
            message: "No se encontró el asiento."
        };
    }

    templateExistAsiento(idAsiento) {
        return {
            status: 200,
            message: "Asiento encontrado.",
            data: { idAsiento }
        };
    }

    templateInvalidClient() {
        return {
            status: 404,
            message: "El usuario no tiene una boleta creada para la reserva."
        };
    }

    templateNoSeatsAvailable() {
        return {
          success: false,
          message: "No hay asientos disponibles."
        };
    }

    templateAsientoInBoleta() {
        return {
            status: 400,
            message: "El asiento ya está registrado en la boleta."
        };
    }

    templateLugarMismatch() {
        return {
            status: 400,
            message: "El lugar no coincide con el registrado en la boleta."
        };
    }

    templateAsientoNotInBoleta() {
        return {
            status: 400,
            message: "El asiento no está registrado en la boleta."
        };
    }

    templateUpdateSuccess() {
        return {
            status: 200,
            message: "Asiento actualizado correctamente en la boleta."
        };
    }

    templateRevertSuccess() {
        return {
            status: 200,
            message: "Asiento revertido correctamente en la boleta."
        };
    }

    templateErrorInternal() {
        return {
            status: 500,
            message: "Error interno del servidor."
        };
    }

    templateInvalidAction(arg) {
        return {
            status: 400,
            message: arg
        };
    }

    templateSuccess(data) {
        return {
          success: true,
          data: data
        };
      }
}

module.exports = AsientoDTO;
