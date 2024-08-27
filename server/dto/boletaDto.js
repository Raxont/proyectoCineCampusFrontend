class BoletaDTO {
    templateInvalidId() {
      return {
        success: false,
        message: "ID inválido proporcionado."
      };
    }
  
    templateInvalidData() {
      return {
        success: false,
        message: "Datos inválidos proporcionados."
      };
    }
  
    templateBoletaNotFound() {
      return {
        success: false,
        message: "No se encontraron boletas."
      };
    }
  
    templateSuccess(data) {
      return {
        success: true,
        data: data
      };
    }
  
    templateError(message) {
      return {
        success: false,
        message: message
      };
    }
  
    templateInvalidAction() {
      return {
        success: false,
        message: "Acción no válida."
      };
    }
  }
  
  module.exports = BoletaDTO;
  