const AsientoRepository = require("../../domain/repositories/asientoRepository");

class AsientoUseCases  {
  constructor() {
    this.asientoRepo = new AsientoRepository();
  }

  async mainAsientos(action, informacion) {
    try {
      if (action === "getReserva") {
        const resultado = await this.asientoService.updateAsientoInBoleta(informacion);
        console.log("Asiento actualizado en boleta:", resultado);
      } 
      else if (action === "returnReserva") {
        const resultado = await this.asientoService.revertAsientoInBoleta(informacion);
        console.log("Asiento revertido en boleta:", resultado);
      } 
      else {
        console.log("Acción no válida. Usa 'getReserva' o 'returnReserva'.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

module.exports = AsientoUseCases;