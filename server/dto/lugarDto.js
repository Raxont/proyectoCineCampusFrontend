class LugarDTO {
  templateSuccess(data) {
    return {
      status: 200,
      message: "Operación exitosa",
      data,
    };
  }

  templateError(message) {
    return {
      status: 500,
      message,
    };
  }
  templateInvalidId(){
    return {
      status: 400,
      message: "El ID de la película no es válido. Debe ser en formato ObjectId.",
    };
  }

  templateInvalidDate() {
    return {
      status: 400,
      message: "La fecha no tiene un formato válido. Debe ser una fecha en formato ISODate.",
    };
  }

  templatePeliculaNotFound() {
    return {
      status: 404,
      message: "No se encontró la película dada.",
    };
  }

  templateLugarNotFound() {
    return {
      status: 404,
      message: "No se encontró el lugar deseado.",
    };
  }

  templateNoFunctionsForDate() {
    return {
      status: 404,
      message: "No se encontraron funciones disponibles para la fecha dada.",
    };
  }

  templateInvalidAction() {
    return {
      status: 400,
      message: "Acción no válida",
    };
  }
}

module.exports = LugarDTO;
