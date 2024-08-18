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

    templateInvalidAction(arg) {
        return {
            status: 400,
            message: arg || "Acción no válida"
        };
    }

    templateListAsiento(arg) {
        return {
            status: 200,
            message: arg
        };
    }
}

module.exports = AsientoDTO;
